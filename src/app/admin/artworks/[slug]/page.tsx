import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArtworkEditor } from "@/components/admin/ArtworkEditor/ArtworkEditor";
import { ARTWORKS } from "@/lib/placeholder/admin";

export function generateStaticParams() {
  return ARTWORKS.map((a) => ({ slug: a.slug }));
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
  const artwork = ARTWORKS.find((a) => a.slug === slug);
  if (!artwork) notFound();
  return <ArtworkEditor key={slug} artwork={artwork} />;
}
