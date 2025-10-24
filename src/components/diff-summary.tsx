"use client";

import { DiffSummary } from "@/lib/diff";
import { cn } from "@/lib/utils";

type DiffSummaryProps = {
  summary: DiffSummary;
};

const SummaryItem = ({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs uppercase tracking-wide",
      className,
    )}
  >
    <span className="text-muted-foreground">{label}</span>
    <span className="text-base font-semibold">{value.toLocaleString()}</span>
  </div>
);

export const DiffSummaryBar = ({ summary }: DiffSummaryProps) => (
  <div className="flex flex-wrap items-center gap-2">
    <SummaryItem label="Added" value={summary.added} className="bg-success/10 text-success" />
    <SummaryItem label="Removed" value={summary.removed} className="bg-danger/10 text-danger" />
    <SummaryItem label="Changed" value={summary.changed} className="bg-warning/10 text-warning" />
  </div>
);
