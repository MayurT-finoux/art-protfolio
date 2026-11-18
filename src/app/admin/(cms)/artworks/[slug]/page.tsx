import { notFound } from "next/navigation";
import { ArtworkEditor } from "@/components/admin/ArtworkEditor/ArtworkEditor";
import { featuredOrder, getArtworks, getCategories } from "@/lib/content/queries";
import { slugParams } from "@/lib/staticParams";

// Rendered in full before it is sent, so an unknown slug answers with a real 404.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  return slugParams((await getArtworks()).map((a) => a.slug));
}

export default async function ArtworkPage({ params }: PageProps<"/admin/artworks/[slug]">) {
  const { slug } = await params;
  const [artworks, categories] = await Promise.all([getArtworks(), getCategories()]);
  const artwork = artworks.find((a) => a.slug === slug);
  if (!artwork) notFound();
  return (
    <ArtworkEditor
      key={artwork.id}
      artwork={artwork}
      categories={categories}
      featuredIds={featuredOrder(artworks).map((a) => a.id)}
    />
  );
}
