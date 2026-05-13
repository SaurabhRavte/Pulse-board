import { cn } from "../lib/cn";

export function BackgroundBeams({ className }: { className?: string }) {
  const beams = [
    { left: "8%", delay: "0s", duration: "9s", height: "240px" },
    { left: "22%", delay: "2s", duration: "11s", height: "180px" },
    { left: "44%", delay: "4s", duration: "13s", height: "260px" },
    { left: "62%", delay: "1s", duration: "10s", height: "200px" },
    { left: "78%", delay: "3s", duration: "12s", height: "220px" },
    { left: "92%", delay: "5s", duration: "9s", height: "180px" },
  ];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        "mask-[radial-gradient(60%_50%_at_50%_30%,#000_70%,transparent_100%)]",
        className,
      )}
    >
      {beams.map((b, i) => (
        <span
          key={i}
          className="absolute top-[-20%] w-px"
          style={{
            left: b.left,
            height: b.height,
            background:
              "linear-gradient(to bottom, transparent, rgb(var(--pb-fg) / 0.6), transparent)",
            animation: `pb-beam-y ${b.duration} linear ${b.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
