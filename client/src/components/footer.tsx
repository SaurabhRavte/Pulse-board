import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  LogOut,
  LayoutDashboard,
  Plus,
  KeyRound,
} from "lucide-react";
import { authStore, clearSession, type AuthUser } from "../lib/auth";
import { api } from "../lib/api";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { ThemeToggle } from "./theme-toggle";

export function FloatingNavbar() {
  const [user, setUser] = useState<AuthUser | null>(authStore.get().user);
  const [hidden, setHidden] = useState(false);

  useEffect(() => authStore.subscribe((s) => setUser(s.user)), []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      const goingDown = currentY > lastY && currentY > 80;
      setHidden(goingDown);
      lastY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore
    }
    clearSession();
    window.location.href = "/";
  };

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(96%,72rem)]",
        "transition-transform duration-300",
        hidden ? "translate-y-[-140%] -translate-x-1/2" : "",
      )}
    >
      <nav
        className={cn(
          "flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2.5",
          "rounded-full border border-app bg-app/70 backdrop-blur-xl",
          "shadow-[0_8px_30px_rgb(0_0_0/0.12)]",
        )}
      >
        <Link to="/" className="flex items-center gap-2 pr-2 sm:pr-3">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[rgb(var(--pb-accent))] text-[rgb(var(--pb-accent-fg))]">
            <Activity className="h-4 w-4" />
          </span>
          <span className="font-semibold tracking-tight text-fg">
            PulseBoard
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1 text-sm text-muted">
          <Link
            to="/"
            className="px-3 py-1.5 rounded-full hover:text-fg hover:bg-elev transition-colors [&.active]:text-fg [&.active]:bg-elev"
          >
            Home
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                className="px-3 py-1.5 rounded-full hover:text-fg hover:bg-elev transition-colors [&.active]:text-fg [&.active]:bg-elev"
              >
                Dashboard
              </Link>
              <Link
                to="/join"
                className="px-3 py-1.5 rounded-full hover:text-fg hover:bg-elev transition-colors [&.active]:text-fg [&.active]:bg-elev"
              >
                Join with code
              </Link>
            </>
          )}
        </div>

        <div className="flex-1" />

        <ThemeToggle />

        {user ? (
          <>
            <Link to="/join" className="sm:hidden">
              <Button size="sm" variant="outline">
                <KeyRound className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/polls/new" className="hidden sm:block">
              <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                New poll
              </Button>
            </Link>
            <Link to="/dashboard" className="sm:hidden">
              <Button size="sm" variant="outline">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              leftIcon={<LogOut className="h-4 w-4" />}
              className="hidden sm:inline-flex"
            >
              Sign out
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button size="sm" variant="ghost">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
