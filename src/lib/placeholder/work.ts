// Work page + project page shapes and copy, from the v6 design
// (design/design_handoff_yurix_site/designs/WorkPage.dc.html).
// Projects themselves come from the database (src/lib/content/work.ts).

export type ProjectImage = {
  url: string;
  /** CSS background-position */
  position: string;
};

export type ProcessStep = ProjectImage & {
  label: string;
  /** CSS filter on the image ("none" for real images) */
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
  /** cover is an MP4 loop instead of an image */
  coverIsVideo?: boolean;
  youtubeId?: string;
  behanceUrl?: string;
  /** Behance block text (falls back to the page copy) */
  behanceText?: string;
  seoTitle?: string;
  seoDescription?: string;
  order: number;
  status: "draft" | "live";
};

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

