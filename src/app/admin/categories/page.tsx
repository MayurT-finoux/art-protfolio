import { AdminPage } from "@/components/admin/AdminPage/AdminPage";
import { CategoryManager } from "@/components/admin/CategoryManager/CategoryManager";

export default function CategoriesPage() {
  return (
    <AdminPage title="Categories">
      <CategoryManager />
    </AdminPage>
  );
}
