import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authStore } from "../lib/auth";
import { FullPageLoader } from "./loader";

/**
 * Gates a subtree behind auth. Renders a loader while we resolve the initial
 * auth state (which is synchronous here, but the effect avoids a flash of
 * unauthenticated content on routes opened directly from a cold load).
 */
export function Protected({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const apply = () => {
      const s = authStore.get();
      if (!s.user || !s.accessToken) {
        setAuthed(false);
        navigate({ to: "/login", replace: true });
      } else {
        setAuthed(true);
      }
    };
    apply();
    return authStore.subscribe(apply);
  }, [navigate]);

  if (authed !== true) return <FullPageLoader />;
  return <>{children}</>;
}
