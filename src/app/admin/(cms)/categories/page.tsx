import { AdminPage } from "@/components/admin/AdminPage/AdminPage";
import { CategoryManager } from "@/components/admin/CategoryManager/CategoryManager";
import { getArtworks } from "@/lib/content/queries";

export default async function CategoriesPage() {
  // Pieces per category from the database; the Gallery shows a category only with live pieces.
  const counts: Record<string, { all: number; live: number }> = {};
  for (const a of await getArtworks()) {
    const c = (counts[a.category] ??= { all: 0, live: 0 });
    c.all++;
    if (a.status === "live") c.live++;
  }
  return (
    <AdminPage title="Categories">
      <CategoryManager counts={counts} />
    </AdminPage>
  );
}
