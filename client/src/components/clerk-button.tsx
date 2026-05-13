import { useEffect, useState } from "react";
import { useSignIn, useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { api, errorMessage } from "../lib/api";
import { setSession } from "../lib/auth";

const baseClasses =
  "group relative w-full inline-flex items-center justify-center gap-3 h-12 rounded-xl bg-white text-[#1f1f1f] border border-[#dadce0] font-medium text-sm shadow-sm hover:shadow-md hover:bg-[#f8fafc] active:scale-[0.99] transition-all disabled:opacity-60 disabled:pointer-events-none";

function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
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

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-[#5f6368]"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

  useEffect(() => {
    if (!isSignedIn || !user) return;
    let cancelled = false;
    const sync = async () => {
      try {
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
        const next = sessionStorage.getItem("pb-login-next");
        sessionStorage.removeItem("pb-login-next");
        navigate({
          to:
            next && next.startsWith("/")
              ? (next as "/dashboard")
              : "/dashboard",
          replace: true,
        });
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
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      if (next && next.startsWith("/")) {
        sessionStorage.setItem("pb-login-next", next);
      } else {
        sessionStorage.removeItem("pb-login-next");
      }
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/sso-callback`,
      });
    } catch (err) {
      setError(errorMessage(err, "Could not start Google sign-in"));
      setBusy(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className={baseClasses}
      >
        <span className="grid place-items-center h-7 w-7 rounded-md bg-white">
          {busy ? <Spinner /> : <GoogleIcon />}
        </span>
        <span className="h-5 w-px bg-[#dadce0]" />
        <span className="tracking-tight">
          {busy
            ? "Redirecting to Google..."
            : mode === "signup"
              ? "Sign up with Google"
              : "Continue with Google"}
        </span>
      </button>
      {error && (
        <p className="text-xs text-[rgb(var(--pb-danger))] mt-2 text-center">
          {error}
        </p>
      )}
    </div>
  );
}

export function ClerkButtonDisabled() {
  return (
    <button
      type="button"
      disabled
      className={baseClasses + " opacity-60 cursor-not-allowed"}
    >
      <span className="grid place-items-center h-7 w-7 rounded-md bg-white">
        <GoogleIcon />
      </span>
      <span className="h-5 w-px bg-[#dadce0]" />
      <span className="tracking-tight text-[#5f6368]">
        Google sign-in (not configured)
      </span>
    </button>
  );
}
