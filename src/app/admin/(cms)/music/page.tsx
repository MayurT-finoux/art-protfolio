import { MusicPlaylist } from "@/components/admin/MusicPlaylist/MusicPlaylist";
import { getMusicContent } from "@/lib/content/queries";

export default async function MusicPage() {
  return <MusicPlaylist initial={await getMusicContent()} />;
}
