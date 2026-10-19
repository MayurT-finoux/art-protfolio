import { FooterEditor } from "@/components/admin/FooterEditor/FooterEditor";
import { getFooterContent } from "@/lib/content/queries";

export default async function FooterPage() {
  return <FooterEditor initial={await getFooterContent()} />;
}
