import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";

const MAX_PARAM_LENGTH = 4000;

export const encodeParam = (
  value: string,
): { value: string | null; truncated: boolean } => {
  if (!value) return { value: null, truncated: false };

  const compressed = compressToEncodedURIComponent(value);
  if (!compressed) return { value: null, truncated: false };

  if (compressed.length > MAX_PARAM_LENGTH) {
    return { value: null, truncated: true };
  }

  return { value: compressed, truncated: false };
};

export const decodeParam = (value: string | null | undefined): string => {
  if (!value) return "";
  const decoded = decompressFromEncodedURIComponent(value);
  return decoded ?? "";
};

export const updateSearchParams = (
  searchParams: URLSearchParams,
  key: string,
  value: string | null,
) => {
  if (value && value.length > 0) {
    searchParams.set(key, value);
  } else {
    searchParams.delete(key);
  }
};
