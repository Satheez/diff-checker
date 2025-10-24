"use client";

export const AppFooter = () => (
  <footer className="flex flex-col items-center justify-between gap-3 border-t border-border/80 py-6 text-xs text-muted-foreground sm:flex-row">
    <span>&copy; {new Date().getFullYear()} Diffly. Built for privacy-first comparisons.</span>
    <nav className="flex items-center gap-4">
      <a
        href="https://diff-match-patch.github.io"
        className="hover:text-foreground"
        target="_blank"
        rel="noreferrer"
      >
        diff-match-patch
      </a>
      <a href="https://github.com/" className="hover:text-foreground" target="_blank" rel="noreferrer">
        Source
      </a>
    </nav>
  </footer>
);
