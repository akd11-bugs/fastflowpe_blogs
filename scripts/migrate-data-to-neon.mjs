// One-off data migration: copies all Payload-owned tables from the old
// Prisma-hosted Postgres to the new Neon database. Excludes the unrelated
// Prisma scratch project's tables (Note/Tag/_NoteToTag/_prisma_migrations)
// and payload_migrations (left for `payload migrate` to populate fresh
// against Neon, run separately before this script).
//
// Neon's managed role can't disable FK-enforcing triggers or set
// session_replication_role (both superuser-only), so tables are inserted in
// FK-dependency (topological) order instead. Self-referencing tables (e.g.
// categories' parent field) fall back to per-row insert with retries, since
// row order within one table can still violate the FK even when table order
// is correct.
//
// Usage: SRC_DB='...' DEST_DB='...' node scripts/migrate-data-to-neon.mjs
import pg from 'pg'

const EXCLUDE = new Set(['Note', 'Tag', '_NoteToTag', '_prisma_migrations', 'payload_migrations'])

const src = new pg.Client({ connectionString: process.env.SRC_DB, ssl: { rejectUnauthorized: false } })
const dest = new pg.Client({ connectionString: process.env.DEST_DB, ssl: { rejectUnauthorized: false } })

await src.connect()
await dest.connect()

const { rows: tableRows } = await src.query(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  ORDER BY table_name
`)
const allTables = tableRows.map((r) => r.table_name).filter((t) => !EXCLUDE.has(t))
const tableSet = new Set(allTables)

// child table -> set of parent tables it has an FK to (excluding self-refs)
const { rows: fkRows } = await src.query(`
  SELECT
    tc.table_name AS child,
    ccu.table_name AS parent
  FROM information_schema.table_constraints tc
  JOIN information_schema.constraint_column_usage ccu
    ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
  WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
`)
const selfReferencing = new Set()
const deps = new Map(allTables.map((t) => [t, new Set()]))
for (const { child, parent } of fkRows) {
  if (!tableSet.has(child) || !tableSet.has(parent)) continue
  if (child === parent) {
    selfReferencing.add(child)
    continue
  }
  deps.get(child)?.add(parent)
}

// Kahn's algorithm — parents before children.
const ordered = []
const remaining = new Set(allTables)
while (remaining.size > 0) {
  const ready = [...remaining].filter((t) => [...deps.get(t)].every((p) => !remaining.has(p)))
  if (ready.length === 0) {
    // Genuine cycle across tables (shouldn't happen in this schema) — bail
    // out by taking the rest in original order rather than looping forever.
    ordered.push(...remaining)
    break
  }
  ready.sort()
  for (const t of ready) {
    ordered.push(t)
    remaining.delete(t)
  }
}

console.log(`Copying ${ordered.length} tables (${selfReferencing.size} self-referencing)...`)

for (const table of ordered) {
  const { rows } = await src.query(`SELECT * FROM "${table}"`)
  if (rows.length === 0) {
    console.log(`  ${table}: 0 rows`)
    continue
  }
  const columns = Object.keys(rows[0])
  const colList = columns.map((c) => `"${c}"`).join(', ')

  if (selfReferencing.has(table)) {
    // Per-row insert with retry, since row order within the table matters too.
    let pending = [...rows]
    let lastError
    while (pending.length > 0) {
      const stillPending = []
      for (const row of pending) {
        try {
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ')
          await dest.query(
            `INSERT INTO "${table}" (${colList}) VALUES (${placeholders})`,
            columns.map((c) => row[c]),
          )
        } catch (err) {
          lastError = err
          stillPending.push(row)
        }
      }
      if (stillPending.length === pending.length) {
        throw new Error(
          `${table}: made no progress on ${stillPending.length} row(s) — ${lastError?.message}`,
        )
      }
      pending = stillPending
    }
  } else {
    const BATCH = 200
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH)
      const values = []
      const placeholders = batch
        .map((row, rowIdx) => {
          const base = rowIdx * columns.length
          values.push(...columns.map((c) => row[c]))
          return `(${columns.map((_, colIdx) => `$${base + colIdx + 1}`).join(', ')})`
        })
        .join(', ')
      await dest.query(`INSERT INTO "${table}" (${colList}) VALUES ${placeholders}`, values)
    }
  }
  console.log(`  ${table}: ${rows.length} rows`)
}

// Reset sequences for serial/identity integer PKs so future inserts don't
// collide with the copied data's existing max IDs.
const { rows: seqCols } = await dest.query(`
  SELECT c.table_name, c.column_name
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.column_default LIKE 'nextval(%'
`)
for (const { table_name, column_name } of seqCols) {
  if (EXCLUDE.has(table_name)) continue
  await dest.query(
    `SELECT setval(pg_get_serial_sequence('"${table_name}"', '${column_name}'), COALESCE((SELECT MAX("${column_name}") FROM "${table_name}"), 1), (SELECT MAX("${column_name}") FROM "${table_name}") IS NOT NULL)`,
  )
}
console.log(`Reset ${seqCols.length} sequences.`)

await src.end()
await dest.end()
console.log('Done.')
