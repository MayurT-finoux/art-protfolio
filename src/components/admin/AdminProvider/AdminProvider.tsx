"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

// Client-side admin state: just the "saved" toast. Content is saved to the
// database through the server actions in src/app/admin/actions.ts.

type AdminContextValue = {
  saved: boolean;
  /** Shows the "saved" toast for 2 seconds. */
  save: () => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const save = useCallback(() => {
    clearTimeout(timer.current);
    setSaved(true);
    timer.current = setTimeout(() => setSaved(false), 2000);
  }, []);

  const value = useMemo(() => ({ saved, save }), [saved, save]);
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}
