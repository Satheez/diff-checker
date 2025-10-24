"use client";

import { useEffect, useRef, useState } from "react";

export const useDebouncedValue = <T>(value: T, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  const timeoutRef = useRef<number | null>(null);
  const idleRef = useRef<number | null>(null);

  useEffect(() => {
    const schedule = () => {
      if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
        idleRef.current = window.requestIdleCallback(
          () => setDebounced(value),
          { timeout: delay },
        );
        return;
      }

      timeoutRef.current = window.setTimeout(() => setDebounced(value), delay);
    };

    schedule();

    return () => {
      if (idleRef.current !== null && typeof window !== "undefined" && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleRef.current);
      }
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      idleRef.current = null;
      timeoutRef.current = null;
    };
  }, [value, delay]);

  return debounced;
};
