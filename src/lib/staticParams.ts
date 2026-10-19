/**
 * Next 16 + Cache Components: generateStaticParams must return at least one
 * entry. When a list is empty, return a placeholder slug that renders not-found.
 */
export const slugParams = (slugs: string[]) =>
  (slugs.length ? slugs : ["__none__"]).map((slug) => ({ slug }));
