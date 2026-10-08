import { AdminPage } from "@/components/admin/AdminPage/AdminPage";
import { HomeEditor } from "@/components/admin/HomeEditor/HomeEditor";

export default function HomeEditorPage() {
  return (
    <AdminPage title="Home page">
      <HomeEditor />
    </AdminPage>
  );
}
