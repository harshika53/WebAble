# WebAble — Agent Guide

## Architecture

- **Frontend** (root): React 18 + Vite + TypeScript + Tailwind CSS. Entry: `src/main.tsx` -> `App.tsx`.
- **Backend (Flask)**: `backend/app.py` — main API gateway, MongoDB, runs on `:5000`. Requires `.env` with `MONGO_URI`.
- **Backend (Node)**: `backend/server.js` — Express alternative that runs Lighthouse + axe-core scans via `scan_service.js`. Also on `:5000`.
- Flask invokes `scan_service.js` via `subprocess.Popen` (`backend/app.py:187`). The Node backend can also be run standalone.
- **Scanning currently returns hardcoded mock data** (`app.py:85-96`, comment: "TEMPORARILY BYPASSED FOR TESTING DUPLICATES"). Real scanning code exists but is not reached.
- **MongoDB**: collection `accessibility_analyzer.scans`. Fields: `id` (UUID), `url`, `date`, `results`, `status`.

## Available scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (flat config) |
| `npm run preview` | Preview production build |
| no typecheck script | Use `npx tsc --noEmit` |
| no test script | No test framework installed |

## Backend setup

```pwsh
cd backend
pip install -r requirements.txt
# Create .env with: MONGO_URI=your_mongodb_connection_string
python app.py          # Flask API + MongoDB
# or: node server.js   # Node.js scanning server (requires Chrome)
```

## Commits

Husky runs commitlint (conventional commits). Format: `<type>: <lowercase description>`.
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `revert`.
Max 100 chars, no trailing period. Example: `fix: resolve scan button crash`.

## Key quirks

- **`/history` route referenced in Navbar but NOT defined in `App.tsx`**. Navigation to it will hit the `*` catch-all (NotFoundPage).
- **API mismatch**: Frontend (`api.ts`) calls `/api/scan` (POST), `/api/reports`, `/api/recent-scans`. Backend Flask only defines `/api/reports/<identifier>`, `/api/recent-scans`. The frontend `getScanReport` calls `/api/scan-report/<id>` which does not exist in Flask.
- **noUnusedLocals / noUnusedParameters** are strict in both tsconfigs — dead code causes compile errors.
- **verbatimModuleSyntax** is enabled — use `import type` for type-only imports.
- **Dark mode**: `darkMode: 'class'` in tailwind, toggled via `localStorage('theme')`.
- **`lucide-react` excluded from Vite's optimizeDeps** (`vite.config.ts:7-9`).
- **`list/` directory** at root exists but contains only `_/` — appears unused.
- **Firebase** (`firebase` in dependencies) is not currently wired into any frontend code — likely planned.

## Installed Skills (`.agents/skills/`)

| Skill | Use in this repo |
|-------|-----------------|
| `accessibility-compliance` | Audit and fix ARIA patterns, screen reader support, and inclusive design across React components |
| `api-design-principles` | Fix the REST API mismatches between Flask backend and frontend `api.ts` (missing `/api/scan`, `/api/scan-report/<id>`) |
| `conventional-commit` | Generate correct commitlint-compliant commit messages (Husky enforces conventional commits on this repo) |
| `core-web-vitals` | Optimize LCP/INP/CLS for the scan results page and report views |
| `flask-api-development` | Extend `backend/app.py` — add missing routes, blueprints, request validation, and error handling |
| `mongodb-query-optimizer` | Optimize queries against `accessibility_analyzer.scans` collection; add indexes for `url`, `date`, `status` fields |
| `mongodb-schema-design` | Review and evolve the scans document schema (embed vs reference for results, TTL for old scans) |
| `python-design-patterns` | Refactor `backend/app.py` — separate scanning logic, DB layer, and API routing that are currently entangled |
| `tailwind-design-system` | Extend or maintain the custom Tailwind tokens (`primary`, `accent`, `success`, etc.) and component classes in `src/index.css` |
| `typescript-advanced-types` | Enforce strict types across `src/` — especially `api.ts` response types and component props under `noUnusedLocals`/`verbatimModuleSyntax` |
| `vercel-composition-patterns` | Refactor React components using compound component / render prop patterns for scan results and report UI |
| `vercel-react-best-practices` | Apply Vercel/React performance patterns to Vite+React 18 frontend — memoization, data fetching, bundle size |
| `wcag-audit-patterns` | Run WCAG 2.2 audits on rendered pages — critical for an accessibility-focused tool like WebAble |

## Tailwind custom tokens

Colors: `primary` (blue), `accent` (violet), `success` (green), `warning` (amber), `error` (red) — all with 50–950 shades.
Utility: `cn()` via `clsx + tailwind-merge` at `src/utils/cn.ts`.
Custom CSS component classes in `src/index.css` (`.btn`, `.btn-primary`, `.input`, `.card`).
