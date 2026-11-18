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

export const ADMIN_USER = { name: "Yurix", email: "hey@yurix.art", initial: "y" };

export const FOOTER_PAGES = ["Home", "Work", "Gallery", "Shop", "About", "Contact"];
/** Instagram post image URLs (until the Instagram connection is built). */
export const INSTAGRAM_POSTS: string[] = [];
