"use client";

import { useEffect, useState } from "react";

/**
 * True once the image has loaded (or failed), so skeletons can be swapped for it.
 * An empty src is ready right away: the frame shows its plain fill.
 */
export function useImageReady(src: string) {
  const [loaded, setLoaded] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    const done = () => setLoaded(src);
    img.onload = img.onerror = done;
    img.src = src;
    if (img.complete) done();
    return () => {
      img.onload = img.onerror = null;
    };
  }, [src]);

  return !src || loaded === src;
}
