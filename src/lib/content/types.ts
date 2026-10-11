// Content shapes shared by the site, the admin and the database layer.
// Relative .ts imports: also used by scripts/db-seed.mts (plain Node).
import { aboutSection, freshWork, hero, selectedWork } from "../placeholder/home.ts";

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
