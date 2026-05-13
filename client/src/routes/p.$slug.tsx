/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { Link, useParams, createFileRoute } from "@tanstack/react-router";
import { Clock, CheckCircle2, Lock } from "lucide-react";
import { api, errorMessage } from "../lib/api";
import { authStore } from "../lib/auth";
import { Button } from "../components/button";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Badge,
} from "../components/card";
import { FullPageLoader } from "../components/loader";
import { Spotlight } from "../components/spotlight";
import { Countdown } from "../components/countdown";

interface OptionDTO {
  id: string;
  label: string;
  position: number;
}
interface QuestionDTO {
  id: string;
  prompt: string;
  isMandatory: boolean;
  type: "single" | "multiple";
  position: number;
  options: OptionDTO[];
}
interface PollDTO {
  id: string;
  title: string;
  description: string | null;
  responseMode: "anonymous" | "authenticated";
  status: "draft" | "active" | "closed" | "published";
  resultsPublished: boolean;
  expiresAt: string | null;
  questions: QuestionDTO[];
}
interface PublicResponse {
  poll: PollDTO;
  accepting: boolean;
  resultsPublished: boolean;
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[70vh] grid place-items-center px-6">{children}</div>
  );
}

function PublicPoll() {
  const { slug } = useParams({ from: "/p/$slug" });

  const [loaded, setLoaded] = useState<PublicResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // single → string optionId | multiple → string[] of optionIds
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expired, setExpired] = useState(false);

  const [signedIn, setSignedIn] = useState(
    Boolean(authStore.get().accessToken),
  );
  useEffect(
    () => authStore.subscribe((s) => setSignedIn(Boolean(s.accessToken))),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ data: PublicResponse }>(
          `/api/polls/public/${slug}`,
        );
        if (!cancelled) setLoaded(res.data.data);
      } catch (err) {
        if (!cancelled) setLoadError(errorMessage(err, "Poll not found"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loadError) {
    return (
      <Center>
        <Card className="p-10 text-center max-w-md">
          <h1 className="text-xl font-semibold text-fg">Poll unavailable</h1>
          <p className="text-sm text-muted mt-2">{loadError}</p>
          <Link to="/" className="inline-block mt-5">
            <Button variant="outline">Back to home</Button>
          </Link>
        </Card>
      </Center>
    );
  }
  if (!loaded) return <FullPageLoader />;

  const { poll, accepting, resultsPublished } = loaded;

  if (resultsPublished && (!accepting || expired)) {
    return (
      <Center>
        <Card className="p-10 text-center max-w-md">
          <h1 className="text-xl font-semibold text-fg">
            This poll has been published
          </h1>
          <p className="text-sm text-muted mt-2">
            Submissions are closed, but the final results are public.
          </p>
          <Link
            to="/p/$slug/results"
            params={{ slug }}
            className="inline-block mt-5"
          >
            <Button>View results</Button>
          </Link>
        </Card>
      </Center>
    );
  }

  if (!accepting || expired) {
    return (
      <Center>
        <Card className="p-10 text-center max-w-md">
          <Clock className="h-6 w-6 mx-auto text-muted" />
          <h1 className="text-xl font-semibold text-fg mt-3">
            This poll has closed
          </h1>
          <p className="text-sm text-muted mt-2">
            Responses are no longer being accepted.
          </p>
        </Card>
      </Center>
    );
  }

  if (submitted) {
    return (
      <Center>
        <Card className="p-10 text-center max-w-md">
          <CheckCircle2 className="h-6 w-6 mx-auto text-[rgb(var(--pb-success))]" />
          <h1 className="text-xl font-semibold text-fg mt-3">
            Thanks for your response
          </h1>
          <p className="text-sm text-muted mt-2">
            Your answers have been recorded. You can close this tab.
          </p>
        </Card>
      </Center>
    );
  }

  if (poll.responseMode === "authenticated" && !signedIn) {
    return (
      <Center>
        <Card className="p-10 text-center max-w-md">
          <Lock className="h-6 w-6 mx-auto text-muted" />
          <h1 className="text-xl font-semibold text-fg mt-3">
            Sign-in required
          </h1>
          <p className="text-sm text-muted mt-2">
            This poll only accepts authenticated responses. Sign in to continue.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <Link to="/login">
              <Button>Sign in</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">Create account</Button>
            </Link>
          </div>
        </Card>
      </Center>
    );
  }

  const selectSingle = (qId: string, oId: string) =>
    setAnswers((a) => ({ ...a, [qId]: oId }));

  const toggleMulti = (qId: string, oId: string) =>
    setAnswers((a) => {
      const current = Array.isArray(a[qId]) ? (a[qId] as string[]) : [];
      const next = current.includes(oId)
        ? current.filter((id) => id !== oId)
        : [...current, oId];
      return { ...a, [qId]: next };
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    for (const q of poll.questions) {
      const ans = answers[q.id];
      const isEmpty =
        q.type === "multiple" ? !Array.isArray(ans) || ans.length === 0 : !ans;
      if (q.isMandatory && isEmpty) {
        setSubmitError(`Please answer: "${q.prompt}"`);
        return;
      }
    }

    const payload: Array<{ questionId: string; optionId: string }> = [];
    for (const [qId, val] of Object.entries(answers)) {
      if (Array.isArray(val)) {
        for (const oId of val) payload.push({ questionId: qId, optionId: oId });
      } else if (val) {
        payload.push({ questionId: qId, optionId: val });
      }
    }

    setSubmitting(true);
    try {
      await api.post(`/api/polls/${poll.id}/responses`, { answers: payload });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(errorMessage(err, "Could not submit response"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] py-10 px-6 overflow-hidden">
      <Spotlight className="-top-40 left-1/4 opacity-60" />
      <div className="mx-auto max-w-2xl relative">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            tone={poll.responseMode === "anonymous" ? "neutral" : "warning"}
          >
            {poll.responseMode}
          </Badge>
          {poll.expiresAt && (
            <Countdown
              expiresAt={poll.expiresAt}
              onExpire={() => setExpired(true)}
            />
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg mt-3">
          {poll.title}
        </h1>
        {poll.description && (
          <p className="text-muted mt-2">{poll.description}</p>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {poll.questions.map((q, qIdx) => (
            <Card key={q.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>
                    <span className="text-muted font-mono mr-2 text-sm">
                      Q{qIdx + 1}
                    </span>
                    {q.prompt}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {q.type === "multiple" && (
                      <Badge tone="neutral">multi-select</Badge>
                    )}
                    {q.isMandatory && <Badge tone="danger">Required</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-2">
                {q.options.map((o) => {
                  const isMulti = q.type === "multiple";
                  const checked = isMulti
                    ? Array.isArray(answers[q.id]) &&
                      (answers[q.id] as string[]).includes(o.id)
                    : answers[q.id] === o.id;
                  return (
                    <label
                      key={o.id}
                      className={
                        "flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors " +
                        (checked
                          ? "bg-[rgb(var(--pb-fg)/0.04)] border-[rgb(var(--pb-fg))]"
                          : "bg-app border-app hover:bg-elev")
                      }
                    >
                      <input
                        type={isMulti ? "checkbox" : "radio"}
                        name={`q-${q.id}`}
                        value={o.id}
                        checked={checked}
                        onChange={() =>
                          isMulti
                            ? toggleMulti(q.id, o.id)
                            : selectSingle(q.id, o.id)
                        }
                        className="accent-[rgb(var(--pb-accent))]"
                      />
                      <span className="text-fg text-sm">{o.label}</span>
                    </label>
                  );
                })}
              </CardBody>
            </Card>
          ))}

          {submitError && (
            <p className="text-sm text-[rgb(var(--pb-danger))]">
              {submitError}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              loading={submitting}
              size="lg"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Submit response
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// @ts-ignore — typed paths come from the auto-generated routeTree.gen.ts
export const Route = createFileRoute("/p/$slug")({
  component: PublicPoll,
});
