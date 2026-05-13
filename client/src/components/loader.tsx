import { cn } from "../lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin h-5 w-5 text-fg", className)}
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

export function FullPageLoader() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <Spinner className="h-6 w-6" />
    </div>
  );
}
