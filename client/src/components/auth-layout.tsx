import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Activity } from "lucide-react";
import { BackgroundBeams } from "./background-beams";
import { Spotlight } from "./spotlight";
import { ThemeToggle } from "./theme-toggle";

/**
 * Split-screen auth layout used by login & register. Left panel is a dark
 * always-dark brand panel with animated beams + abstract chart art. Right
 * panel is the form, with a "Back to home" link at the top.
 */
export function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    // Fixed overlay so it sits above the floating navbar / page footer
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-app">
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* -------------------- Left brand panel (lg+) -------------------- */}
        <aside
          className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-neutral-950 text-neutral-100"
          // Keep the beams + spotlight visible even when the rest of the app
          // is on the light theme — the panel is intentionally always dark.
          style={{ "--pb-fg": "250 250 250" } as React.CSSProperties}
          aria-hidden
        >
          <BackgroundBeams className="opacity-70" />
          <Spotlight className="-top-20 left-10" />

          <div className="relative z-10 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-white text-neutral-950">
              <Activity className="h-4 w-4" />
            </span>
            <span className="font-semibold tracking-tight">PulseBoard</span>
          </div>

          {/* Abstract "live poll" visual that anchors the panel */}
          <div className="relative z-10 flex-1 grid place-items-center">
            <BrandVisual />
          </div>

          <div className="relative z-10 max-w-md">
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Why teams use PulseBoard
            </p>
            <p className="text-lg leading-snug mt-2">
              Ask better questions, see answers arrive live, and publish a
              transparent result with the same link.
            </p>
          </div>
        </aside>

        {/* -------------------- Right form panel -------------------- */}
        <section className="relative flex flex-col px-6 sm:px-12 py-8">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md py-10">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                {eyebrow}
              </p>
              <h1 className="mt-3 text-5xl sm:text-6xl font-semibold tracking-tighter text-fg leading-[0.95]">
                {title}
              </h1>
              <p className="mt-4 text-base text-muted max-w-sm">{subtitle}</p>

              <div className="mt-10">{children}</div>

              {footer && <p className="mt-8 text-xs text-muted">{footer}</p>}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * Pure-CSS/SVG abstract — five "live" bars pulsing at different heights to
 * suggest votes coming in. No external assets, looks intentional, scales.
 */
function BrandVisual() {
  const bars = [
    { h: 38, delay: "0s" },
    { h: 64, delay: "0.4s" },
    { h: 92, delay: "0.8s" },
    { h: 54, delay: "1.2s" },
    { h: 76, delay: "1.6s" },
  ];
  return (
    <div className="w-full max-w-sm aspect-square rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 relative overflow-hidden">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest text-neutral-400">
          Live · 248 responses
        </span>
      </div>
      <p className="text-neutral-200 text-sm mt-2">How was the Q1 launch?</p>

      <div className="absolute inset-x-8 bottom-8 flex items-end gap-4 h-44">
        {bars.map((b, i) => (
          <div
            key={i}
            className="flex-1 rounded-md bg-gradient-to-t from-white/90 to-white/40"
            style={{
              height: `${b.h}%`,
              animation: `pb-bar-rise 2.4s ease-out ${b.delay} both`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pb-bar-rise {
          from { transform: scaleY(0.15); opacity: 0.2; }
          to   { transform: scaleY(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
