// Placeholder content for the admin, copied from the v6 design
// (design/design_handoff_yurix_site/designs/Admin.dc.html).
// Replaced by database queries when the admin is wired up.

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  client: string;
  role: string;
  tools: string;
  /** cover image URL */
  image: string;
  teaser: string;
  youtubeId: string;
  behance: boolean;
  draft: boolean;
};

export const PROJECTS: Project[] = [];
export const MAX_PROJECTS = 12;

export type NavRow = { id: string; label: string; href: string; visible: boolean };
export const NAV: NavRow[] = [
  { id: "work", label: "work", href: "/work", visible: true },
  { id: "gallery", label: "gallery", href: "/gallery", visible: true },
  { id: "shop", label: "shop", href: "/shop", visible: true },
  { id: "about", label: "about", href: "/about", visible: true },
  { id: "contact", label: "contact", href: "/contact", visible: true },
];

export type Track = { name: string; file: string; duration: string; /** uploaded file (R2) */ url?: string };
export const TRACKS: Track[] = [
  { name: "lullaby for a cat (loop)", file: "lullaby-cat.mp3", duration: "1:42" },
  { name: "rooftop hum", file: "rooftop-hum.mp3", duration: "2:10" },
  { name: "monsoon tape 02", file: "monsoon-02.mp3", duration: "3:05" },
];

export const CATEGORY_ROWS = ["Traditional", "Digital", "Animation", "Handmade", "Comics", "Graffiti"];

export type ListItem = { a: string; b: string; soon?: boolean };
export type AboutListKey = "mediums" | "process" | "tools" | "skills" | "timeline" | "clients" | "facts" | "social";

export const ABOUT_LISTS: Record<AboutListKey, ListItem[]> = {
  mediums: [
    { a: "Illustration", b: "Characters, covers and editorial." },
    { a: "Animation", b: "Frame by frame in Procreate Dreams." },
    { a: "Painting", b: "Watercolour, gouache, the odd oil." },
    { a: "Custom objects", b: "Skateboards, headphones, metro cards, clay." },
    { a: "Graffiti", b: "walls are on the list.", soon: true },
    { a: "Comics", b: "panels are being inked.", soon: true },
  ],
  process: [
    { a: "sketch", b: "Loose, fast, lots of bad ones." },
    { a: "line art", b: "Clean lines, still a little wonky." },
    { a: "colour", b: "Flat colours, then light, then mood." },
    { a: "animation", b: "Frame by frame until it breathes." },
  ],
  tools: [
    { a: "Procreate", b: "sketching & illustration" },
    { a: "Procreate Dreams", b: "frame-by-frame animation" },
    { a: "Watercolour & gouache", b: "paintings on paper" },
  ],
  skills: [
    { a: "character design", b: "" },
    { a: "frame-by-frame animation", b: "" },
    { a: "illustration", b: "" },
    { a: "customising objects", b: "" },
    { a: "video editing", b: "" },
  ],
  timeline: [
    { a: "2016", b: "first sketchbook, filled" },
    { a: "2019", b: "the flipbook" },
    { a: "2023", b: "first paid commission" },
    { a: "2024", b: "tiny gods" },
    { a: "2025", b: "monsoon diary" },
    { a: "2026", b: "moth lullaby" },
  ],
  clients: [
    { a: "Lalit & The Lamps", b: "music video" },
    { a: "Mumbai Film Fest", b: "loop" },
    { a: "Static Hearts", b: "album cover" },
    { a: "Kavya", b: "music video" },
    { a: "The Bombay Review", b: "editorial" },
  ],
  facts: [
    { a: "snack while drawing", b: "masala peanuts. too many." },
    { a: "I animate to", b: "lo-fi, old Bollywood, rain sounds" },
    { a: "on my desk", b: "one cat, nine brushes, zero clean mugs" },
    { a: "inspired by", b: "Ghibli skies, rickshaw art, Mumbai in monsoon" },
  ],
  social: [
    { a: "Instagram", b: "@yurix.draws" },
    { a: "Behance", b: "behance.net/yurix" },
    { a: "YouTube", b: "@yurix" },
    { a: "Patreon", b: "patreon.com/yurix" },
  ],
};

export const ADMIN_USER = { name: "Yurix", email: "hey@yurix.art", initial: "y" };

export const FOOTER_PAGES = ["Home", "Work", "Gallery", "Shop", "About", "Contact"];
export const MICROCOPY = [
  {
    name: "Little lines",
    fields: [
      { key: "scrollHint", label: "scroll hint", where: "Home hero, under the intro", value: "scroll · it gets dreamy" },
      { key: "scrollHintMobile", label: "scroll hint · mobile", where: "Home hero on phones", value: "scroll" },
      { key: "emptyCategory", label: "empty category", where: "Gallery, when a filter has nothing", value: "nothing here yet. soon." },
    ],
  },
  {
    name: "Cursor labels",
    fields: [
      { key: "cursorPlay", label: "play", where: "over animation cards and videos", value: "play" },
      { key: "cursorView", label: "view", where: "over artwork cards", value: "view" },
      { key: "cursorOpen", label: "open", where: "over project cards", value: "open" },
    ],
  },
];

/** Instagram post image URLs (until the Instagram connection is built). */
export const INSTAGRAM_POSTS: string[] = [];
