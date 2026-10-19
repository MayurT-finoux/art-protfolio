/** CSS background-image for a URL; nothing when there's no image (the frame shows its fill color). */
export const bgImage = (url?: string | null) => (url ? `url("${url}")` : undefined);
