"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EditorPanelProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmitShortcut?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export const EditorPanel = ({
  id,
  label,
  value,
  onChange,
  onClear,
  onSubmitShortcut,
  placeholder,
  disabled,
  className,
}: EditorPanelProps) => {
  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      onSubmitShortcut?.();
    }
  };

  return (
    <section
      aria-labelledby={`${id}-label`}
      className={cn(
        "flex h-full min-h-[18rem] flex-col rounded-lg border border-border bg-background/95 shadow-sm",
        className,
      )}
    >
      <header className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-3">
        <div className="flex flex-col">
          <span id={`${id}-label`} className="text-sm font-semibold uppercase tracking-wide">
            {label}
          </span>
          <span className="text-xs text-muted-foreground">{value.length.toLocaleString()} chars</span>
        </div>
        <Button
          variant="ghost"
          onClick={onClear}
          className="gap-1 px-2 text-xs uppercase tracking-wide text-muted-foreground"
          title={`Clear ${label.toLowerCase()} input`}
          disabled={disabled || value.length === 0}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Clear
        </Button>
      </header>
      <div className="flex flex-1 flex-col">
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[12rem] flex-1 resize-none rounded-b-lg bg-transparent px-4 py-4 font-mono text-sm leading-6 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          placeholder={placeholder}
          spellCheck={false}
          aria-label={label}
          disabled={disabled}
        />
      </div>
    </section>
  );
};
