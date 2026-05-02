# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (provisioned but not yet used — astrology calculations are pure algorithmic)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Artifacts

### astrology-app (React + Vite, preview at `/`)
Saju (사주팔자) & Vedic Astrology analysis web app.

**Pages:**
- `/` — Landing page: birth info input form (date, time, gender, birthplace)
- `/result` — Analysis dashboard: Saju four pillars chart, Vedic birth chart, element balance radar, daewoon timeline, fortune scores, interpretations

**Features:**
- Saju (Four Pillars of Destiny) calculation using sexagenary cycle (만세력 기반)
- Vedic astrology with simplified sidereal astronomical calculations
- Vimshottari dasha period system
- Element balance visualization (목/화/토/금/수)
- Daewoon (대운) & Sewoon (세운) fortune cycle display
- Today's fortune (daily oracle based on birth data)
- Dark cosmic theme: deep space purples, midnight blues, gold accents

**API Endpoints:**
- `POST /api/astrology/analyze` — Full Saju + Vedic analysis
- `POST /api/astrology/today-fortune` — Today's fortune based on birth info

### api-server (Express 5, preview at `/api`)
Backend API server serving all astrology calculation endpoints.

**Key files:**
- `artifacts/api-server/src/routes/astrology/saju.ts` — Saju four pillars calculation engine
- `artifacts/api-server/src/routes/astrology/vedic.ts` — Vedic astrology calculations (sidereal)
- `artifacts/api-server/src/routes/astrology/interpretation.ts` — Interpretation & daewoon generation
- `artifacts/api-server/src/routes/astrology/today.ts` — Today's fortune generator

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
