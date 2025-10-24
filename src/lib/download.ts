"use client";

type DownloadFormat = "text" | "html";

const MIME_TYPES: Record<DownloadFormat, string> = {
  text: "text/plain",
  html: "text/html",
};

const EXTENSIONS: Record<DownloadFormat, string> = {
  text: "txt",
  html: "html",
};

export const downloadDiff = (content: string, format: DownloadFormat) => {
  const blob = new Blob([content], { type: MIME_TYPES[format] });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  anchor.href = url;
  anchor.download = `diffly-${timestamp}.${EXTENSIONS[format]}`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
