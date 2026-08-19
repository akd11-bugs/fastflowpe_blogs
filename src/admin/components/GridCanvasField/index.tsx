'use client'

import { useField } from '@payloadcms/ui'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { ReactGridLayout, WidthProvider, type Layout } from 'react-grid-layout/legacy'

import 'react-grid-layout/css/styles.css'

const GridLayout = WidthProvider(ReactGridLayout)

const BLOCK_LABELS: Record<string, string> = {
  archive: 'Archive',
  content: 'Content',
  cta: 'Call to Action',
  formBlock: 'Form',
  mediaBlock: 'Media',
}

type RowHandle = {
  colStart: number
  colSpan: number
  rowStart: number
  rowSpan: number
  setColStart: (v: number) => void
  setColSpan: (v: number) => void
  setRowStart: (v: number) => void
  setRowSpan: (v: number) => void
}

/**
 * Renders nothing — exists purely to bind to one block row's gridPosition
 * sub-fields via useField, and report the current read/write handle up to
 * the parent canvas. Payload's form state stores nested block data as flat
 * per-path fields, so each row's position must be read/written individually
 * rather than as one nested object under the array field.
 */
const GridPositionRow: React.FC<{
  rowPath: string
  onReady: (handle: RowHandle) => void
}> = ({ rowPath, onReady }) => {
  const colStartField = useField<number>({ path: `${rowPath}.gridPosition.colStart` })
  const colSpanField = useField<number>({ path: `${rowPath}.gridPosition.colSpan` })
  const rowStartField = useField<number>({ path: `${rowPath}.gridPosition.rowStart` })
  const rowSpanField = useField<number>({ path: `${rowPath}.gridPosition.rowSpan` })

  const colStart = (colStartField.value as number) ?? 1
  const colSpan = (colSpanField.value as number) ?? 12
  const rowStart = (rowStartField.value as number) ?? 1
  const rowSpan = (rowSpanField.value as number) ?? 1

  React.useEffect(() => {
    onReady({
      colStart,
      colSpan,
      rowStart,
      rowSpan,
      setColStart: (v) => colStartField.setValue(v),
      setColSpan: (v) => colSpanField.setValue(v),
      setRowStart: (v) => rowStartField.setValue(v),
      setRowSpan: (v) => rowSpanField.setValue(v),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colStart, colSpan, rowStart, rowSpan])

  return null
}

type ActiveDrag = { id: string; x: number; w: number } | null

const COLS = 12

export const GridCanvasField: React.FC = () => {
  const layoutField = useField({ path: 'layout' })
  const rows = layoutField.rows || []

  const [handles, setHandles] = useState<Record<string, RowHandle>>({})
  const [activeDrag, setActiveDrag] = useState<ActiveDrag>(null)

  const handleReady = useCallback((id: string, handle: RowHandle) => {
    setHandles((prev) => {
      const existing = prev[id]
      if (
        existing &&
        existing.colStart === handle.colStart &&
        existing.colSpan === handle.colSpan &&
        existing.rowStart === handle.rowStart &&
        existing.rowSpan === handle.rowSpan
      ) {
        return prev
      }
      return { ...prev, [id]: handle }
    })
  }, [])

  const lastLayoutRef = useRef<Layout>([])

  const layout: Layout = useMemo(() => {
    const next = rows.map((row, index) => {
      const handle = handles[row.id]
      return {
        i: row.id || String(index),
        x: (handle?.colStart ?? 1) - 1,
        y: (handle?.rowStart ?? 1) - 1,
        w: handle?.colSpan ?? 12,
        h: handle?.rowSpan ?? 1,
      }
    })
    const prev = lastLayoutRef.current
    const unchanged =
      prev.length === next.length &&
      next.every((item, index) => {
        const p = prev[index]
        return p && p.i === item.i && p.x === item.x && p.y === item.y && p.w === item.w && p.h === item.h
      })
    if (unchanged) return prev
    lastLayoutRef.current = next
    return next
  }, [rows, handles])

  const onLayoutChange = useCallback(
    (newLayout: Layout) => {
      newLayout.forEach((item) => {
        const handle = handles[item.i]
        if (!handle) return
        if (handle.colStart !== item.x + 1) handle.setColStart(item.x + 1)
        if (handle.colSpan !== item.w) handle.setColSpan(item.w)
        if (handle.rowStart !== item.y + 1) handle.setRowStart(item.y + 1)
        if (handle.rowSpan !== item.h) handle.setRowSpan(item.h)
      })
    },
    [handles],
  )

  const trackActiveDrag = useCallback(
    (_layout: Layout, _oldItem: Layout[number] | null, newItem: Layout[number] | null) => {
      if (!newItem) return
      setActiveDrag({ id: newItem.i, x: newItem.x, w: newItem.w })
    },
    [],
  )

  const clearActiveDrag = useCallback(() => setActiveDrag(null), [])

  if (rows.length === 0) {
    return (
      <p style={{ color: 'var(--theme-elevation-400)' }}>
        Add blocks below, then come back here to drag/resize their layout position.
      </p>
    )
  }

  return (
    <div className="grid-canvas-root">
      <style>{`
        .grid-canvas-root .react-resizable-handle {
          opacity: 0.35;
          transition: opacity 0.15s ease, transform 0.15s ease;
          transform: scale(0.85);
        }
        .grid-canvas-root .react-grid-item:hover .react-resizable-handle {
          opacity: 1;
          transform: scale(1);
        }
        .grid-canvas-root .react-grid-item.react-draggable-dragging .grid-canvas-tile,
        .grid-canvas-root .react-grid-item.resizing .grid-canvas-tile {
          transform: scale(1.02);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
        }
        .grid-canvas-root .grid-canvas-tile {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, border-color 0.15s ease;
        }
        .grid-canvas-root .grid-canvas-tile:hover {
          transform: scale(1.01);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
          border-color: var(--theme-success-500, var(--theme-elevation-800));
        }
        .grid-canvas-root .react-grid-item.react-draggable-dragging,
        .grid-canvas-root .react-grid-item.resizing {
          z-index: 5;
        }
      `}</style>
      {rows.map((row, index) => (
        <GridPositionRow
          key={row.id || index}
          rowPath={`layout.${index}`}
          onReady={(handle) => handleReady(row.id || String(index), handle)}
        />
      ))}
      <div
        style={{
          position: 'relative',
          border: '1px dashed var(--theme-elevation-150)',
          borderRadius: 8,
          padding: 8,
        }}
      >
        {/* 12-column guide lines, purely decorative — gives the canvas a visible grid structure
            even when every block currently sits at its full-width default. */}
        <div
          style={{
            position: 'absolute',
            inset: 8,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {Array.from({ length: COLS - 1 }, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${((i + 1) / COLS) * 100}%`,
                width: 1,
                background: 'var(--theme-elevation-100)',
              }}
            />
          ))}
          {activeDrag && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${(activeDrag.x / COLS) * 100}%`,
                width: `${(activeDrag.w / COLS) * 100}%`,
                background: 'var(--theme-success-100, rgba(0, 0, 0, 0.05))',
                transition: 'left 0.05s linear, width 0.05s linear',
                borderRadius: 6,
              }}
            />
          )}
        </div>

        <GridLayout
          className="layout"
          cols={COLS}
          rowHeight={40}
          layout={layout}
          onLayoutChange={onLayoutChange}
          onDragStart={trackActiveDrag}
          onDrag={trackActiveDrag}
          onDragStop={clearActiveDrag}
          onResizeStart={trackActiveDrag}
          onResize={trackActiveDrag}
          onResizeStop={clearActiveDrag}
          draggableHandle=".grid-canvas-item-handle"
          style={{ position: 'relative', zIndex: 1 }}
        >
          {rows.map((row, index) => {
            const handle = handles[row.id]
            const colStart = handle?.colStart ?? 1
            const colSpan = handle?.colSpan ?? 12
            const label = BLOCK_LABELS[row.blockType || ''] || row.blockType || 'Block'

            return (
              <div key={row.id || String(index)}>
                <div
                  className="grid-canvas-tile"
                  style={{
                    height: '100%',
                    background: 'var(--theme-elevation-50)',
                    border: '2px solid var(--theme-elevation-150)',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="grid-canvas-item-handle"
                    style={{
                      cursor: 'grab',
                      padding: '6px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--theme-elevation-0)',
                      background: 'var(--theme-success-500, var(--theme-elevation-800))',
                    }}
                  >
                    {label} #{index + 1} · Col {colStart}–{colStart + colSpan - 1}
                  </div>
                </div>
              </div>
            )
          })}
        </GridLayout>
      </div>
    </div>
  )
}
