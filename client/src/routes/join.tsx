/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, KeyRound } from "lucide-react";
import { Protected } from "../components/protected";
import { Button } from "../components/button";
import { Input, Label } from "../components/input";
import { Card } from "../components/card";
import { Spotlight } from "../components/spotlight";

function JoinInner() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = code
      .trim()
      .replace(/^\/p\//, "")
      .split("/")[0];
    if (!trimmed || trimmed.length < 4) {
      setError("Enter a valid poll code.");
      return;
    }
    navigate({ to: "/p/$slug", params: { slug: trimmed } });
  };

  return (
    <div className="relative min-h-[70vh] grid place-items-center px-6 overflow-hidden">
      <Spotlight className="-top-40 left-1/4 opacity-60" />
      <Card className="relative w-full max-w-md p-8">
        <div className="h-10 w-10 grid place-items-center rounded-lg bg-app border border-app text-fg mb-4">
          <KeyRound className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          Join a poll
        </h1>
        <p className="text-sm text-muted mt-2">
          Enter the code you received to open the poll.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="code">Poll code</Label>
            <Input
              id="code"
              required
              autoFocus
              placeholder="e.g. nKzA4_x9q-Vp"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono"
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
            className="w-full"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Open poll
          </Button>
        </form>

        <p className="text-xs text-muted text-center mt-6">
          Have your own polls?{" "}
          <Link
            to="/dashboard"
            className="text-fg underline underline-offset-4"
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
export const Route = createFileRoute("/join")({
  component: JoinPage,
});
