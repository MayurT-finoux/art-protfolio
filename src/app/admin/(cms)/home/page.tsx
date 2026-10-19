import { HomeEditor } from "@/components/admin/HomeEditor/HomeEditor";
import { featuredOrder, getArtworks, getHomeContent } from "@/lib/content/queries";

export default async function HomeEditorPage() {
  const [content, artworks] = await Promise.all([getHomeContent(), getArtworks()]);
  return <HomeEditor initial={content} featuredCount={featuredOrder(artworks).length} />;
}
