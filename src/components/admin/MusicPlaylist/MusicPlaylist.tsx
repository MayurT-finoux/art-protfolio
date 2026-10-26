"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { arrayMove, SortableList } from "../ui/Sortable";
import { AddRow, DragHandle, ReorderButtons, Toggle } from "../ui/AdminUI";
import { FilePicker, progressLabel } from "../ui/FilePicker";
import styles from "./MusicPlaylist.module.css";

/** "1:42" from an audio file's metadata. */
function readDuration(file: File) {
  return new Promise<string>((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      const s = Math.round(audio.duration);
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "—");
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("—");
    };
    audio.src = url;
  });
}

// Playlist editor. Preview plays uploaded tracks; the placeholder tracks have no file yet.
export function MusicPlaylist() {
  const { tracks, setTracks, musicOn, setMusicOn } = useAdmin();
  const [playing, setPlaying] = useState(-1);

  // Play / stop the previewed track.
  useEffect(() => {
    const url = tracks[playing]?.url;
    if (!url) return;
    const a = new Audio(url);
    a.onended = () => setPlaying(-1);
    void a.play();
    return () => a.pause();
  }, [playing, tracks]);

  const reorder = (next: typeof tracks) => {
    setTracks(next);
    setPlaying(-1);
  };

  return (
    <div data-component="MusicPlaylist" className={styles.playlist}>
      <div className={styles.player}>
        <div className={styles.playerText}>
          <span className={styles.playerTitle}>Music player</span>
          <span className={styles.playerNote}>
            {musicOn ? "On · shows on the Home hero and the mobile menu, plays tracks in this order" : "Off · player hidden everywhere"}
          </span>
        </div>
        <Toggle on={musicOn} onChange={setMusicOn} label="Toggle music player" />
      </div>

      <div className={styles.rows}>
        <SortableList
          items={tracks}
          getId={(t) => t.file}
          onReorder={reorder}
          className={styles.rows}
          renderItem={(t, i, handleProps) => {
            const on = playing === i;
            return (
              <div className={styles.row} data-playing={on || undefined}>
                <DragHandle {...handleProps} />
                <button type="button" aria-label="Preview track" className={styles.play} onClick={() => setPlaying(on ? -1 : i)}>
                  {on ? "❚❚" : "▶"}
                </button>
                <span className={styles.trackText}>
                  <span className={styles.name}>{t.name}</span>
                  <span className={styles.file}>
                    {t.file} · {i === 0 ? "plays first" : `track ${i + 1}`}
                  </span>
                </span>
                <span className={styles.duration}>{t.duration}</span>
                <ReorderButtons index={i} length={tracks.length} onMove={(from, to) => reorder(arrayMove(tracks, from, to))} />
              </div>
            );
          }}
        />
        <FilePicker
          kind="audio"
          folder="music"
          onUploaded={async (url, file) => {
            const duration = await readDuration(file);
            setTracks([...tracks, { name: file.name.replace(/\.[^.]+$/, ""), file: file.name, duration, url }]);
          }}
        >
          {({ open, progress }) => <AddRow onClick={open}>{progressLabel(progress, "+ add track · MP3 or M4A")}</AddRow>}
        </FilePicker>
      </div>
    </div>
  );
}
