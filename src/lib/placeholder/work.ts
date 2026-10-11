// Placeholder projects for the Work page and project pages, copied from the v6 design
// (design/design_handoff_yurix_site/designs/WorkPage.dc.html).
// Shaped like the handoff data model's `Project` so it can move to the database later.

import { img, slugify, type ImageKey } from "@/lib/placeholder/admin";

export type ProjectImage = {
  url: string;
  /** CSS background-position */
  position: string;
};

export type ProcessStep = ProjectImage & {
  label: string;
  /** CSS filter used on the placeholder images (sketchy early steps) */
  filter: string;
};

export type FinalPiece = ProjectImage & {
  /** columns spanned on desktop (the first piece is wide) */
  span: 1 | 2;
  /** CSS aspect-ratio on desktop */
  ratio: string;
};

export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  client: string;
  role: string;
  tools: string;
  teaser: string;
  /** large cover (project page) */
  cover: ProjectImage;
  /** smaller cover (Work list card) */
  thumb: ProjectImage;
  story: string[];
  process: ProcessStep[];
  finals: FinalPiece[];
  youtubeId?: string;
  behanceUrl?: string;
  order: number;
  status: "draft" | "live";
};

// Story copy is the same placeholder for every project in the design.
const STORY = [
  "It started as a voice note and a single sketch on a train. The brief was loose: make something that feels like the song sounds at 2am. So I drew the first frame before writing anything down.",
  "Everything is hand-drawn, frame by frame. I kept the boil in the lines on purpose so it never sits still, and painted the backgrounds flat so the characters do the moving.",
];
const POS = ["center", "center 30%", "left center", "right center"];
const STEPS = ["thumbnails", "animatic", "line", "colour"];
const FILTERS = ["grayscale(1) contrast(1.15)", "grayscale(1) contrast(1.15)", "grayscale(0.6)", "none"];

// No real Behance profile yet; the design links to "#".
const BEHANCE_PLACEHOLDER = "#";

const project = (
  order: number, title: string, kind: string, year: string, client: string, role: string, tools: string,
  key: ImageKey, teaser: string, youtubeId: string, behance: boolean,
): Project => ({
  slug: slugify(title),
  title, kind, year, client, role, tools, teaser,
  cover: { url: img(key, 1800), position: "center" },
  thumb: { url: img(key, 1200), position: "center" },
  story: STORY,
  process: STEPS.map((label, j) => ({
    label,
    url: img(key, 700, j < 3 ? 0 : j),
    position: POS[j],
    filter: FILTERS[j],
  })),
  finals: [
    { url: img(key, 1600), position: "center", span: 2, ratio: "16/9" },
    { url: img(key, 900, 1), position: "center", span: 1, ratio: "4/5" },
    { url: img(key, 900, 2), position: "center", span: 1, ratio: "4/5" },
  ],
  youtubeId: youtubeId || undefined,
  behanceUrl: behance ? BEHANCE_PLACEHOLDER : undefined,
  order,
  status: "live",
});

export const workPage = {
  label: "selected projects",
  heading: "work",
  intro: "The long ones. Music videos, short films and series, each with the messy middle left in.",
};

export const projectPage = {
  back: "← all work",
  storyLabel: "the story",
  processHeading: "process",
  processHint: "thumbnail → final",
  videoHeading: "watch it move",
  videoHint: "on youtube",
  finalsHeading: "final pieces",
  behanceHeading: "the full case study lives on behance",
  behanceText: "Every frame, colour script and the bits that didn't make it.",
  behanceButton: "view on behance ↗",
  next: "next project",
};

export const PROJECTS: Project[] = [
  project(0, "moth lullaby", "music video", "2026", "Lalit & The Lamps", "Direction, animation", "Procreate Dreams, After Effects", "klimt", "A three-minute lullaby for a band that only plays after midnight.", "aqz-KE-bpKQ", true),
  project(1, "ghost roommate", "short series", "2026", "Personal", "Writing, animation", "Procreate Dreams", "pearl", "Six tiny episodes about sharing a flat with someone who isn't there.", "", true),
  project(2, "neon auto ride", "loop", "2026", "Mumbai Film Fest", "Animation", "Procreate Dreams", "starry", "A night ride through Bandra, drawn on the back of a rickshaw ticket.", "aqz-KE-bpKQ", false),
  project(3, "static hearts", "album cover", "2025", "Static Hearts", "Illustration, lettering", "Procreate, gouache", "scream", "Cover, vinyl label and a sticker sheet nobody asked for.", "", true),
  project(4, "sticker sheet 03", "merch", "2025", "Personal", "Illustration", "Procreate, risograph", "kand", "Forty stickers, two inks, one very tired risograph machine.", "", false),
  project(5, "slow static", "music video", "2025", "Kavya", "Direction, animation", "Procreate Dreams, TVPaint", "wave", "Hand-drawn waves at 8 frames a second, on purpose.", "aqz-KE-bpKQ", true),
  project(6, "monsoon diary", "editorial", "2025", "The Bombay Review", "Illustration", "Watercolour, Procreate", "venus", "A month of rain drawn as a daily diary for a weekly column.", "", false),
  project(7, "tiny gods", "short film", "2024", "Festival short", "Writing, direction, animation", "TVPaint, After Effects", "monet", "Seven minutes about the gods who live in kitchen shelves.", "aqz-KE-bpKQ", true),
];

/** Live projects in CMS order. */
export const liveProjects = () =>
  PROJECTS.filter((p) => p.status === "live").sort((a, b) => a.order - b.order);
