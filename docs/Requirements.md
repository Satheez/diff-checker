# Requirements — Diffly

## Functional
1. Enter/paste text into two inputs (Original, Modified).
2. Compute diff (manual and auto after debounce).
3. Toggle view: Inline | Side-by-side.
4. Copy diff output to clipboard.
5. Reset both editors.
6. Download diff as .txt or .html.
7. Theme toggle; persist preference in localStorage.
8. Shareable URL encodes inputs or a short hash (optional if too long).

## Non-Functional
- Performant for inputs up to 100k chars.
- Pure client-side; no data leaves the browser.
- Accessible keyboard navigation; screen-reader roles/labels.
- Responsive down to 360px width.

## Acceptance Criteria
- Given two strings, when user clicks Compare, then visible diff highlights are rendered.
- Given typing in either editor, when 500ms pass, diff re-renders without freezing UI.
- Given dark theme, colors maintain sufficient contrast (WCAG AA).
