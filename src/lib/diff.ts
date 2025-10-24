import DiffMatchPatch from "diff-match-patch";
import type { Change } from "diff";
import { diffWordsWithSpace } from "diff";

export type DiffKind = "equal" | "insert" | "delete" | "replace";

export type DiffToken = {
  type: DiffKind;
  value: string;
};

export type DiffSpan = DiffToken & {
  key: string;
  ariaLabel: string;
};

export type DiffLine = {
  key: string;
  type: DiffKind;
  left?: {
    value: string;
    lineNumber: number;
  };
  right?: {
    value: string;
    lineNumber: number;
  };
};

export type DiffSummary = {
  added: number;
  removed: number;
  changed: number;
};

export type DiffResult = {
  inline: DiffToken[];
  lines: DiffLine[];
  summary: DiffSummary;
  hasChanges: boolean;
};

const dmp = new DiffMatchPatch();
dmp.Diff_Timeout = 2;
dmp.Diff_EditCost = 4;

const enum Operation {
  Delete = -1,
  Equal = 0,
  Insert = 1,
}

const ARIA_LABEL_MAP: Record<DiffKind, string> = {
  equal: "unchanged text",
  insert: "added text",
  delete: "removed text",
  replace: "modified text",
};

const splitLines = (input: string): string[] => {
  const normalized = input.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }
  return lines;
};

const asKind = (change: Change): DiffKind => {
  if (change.added) return "insert";
  if (change.removed) return "delete";
  return "equal";
};

export const diffWords = (original: string, modified: string): DiffToken[] => {
  const changes = diffWordsWithSpace(original, modified);
  const tokens: DiffToken[] = [];

  for (const change of changes) {
    if (!change.value) continue;

    const type = asKind(change);
    tokens.push({
      type,
      value: change.value,
    });
  }

  return tokens;
};

export const toHtmlSpans = (tokens: DiffToken[]): DiffSpan[] =>
  tokens.map((token, index) => ({
    ...token,
    key: `${token.type}-${index}`,
    ariaLabel: ARIA_LABEL_MAP[token.type],
  }));

const pairwise =
  <T, K>(left: T[], right: K[]) =>
  (handle: (pair: { left?: T; right?: K; index: number }) => void) => {
    const max = Math.max(left.length, right.length);
    for (let index = 0; index < max; index += 1) {
      handle({
        left: left[index],
        right: right[index],
        index,
      });
    }
  };

export const diffLines = (
  original: string,
  modified: string,
): { lines: DiffLine[]; summary: DiffSummary } => {
  const { chars1, chars2, lineArray } = dmp.diff_linesToChars_(original, modified);
  const diffs = dmp.diff_main(chars1, chars2, false);
  dmp.diff_cleanupSemantic(diffs);
  dmp.diff_cleanupEfficiency(diffs);
  dmp.diff_charsToLines_(diffs, lineArray);

  const lines: DiffLine[] = [];
  const summary: DiffSummary = { added: 0, removed: 0, changed: 0 };
  let leftLine = 1;
  let rightLine = 1;

  for (let index = 0; index < diffs.length; index += 1) {
    const [operation, text] = diffs[index];
    if (!text) continue;

    if (operation === Operation.Equal) {
      const equalLines = splitLines(text);
      for (const equalLine of equalLines) {
        lines.push({
          key: `equal-${leftLine}-${rightLine}`,
          type: "equal",
          left: { value: equalLine, lineNumber: leftLine },
          right: { value: equalLine, lineNumber: rightLine },
        });
        leftLine += 1;
        rightLine += 1;
      }
      continue;
    }

    if (operation === Operation.Delete) {
      const leftLines = splitLines(text);
      const next = diffs[index + 1];
      if (next && next[0] === Operation.Insert) {
        const rightLines = splitLines(next[1]);
        const shared = Math.min(leftLines.length, rightLines.length);

        summary.changed += shared;

        pairwise(leftLines.slice(0, shared), rightLines.slice(0, shared))(
          ({ left, right, index: pairIndex }) => {
            lines.push({
              key: `replace-${leftLine + pairIndex}-${rightLine + pairIndex}`,
              type: "replace",
              left: left
                ? { value: left, lineNumber: leftLine + pairIndex }
                : undefined,
              right: right
                ? { value: right, lineNumber: rightLine + pairIndex }
                : undefined,
            });
          },
        );

        if (leftLines.length > shared) {
          summary.removed += leftLines.length - shared;
          for (let offset = shared; offset < leftLines.length; offset += 1) {
            const value = leftLines[offset];
            lines.push({
              key: `delete-${leftLine + offset}`,
              type: "delete",
              left: { value, lineNumber: leftLine + offset },
            });
          }
        }

        if (rightLines.length > shared) {
          summary.added += rightLines.length - shared;
          for (let offset = shared; offset < rightLines.length; offset += 1) {
            const value = rightLines[offset];
            lines.push({
              key: `insert-${rightLine + offset}`,
              type: "insert",
              right: { value, lineNumber: rightLine + offset },
            });
          }
        }

        leftLine += leftLines.length;
        rightLine += rightLines.length;
        index += 1; // Skip the paired insert segment.
        continue;
      }

      summary.removed += leftLines.length;
      for (const [offset, value] of leftLines.entries()) {
        lines.push({
          key: `delete-${leftLine + offset}`,
          type: "delete",
          left: { value, lineNumber: leftLine + offset },
        });
      }
      leftLine += leftLines.length;
      continue;
    }

    if (operation === Operation.Insert) {
      const rightLines = splitLines(text);
      summary.added += rightLines.length;
      for (const [offset, value] of rightLines.entries()) {
        lines.push({
          key: `insert-${rightLine + offset}`,
          type: "insert",
          right: { value, lineNumber: rightLine + offset },
        });
      }
      rightLine += rightLines.length;
    }
  }

  return { lines, summary };
};

export const buildDiff = (original: string, modified: string): DiffResult => {
  const inline = diffWords(original, modified);
  const { lines, summary } = diffLines(original, modified);
  const hasChanges = summary.added + summary.removed + summary.changed > 0;

  return { inline, lines, summary, hasChanges };
};
