"use client";

import { useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import { DiffResult, DiffSpan, DiffLine, DiffKind, toHtmlSpans } from "@/lib/diff";
import { cn } from "@/lib/utils";

type DiffViewProps = {
  diff: DiffResult;
  mode: "inline" | "split";
};

const INLINE_CLASS_MAP: Record<DiffKind, string> = {
  equal: "text-foreground",
  insert: "bg-success/15 text-success",
  delete: "bg-danger/15 text-danger line-through decoration-danger/70",
  replace: "bg-warning/20 text-warning",
};

const LINE_BADGE_MAP: Record<DiffKind, string> = {
  equal: "text-muted-foreground",
  insert: "text-success",
  delete: "text-danger",
  replace: "text-warning",
};

const LINE_CELL_MAP: Record<DiffKind, string> = {
  equal: "",
  insert: "bg-success/10",
  delete: "bg-danger/10",
  replace: "bg-warning/10",
};

const InlineView = ({ spans }: { spans: DiffSpan[] }) => (
  <article className="relative h-full min-h-[20rem] w-full overflow-auto rounded-xl border border-border bg-background p-4 shadow-sm">
    <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-7">
      {spans.length === 0 ? (
        <span className="text-muted-foreground">Start typing to see the diff.</span>
      ) : (
        spans.map((span) => (
          <span
            key={span.key}
            className={cn(
              "rounded-sm px-0.5 py-0.5 transition-colors",
              INLINE_CLASS_MAP[span.type],
            )}
            aria-label={span.ariaLabel}
          >
            {span.value}
          </span>
        ))
      )}
    </pre>
  </article>
);

const LineCell = ({
  value,
  type,
}: {
  value?: { value: string; lineNumber: number };
  type: DiffKind;
}) => (
  <div
    className={cn(
      "flex min-h-[2.5rem] flex-1 items-start gap-4 rounded-md px-3 py-2 font-mono text-sm leading-6",
      LINE_CELL_MAP[type],
      value ? "text-foreground" : "text-muted-foreground",
    )}
  >
    <span className={cn("min-w-[2.5rem] text-right text-xs uppercase tracking-wide", LINE_BADGE_MAP[type])}>
      {value?.lineNumber ?? "—"}
    </span>
    <span className="flex-1 whitespace-pre-wrap break-words">{value?.value ?? ""}</span>
  </div>
);

const LineRow = ({ line }: { line: DiffLine }) => (
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
    <LineCell value={line.left} type={line.type === "insert" ? "equal" : line.type} />
    <LineCell value={line.right} type={line.type === "delete" ? "equal" : line.type} />
  </div>
);

const SplitView = ({ lines }: { lines: DiffLine[] }) => {
  if (lines.length === 0) {
    return (
      <div className="flex min-h-[16rem] flex-col items-center justify-center rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground">
        <p>No diff yet. Paste text in both editors to begin.</p>
      </div>
    );
  }

  return (
    <div className="h-[28rem] w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm sm:h-[32rem] md:h-[36rem]">
      <div className="grid grid-cols-1 border-b border-border bg-muted/60 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid-cols-2">
        <span>Original</span>
        <span className="mt-2 sm:mt-0">Modified</span>
      </div>
      <Virtuoso
        data={lines}
        className="h-full"
        itemContent={(index, line) => (
          <div
            key={line.key ?? `line-${index}`}
            className="border-b border-border/60 px-3 py-2 last:border-none"
          >
            <LineRow line={line} />
          </div>
        )}
      />
    </div>
  );
};

export const DiffView = ({ diff, mode }: DiffViewProps) => {
  const spans = useMemo(() => toHtmlSpans(diff.inline), [diff.inline]);

  if (!diff.hasChanges && diff.inline.length === 0) {
    return (
      <div className="flex min-h-[12rem] flex-col items-center justify-center rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground">
        <p>Paste or type text in both panels, then press Compare to see the diff.</p>
        <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground/80">
          Tip: Use Cmd/Ctrl + Enter to compare instantly.
        </p>
      </div>
    );
  }

  return mode === "inline" ? <InlineView spans={spans} /> : <SplitView lines={diff.lines} />;
};
