# syntax=docker/dockerfile:1

# --- deps: install dependencies only (cached separately from source changes) ---
FROM node:22-alpine AS deps
# Needed for some native addons (sharp, etc.) under Alpine's musl libc.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
# Not `npm ci`: this tree has optional peer deps (yjs/monaco-editor, pulled
# in by @payloadcms/richtext-lexical's optional features) that npm resolves
# fine but doesn't always record into the lockfile in a way `ci`'s strict
# sync check accepts, even from a clean install. Versions here are mostly
# exact-pinned anyway, so drift risk from `install` is low.
# --ignore-scripts: package.json's postinstall runs `prisma generate`, which
# needs prisma/schema.prisma — not present yet in this manifests-only layer
# (kept separate from the full source COPY for build-cache efficiency). The
# builder stage below already runs `prisma generate` explicitly once the
# full source is in place, so skipping it here isn't losing anything.
RUN npm install --ignore-scripts

# --- builder: generate the Prisma client, run migrations, build the app ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env — Render provides the same env vars at build and runtime,
# so DATABASE_URL etc. are available here for `payload migrate` and for the
# static/SSG pages that read from the DB during `next build`.
ARG DATABASE_URL
ARG PRISMA_DATABASE_URL
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL
ARG S3_BUCKET
ARG S3_ENDPOINT
ARG S3_ACCESS_KEY_ID
ARG S3_SECRET_ACCESS_KEY
ENV DATABASE_URL=$DATABASE_URL
ENV PRISMA_DATABASE_URL=$PRISMA_DATABASE_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV S3_BUCKET=$S3_BUCKET
ENV S3_ENDPOINT=$S3_ENDPOINT
ENV S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID
ENV S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate
# Runs once per image build/deploy, against the real target DB — keeps the
# runtime image below (standalone output) free of Payload's CLI toolchain.
RUN npx payload migrate
RUN npm run build

# --- runner: minimal runtime image, standalone Next.js server only ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
