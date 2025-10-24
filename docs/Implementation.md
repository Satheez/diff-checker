# Implementation Plan — Diffly

## Step 1 — Scaffold
- Create Next.js app with TS; add Tailwind; setup base theme tokens.

## Step 2 — Diff Utility
- Wrap `diff-match-patch` with helpers:
  - `diffLines(a,b)`
  - `diffWords(a,b)`
  - `toHtmlSpans(deltas)` — returns JSX-ready tokens with metadata.

## Step 3 — UI
- Two `EditorPanel` components side-by-side (stack on mobile).
- `Toolbar` with debounced compare, mode toggle, copy, download, theme.
- `DiffView` that supports inline and side-by-side; virtualize changed blocks.

## Step 4 — URL & Persistence
- Sync inputs and mode to query string (encoded); store theme in localStorage.

## Step 5 — Testing
- Unit: diff utils for correctness; debounce behavior.
- E2E: paste sample texts; verify highlights; theme persistence.

## Step 6 — Performance
- Add Web Worker behind a feature flag for >50k chars.
- Use `requestIdleCallback` for heavy recomputes.
