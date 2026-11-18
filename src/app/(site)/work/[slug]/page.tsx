import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectPage } from "@/components/work/ProjectPage/ProjectPage";
import { liveProjects } from "@/lib/content/work";
import { projectPage } from "@/lib/placeholder/work";
import { slugParams } from "@/lib/staticParams";

export async function generateStaticParams() {
  return slugParams((await liveProjects()).map((p) => p.slug));
}

// The slug is read inside <Suspense> (Next 16 Cache Components).
export default function WorkProjectPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense>
      <Project params={params} />
    </Suspense>
  );
}

async function Project({ params }: { params: PageProps<"/work/[slug]">["params"] }) {
  const { slug } = await params;
  const projects = await liveProjects();
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const next = projects[(i + 1) % projects.length];
  const project = projects[i];
  const copy = { ...projectPage, behanceText: project.behanceText ?? projectPage.behanceText };
  return <ProjectPage key={slug} project={project} n={i + 1} next={next} copy={copy} />;
}
