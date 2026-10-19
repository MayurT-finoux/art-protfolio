import { AdminPage } from "@/components/admin/AdminPage/AdminPage";
import { MicrocopyEditor } from "@/components/admin/MicrocopyEditor/MicrocopyEditor";

export default function MicrocopyPage() {
  return (
    <AdminPage title="Microcopy">
      <MicrocopyEditor />
    </AdminPage>
  );
}
