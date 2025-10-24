# Design — Diffly

## Information Architecture
- `/` home: editors + results
- (future) `/file` for uploads

## Components
- `EditorPanel` — text area with label, clear, paste.
- `Toolbar` — actions: Compare, Reset, Copy, Download, Theme, ViewMode.
- `DiffView` — renders diff in two modes; virtualized for long outputs.
- `Footer` — minimal links (privacy, source).

## UX Notes
- Keep inputs and actions in a sticky header on mobile.
- Use monospace font in editors; proportional in results.
- Added = green bg; Removed = red bg; Changed = yellow bg.
- Provide keyboard shortcuts: Cmd/Ctrl+Enter to compare, Esc to clear modals.

## Accessibility
- ARIA roles on buttons/toggles, focus rings, proper labels.
- Ensure diff spans have `aria-label` describing change type.
