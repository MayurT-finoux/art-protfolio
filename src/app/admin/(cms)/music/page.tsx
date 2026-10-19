import { AdminPage } from "@/components/admin/AdminPage/AdminPage";
import { MusicPlaylist } from "@/components/admin/MusicPlaylist/MusicPlaylist";

export default function MusicPage() {
  return (
    <AdminPage title="Music playlist">
      <MusicPlaylist />
    </AdminPage>
  );
}
