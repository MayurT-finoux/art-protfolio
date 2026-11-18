import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/admin/ProjectEditor/ProjectEditor";
import { getProjects } from "@/lib/content/queries";
import { slugParams } from "@/lib/staticParams";

// Rendered in full before it is sent, so an unknown slug answers with a real 404.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  return slugParams((await getProjects()).map((p) => p.slug));
}

export default async function ProjectPage({ params }: PageProps<"/admin/projects/[slug]">) {
  const { slug } = await params;
  const project = (await getProjects()).find((p) => p.slug === slug);
  if (!project) notFound();
  return <ProjectEditor key={project.id} project={project} />;
}
