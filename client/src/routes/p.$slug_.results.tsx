/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { Link, useParams, createFileRoute } from "@tanstack/react-router";
import { api, errorMessage } from "../lib/api";
import { Button } from "../components/button";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "../components/card";
import { BarChart } from "../components/bar-chart";
import { FullPageLoader } from "../components/loader";
import { Spotlight } from "../components/spotlight";

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
  type: "single" | "multiple";
  totalAnswers: number;
  options: OptionAnalytics[];
}
interface AnalyticsDTO {
  pollId: string;
  totalResponses: number;
  questions: QuestionAnalytics[];
}

function PublishedResults() {
  const { slug } = useParams({ from: "/p/$slug_/results" });
  const [analytics, setAnalytics] = useState<AnalyticsDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ data: AnalyticsDTO }>(
          `/api/analytics/public/${slug}`,
        );
        if (!cancelled) setAnalytics(res.data.data);
      } catch (err) {
        if (!cancelled)
          setError(errorMessage(err, "Results are not available"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-6">
        <Card className="p-10 text-center max-w-md">
          <h1 className="text-xl font-semibold text-fg">
            Results not available
          </h1>
          <p className="text-sm text-muted mt-2">{error}</p>
          <Link to="/" className="inline-block mt-5">
            <Button variant="outline">Back to home</Button>
          </Link>
        </Card>
      </div>
    );
  }
  if (!analytics) return <FullPageLoader />;

  return (
    <div className="relative min-h-[80vh] py-10 px-6 overflow-hidden">
      <Spotlight className="-top-40 left-1/4 opacity-60" />
      <div className="mx-auto max-w-4xl relative">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge tone="success">published</Badge>
          <Badge tone="neutral">
            {analytics.totalResponses}{" "}
            {analytics.totalResponses === 1 ? "response" : "responses"}
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
          Final results
        </h1>
        <p className="text-muted mt-2 max-w-xl">
          The creator has published the outcome of this poll. Here's the
          breakdown of every question.
        </p>

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
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    {q.type === "multiple" && (
                      <Badge tone="neutral">multi-select</Badge>
                    )}
                    <span className="text-xs text-muted">
                      {q.totalAnswers}{" "}
                      {q.totalAnswers === 1 ? "answer" : "answers"}
                    </span>
                  </div>
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
                          className="h-full bg-[rgb(var(--pb-fg))]"
                          style={{ width: `${o.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {q.totalAnswers > 0 && (
                  <BarChart
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
      </div>
    </div>
  );
}

// @ts-ignore — typed paths come from the auto-generated routeTree.gen.ts
export const Route = createFileRoute("/p/$slug_/results")({
  component: PublishedResults,
});
