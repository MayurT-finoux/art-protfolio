import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectEditor } from "@/components/admin/ProjectEditor/ProjectEditor";
import { PROJECTS } from "@/lib/placeholder/admin";
import { slugParams } from "@/lib/staticParams";

export function generateStaticParams() {
  return slugParams(PROJECTS.map((p) => p.slug));
}

// The slug is read inside <Suspense> so navigation into the editor stays instant.
export default function ProjectPage({ params }: PageProps<"/admin/projects/[slug]">) {
  return (
    <Suspense>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: PageProps<"/admin/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();
  return <ProjectEditor key={slug} project={project} />;
}
