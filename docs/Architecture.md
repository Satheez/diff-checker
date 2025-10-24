# Architecture — Diffly

## Approaches
### A) Simple & Readable (Recommended for v1)
- Next.js (App Router) + TS, client-only page.
- `diff-match-patch` for diff generation.
- Debounce with `requestIdleCallback` fallback to setTimeout(500).
- No global state manager; use component state and URL params.

### B) Max Performance (For very large diffs)
- Web Worker for diff calculation to keep UI main thread free.
- Chunked diff (paragraph/line first, then word/char within changed segments).
- Virtualized list for result (`react-virtualized`/`react-virtuoso`).
- Optional WASM diff (e.g., patience diff).

## Data Flow
Editor -> (debounce) -> Diff Engine -> Diff AST -> Renderer

## URL Sharing
- `?l=...&r=...&mode=inline` (base64 or lz-string compressed); guard length to avoid URL limits.
