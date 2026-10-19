import { AdminPage } from "@/components/admin/AdminPage/AdminPage";
import { NavEditor } from "@/components/admin/NavEditor/NavEditor";

export default function NavigationPage() {
  return (
    <AdminPage title="Navigation">
      <NavEditor />
    </AdminPage>
  );
}
