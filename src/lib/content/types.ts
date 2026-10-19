// Content shapes shared by the site, the admin and the database layer.
// Relative .ts imports: also used by scripts/db-seed.mts (plain Node).
import { aboutSection, freshWork, hero, selectedWork, site, social } from "../placeholder/home.ts";

/** Home page content, stored as site_content["home"]. */
export type HomeContent = {
  heroVideo: string | null;
  heroStill: string;
  heroLabel: string;
  heroHeading: string;
  heroIntro: string;
  selectedLabel: string;
  selectedHeading: string;
  selectedButton: string;
  freshLabel: string;
  freshHeading: string;
  followButton: string;
  aboutVideo: string | null;
  aboutStill: string;
  aboutWindowLabel: string;
  aboutLabel: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
};

export const DEFAULT_HOME: HomeContent = {
  heroVideo: hero.video,
  heroStill: hero.still,
  heroLabel: hero.label,
  heroHeading: hero.heading,
  heroIntro: hero.intro,
  selectedLabel: selectedWork.label,
  selectedHeading: selectedWork.heading,
  selectedButton: selectedWork.button.label,
  freshLabel: freshWork.label,
  freshHeading: freshWork.heading,
  followButton: freshWork.followButton,
  aboutVideo: aboutSection.video,
  aboutStill: aboutSection.still,
  aboutWindowLabel: aboutSection.windowLabel,
  aboutLabel: aboutSection.label,
  aboutParagraph1: aboutSection.paragraphs[0],
  aboutParagraph2: aboutSection.paragraphs[1],
};

export type ArtworkImageData = { url: string; label: string; width: number; height: number; focus: string };

export type ArtworkStatus = "draft" | "live";

/** One artwork as the admin and site use it. */
export type ArtworkData = {
  id: number;
  slug: string;
  title: string;
  year: string;
  category: string;
  description: string;
  materials: string[];
  links: { instagram?: string; behance?: string; youtube?: string };
  previewUrl: string | null;
  featured: boolean;
  featuredOrder: number | null;
  status: ArtworkStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  images: ArtworkImageData[];
};

export const MAX_FEATURED = 8;
export const DEFAULT_CATEGORIES = ["Traditional", "Digital", "Animation", "Handmade", "Comics", "Graffiti"];

/** Card aspect ratio from the cover image, e.g. "4/5". */
export const coverRatio = (a: Pick<ArtworkData, "images">) =>
  a.images[0] ? `${a.images[0].width}/${a.images[0].height}` : "4/5";

/** Footer + social links (admin "Footer & social"), stored as site_content["footer"]. */
export type FooterContent = {
  wordmark: string;
  sayHiLabel: string;
  location: string;
  email: string;
  copyright: string;
  /** Full URLs; empty = not shown on the site. */
  instagram: string;
  behance: string;
  youtube: string;
};

const realUrl = (href: string) => (href.startsWith("http") ? href : "");

export const DEFAULT_FOOTER: FooterContent = {
  wordmark: site.wordmark,
  sayHiLabel: site.sayHiLabel,
  location: site.location,
  email: site.email,
  copyright: site.copyright,
  instagram: realUrl(social.find((s) => s.label === "Instagram")?.href ?? ""),
  behance: realUrl(social.find((s) => s.label === "Behance")?.href ?? ""),
  youtube: realUrl(social.find((s) => s.label === "YouTube")?.href ?? ""),
};

/** Footer social links that are set, in the footer's order. */
export const footerSocial = (f: FooterContent) =>
  [
    { label: "Instagram", href: f.instagram },
    { label: "Behance", href: f.behance },
    { label: "YouTube", href: f.youtube },
  ].filter((l) => l.href);

/** "@yurix.draws" from an Instagram profile URL. */
export const instagramHandle = (url: string) => {
  const handle = url.match(/instagram\.com\/([^/?#]+)/i)?.[1];
  return handle ? `@${handle}` : "";
};
