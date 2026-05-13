/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { Link, useParams, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Copy, Globe, XCircle } from "lucide-react";
import { api, errorMessage } from "../lib/api";
import { subscribeToPoll } from "../lib/socket";
import { Protected } from "../components/protected";
import { Button } from "../components/button";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Badge,
} from "../components/card";
import { BarChart } from "../components/bar-chart";
import { FullPageLoader } from "../components/loader";

interface OptionAnalytics {
  optionId: string;
  label: string;
  count: number;
  percentage: number;
}
interface QuestionAnalytics {
  questionId: string;
  prompt: string;
  isMandatory: boolean;
  totalAnswers: number;
  options: OptionAnalytics[];
}
interface AnalyticsDTO {
  pollId: string;
  totalResponses: number;
  questions: QuestionAnalytics[];
  responsesOverTime: Array<{ date: string; count: number }>;
}
interface PollMeta {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "active" | "closed" | "published";
  resultsPublished: boolean;
  responseMode: "anonymous" | "authenticated";
  expiresAt: string | null;
}

function AnalyticsInner() {
  const { pollId } = useParams({ from: "/polls/$pollId/analytics" });

  const [poll, setPoll] = useState<PollMeta | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /* ----- Initial load ----- */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [pollRes, anaRes] = await Promise.all([
          api.get<{ data: PollMeta }>(`/api/polls/${pollId}`),
          api.get<{ data: AnalyticsDTO }>(`/api/analytics/${pollId}`),
        ]);
        if (cancelled) return;
        setPoll(pollRes.data.data);
        setAnalytics(anaRes.data.data);
      } catch (err) {
        if (!cancelled) setError(errorMessage(err, "Could not load analytics"));
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [pollId]);

  /* ----- Live updates via Socket.io ----- */
  useEffect(() => {
    const unsub = subscribeToPoll(pollId, {
      onResponse: ({ totalResponses, optionCounts }) => {
        // Merge new counts in without refetching the whole analytics object.
        setAnalytics((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            totalResponses,
            questions: prev.questions.map((q) => {
              const updatedOptions = q.options.map((o) => ({
                ...o,
                count: optionCounts[o.optionId] ?? o.count,
              }));
              const total = updatedOptions.reduce((s, o) => s + o.count, 0);
              return {
                ...q,
                totalAnswers: total,
                options: updatedOptions.map((o) => ({
                  ...o,
                  percentage:
                    total > 0 ? Math.round((o.count / total) * 1000) / 10 : 0,
                })),
              };
            }),
          };
        });
      },
      onClosed: () => setPoll((p) => (p ? { ...p, status: "closed" } : p)),
      onPublished: () =>
        setPoll((p) =>
          p ? { ...p, status: "published", resultsPublished: true } : p,
        ),
    });
    return unsub;
  }, [pollId]);

  /* ----- Actions ----- */

  const handlePublish = async () => {
    if (!poll) return;
    if (!confirm("Publish results? Anyone with the link will see them."))
      return;
    setBusy(true);
    try {
      await api.post(`/api/polls/${poll.id}/publish`);
      setPoll((p) =>
        p ? { ...p, resultsPublished: true, status: "published" } : p,
      );
    } catch (err) {
      alert(errorMessage(err, "Could not publish"));
    } finally {
      setBusy(false);
    }
  };

  const handleClose = async () => {
    if (!poll) return;
    if (!confirm("Close this poll? No more responses will be accepted."))
      return;
    setBusy(true);
    try {
      await api.post(`/api/polls/${poll.id}/close`);
      setPoll((p) => (p ? { ...p, status: "closed" } : p));
    } catch (err) {
      alert(errorMessage(err, "Could not close"));
    } finally {
      setBusy(false);
    }
  };

  const handleCopyLink = async () => {
    if (!poll) return;
    try {
      const url = `${window.location.origin}/p/${poll.slug}`;
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Card className="p-8 text-sm text-[rgb(var(--pb-danger))]">
          {error}
        </Card>
      </div>
    );
  }
  if (!poll || !analytics) return <FullPageLoader />;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* -------- Header -------- */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link
            to="/dashboard"
            className="text-xs uppercase tracking-widest text-muted hover:text-fg"
          >
            ← All polls
          </Link>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg mt-2">
            {poll.title}
          </h1>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge
              tone={
                poll.status === "active"
                  ? "success"
                  : poll.status === "closed"
                    ? "danger"
                    : poll.status === "published"
                      ? "neutral"
                      : "warning"
              }
            >
              {poll.status}
            </Badge>
            <Badge tone="neutral">{poll.responseMode}</Badge>
            {poll.resultsPublished && (
              <Badge tone="neutral">results public</Badge>
            )}
            <Badge tone="neutral" className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--pb-success))] animate-pulse" />
              Live
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            leftIcon={<Copy className="h-4 w-4" />}
          >
            Copy link
          </Button>
          {poll.status === "active" && (
            <Button
              variant="outline"
              onClick={handleClose}
              loading={busy}
              leftIcon={<XCircle className="h-4 w-4" />}
            >
              Close poll
            </Button>
          )}
          {!poll.resultsPublished && (
            <Button
              onClick={handlePublish}
              loading={busy}
              leftIcon={<Globe className="h-4 w-4" />}
            >
              Publish results
            </Button>
          )}
        </div>
      </div>

      {/* -------- Top-line stat -------- */}
      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <Stat label="Total responses" value={analytics.totalResponses} />
        <Stat label="Questions" value={analytics.questions.length} />
        <Stat
          label="Avg. answers / question"
          value={
            analytics.questions.length === 0
              ? 0
              : Math.round(
                  analytics.questions.reduce((s, q) => s + q.totalAnswers, 0) /
                    analytics.questions.length,
                )
          }
        />
      </div>

      {/* -------- Per-question breakdowns -------- */}
      <div className="mt-10 space-y-6">
        {analytics.questions.map((q, idx) => (
          <Card key={q.questionId}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>
                  <span className="text-muted font-mono mr-2 text-sm">
                    Q{idx + 1}
                  </span>
                  {q.prompt}
                </CardTitle>
                <span className="text-xs text-muted whitespace-nowrap">
                  {q.totalAnswers} {q.totalAnswers === 1 ? "answer" : "answers"}
                </span>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3 mb-6">
                {q.options.map((o) => (
                  <div key={o.optionId}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-fg">{o.label}</span>
                      <span className="text-muted tabular-nums">
                        {o.count} · {o.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-app overflow-hidden border border-app">
                      <div
                        className="h-full bg-[rgb(var(--pb-fg))] transition-all duration-500"
                        style={{ width: `${o.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {q.totalAnswers > 0 && (
                <BarChart
                  title="Distribution"
                  data={q.options.map((o) => ({
                    label: o.label,
                    value: o.count,
                  }))}
                />
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* -------- Share link footer -------- */}
      <Card className="mt-8 p-6">
        <p className="text-xs uppercase tracking-widest text-muted mb-2">
          Public link
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 rounded-lg bg-app border border-app text-sm text-fg font-mono truncate">
            {`${typeof window !== "undefined" ? window.location.origin : ""}/p/${poll.slug}`}
          </code>
          <Button
            onClick={handleCopyLink}
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            Copy
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
      <p className="text-3xl font-semibold tracking-tight text-fg mt-2 tabular-nums">
        {value}
      </p>
    </Card>
  );
}

function Analytics() {
  return (
    <Protected>
      <AnalyticsInner />
    </Protected>
  );
}

// @ts-ignore — typed paths come from the auto-generated routeTree.gen.ts
export const Route = createFileRoute("/polls/$pollId/analytics")({
  component: Analytics,
});
