"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
// Client-side admin state: the "saved" toast and the Instagram panel (placeholder
// until the Instagram API is connected). Content is saved to the database through
// the server actions in src/app/admin/actions.ts.

export type IgState = "ok" | "syncing" | "fail";

type AdminState = {
  ig: IgState;
  saved: boolean;
};

type AdminActions = {
  syncInstagram: () => void;
  save: () => void;
};

const AdminContext = createContext<(AdminState & AdminActions) | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminState>({
    ig: "ok",
    saved: false,
  });
  const savedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const igTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const patch = useCallback((p: Partial<AdminState>) => setState((s) => ({ ...s, ...p })), []);

  const save = useCallback(() => {
    clearTimeout(savedTimer.current);
    patch({ saved: true });
    savedTimer.current = setTimeout(() => patch({ saved: false }), 2000);
  }, [patch]);

  const syncInstagram = useCallback(() => {
    patch({ ig: "syncing" });
    clearTimeout(igTimer.current);
    igTimer.current = setTimeout(() => patch({ ig: "ok" }), 900);
  }, [patch]);

  const value = useMemo(
    () => ({
      ...state,
      syncInstagram,
      save,
    }),
    [state, syncInstagram, save],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}
