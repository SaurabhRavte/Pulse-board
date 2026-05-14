/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, KeyRound, Star, Plus, Check } from "lucide-react";
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

        <div className="mx-auto max-w-6xl px-6 pt-20 pb-20 sm:pt-28 sm:pb-24 relative">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--pb-red)/0.4)] bg-[rgb(var(--pb-red)/0.10)] px-3 py-1 text-[11px] font-medium text-red-pb tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-red-pb animate-pulse" />
                v1.0 / open source / built in 48h
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-fg mt-6 leading-[1.05]">
                Live polls.
                <br />
                Without the <span className="text-red-pb">polling</span>.
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
                  <span className="h-1.5 w-1.5 rounded-full bg-green-pb" />
                  ws://real-time
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-pb" />
                  typescript
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-pb" />
                  drizzle + postgres
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-pb" />
                  clerk auth
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-pb" />
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

      {/* BENTO FEATURES */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 border-t border-app">
        <div className="mb-12 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted mb-3">
              // what_you_get
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
              Four pieces. Pick yours.
            </h2>
          </div>
          <p className="text-xs text-muted max-w-xs">
            Every feature works on its own. Mix them by toggling a setting per
            poll.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-fr">
          <BentoCard
            color="green"
            tag="real-time"
            title="Streamed over WebSocket."
            description="Every vote arrives in every viewer's browser within ~200ms. No setInterval. No refresh button."
            span={2}
          >
            <BarsViz />
          </BentoCard>

          <BentoCard
            color="blue"
            tag="privacy"
            title="Anonymous or auth."
            description="Default anonymous. Switch to auth-required per poll. Creator sees who voted either way."
            span={1}
          >
            <PrivacyViz />
          </BentoCard>

          <BentoCard
            color="yellow"
            tag="formats"
            title="Mix question types."
            description="Single choice, multi-select, mandatory toggles. Build the poll the room needs."
            span={1}
          >
            <ChecksViz />
          </BentoCard>

          <BentoCard
            color="pink"
            tag="self-host"
            title="It's just a repo."
            description="Fork the schema, change the colors, deploy it anywhere PostgreSQL runs. Zero vendor lock-in."
            span={2}
          >
            <CodeViz />
          </BentoCard>
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
          <Faq color="green" question="Is PulseBoard free to use?">
            Yes. PulseBoard is open source and free forever &mdash; it&apos;s a
            hackathon project, not a startup. Run it on your own server, fork
            the repo, or use the hosted demo. No paid plans, no usage caps, no
            upsell screens.
          </Faq>
          <Faq color="yellow" question="Do my respondents need an account?">
            Only if you want them to. Polls are anonymous by default &mdash;
            just share the link and anyone can vote. Switch to
            &quot;authenticated&quot; mode if you need verified responses. The
            creator sees exactly who responded in either case.
          </Faq>
          <Faq
            color="blue"
            question="How are responses live without me refreshing?"
          >
            PulseBoard runs a WebSocket per poll. The moment a vote hits the
            database, the server pushes new tallies down the socket to every
            connected viewer. No setInterval, no polling, no manual refresh.
            Latency is usually under a second.
          </Faq>
          <Faq color="pink" question="Can I close or expire a poll?">
            Both. Set an &quot;expires at&quot; time when creating &mdash; the
            countdown shows live on every respondent&apos;s screen and the
            server refuses votes once it hits zero. Close manually from the
            analytics page at any time, then publish results to a public
            read-only page when you&apos;re ready.
          </Faq>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-6xl px-6 py-16">
        <Card
          className="relative overflow-hidden p-10 sm:p-14 text-center border-t"
          style={{ borderTopColor: "rgb(var(--pb-red))" }}
        >
          <div className="relative">
            <div className="flex justify-center mb-4">
              <Logo size={40} className="text-fg" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-red-pb mb-3">
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

type AccentColor = "red" | "yellow" | "green" | "blue" | "pink" | "purple";
const colorVars: Record<AccentColor, string> = {
  red: "var(--pb-red)",
  yellow: "var(--pb-yellow)",
  green: "var(--pb-green)",
  blue: "var(--pb-blue)",
  pink: "var(--pb-pink)",
  purple: "var(--pb-purple)",
};

function BentoCard({
  color,
  tag,
  title,
  description,
  children,
  span,
}: {
  color: AccentColor;
  tag: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  span: 1 | 2;
}) {
  const v = colorVars[color];
  const colClass = span === 2 ? "sm:col-span-2" : "sm:col-span-1";
  return (
    <Card
      className={
        "p-6 relative flex flex-col justify-between overflow-hidden " + colClass
      }
      style={{ borderColor: "rgb(var(--pb-border))" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: `rgb(${v})` }}
        />
        <span
          className="text-[10px] uppercase tracking-[0.2em] font-bold"
          style={{ color: `rgb(${v})` }}
        >
          // {tag}
        </span>
      </div>
      <div className="flex-1 grid sm:grid-cols-[1.4fr_1fr] gap-4 items-center">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-fg tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-end">{children}</div>
      </div>
    </Card>
  );
}

function BarsViz() {
  return (
    <div className="w-full max-w-[160px] space-y-1.5">
      <div className="h-1.5 rounded-full bg-app overflow-hidden">
        <div
          className="h-full w-[78%] rounded-full"
          style={{ background: "rgb(var(--pb-green))" }}
        />
      </div>
      <div className="h-1.5 rounded-full bg-app overflow-hidden">
        <div
          className="h-full w-[45%] rounded-full"
          style={{ background: "rgb(var(--pb-green))", opacity: 0.7 }}
        />
      </div>
      <div className="h-1.5 rounded-full bg-app overflow-hidden">
        <div
          className="h-full w-[22%] rounded-full"
          style={{ background: "rgb(var(--pb-green))", opacity: 0.4 }}
        />
      </div>
      <p
        className="text-[9px] font-mono mt-2"
        style={{ color: "rgb(var(--pb-green))" }}
      >
        +3 votes / sec
      </p>
    </div>
  );
}

function PrivacyViz() {
  return (
    <div className="grid grid-cols-2 gap-2 w-full max-w-[120px]">
      <div
        className="aspect-square rounded-md border grid place-items-center text-[9px]"
        style={{
          borderColor: "rgb(var(--pb-blue) / 0.4)",
          color: "rgb(var(--pb-blue))",
        }}
      >
        anon
      </div>
      <div
        className="aspect-square rounded-md grid place-items-center text-[9px] font-bold"
        style={{
          background: "rgb(var(--pb-blue))",
          color: "rgb(var(--pb-bg))",
        }}
      >
        auth
      </div>
    </div>
  );
}

function ChecksViz() {
  return (
    <div className="space-y-1.5 w-full max-w-[120px]">
      {["single", "multi", "required"].map((label, i) => (
        <div key={label} className="flex items-center gap-2 text-[10px]">
          <span
            className="h-3 w-3 rounded-sm border grid place-items-center"
            style={{
              borderColor: `rgb(var(--pb-yellow))`,
              background: i < 2 ? "rgb(var(--pb-yellow))" : "transparent",
            }}
          >
            {i < 2 && (
              <Check
                className="h-2 w-2"
                style={{ color: "rgb(var(--pb-bg))" }}
              />
            )}
          </span>
          <span className="text-muted font-mono">{label}</span>
        </div>
      ))}
    </div>
  );
}

function CodeViz() {
  return (
    <div
      className="w-full max-w-[180px] rounded-md border p-3 font-mono text-[10px] space-y-1"
      style={{
        borderColor: "rgb(var(--pb-pink) / 0.4)",
        background: "rgb(var(--pb-pink) / 0.06)",
      }}
    >
      <p style={{ color: "rgb(var(--pb-pink))" }}>$ git clone</p>
      <p className="text-muted truncate">pulse-board</p>
      <p style={{ color: "rgb(var(--pb-pink))" }}>$ bun dev</p>
      <p className="text-muted">running on :5173</p>
    </div>
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
    { label: "Ladakh", pct: 48, color: "green" as AccentColor },
    { label: "manali", pct: 28, color: "yellow" as AccentColor },
    { label: "mussoorie", pct: 14, color: "blue" as AccentColor },
    { label: "munnar", pct: 10, color: "pink" as AccentColor },
  ];

  return (
    <Card className="relative p-5 sm:p-6 text-left bg-elev shadow-2xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-app">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-pb opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-pb" />
          </span>
          <span className="text-[10px] uppercase tracking-widest text-green-pb font-bold">
            live &middot; 412 votes
          </span>
        </div>
        <span className="text-[10px] text-muted">poll/destination</span>
      </div>

      <p className="text-fg font-medium text-sm">
        Which destination is at the top of your travel bucket list in india?
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
        <span className="inline-flex items-center gap-1 text-green-pb font-bold">
          +5 just now
        </span>
      </div>
    </Card>
  );
}

export const Route = createFileRoute("/")({
  component: Landing,
});
