const DAY = 24 * 60 * 60 * 1000;

/** "today", "2 days ago", "1 week ago", … */
export function timeAgo(iso: string, now: number) {
  const days = Math.max(0, Math.floor((now - Date.parse(iso)) / DAY));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return months <= 1 ? "1 month ago" : `${months} months ago`;
}
