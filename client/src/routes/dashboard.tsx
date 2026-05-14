/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Clock,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  ArrowRight,
  Link2,
} from "lucide-react";
import { api, errorMessage } from "../lib/api";
import { Protected } from "../components/protected";
import { Button } from "../components/button";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Badge,
} from "../components/card";
import { Input } from "../components/input";
import { Spinner } from "../components/loader";
import { extractSlug } from "../lib/extract-slug";

interface PollListItem {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "active" | "closed" | "published";
  responseMode: "anonymous" | "authenticated";
  expiresAt: string | null;
  resultsPublished: boolean;
  createdAt: string;
  responseCount: number;
}

function JoinPanel() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const slug = extractSlug(code);
    if (!slug) {
      setError("Paste a valid poll link or code");
      return;
    }
    navigate({ to: "/p/$slug", params: { slug } });
  };

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="h-9 w-9 grid place-items-center rounded-md border"
          style={{
            color: "rgb(var(--pb-cyan))",
            background: "rgb(var(--pb-cyan) / 0.10)",
            borderColor: "rgb(var(--pb-cyan) / 0.35)",
          }}
        >
          <Link2 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-fg tracking-tight">
            Join a poll
          </h3>
          <p className="text-[11px] text-muted">
            Paste a poll link or enter the short code.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="https://pulseboard.app/p/abc123 or abc123"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono text-sm flex-1"
        />
        <Button type="submit" rightIcon={<ArrowRight className="h-4 w-4" />}>
          Open poll
        </Button>
      </form>
      {error && (
        <p className="text-xs text-[rgb(var(--pb-danger))] mt-2">{error}</p>
      )}
    </Card>
  );
}

function DashboardInner() {
  const [polls, setPolls] = useState<PollListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ data: PollListItem[] }>("/api/polls");
        if (!cancelled) setPolls(res.data.data);
      } catch (err) {
        if (!cancelled) setError(errorMessage(err, "Could not load polls"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this poll and all its responses?")) return;
    setBusyId(id);
    try {
      await api.delete(`/api/polls/${id}`);
      setPolls((cur) => (cur ? cur.filter((p) => p.id !== id) : cur));
    } catch (err) {
      alert(errorMessage(err, "Could not delete"));
    } finally {
      setBusyId(null);
    }
  };

  const handleCopyLink = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/p/${slug}`,
      );
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted mb-1.5">
            // dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
            Your polls
          </h1>
        </div>
        <Link to="/polls/new">
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            className="pb-glow-primary"
          >
            New poll
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <JoinPanel />
      </div>

      {polls === null && !error && (
        <div className="grid place-items-center py-20">
          <Spinner className="h-6 w-6" />
        </div>
      )}

      {error && (
        <Card className="p-6 text-sm text-[rgb(var(--pb-danger))]">
          {error}
        </Card>
      )}

      {polls && polls.length === 0 && (
        <Card className="p-12 text-center">
          <h2 className="text-lg font-bold text-fg">No polls yet</h2>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            Create your first poll to share a public link and start collecting
            responses live.
          </p>
          <Link to="/polls/new" className="inline-block mt-5">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Create a poll
            </Button>
          </Link>
        </Card>
      )}

      {polls && polls.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {polls.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge
                    tone={
                      p.status === "active"
                        ? "success"
                        : p.status === "closed"
                          ? "danger"
                          : p.status === "published"
                            ? "neutral"
                            : "warning"
                    }
                  >
                    {p.status}
                  </Badge>
                  <Badge tone="neutral">{p.responseMode}</Badge>
                  {p.resultsPublished && (
                    <Badge tone="neutral">results public</Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-2">{p.title}</CardTitle>
                <p className="text-xs text-muted mt-2 inline-flex items-center gap-1.5">
                  <BarChart3 className="h-3 w-3" />
                  {p.responseCount}{" "}
                  {p.responseCount === 1 ? "response" : "responses"}
                  {p.expiresAt && (
                    <>
                      <span aria-hidden>&middot;</span>
                      <Clock className="h-3 w-3" />
                      <span>
                        expires{" "}
                        {new Date(p.expiresAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </>
                  )}
                </p>
              </CardHeader>
              <CardBody className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Link
                    to="/polls/$pollId/analytics"
                    params={{ pollId: p.id }}
                    className="flex-1"
                  >
                    <Button variant="secondary" className="w-full">
                      Analytics
                    </Button>
                  </Link>
                  <a
                    href={`/p/${p.slug}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <Button
                      variant="outline"
                      aria-label="Open public link"
                      title="Open public link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    aria-label="Copy public link"
                    title="Copy public link"
                    onClick={() => handleCopyLink(p.slug)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    aria-label="Delete poll"
                    title="Delete poll"
                    onClick={() => handleDelete(p.id)}
                    loading={busyId === p.id}
                  >
                    <Trash2 className="h-4 w-4 text-[rgb(var(--pb-danger))]" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  return (
    <Protected>
      <DashboardInner />
    </Protected>
  );
}

// @ts-ignore — typed paths come from the auto-generated routeTree.gen.ts
export const Route = createFileRoute("/dashboard")({ component: Dashboard });
