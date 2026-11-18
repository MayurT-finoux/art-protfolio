import { ProjectList } from "@/components/admin/ProjectList/ProjectList";
import { getProjects } from "@/lib/content/queries";

export default async function ProjectsPage() {
  const projects = await getProjects();
  // key: a fresh list after saves elsewhere (new project, order).
  return <ProjectList key={projects.map((p) => `${p.id}:${p.position}`).join()} projects={projects} />;
}
