// Small admin helpers + fixed lists from the v6 design
// (design/design_handoff_yurix_site/designs/Admin.dc.html).

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const ADMIN_USER = { name: "Yurix", email: "hey@yurix.art", initial: "y" };

export const FOOTER_PAGES = ["Home", "Work", "Gallery", "Shop", "About", "Contact"];
