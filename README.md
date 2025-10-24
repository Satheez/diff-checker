# Diffly — Modern Text Diff Checker

Diffly is a fast, privacy-first diff tool for comparing two blocks of text right in the browser. It features inline and side-by-side views, virtualized rendering for large diffs, and shareable URLs that keep your data compressed on the client.

## Features
- Inline and split diff modes with instant switching
- Debounced diff engine powered by `diff-match-patch`
- URL syncing (compressed) for sharable comparisons
- Copy diff to clipboard as HTML + plain text
- Download results as `.html` or `.txt`
- Dark/light theme toggle with persistence
- Virtualized rendering keeps long diffs responsive

## Tech Stack
- [Next.js 16](https://nextjs.org/) + React 19 (App Router)
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [diff-match-patch](https://diff-match-patch.github.io) & [`diff`](https://www.npmjs.com/package/diff) for diff generation
- [Radix UI primitives](https://www.radix-ui.com/) + [lucide-react](https://lucide.dev/) icons
- [react-virtuoso](https://virtuoso.dev/) for virtualized line rendering
- [next-themes](https://github.com/pacocoursey/next-themes) for theme persistence

## Getting Started

```bash
pnpm install
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to use Diffly locally. Edits in `src/app/page.tsx` and related components will hot-reload automatically.

## Available Scripts
- `pnpm dev` – Run the development server
- `pnpm build` – Create a production build
- `pnpm start` – Serve the production build
- `pnpm lint` – Lint the project (ESLint + Prettier integration)
- `pnpm format` / `pnpm format:write` – Check or fix formatting with Prettier

## Project Structure

```
docs/                # Product and engineering documentation
src/app/             # Next.js app router pages/layouts
src/components/      # UI components (editors, toolbar, diff view, etc.)
src/hooks/           # Reusable React hooks
src/lib/             # Diff utilities, serialization, clipboard helpers
public/              # Static assets
```

## Next Steps
- Add Vitest unit coverage for `src/lib/diff.ts` and serializer helpers
- Cover end-to-end flows with Playwright (editor input → copy/download)
- Ship web worker support for heavy inputs (>50k chars) and expose a toggle in the toolbar

---

Diffly keeps all processing on-device—no servers, no telemetry. Perfect for sharing sensitive diffs without leaving the browser.
