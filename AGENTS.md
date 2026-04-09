# AGENTS.md

## Cursor Cloud specific instructions

**DOC-DOC** is a client-side-only React SPA for managing family documents. There is no backend, database, or external service dependency.

### Tech stack

- React 19 + TypeScript 5.7 + Vite 6 + Tailwind CSS 4
- Package manager: **npm** (lockfile: `package-lock.json`)

### Key commands

All defined in `package.json` scripts:

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (Vite on port 5173) |
| Lint | `npm run lint` (ESLint) |
| Build | `npm run build` (tsc + vite build) |
| Preview prod build | `npm run preview` |

### Notes

- No automated tests exist in this repo. There is no test runner or test framework configured.
- The GitHub Actions CI workflow (`.github/workflows/webpack.yml`) references `npx webpack` but the project uses Vite — the CI config is outdated and will fail.
- All application state is in-memory React state; data is lost on page refresh.
- The entire app logic lives in `src/App.tsx` (~287 lines).
