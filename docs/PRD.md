# PRD — Diffly (v1.0)
Date: 2025-10-24
Owner: Satheez

## 1. Problem & Goal
Users need to quickly see what changed between two text blocks. Diffly provides an **instant**, **accurate**, and **pleasant** diff experience in the browser.

## 2. Objectives
- Fast, accurate diff between two inputs
- Side-by-side & inline views
- Copy, reset, download, theme toggle
- Accessible, responsive UI
- Works offline (optional PWA)

## 3. Success Metrics
- Time-to-first-diff < 100ms for 50k chars
- CLS < 0.05; Lighthouse Perf > 95
- Error rate ~0% (no crashes)
- Session share via URL in < 1 click

## 4. Scope v1
- Two editors: "Original" and "Modified"
- Debounced live diff (500ms)
- Inline & side-by-side modes
- Color-coded highlights (add, remove, change)
- Copy result, Reset, Download (.txt/.html)
- Theme toggle (dark/light)

## 5. Out of Scope (v2+)
- File upload diff (.txt/.json/.csv/.docx)
- Syntax-aware code diff (language modes)
- Git integration & history
- Cloud sync & accounts

## 6. Non-Functional
- Client-only, privacy-first
- WCAG 2.1 AA
- Mobile friendly
- Tested on Chrome/Edge/Safari/Firefox
