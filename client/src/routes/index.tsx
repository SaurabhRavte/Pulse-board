/* eslint-disable react-refresh/only-export-components */
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  KeyRound,
  Pencil,
  Send,
  Radio,
  Star,
  Zap,
  ShieldCheck,
  ListChecks,
  Code2,
} from "lucide-react";
import { Button } from "../components/button";
import { Card } from "../components/card";

function Landing() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-dot-pattern opacity-50"
        />
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] pb-lime-glow"
        />

        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 relative">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--pb-lime)/0.4)] bg-[rgb(var(--pb-lime)/0.08)] px-3 py-1 text-[11px] font-medium text-lime tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
                v1.0 / open source / built in 48h
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-fg mt-6 leading-[1.05]">
                Live polls.
                <br />
                Without the{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, rgb(var(--pb-lime)), rgb(var(--pb-cyan)))",
                  }}
                >
                  polling
                </span>
                .
              </h1>

              <p className="mt-5 text-sm sm:text-base text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                PulseBoard streams every vote to your screen the moment it lands
                — over WebSocket, not HTTP polling. Anonymous respondents by
                default. Self-hostable. No signup wall for the room.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <Link to="/register">
                  <Button
                    size="lg"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="pb-glow-primary"
                  >
                    Start a poll
                  </Button>
                </Link>
                <Link to="/join">
                  <Button
                    size="lg"
                    variant="outline"
                    leftIcon={<KeyRound className="h-4 w-4" />}
                  >
                    I have a code
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-[11px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                  ws://real-time
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                  typescript
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                  drizzle + postgres
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple" />
                  clerk auth
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink" />
                  tanstack router
                </span>
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-6 rounded-3xl bg-[rgb(var(--pb-lime)/0.08)] blur-2xl"
              />
              <HeroMock />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 border-t border-app">
        <div className="mb-14">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted mb-3">
            // how_it_works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
            Three steps. One WebSocket.
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <StepCard
            num="01"
            color="cyan"
            icon={<Pencil className="h-4 w-4" />}
            title="WRITE"
            description="Single choice, multi-select, mandatory toggles. Set an expiry if the room is on a clock."
          />
          <StepCard
            num="02"
            color="orange"
            icon={<Send className="h-4 w-4" />}
            title="SHARE"
            description="A short URL or a 6-char code your audience types into the Join page. No signup for them."
          />
          <StepCard
            num="03"
            color="lime"
            icon={<Radio className="h-4 w-4" />}
            title="STREAM"
            description="Every response hits the chart over a socket. Bars move. Numbers tick. No refresh needed."
          />
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          <FeatureChip color="cyan" icon={<Zap className="h-3.5 w-3.5" />}>
            real-time updates
          </FeatureChip>
          <FeatureChip
            color="lime"
            icon={<ShieldCheck className="h-3.5 w-3.5" />}
          >
            anonymous or auth
          </FeatureChip>
          <FeatureChip
            color="orange"
            icon={<ListChecks className="h-3.5 w-3.5" />}
          >
            multi-select
          </FeatureChip>
          <FeatureChip color="purple" icon={<Code2 className="h-3.5 w-3.5" />}>
            open source
          </FeatureChip>
          <FeatureChip color="pink" icon={<Star className="h-3.5 w-3.5" />}>
            self-hostable
          </FeatureChip>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-6xl px-6 py-16">
        <Card className="relative overflow-hidden p-10 sm:p-14 text-center">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgb(var(--pb-lime)), rgb(var(--pb-cyan)), rgb(var(--pb-purple)), transparent)",
            }}
          />
          <div
            aria-hidden
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pb-lime-glow"
          />
          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.2em] text-lime mb-3">
              // ready_when_you_are
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
              Run it in the room you're in.
            </h2>
            <p className="mt-3 max-w-md mx-auto text-sm text-muted">
              Free forever — it's just a repo. Fork it, host it, tweak the
              schema, ship your own version.
            </p>

            <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
              <Link to="/register">
                <Button
                  size="lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  className="pb-glow-primary"
                >
                  Create a poll
                </Button>
              </Link>
              <a
                href="https://github.com/SaurabhRavte/Pulse-board"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button
                  size="lg"
                  variant="outline"
                  leftIcon={<Star className="h-4 w-4" />}
                >
                  Star on GitHub
                </Button>
              </a>
            </div>

            <p className="mt-8 text-[11px] text-muted font-mono">
              $ git clone github.com/SaurabhRavte/Pulse-board
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}

type AccentColor = "lime" | "cyan" | "orange" | "pink" | "purple";

const colorVars: Record<AccentColor, string> = {
  lime: "var(--pb-lime)",
  cyan: "var(--pb-cyan)",
  orange: "var(--pb-orange)",
  pink: "var(--pb-pink)",
  purple: "var(--pb-purple)",
};

function StepCard({
  num,
  color,
  icon,
  title,
  description,
}: {
  num: string;
  color: AccentColor;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const v = colorVars[color];
  return (
    <Card
      className="p-6 relative transition-colors group"
      style={{ ["--c" as string]: `rgb(${v})` }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-40"
        style={{
          background: `linear-gradient(90deg, transparent, rgb(${v}), transparent)`,
        }}
      />
      <div className="flex items-start justify-between mb-6">
        <div
          className="h-10 w-10 grid place-items-center rounded-md border transition-all group-hover:scale-105"
          style={{
            color: `rgb(${v})`,
            background: `rgb(${v} / 0.10)`,
            borderColor: `rgb(${v} / 0.35)`,
          }}
        >
          {icon}
        </div>
        <span
          className="text-3xl font-bold tracking-tighter"
          style={{ color: `rgb(${v})` }}
        >
          {num}
        </span>
      </div>
      <h3 className="text-base font-bold text-fg tracking-tight">{title}</h3>
      <p className="text-xs text-muted mt-2 leading-relaxed">{description}</p>
    </Card>
  );
}

function FeatureChip({
  color,
  icon,
  children,
}: {
  color: AccentColor;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const v = colorVars[color];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-elev text-[11px] text-fg border transition-colors"
      style={{ borderColor: `rgb(${v} / 0.35)` }}
    >
      <span style={{ color: `rgb(${v})` }}>{icon}</span>
      {children}
    </span>
  );
}

function HeroMock() {
  const opts = [
    { label: "shipped on time", pct: 64, color: "lime" as AccentColor },
    { label: "slipped a little", pct: 22, color: "cyan" as AccentColor },
    { label: "significantly delayed", pct: 14, color: "orange" as AccentColor },
  ];

  return (
    <Card className="relative p-5 sm:p-6 text-left bg-elev shadow-2xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-app">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--pb-lime))] opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
          </span>
          <span className="text-[10px] uppercase tracking-widest text-lime font-bold">
            live · 128 votes
          </span>
        </div>
        <span className="text-[10px] text-muted">poll/q1-retro</span>
      </div>

      <p className="text-fg font-medium text-sm">
        how did the team feel about Q1 delivery?
      </p>

      <div className="mt-4 space-y-3">
        {opts.map((o) => {
          const v = colorVars[o.color];
          return (
            <div key={o.label}>
              <div className="flex items-center justify-between text-[11px] text-fg mb-1">
                <span>{o.label}</span>
                <span
                  className="tabular-nums font-bold"
                  style={{ color: `rgb(${v})` }}
                >
                  {o.pct}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-app overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${o.pct}%`,
                    background: `rgb(${v})`,
                    boxShadow: `0 0 12px rgb(${v} / 0.6)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-app flex items-center justify-between text-[10px]">
        <span className="text-muted font-mono">socket: connected</span>
        <span className="inline-flex items-center gap-1 text-lime font-bold">
          +3 just now
        </span>
      </div>
    </Card>
  );
}

export const Route = createFileRoute("/")({
  component: Landing,
});
