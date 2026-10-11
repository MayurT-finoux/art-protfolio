// Home page data, assembled from the database (cached; refreshed on admin save).
import { cacheLife, cacheTag } from "next/cache";
import { aboutSection, freshWork, type FreshItem, type SelectedArtwork } from "@/lib/placeholder/home";
import { CONTENT_TAG, featuredArtworks, getArtworks, getHomeContent } from "./queries";
import { coverRatio } from "./types";

const DAY = 24 * 60 * 60 * 1000;

/** "2 days ago", "1 week ago" — refreshed at least hourly with the cache. */
function ago(iso: string, now: number) {
  const days = Math.max(0, Math.floor((now - Date.parse(iso)) / DAY));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return months <= 1 ? "1 month ago" : `${months} months ago`;
}

export async function getHomePageData() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");

  const [content, artworks] = await Promise.all([getHomeContent(), getArtworks()]);
  const now = Date.now();

  const selected: SelectedArtwork[] = featuredArtworks(artworks).map((a) => ({
    title: a.title,
    kind: a.category.toLowerCase(),
    year: a.year,
    image: a.images[0].url,
    position: a.images[0].focus,
    pin: coverRatio(a),
    animated: a.category === "Animation",
  }));

  // Fresh: 3 newest live artworks, interleaved with the 3 newest Instagram posts
  // (Instagram is placeholder until the API is connected).
  const newest = artworks.filter((a) => a.status === "live" && a.images.length).slice(0, 3);
  const instagram = freshWork.items.filter((i) => i.instagram);
  const fresh: FreshItem[] = [];
  newest.forEach((a, i) => {
    fresh.push({
      title: a.title,
      when: ago(a.createdAt, now),
      image: a.images[0].url,
      position: a.images[0].focus,
      isNew: i === 0,
    });
    if (instagram[i]) fresh.push(instagram[i]);
  });

  return { content, selected, fresh, aboutButtons: aboutSection.buttons };
}
