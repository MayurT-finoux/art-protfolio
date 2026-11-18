import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/work/ProjectPage/ProjectPage";
import { liveProjects } from "@/lib/content/work";
import { projectPage } from "@/lib/placeholder/work";
import { slugParams } from "@/lib/staticParams";

// The whole page is rendered before it is sent (all data is cached), so an
// unknown slug answers with a real 404 instead of a streamed not-found page.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  return slugParams((await liveProjects()).map((p) => p.slug));
}

export default async function WorkProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const projects = await liveProjects();
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const project = projects[i];
  const next = projects[(i + 1) % projects.length];
  const copy = { ...projectPage, behanceText: project.behanceText ?? projectPage.behanceText };
  return <ProjectPage key={slug} project={project} n={i + 1} next={next} copy={copy} />;
}
