import { AboutEditor } from "@/components/admin/AboutEditor/AboutEditor";
import { getAboutContent } from "@/lib/content/queries";

export default async function AboutEditorPage() {
  return <AboutEditor initial={await getAboutContent()} />;
}
