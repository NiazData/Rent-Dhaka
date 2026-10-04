import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { session, loading } = useSession();

  if (loading) {
    return <p className="mx-auto max-w-xl px-4 py-16 text-center text-stone-600">Loading…</p>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
