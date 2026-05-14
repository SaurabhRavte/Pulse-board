/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Link2 } from "lucide-react";
import { Protected } from "../components/protected";
import { Button } from "../components/button";
import { Input, Label } from "../components/input";
import { Card } from "../components/card";
import { extractSlug } from "../lib/extract-slug";

function JoinInner() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const slug = extractSlug(code);
    if (!slug) {
      setError("Paste a poll link or enter a valid code (4+ characters).");
      return;
    }
    navigate({ to: "/p/$slug", params: { slug } });
  };

  return (
    <div className="relative min-h-[70vh] grid place-items-center px-6 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-grid-pattern opacity-20"
      />
      <Card className="relative w-full max-w-md p-8 bg-elev">
        <div
          className="h-10 w-10 grid place-items-center rounded-md border"
          style={{
            color: "rgb(var(--pb-lime))",
            background: "rgb(var(--pb-lime) / 0.10)",
            borderColor: "rgb(var(--pb-lime) / 0.35)",
          }}
        >
          <Link2 className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-fg mt-4">
          Join a poll
        </h1>
        <p className="text-sm text-muted mt-2">
          Paste the full poll link or just the short code.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="code">Link or code</Label>
            <Input
              id="code"
              required
              autoFocus
              placeholder="https://pulseboard.app/p/abc123 or just abc123"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm"
            />
            {error && (
              <p className="text-xs text-[rgb(var(--pb-danger))] mt-1.5">
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full pb-glow-primary"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Open poll
          </Button>
        </form>

        <p className="text-xs text-muted text-center mt-6">
          Have your own polls?{" "}
          <Link
            to="/dashboard"
            className="text-fg underline underline-offset-4 hover:text-lime"
          >
            Go to dashboard
          </Link>
        </p>
      </Card>
    </div>
  );
}

function JoinPage() {
  return (
    <Protected>
      <JoinInner />
    </Protected>
  );
}

// @ts-ignore — typed paths come from the auto-generated routeTree.gen.ts
export const Route = createFileRoute("/join")({ component: JoinPage });
