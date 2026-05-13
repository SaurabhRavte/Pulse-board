import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface CountdownProps {
  expiresAt: string;
  onExpire?: () => void;
}

const pad = (n: number) => n.toString().padStart(2, "0");

const computeRemaining = (target: number) => {
  const diff = target - Date.now();
  if (diff <= 0) return { expired: true, d: 0, h: 0, m: 0, s: 0 };
  const totalSeconds = Math.floor(diff / 1000);
  return {
    expired: false,
    d: Math.floor(totalSeconds / 86400),
    h: Math.floor((totalSeconds % 86400) / 3600),
    m: Math.floor((totalSeconds % 3600) / 60),
    s: totalSeconds % 60,
  };
};

export function Countdown({ expiresAt, onExpire }: CountdownProps) {
  const target = new Date(expiresAt).getTime();
  const [t, setT] = useState(() => computeRemaining(target));

  useEffect(() => {
    if (t.expired) return;
    const id = setInterval(() => {
      const next = computeRemaining(target);
      setT(next);
      if (next.expired) {
        clearInterval(id);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target, t.expired, onExpire]);

  if (t.expired) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgb(var(--pb-danger)/0.4)] bg-[rgb(var(--pb-danger)/0.08)] text-[rgb(var(--pb-danger))] text-xs">
        <AlertTriangle className="h-3.5 w-3.5" />
        This poll has expired
      </div>
    );
  }

  const urgent = t.d === 0 && t.h === 0 && t.m < 5;

  return (
    <div
      className={
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono " +
        (urgent
          ? "border-[rgb(var(--pb-danger)/0.4)] bg-[rgb(var(--pb-danger)/0.08)] text-[rgb(var(--pb-danger))]"
          : "border-app bg-elev text-fg")
      }
    >
      <Clock className="h-3.5 w-3.5" />
      <span>
        {t.d > 0 && <>{t.d}d </>}
        {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
      </span>
      <span className="text-muted normal-case font-sans">left</span>
    </div>
  );
}
