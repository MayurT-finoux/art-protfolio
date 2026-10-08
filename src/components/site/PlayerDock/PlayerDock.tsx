import { MusicPlayer } from "../MusicPlayer/MusicPlayer";
import styles from "./PlayerDock.module.css";

// Floating MusicPlayer, bottom-right. Shown only on the Home hero intro:
// HeroScroll sets --hide and html[data-player="show"].
export function PlayerDock({ track }: { track: string }) {
  return (
    <div className={styles.dock}>
      <MusicPlayer track={track} compact="mobile" />
    </div>
  );
}
