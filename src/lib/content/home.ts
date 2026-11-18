// Home page data, assembled from the database (cached; refreshed on admin save).
import { cacheLife, cacheTag } from "next/cache";
import { aboutSection, freshWork, infoCards, type FreshItem, type InfoCard, type SelectedArtwork } from "@/lib/placeholder/home";
import { CONTENT_TAG, featuredArtworks, getArtworks, getHomeContent } from "./queries";
import { timeAgo } from "@/lib/timeAgo";
import { coverRatio } from "./types";

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
      when: timeAgo(a.createdAt, now),
      image: a.images[0].url,
      position: a.images[0].focus,
      isNew: i === 0,
    });
    if (instagram[i]) fresh.push(instagram[i]);
  });

  // Saved links + text; the (unused) cursor labels stay from the design.
  const aboutButtons = content.aboutButtons.map((b, i) => ({ ...b, cursor: aboutSection.buttons[i]?.cursor ?? "" }));
  const cards: InfoCard[] = content.infoCards.map((c, i) => ({ ...c, cursor: infoCards[i]?.cursor ?? "" }));

  return { content, selected, fresh, aboutButtons, infoCards: cards };
}
