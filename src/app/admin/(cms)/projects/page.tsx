import { AdminPage } from "@/components/admin/AdminPage/AdminPage";
import { ProjectList } from "@/components/admin/ProjectList/ProjectList";

export default function ProjectsPage() {
  return (
    <AdminPage title="Projects">
      <ProjectList />
    </AdminPage>
  );
}
