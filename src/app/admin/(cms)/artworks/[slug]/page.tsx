import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArtworkEditor } from "@/components/admin/ArtworkEditor/ArtworkEditor";
import { featuredOrder, getArtworks, getCategories } from "@/lib/content/queries";
import { slugParams } from "@/lib/staticParams";

export async function generateStaticParams() {
  return slugParams((await getArtworks()).map((a) => a.slug));
}

// The slug is read inside <Suspense> so navigation into the editor stays instant.
export default function ArtworkPage({ params }: PageProps<"/admin/artworks/[slug]">) {
  return (
    <Suspense>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: PageProps<"/admin/artworks/[slug]">["params"] }) {
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
