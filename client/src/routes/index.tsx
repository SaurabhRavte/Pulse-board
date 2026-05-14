/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
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
  Plus,
} from "lucide-react";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Logo } from "../components/logo";

function Landing() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-grid-pattern opacity-30"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[400px] bg-app [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)]"
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
                Without the <span className="text-lime">polling</span>.
              </h1>

              <p className="mt-5 text-sm sm:text-base text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                PulseBoard streams every vote to your screen the moment it lands
                &mdash; over WebSocket, not HTTP polling. Anonymous respondents
                by default. Self-hostable. No signup wall for the room.
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
            color="orange"
            icon={<Pencil className="h-4 w-4" />}
            title="WRITE"
            description="Single choice, multi-select, mandatory toggles. Set an expiry if the room is on a clock."
          />
          <StepCard
            num="02"
            color="cyan"
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

      {/* FAQ */}
      <section className="relative mx-auto max-w-3xl px-6 py-20 border-t border-app">
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted mb-3">
            // frequently_asked
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
            Questions, answered.
          </h2>
        </div>

        <div className="space-y-3">
          <Faq color="lime" question="Is PulseBoard free to use?">
            Yes. PulseBoard is open source and free forever &mdash; it&apos;s a
            hackathon project, not a startup. Run it on your own server, fork
            the repo, or use the hosted demo. There are no paid plans, no usage
            caps, and no upsell screens.
          </Faq>

          <Faq color="cyan" question="Do my respondents need an account?">
            Only if you want them to. Polls are anonymous by default &mdash;
            just share the link and anyone can vote. Switch a poll to
            &quot;authenticated&quot; mode if you need verified responses, and
            only signed-in users can submit. The creator sees exactly who
            responded in either case.
          </Faq>

          <Faq
            color="orange"
            question="How are responses live without me refreshing?"
          >
            PulseBoard runs a WebSocket per poll. The moment a vote hits the
            database, the server pushes the new tallies down the socket to every
            connected viewer &mdash; creator and audience. No setInterval, no
            polling, no manual refresh. Latency is usually under a second.
          </Faq>

          <Faq color="purple" question="Can I close or expire a poll?">
            Both. You can set an &quot;expires at&quot; time when creating the
            poll &mdash; the countdown shows up live on the respondent&apos;s
            screen, and the server refuses votes once it hits zero. You can also
            close a poll manually from the analytics page at any time, and
            publish results to a public read-only page when you&apos;re ready.
          </Faq>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-6xl px-6 py-16">
        <Card className="relative overflow-hidden p-10 sm:p-14 text-center border-t border-lime">
          <div className="relative">
            <div className="flex justify-center mb-4">
              <Logo size={40} className="text-fg" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-lime mb-3">
              // ready_when_you_are
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
              Run it in the room you&apos;re in.
            </h2>
            <p className="mt-3 max-w-md mx-auto text-sm text-muted">
              Free forever &mdash; it&apos;s just a repo. Fork it, host it,
              tweak the schema, ship your own version.
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
    <Card className="p-6 relative transition-colors group">
      <div className="flex items-start justify-between mb-6">
        <div
          className="h-10 w-10 grid place-items-center rounded-md border transition-transform group-hover:scale-105"
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

function Faq({
  color,
  question,
  children,
}: {
  color: AccentColor;
  question: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const v = colorVars[color];
  return (
    <div
      className="rounded-lg border bg-elev overflow-hidden transition-colors"
      style={{
        borderColor: open ? `rgb(${v} / 0.4)` : "rgb(var(--pb-border))",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="flex items-center gap-3 text-sm font-medium text-fg">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: `rgb(${v})` }}
          />
          {question}
        </span>
        <Plus
          className={
            "h-4 w-4 text-muted transition-transform " +
            (open ? "rotate-45" : "")
          }
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-muted leading-relaxed pl-11">
          {children}
        </div>
      )}
    </div>
  );
}

function HeroMock() {
  const opts = [
    { label: "Ladakh", pct: 64, color: "lime" as AccentColor },
    { label: "Uttarakhand", pct: 22, color: "pink" as AccentColor },
    { label: "Goa", pct: 14, color: "purple" as AccentColor },
  ];

  return (
    <Card className="relative p-5 sm:p-6 text-left bg-elev shadow-2xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-app">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-lime opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
          </span>
          <span className="text-[10px] uppercase tracking-widest text-lime font-bold">
            live &middot; 128 votes
          </span>
        </div>
        <span className="text-[10px] text-muted"></span>
      </div>

      <p className="text-fg font-medium text-sm">
        What’s your dream travel destination in india?
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
                  style={{ width: `${o.pct}%`, background: `rgb(${v})` }}
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
