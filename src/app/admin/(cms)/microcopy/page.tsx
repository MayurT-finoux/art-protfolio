import { MicrocopyEditor } from "@/components/admin/MicrocopyEditor/MicrocopyEditor";
import { getMicrocopy } from "@/lib/content/queries";

export default async function MicrocopyPage() {
  return <MicrocopyEditor initial={await getMicrocopy()} />;
}
