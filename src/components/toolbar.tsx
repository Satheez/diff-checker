"use client";

import {
  AlignJustify,
  Columns2,
  Copy,
  Download,
  FileText,
  GitCompare,
  LayoutPanelLeft,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";

type ViewMode = "inline" | "split";
type DownloadFormat = "text" | "html";

type ToolbarProps = {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  onCompare: () => void;
  onReset: () => void;
  onCopy: () => Promise<void>;
  onDownload: (format: DownloadFormat) => void;
  canCopy: boolean;
  hasChanges: boolean;
  isDiffing: boolean;
  isCopying: boolean;
};

export const Toolbar = ({
  mode,
  onModeChange,
  onCompare,
  onReset,
  onCopy,
  onDownload,
  canCopy,
  hasChanges,
  isDiffing,
  isCopying,
}: ToolbarProps) => {
  const handleModeChange = (value: string) => {
    if (value === "inline" || value === "split") {
      onModeChange(value);
    }
  };

  const handleDownload = (format: DownloadFormat) => () => {
    onDownload(format);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex w-full flex-col gap-3 rounded-xl border border-border bg-background/95 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Button onClick={onCompare} disabled={isDiffing}>
            {isDiffing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <GitCompare className="h-4 w-4" aria-hidden="true" />}
            Compare
          </Button>
          <Button variant="outline" onClick={onReset} disabled={isDiffing}>
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                onClick={onCopy}
                disabled={!canCopy}
                isLoading={isCopying}
              >
                {isCopying ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                Copy
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy HTML & plain text diff</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" disabled={!hasChanges}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Download as</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDownload("html")}>
                <LayoutPanelLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                HTML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload("text")}>
                <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                Plain text
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-1 items-center justify-between gap-2 lg:justify-end">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={handleModeChange}
            aria-label="Select diff view mode"
          >
            <ToggleGroupItem value="inline" aria-label="Inline diff view">
              <AlignJustify className="mr-2 h-4 w-4" aria-hidden="true" />
              Inline
            </ToggleGroupItem>
            <ToggleGroupItem value="split" aria-label="Side-by-side diff view">
              <Columns2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Split
            </ToggleGroupItem>
          </ToggleGroup>
          <ThemeToggle />
        </div>
      </div>
    </TooltipProvider>
  );
};
