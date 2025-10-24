# codex cli — Build Spec

This file describes what a codegen CLI should scaffold.

## Project
- Name: `diffly`
- Language: TypeScript
- Framework: Next.js (App Router)
- Styling: TailwindCSS
- QA: ESLint + Prettier + Vitest + Playwright
- Hosting: Vercel
- Optional: PWA plugin

## Commands to Generate
- `init`: scaffold Next.js + TS + Tailwind
- `add:ui`: add shadcn/ui base + theme toggle
- `add:diff`: add `diff-match-patch` and utils
- `add:pages`: create core pages & components
- `add:tests`: add unit + e2e tests
- `deploy`: configure Vercel project

## File Targets
- `app/page.tsx` — main UI
- `components/EditorPanel.tsx`
- `components/Toolbar.tsx`
- `components/DiffView.tsx`
- `lib/diff.ts`
- `lib/debounce.ts`
- `styles/globals.css`
- `tests/unit/diff.spec.ts`
- `tests/e2e/diff.spec.ts`
