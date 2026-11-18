import { WorkList } from "@/components/work/WorkList/WorkList";
import { liveProjects } from "@/lib/content/work";
import { workPage } from "@/lib/placeholder/work";

export default async function WorkPage() {
  return (
    <WorkList
      label={workPage.label}
      heading={workPage.heading}
      intro={workPage.intro}
      projects={await liveProjects()}
    />
  );
}
