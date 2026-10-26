"use client";

import { useState, type ReactNode } from "react";
import { uploadFile } from "@/lib/uploadFile";
import { acceptFor, type UploadKind } from "@/lib/uploads";

export type PickerState = {
  /** Opens the file dialog. */
  open: () => void;
  /** 0–1 while uploading, null otherwise. */
  progress: number | null;
};

/**
 * Hidden file input + upload to R2. `children` renders the trigger
 * (the existing "+ add image" / "replace" buttons) from the picker state.
 */
export function FilePicker({
  kind,
  folder,
  onUploaded,
  children,
}: {
  kind: UploadKind | UploadKind[];
  folder: string;
  onUploaded: (url: string, file: File) => void;
  children: (state: PickerState) => ReactNode;
}) {
  const [input, setInput] = useState<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const kinds = Array.isArray(kind) ? kind : [kind];
  const open = () => {
    if (progress == null) input?.click();
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const fileKind = kinds.find((k) => file.type.startsWith(`${k}/`)) ?? kinds[0];
    setProgress(0);
    try {
      const url = await uploadFile(file, { kind: fileKind, folder, onProgress: setProgress });
      onUploaded(url, file);
    } catch (error) {
      window.alert((error as Error).message);
    } finally {
      setProgress(null);
    }
  };

  return (
    <>
      <input ref={setInput} type="file" hidden accept={kinds.map(acceptFor).join(",")} onChange={onChange} />
      {children({ open, progress })}
    </>
  );
}

/** "uploading 42%" label while a file uploads. */
export const progressLabel = (progress: number | null, idle: string) =>
  progress == null ? idle : `uploading ${Math.round(progress * 100)}%`;
