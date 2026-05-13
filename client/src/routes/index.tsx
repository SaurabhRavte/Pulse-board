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
} from "lucide-react";
import { Button } from "../components/button";
import { Spotlight } from "../components/spotlight";
import { BackgroundBeams } from "../components/background-beams";
import { Card } from "../components/card";

function Landing() {
  return (
    <div className="relative">
      {/* -------------------- HERO -------------------- */}
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
              Built for live audience feedback
              <ArrowRight className="h-3 w-3" />
            </Link>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-fg max-w-4xl leading-[1.05]">
              Live polls.{" "}
              <span className="text-muted">Real-time feedback.</span>
              <br className="hidden sm:block" /> Zero setup.
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-muted">
              PulseBoard turns any meeting, classroom or product review into a
              two-way conversation. Build a poll in seconds, share a link, and
              watch responses arrive on the screen — live.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <Link to="/register">
                <Button
                  size="lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Create your first poll
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  I already have an account
                </Button>
              </Link>
            </div>

            <div className="mt-12 w-full max-w-4xl">
              <HeroMock />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM IT SOLVES */}
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

      {/* Features  */}
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
            description="Pick the mode that fits the audience. Anonymous for honest feedback, authenticated for verified responses."
          />
          <FeatureCard
            icon={<Clock className="h-4 w-4" />}
            title="Auto-expiring links"
            description="Set an expiry and the poll closes itself. No more stale links collecting noise weeks after the session."
          />
          <FeatureCard
            icon={<LineChart className="h-4 w-4" />}
            title="Built-in analytics"
            description="Per-question breakdowns, percentage splits and a response-over-time trend — without exporting anything."
          />
          <FeatureCard
            icon={<Eye className="h-4 w-4" />}
            title="Publish results"
            description="One click and the same share link starts showing aggregated outcomes — perfect for transparent retros."
          />
          <FeatureCard
            icon={<Lock className="h-4 w-4" />}
            title="Mandatory questions"
            description="Mark questions required and PulseBoard enforces them on both the form and the API, every time."
          />
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-20 border-t border-app">
        <Card className="relative overflow-hidden p-10 sm:p-14 text-center">
          <BackgroundBeams className="opacity-40" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
              Start asking better questions.
            </h2>
            <p className="text-muted mt-3 max-w-lg mx-auto">
              Free during the hackathon. No credit card. Sign in with Google or
              email — your first poll takes under a minute.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
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
