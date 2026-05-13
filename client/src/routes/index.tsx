/* eslint-disable react-refresh/only-export-components */
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Eye,
  EyeOff,
  Github,
  LineChart,
  Lock,
  Sparkles,
  Zap,
  KeyRound,
  PlusCircle,
  Share2,
  Activity,
} from "lucide-react";

import { Button } from "../components/button";
import { Spotlight } from "../components/spotlight";
import { BackgroundBeams } from "../components/background-beams";
import { Card } from "../components/card";

function Landing() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <BackgroundBeams className="opacity-60" />
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />

        <div className="mx-auto max-w-6xl px-6 pt-12 pb-24 sm:pt-20 sm:pb-32 relative">
          <div className="flex flex-col items-center text-center gap-6">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full border border-app bg-elev/60 backdrop-blur px-3 py-1.5 text-xs text-muted hover:text-fg transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              Live polls in seconds — no setup
              <ArrowRight className="h-3 w-3" />
            </Link>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tighter text-fg max-w-5xl leading-[0.95]">
              Turn every meeting into a{" "}
              <span className="bg-linear-to-r from-[rgb(var(--pb-accent))] to-[rgb(var(--pb-fg))] bg-clip-text text-transparent">
                conversation
              </span>
              .
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-muted">
              PulseBoard is the fastest way to capture live feedback from any
              room. Build a poll in seconds, share a link or code, and watch
              answers stream in — in real time.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <Link to="/register">
                <Button
                  size="lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Create your first poll — free
                </Button>
              </Link>

              <Link to="/join">
                <Button
                  size="lg"
                  variant="outline"
                  leftIcon={<KeyRound className="h-4 w-4" />}
                >
                  Join with a code
                </Button>
              </Link>
            </div>

            <div className="mt-12 w-full max-w-4xl">
              <HeroMock />
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="relative border-y border-app bg-app/40 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <StatBlock value="< 60s" label="To launch a poll" />
          <StatBlock value="Real-time" label="Response stream" />
          <StatBlock value="0₹" label="During the hackathon" />
          <StatBlock value="∞" label="Polls per account" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-muted mb-3">
            How it works
          </p>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-fg">
            Three steps. One link. Zero friction.
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <StepCard
            step="01"
            icon={<PlusCircle className="h-5 w-5" />}
            title="Build your poll"
            description="Add questions, pick single- or multi-select, mark required ones, and choose anonymous or authenticated responses."
          />

          <StepCard
            step="02"
            icon={<Share2 className="h-5 w-5" />}
            title="Share the link or code"
            description="Drop the URL in chat, project it on screen, or have your audience punch in the short code on the Join page."
          />

          <StepCard
            step="03"
            icon={<Activity className="h-5 w-5" />}
            title="Watch responses live"
            description="Bars grow as votes arrive. Publish the results when ready and everyone gets the same shareable summary."
          />
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 border-t border-app">
        <div className="grid sm:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-3">
              The problem
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
              Audience feedback shouldn't need a 30-minute setup.
            </h2>
          </div>

          <div className="space-y-4 text-muted">
            <p>
              Hands-up doesn't scale. Email surveys go unread. Slack threads die
              after the first reply. Most "interactive" tools want a workspace,
              a billing seat and a tour before they'll show you a single
              question.
            </p>

            <p className="text-fg">
              PulseBoard removes the friction. One link, one screen, real-time
              charts — and respondents never have to sign up unless you want
              them to.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 border-t border-app">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-muted mb-3">
            What's inside
          </p>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
            Everything you need to run a session.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon={<Zap className="h-4 w-4" />}
            title="Live response counts"
            description="Socket.io pushes every vote to the analytics screen the moment it lands. No refresh, no polling, no lag."
          />

          <FeatureCard
            icon={<EyeOff className="h-4 w-4" />}
            title="Anonymous or authenticated"
            description="Pick the mode that fits the audience. Anonymous for honest feedback, authenticated for verified answers."
          />

          <FeatureCard
            icon={<Clock className="h-4 w-4" />}
            title="Live countdown timer"
            description="Set an expiry and the poll closes itself. Respondents see a ticking clock as urgency builds."
          />

          <FeatureCard
            icon={<LineChart className="h-4 w-4" />}
            title="Built-in analytics"
            description="Per-question breakdowns, percentage splits and a response-over-time trend — without exporting anything."
          />

          <FeatureCard
            icon={<Eye className="h-4 w-4" />}
            title="See who responded"
            description="For authenticated polls, the creator can see exactly which signed-in users submitted answers."
          />

          <FeatureCard
            icon={<Lock className="h-4 w-4" />}
            title="Single- or multi-select"
            description="Mix question types in one poll. Mark mandatory ones and PulseBoard enforces them on both client and server."
          />
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="relative mx-auto max-w-4xl px-6 py-20 border-t border-app">
        <Card className="p-10 sm:p-14 text-center">
          <p className="text-xl sm:text-2xl text-fg leading-relaxed">
            “We replaced our entire post-stand-up survey workflow with
            PulseBoard. The team actually answers now — the live chart on screen
            is half the fun.”
          </p>

          <p className="mt-6 text-sm text-muted">
            — Beta tester, internal pilot
          </p>
        </Card>
      </section>

      {/* FINAL CTA */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 border-t border-app">
        <Card className="relative overflow-hidden p-10 sm:p-14 text-center">
          <BackgroundBeams className="opacity-40" />

          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-fg">
              Start asking better questions.
            </h2>

            <p className="text-muted mt-3 max-w-lg mx-auto">
              Free during the hackathon. No credit card. Sign in with Google or
              email — your first poll takes under a minute.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              <Link to="/register">
                <Button size="lg">Create a poll</Button>
              </Link>

              <a
                href="https://github.com/SaurabhRavte/Pulse-board"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button
                  size="lg"
                  variant="outline"
                  leftIcon={<Github className="h-4 w-4" />}
                >
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-3xl sm:text-4xl font-semibold tracking-tighter text-fg tabular-nums">
        {value}
      </p>

      <p className="text-xs uppercase tracking-widest text-muted mt-1.5">
        {label}
      </p>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 relative">
      <span className="absolute top-6 right-6 text-xs font-mono text-muted">
        {step}
      </span>

      <div className="h-9 w-9 grid place-items-center rounded-lg bg-app border border-app text-fg mb-4">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-fg">{title}</h3>

      <p className="text-sm text-muted mt-2 leading-relaxed">{description}</p>
    </Card>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 hover:border-[rgb(var(--pb-fg-muted))] transition-colors">
      <div className="h-9 w-9 grid place-items-center rounded-lg bg-app border border-app text-fg mb-4">
        {icon}
      </div>

      <h3 className="text-base font-semibold text-fg">{title}</h3>

      <p className="text-sm text-muted mt-1.5 leading-relaxed">{description}</p>
    </Card>
  );
}

function HeroMock() {
  const opts = [
    { label: "Shipped on time", pct: 64 },
    { label: "Slipped a little", pct: 22 },
    { label: "Significantly delayed", pct: 14 },
  ];

  return (
    <Card className="relative p-6 sm:p-8 text-left bg-elev/80 backdrop-blur">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[rgb(var(--pb-success))] animate-pulse" />

          <span className="text-xs uppercase tracking-widest text-muted">
            Live · 128 responses
          </span>
        </div>

        <span className="text-xs text-muted">Q1 retrospective</span>
      </div>

      <p className="text-fg font-medium">
        How did the team feel about delivery in Q1?
      </p>

      <div className="mt-5 space-y-3">
        {opts.map((o) => (
          <div key={o.label}>
            <div className="flex items-center justify-between text-sm text-fg mb-1.5">
              <span>{o.label}</span>

              <span className="text-muted tabular-nums">{o.pct}%</span>
            </div>

            <div className="h-2 w-full rounded-full bg-app overflow-hidden border border-app">
              <div
                className="h-full bg-[rgb(var(--pb-fg))]"
                style={{ width: `${o.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export const Route = createFileRoute("/")({
  component: Landing,
});
