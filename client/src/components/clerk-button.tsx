import { useEffect, useState } from "react";
import { useSignIn, useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { api, errorMessage } from "../lib/api";
import { setSession } from "../lib/auth";
import { Button } from "./button";

/**
 * Clerk "Continue with Google" button. After Clerk completes the OAuth dance
 * we POST the verified user details to our backend's /api/auth/clerk-sync
 * endpoint, which returns our own JWTs and links the Clerk account to a
 * local user row.
 */
export function ClerkButton({
  mode = "signin",
}: {
  mode?: "signin" | "signup";
}) {
  const navigate = useNavigate();
  const { signIn, isLoaded } = useSignIn();
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Once Clerk reports the user is signed in, sync with our backend.
  useEffect(() => {
    if (!isSignedIn || !user) return;
    let cancelled = false;

    const sync = async () => {
      try {
        // Pull a Clerk session token mostly to confirm session is live.
        await getToken();
        const res = await api.post<{
          success: boolean;
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
        const { user: localUser, accessToken } = res.data.data;
        setSession(localUser, accessToken);
        navigate({ to: "/dashboard" });
      } catch (err) {
        if (!cancelled) setError(errorMessage(err, "Could not link account"));
      }
    };
    sync();
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, user, getToken, navigate]);

  const handleClick = async () => {
    if (!isLoaded || !signIn) return;
    setBusy(true);
    setError(null);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/sso-callback`,
        // Send the user back to /sso-callback after Clerk finishes — that
        // page calls our /api/auth/clerk-sync endpoint and then forwards
        // them to /dashboard once a local session exists.
        redirectUrlComplete: `${window.location.origin}/sso-callback`,
      });
    } catch (err) {
      setError(errorMessage(err, "Could not start Google sign-in"));
      setBusy(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        loading={busy}
        onClick={handleClick}
      >
        <GoogleIcon />
        <span>
          {mode === "signup" ? "Sign up with Google" : "Continue with Google"}
        </span>
      </Button>
      {error && (
        <p className="text-xs text-[rgb(var(--pb-danger))] mt-2">{error}</p>
      )}
    </div>
  );
}

/** Fallback shown when VITE_CLERK_PUBLISHABLE_KEY isn't set. */
export function ClerkButtonDisabled() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full opacity-60 cursor-not-allowed"
      disabled
    >
      <GoogleIcon />
      <span>Google sign-in (not configured)</span>
    </Button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.11A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.45.36-2.11V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
        fill="#EA4335"
      />
    </svg>
  );
}
