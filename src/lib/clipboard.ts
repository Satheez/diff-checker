"use client";

type ClipboardPayload = {
  html: string;
  text: string;
};

export const copyDiff = async ({ html, text }: ClipboardPayload) => {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    throw new Error("Clipboard unavailable");
  }

  try {
    if ("write" in navigator.clipboard && typeof ClipboardItem !== "undefined") {
      const blobHtml = new Blob([html], { type: "text/html" });
      const blobText = new Blob([text], { type: "text/plain" });
      const clipboardItem = new ClipboardItem({
        "text/html": blobHtml,
        "text/plain": blobText,
      });
      await navigator.clipboard.write([clipboardItem]);
      return;
    }

    await navigator.clipboard.writeText(text);
  } catch {
    await navigator.clipboard.writeText(text);
  }
};
