import { NavEditor } from "@/components/admin/NavEditor/NavEditor";
import { getNavContent } from "@/lib/content/queries";

export default async function NavigationPage() {
  return <NavEditor initial={await getNavContent()} />;
}
