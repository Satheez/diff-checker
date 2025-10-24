# Acceptance Scenarios — Diffly

## Basic Compare
- Given: two texts with known differences.
- When: user clicks Compare (or waits 500ms after typing).
- Then: highlights show adds/removes/changes correctly.

## Mode Toggle
- Given: Inline mode.
- When: user switches to Side-by-side.
- Then: corresponding segments align and remain readable.

## Copy/Reset/Download
- Copy places HTML/plain text diff on clipboard.
- Reset clears both inputs and result.
- Download creates a .txt or .html file containing the diff.

## Accessibility
- All controls reachable via keyboard; focus states visible.
- Screen readers announce change types in diff spans.
