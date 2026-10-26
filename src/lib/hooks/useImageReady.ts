"use client";

import { useEffect, useState } from "react";

/** True once the image has loaded (or failed), so skeletons can be swapped for it. */
export function useImageReady(src: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    const done = () => setReady(true);
    img.onload = done;
    img.onerror = done;
    img.src = src;
    if (img.complete) done();
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return ready;
}
