/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AuthenticateWithRedirectCallback, useUser } from "@clerk/clerk-react";
import { api, errorMessage } from "../lib/api";
import { setSession } from "../lib/auth";
import { FullPageLoader } from "../components/loader";
import { Button } from "../components/button";
import { Card } from "../components/card";

/**
 * Destination after the Google OAuth redirect. Clerk lands the user here
 * with `<AuthenticateWithRedirectCallback />` quietly finalising the session
 * in the background; once `useUser` reports signed-in, we POST to our own
 * /api/auth/clerk-sync to mint a JWT and persist a local session, then push
 * the user to /dashboard.
 */
function SSOCallback() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    let cancelled = false;
    const sync = async () => {
      try {
        const res = await api.post<{
          data: {
            user: { id: string; name: string; email: string };
            accessToken: string;
          };
        }>("/api/auth/clerk-sync", {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          name:
            user.fullName ||
            user.firstName ||
            user.primaryEmailAddress?.emailAddress ||
            "User",
        });
        if (cancelled) return;
        setSession(res.data.data.user, res.data.data.accessToken);
        navigate({ to: "/dashboard", replace: true });
      } catch (err) {
        if (!cancelled) setError(errorMessage(err, "Could not finish sign-in"));
      }
    };
    sync();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, user, navigate]);

  if (error) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-6">
        <Card className="p-10 text-center max-w-md">
          <h1 className="text-xl font-semibold text-fg">
            Sign-in didn't complete
          </h1>
          <p className="text-sm text-muted mt-2">{error}</p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <Link to="/login">
              <Button>Try again</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Back to home</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Renders nothing visually — handles the OAuth URL params on mount */}
      <AuthenticateWithRedirectCallback />
      <FullPageLoader />
    </>
  );
}

// @ts-ignore — typed paths come from the auto-generated routeTree.gen.ts
export const Route = createFileRoute("/sso-callback")({
  component: SSOCallback,
});
