"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { AppFooter } from "@/components/app-footer";
import { DiffSummaryBar } from "@/components/diff-summary";
import { DiffView } from "@/components/diff-view";
import { EditorPanel } from "@/components/editor-panel";
import { Toolbar } from "@/components/toolbar";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { copyDiff } from "@/lib/clipboard";
import { buildDiff, DiffResult } from "@/lib/diff";
import { downloadDiff } from "@/lib/download";
import { diffToHtml, diffToPlainText } from "@/lib/serialize";
import { decodeParam, encodeParam, updateSearchParams } from "@/lib/url";
import { cn } from "@/lib/utils";

type ViewMode = "inline" | "split";

type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

const parseViewMode = (mode: string | null): ViewMode =>
  mode === "split" ? "split" : "inline";

const Header = () => (
  <header className="flex flex-col gap-3 text-center lg:text-left">
    <span className="inline-flex items-center gap-2 self-center rounded-full border border-border bg-background/80 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground backdrop-blur supports-[backdrop-filter]:bg-background/50 lg:self-start">
      <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
      Real-time diff engine
    </span>
    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
      Diffly — instant, shareable text diffs
    </h1>
    <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
      Paste any two snippets, compare inline or side-by-side, and share the result via URL.
      Everything stays on-device for maximum privacy.
    </p>
  </header>
);

const FeedbackBanner = ({ feedback }: { feedback: Feedback }) => {
  if (!feedback) return null;
  const isSuccess = feedback.type === "success";
  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
        isSuccess
          ? "border-success/40 bg-success/10 text-success"
          : "border-danger/40 bg-danger/10 text-danger",
      )}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      ) : (
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
      )}
      <span>{feedback.message}</span>
    </div>
  );
};

const WarningBanner = ({ message }: { message: string | null }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-warning/50 bg-warning/10 px-3 py-2 text-sm text-warning">
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};

const useDiffState = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const initialLeftParam = searchParams.get("l");
  const initialRightParam = searchParams.get("r");
  const initialModeParam = searchParams.get("mode");

  const [left, setLeft] = useState(() => decodeParam(initialLeftParam));
  const [right, setRight] = useState(() => decodeParam(initialRightParam));
  const [mode, setMode] = useState<ViewMode>(() => parseViewMode(initialModeParam));
  const [source, setSource] = useState(() => ({
    left: decodeParam(initialLeftParam),
    right: decodeParam(initialRightParam),
  }));

  const encodedRef = useRef({
    left: initialLeftParam,
    right: initialRightParam,
    mode: parseViewMode(initialModeParam),
  });
  const queryRef = useRef(searchString);

  const debouncedLeft = useDebouncedValue(left, 500);
  const debouncedRight = useDebouncedValue(right, 500);

  const [isDiffing, startTransition] = useTransition();

  const encodedState = useMemo(() => {
    const leftEncoded = encodeParam(debouncedLeft);
    const rightEncoded = encodeParam(debouncedRight);
    const warning =
      leftEncoded.truncated || rightEncoded.truncated
        ? "Inputs are too large to sync to the URL. Your diff still works locally."
        : null;

    return {
      leftEncoded,
      rightEncoded,
      warning,
    };
  }, [debouncedLeft, debouncedRight]);

  useEffect(() => {
    const params = new URLSearchParams();
    updateSearchParams(params, "l", encodedState.leftEncoded.value);
    updateSearchParams(params, "r", encodedState.rightEncoded.value);
    if (mode === "split") {
      params.set("mode", "split");
    }

    const nextQuery = params.toString();
    if (nextQuery !== queryRef.current) {
      queryRef.current = nextQuery;
      encodedRef.current.left = encodedState.leftEncoded.value;
      encodedRef.current.right = encodedState.rightEncoded.value;
      encodedRef.current.mode = mode;
      const target = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(target, { scroll: false });
    } else {
      encodedRef.current.left = encodedState.leftEncoded.value;
      encodedRef.current.right = encodedState.rightEncoded.value;
      encodedRef.current.mode = mode;
    }
  }, [encodedState, mode, pathname, router]);

  useEffect(() => {
    const currentParams = new URLSearchParams(searchString);

    const paramLeft = currentParams.get("l");
    if (paramLeft !== encodedRef.current.left) {
      startTransition(() => {
        setLeft(decodeParam(paramLeft));
      });
      encodedRef.current.left = paramLeft;
    }

    const paramRight = currentParams.get("r");
    if (paramRight !== encodedRef.current.right) {
      startTransition(() => {
        setRight(decodeParam(paramRight));
      });
      encodedRef.current.right = paramRight;
    }

    const paramMode = parseViewMode(currentParams.get("mode"));
    if (paramMode !== encodedRef.current.mode) {
      startTransition(() => {
        setMode(paramMode);
      });
      encodedRef.current.mode = paramMode;
    }
  }, [searchString, startTransition]);

  const handleCompare = useCallback(() => {
    startTransition(() => setSource({ left, right }));
  }, [left, right, startTransition]);

  const handleReset = useCallback(() => {
    setLeft("");
    setRight("");
    startTransition(() => setSource({ left: "", right: "" }));
  }, [startTransition]);

  return {
    state: { left, right, mode, source, urlWarning: encodedState.warning },
    actions: { setLeft, setRight, setMode, handleCompare, handleReset },
    debounced: { left: debouncedLeft, right: debouncedRight },
    meta: { isDiffing },
  };
};

const HomeContent = () => {
  const {
    state: { left, right, mode, source, urlWarning },
    actions: { setLeft, setRight, setMode, handleCompare, handleReset },
    meta: { isDiffing },
  } = useDiffState();

  const diff = useMemo<DiffResult>(
    () => buildDiff(source.left, source.right),
    [source.left, source.right],
  );

  const [isCopying, setIsCopying] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const handleCopy = useCallback(async () => {
    if (!diff.inline.length) return;
    try {
      setIsCopying(true);
      await copyDiff({
        html: diffToHtml(diff),
        text: diffToPlainText(diff),
      });
      setFeedback({ type: "success", message: "Diff copied to clipboard." });
    } catch {
      setFeedback({
        type: "error",
        message: "Clipboard permission denied. Try copying manually.",
      });
    } finally {
      setIsCopying(false);
    }
  }, [diff]);

  const handleDownload = useCallback(
    (format: "text" | "html") => {
      if (!diff.inline.length) return;
      const payload =
        format === "html" ? diffToHtml(diff) : diffToPlainText(diff);
      downloadDiff(payload, format);
      setFeedback({
        type: "success",
        message: `Diff downloaded as ${format === "html" ? "HTML" : "plain text"}.`,
      });
    },
    [diff],
  );

  const canCopy = diff.inline.length > 0;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[95vw] flex-col gap-8 px-4 py-12 sm:px-6 lg:px-10">
      <Header />

      <Toolbar
        mode={mode}
        onModeChange={setMode}
        onCompare={handleCompare}
        onReset={handleReset}
        onCopy={handleCopy}
        onDownload={handleDownload}
        canCopy={canCopy}
        hasChanges={diff.hasChanges}
        isDiffing={isDiffing}
        isCopying={isCopying}
      />

      <FeedbackBanner feedback={feedback} />
      <WarningBanner message={urlWarning} />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EditorPanel
          id="original"
          label="Original"
          value={left}
          onChange={setLeft}
          onClear={() => setLeft("")}
          onSubmitShortcut={handleCompare}
          placeholder="Paste or type the original text here..."
        />
        <EditorPanel
          id="modified"
          label="Modified"
          value={right}
          onChange={setRight}
          onClear={() => setRight("")}
          onSubmitShortcut={handleCompare}
          placeholder="Paste or type the modified text here..."
        />
      </section>

      <DiffSummaryBar summary={diff.summary} />

      <DiffView diff={diff} mode={mode} />

      <AppFooter />
    </main>
  );
};

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="flex max-w-md flex-col items-center gap-3 rounded-xl border border-border/70 bg-background/80 px-6 py-8 text-sm text-muted-foreground shadow-sm">
      <span className="h-3 w-3 animate-pulse rounded-full bg-accent" aria-hidden="true" />
      <p>Loading diff engine…</p>
    </div>
  </div>
);

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}
