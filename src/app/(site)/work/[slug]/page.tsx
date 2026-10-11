import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectPage } from "@/components/work/ProjectPage/ProjectPage";
import { liveProjects, projectPage } from "@/lib/placeholder/work";

export function generateStaticParams() {
  return liveProjects().map((p) => ({ slug: p.slug }));
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
  const projects = liveProjects();
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const next = projects[(i + 1) % projects.length];
  return <ProjectPage key={slug} project={projects[i]} n={i + 1} next={next} copy={projectPage} />;
}
