// Content shapes shared by the site, the admin and the database layer.
// Relative .ts imports: also used by scripts/db-seed.mts (plain Node).
import { aboutSection, freshWork, hero, infoCards, music, nav, selectedWork, site, social } from "../placeholder/home.ts";

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
  /** "more about me →" + "say hi" buttons under the About section. */
  aboutButtons: HomeLink[];
  /** Shop · About · Contact cards. */
  infoCards: HomeInfoCard[];
};

export type HomeLink = { label: string; href: string };
export type HomeInfoCard = { label: string; title: string; text: string; href: string };

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
  aboutButtons: aboutSection.buttons.map(({ label, href }) => ({ label, href })),
  infoCards: infoCards.map(({ label, title, text, href }) => ({ label, title, text, href })),
};

export type ArtworkImageData = { url: string; label: string; width: number; height: number; focus: string };

type ArtworkStatus = "draft" | "live";

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

/** One MainNav / mobile menu link. Hidden links stay in the footer. */
export type NavRow = { id: string; label: string; href: string; visible: boolean };

/** Admin "Navigation", stored as site_content["nav"]. */
export type NavContent = { items: NavRow[]; menuWordmark: string };

export const DEFAULT_NAV: NavContent = {
  items: nav.map((n) => ({ id: n.label, label: n.label, href: n.href, visible: true })),
  menuWordmark: site.wordmark,
};

/** Visible nav links, as the site uses them. */
export const navLinks = (n: NavContent) => n.items.filter((i) => i.visible).map(({ label, href }) => ({ label, href }));

/** One playlist track (uploaded to R2). */
export type Track = { name: string; file: string; duration: string; url: string };

/** Admin "Music", stored as site_content["music"]. */
export type MusicContent = { on: boolean; tracks: Track[] };

export const DEFAULT_MUSIC: MusicContent = { on: true, tracks: [] };

/** Track name the MusicPlayer shows, or null when the player is switched off. */
export const playerTrack = (m: MusicContent) => (m.on ? (m.tracks[0]?.name ?? music.track) : null);

/** Admin "Microcopy" (little lines across the site), stored as site_content["microcopy"]. */
export type MicrocopyContent = {
  scrollHint: string;
  scrollHintMobile: string;
  emptyCategory: string;
};

export const DEFAULT_MICROCOPY: MicrocopyContent = {
  scrollHint: hero.scrollHint,
  scrollHintMobile: hero.scrollHintMobile,
  emptyCategory: "nothing here yet. soon.",
};

/** One Work project as the admin uses it (projects table). */
export type ProjectData = {
  id: number;
  slug: string;
  title: string;
  kind: string;
  year: string;
  client: string;
  role: string;
  tools: string;
  teaser: string;
  coverUrl: string;
  coverIsVideo: boolean;
  story: string[];
  process: { label: string; url: string }[];
  finals: string[];
  youtubeId: string | null;
  behanceUrl: string | null;
  behanceText: string;
  position: number;
  status: "draft" | "live";
  seoTitle: string | null;
  seoDescription: string | null;
};

/** Work shows 6–12 projects. */
export const MAX_PROJECTS = 12;
