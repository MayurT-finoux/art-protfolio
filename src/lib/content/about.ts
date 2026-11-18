// About page data: saved content (admin "About page") + live artworks + footer links.
import { cacheLife, cacheTag } from "next/cache";
import type { AboutContent } from "@/lib/placeholder/about";
import { CONTENT_TAG, getAboutContent, getArtworks, getFooterContent } from "./queries";

export async function getAboutPageData(): Promise<AboutContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");

  const [content, artworks, footer] = await Promise.all([getAboutContent(), getArtworks(), getFooterContent()]);
  const live = artworks.filter((a) => a.status === "live" && a.images.length);

  // Medium cards: cover = newest live artwork in the category with that name, count = live pieces.
  // A "soon" medium goes live by itself once its category has a piece.
  const mediums = content.mediums.map((m) => {
    const pieces = live.filter((a) => a.category.toLowerCase() === m.name.toLowerCase());
    const cover = pieces[0]?.images[0];
    return {
      ...m,
      soon: m.soon && pieces.length === 0,
      count: pieces.length,
      image: cover?.url ?? "",
      position: cover?.focus ?? m.position,
      animated: m.name.toLowerCase() === "animation",
      href: m.href || "/gallery",
    };
  });

  // Same links as the footer ("edit once, used everywhere") where the footer has one.
  const footerUrl: Record<string, string> = { instagram: footer.instagram, behance: footer.behance, youtube: footer.youtube };
  const social = content.social.map((s) => ({ ...s, href: footerUrl[s.name.toLowerCase()] || s.href }));

  return { ...content, mediums, social };
}
