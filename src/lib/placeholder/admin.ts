// Placeholder content for the admin, copied from the v6 design
// (design/design_handoff_yurix_site/designs/Admin.dc.html).
// Replaced by database queries when the admin is wired up.

const wm = (file: string, width = 400) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`;

const FILES = {
  klimt: "Gustav_Klimt_016.jpg",
  pearl: "Girl_with_a_Pearl_Earring.jpg",
  starry: "Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
  scream: "The_Scream.jpg",
  kand: "Vassily_Kandinsky,_1913_-_Composition_7.jpg",
  wave: "Tsunami_by_hokusai_19th_century.jpg",
  venus: "Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
  monet: "Claude_Monet,_Impression,_soleil_levant.jpg",
};
export type ImageKey = keyof typeof FILES;
const KEYS = Object.keys(FILES) as ImageKey[];

/** Placeholder image URL by key, `offset` steps along the key list. */
export const img = (key: ImageKey, width = 400, offset = 0) =>
  wm(FILES[KEYS[(KEYS.indexOf(key) + offset) % KEYS.length]], width);

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const CATEGORIES = ["Traditional", "Digital", "Animation", "Handmade"] as const;
export type LinkName = "Instagram" | "Behance" | "YouTube";

export type Artwork = {
  slug: string;
  title: string;
  category: string;
  year: string;
  imageKey: ImageKey;
  position: string;
  pin: string;
  materials: string[];
  links: LinkName[];
  /** image labels; the first image is the card cover */
  views: string[];
  draft: boolean;
};

const art = (
  title: string, category: string, year: string, imageKey: ImageKey, position: string, pin: string,
  materials: string[], links: LinkName[], views: string[], draft = false,
): Artwork => ({ slug: slugify(title), title, category, year, imageKey, position, pin, materials, links, views, draft });

export const ARTWORKS: Artwork[] = [
  art("monsoon window", "Traditional", "2026", "venus", "center", "4/5", ["Watercolour", "Cold-press paper"], ["Instagram"], ["front"]),
  art("frog choir", "Digital", "2026", "kand", "left center", "1/1", ["Procreate", "iPad Pro"], ["Instagram", "Behance"], ["final"]),
  art("moth lullaby loop", "Animation", "2026", "klimt", "center", "2/3", ["Procreate Dreams", "24 frames"], ["YouTube", "Instagram"], ["loop"]),
  art("clay ghost", "Handmade", "2026", "pearl", "center 30%", "3/4", ["Air-dry clay", "Acrylic", "Varnish"], ["Instagram"], ["front", "side", "detail"]),
  art("night shift", "Digital", "2025", "starry", "right center", "4/3", ["Procreate"], [], ["final"]),
  art("static hearts", "Traditional", "2025", "scream", "center 35%", "9/14", ["Gouache", "Ink"], ["Behance"], ["before", "after"]),
  art("neon auto ride", "Animation", "2025", "starry", "center", "1/1", ["Procreate Dreams", "After Effects"], ["YouTube"], ["loop"]),
  art("sticker sheet 03", "Handmade", "2025", "kand", "center", "4/5", ["Risograph", "Vinyl", "Die-cut"], ["Instagram"], ["sheet", "close-up"]),
  art("pigeon study", "Traditional", "2025", "wave", "left center", "3/4", ["Graphite", "Charcoal"], [], ["front"]),
  art("slow static loop", "Animation", "2025", "wave", "center", "16/10", ["TVPaint", "8 fps"], ["YouTube", "Behance"], ["loop"]),
  art("chai break", "Digital", "2025", "klimt", "center bottom", "2/3", ["Procreate"], ["Instagram"], ["final"]),
  art("paper moon", "Handmade", "2024", "monet", "center", "1/1", ["Cut paper", "Glue", "Thread"], [], ["front", "angle"], true),
  art("bus stop", "Traditional", "2024", "pearl", "center top", "4/5", ["Oil on canvas"], ["Behance"], ["front"]),
  art("tiny gods", "Animation", "2024", "monet", "center", "3/4", ["TVPaint"], ["YouTube"], ["loop"]),
  art("rooftop", "Digital", "2024", "venus", "right center", "5/4", ["Procreate", "Photoshop"], [], ["final"]),
  art("embroidered cat", "Handmade", "2024", "scream", "center", "1/1", ["Embroidery floss", "Linen"], ["Instagram"], ["before", "after"]),
];

/** Placeholder description per category. */
export const DESCRIPTIONS: Record<string, string> = {
  Traditional: "Painted at the window during the first week of rain. The paper buckled; I kept it.",
  Digital: "Drawn on the iPad on a slow Sunday. Started as a doodle in a meeting.",
  Animation: "A short loop made frame by frame. Plays muted on the card, full version on YouTube.",
  Handmade: "A small object made by hand. Shown from a few sides so you can see the bumps.",
};

/** Featured artworks (indexes into ARTWORKS), in Home order. Max 8. */
export const FEATURED = [0, 2, 1, 3, 6, 5, 9];
export const MAX_FEATURED = 8;

export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  client: string;
  role: string;
  tools: string;
  imageKey: ImageKey;
  teaser: string;
  youtubeId: string;
  behance: boolean;
  draft: boolean;
};

const proj = (
  title: string, kind: string, year: string, client: string, role: string, tools: string, imageKey: ImageKey,
  teaser: string, youtubeId: string, behance: boolean, draft = false,
): Project => ({ slug: slugify(title), title, kind, year, client, role, tools, imageKey, teaser, youtubeId, behance, draft });

export const PROJECTS: Project[] = [
  proj("moth lullaby", "music video", "2026", "Lalit & The Lamps", "Direction, animation", "Procreate Dreams, After Effects", "klimt", "A three-minute lullaby for a band that only plays after midnight.", "aqz-KE-bpKQ", true),
  proj("ghost roommate", "short series", "2026", "Personal", "Writing, animation", "Procreate Dreams", "pearl", "Six tiny episodes about sharing a flat with someone who isn't there.", "", true),
  proj("neon auto ride", "loop", "2026", "Mumbai Film Fest", "Animation", "Procreate Dreams", "starry", "A night ride through Bandra, drawn on the back of a rickshaw ticket.", "aqz-KE-bpKQ", false),
  proj("static hearts", "album cover", "2025", "Static Hearts", "Illustration, lettering", "Procreate, gouache", "scream", "Cover, vinyl label and a sticker sheet nobody asked for.", "", true),
  proj("sticker sheet 03", "merch", "2025", "Personal", "Illustration", "Procreate, risograph", "kand", "Forty stickers, two inks, one very tired risograph machine.", "", false),
  proj("slow static", "music video", "2025", "Kavya", "Direction, animation", "Procreate Dreams, TVPaint", "wave", "Hand-drawn waves at 8 frames a second, on purpose.", "aqz-KE-bpKQ", true),
  proj("monsoon diary", "editorial", "2025", "The Bombay Review", "Illustration", "Watercolour, Procreate", "venus", "A month of rain drawn as a daily diary for a weekly column.", "", false),
  proj("tiny gods", "short film", "2024", "Festival short", "Writing, direction, animation", "TVPaint, After Effects", "monet", "Seven minutes about the gods who live in kitchen shelves.", "aqz-KE-bpKQ", false, true),
];
export const MAX_PROJECTS = 12;

export type NavRow = { id: string; label: string; href: string; visible: boolean };
export const NAV: NavRow[] = [
  { id: "work", label: "work", href: "/work", visible: true },
  { id: "gallery", label: "gallery", href: "/gallery", visible: true },
  { id: "shop", label: "shop", href: "/shop", visible: true },
  { id: "about", label: "about", href: "/about", visible: true },
  { id: "contact", label: "contact", href: "/contact", visible: true },
];

export type Track = { name: string; file: string; duration: string };
export const TRACKS: Track[] = [
  { name: "lullaby for a cat (loop)", file: "lullaby-cat.mp3", duration: "1:42" },
  { name: "rooftop hum", file: "rooftop-hum.mp3", duration: "2:10" },
  { name: "monsoon tape 02", file: "monsoon-02.mp3", duration: "3:05" },
];

export const CATEGORY_ROWS = [...CATEGORIES, "Comics", "Graffiti"];

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

export const FOOTER_FIELDS = [
  { key: "wordmark", label: "wordmark", value: "yurix" },
  { key: "sayHi", label: "say hi label", value: "say hi" },
  { key: "location", label: "location", value: "Mumbai, IN" },
  { key: "email", label: "email", value: "hey@yurix.art" },
  { key: "copyright", label: "copyright", value: "© 2026 Yurix. Drawn by hand." },
];
export const FOOTER_PAGES = ["Home", "Work", "Gallery", "Shop", "About", "Contact"];
export const SOCIALS = [
  { name: "Instagram", url: "instagram.com/yurix.draws" },
  { name: "Behance", url: "behance.net/yurix" },
  { name: "YouTube", url: "youtube.com/@yurix" },
];

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

export const INSTAGRAM_POSTS: ImageKey[] = ["wave", "monet", "kand"];
