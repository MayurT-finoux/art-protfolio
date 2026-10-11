import { WorkList } from "@/components/work/WorkList/WorkList";
import { liveProjects, workPage } from "@/lib/placeholder/work";

export default function WorkPage() {
  return (
    <WorkList
      label={workPage.label}
      heading={workPage.heading}
      intro={workPage.intro}
      projects={liveProjects()}
    />
  );
}
