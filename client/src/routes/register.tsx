/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import { api, errorMessage } from "../lib/api";
import { setSession } from "../lib/auth";
import { Button } from "../components/button";
import { Input, Label } from "../components/input";
import { AuthLayout } from "../components/auth-layout";
import { ClerkButton, ClerkButtonDisabled } from "../components/clerk-button";

const CLERK_ENABLED = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/api/auth/register", { name, email, password });
      const res = await api.post<{
        data: {
          user: { id: string; name: string; email: string };
          accessToken: string;
        };
      }>("/api/auth/login", { email, password });
      setSession(res.data.data.user, res.data.data.accessToken);
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      navigate({
        to:
          next && next.startsWith("/") ? (next as "/dashboard") : "/dashboard",
        replace: true,
      });
    } catch (err) {
      setError(errorMessage(err, "Could not create your account"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="PulseBoard"
      title="Get started"
      subtitle="Build live polls in seconds. Share a link, collect responses anonymously or authenticated, then publish the results."
      footer={
        <>
          By continuing you agree to our{" "}
          <Link to="/" className="underline underline-offset-4 hover:text-fg">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/" className="underline underline-offset-4 hover:text-fg">
            Privacy Policy
          </Link>
          .
        </>
      }
    >
      <div className="space-y-3">
        {CLERK_ENABLED ? (
          <ClerkButton mode="signup" />
        ) : (
          <ClerkButtonDisabled />
        )}
        <p className="text-xs text-muted text-center">
          No credit card required to start.
        </p>
      </div>

      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-[rgb(var(--pb-border))]" />
        <span className="text-[10px] uppercase tracking-widest text-muted">
          or with email
        </span>
        <div className="h-px flex-1 bg-[rgb(var(--pb-border))]" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            required
            minLength={2}
            placeholder="Saurabh Ravte"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 chars · 1 uppercase · 1 digit"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-[rgb(var(--pb-danger))]">{error}</p>
        )}

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          Create account
        </Button>
      </form>

      <p className="text-sm text-muted text-center mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-fg font-medium underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

// @ts-ignore — typed paths come from the auto-generated routeTree.gen.ts
export const Route = createFileRoute("/register")({
  component: RegisterPage,
});
