// Placeholder projects for the Work page and project pages, copied from the v6 design
// (design/design_handoff_yurix_site/designs/WorkPage.dc.html).
// Shaped like the handoff data model's `Project` so it can move to the database later.

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

// Sample projects removed at Yurix's request (2026-10-19).
export const PROJECTS: Project[] = [];

/** Live projects in CMS order. */
export const liveProjects = () =>
  PROJECTS.filter((p) => p.status === "live").sort((a, b) => a.order - b.order);
