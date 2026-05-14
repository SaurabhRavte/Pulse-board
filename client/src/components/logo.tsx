type LogoProps = {
  size?: number;
  className?: string;
  showBackground?: boolean;
};

export function Logo({
  size = 24,
  className = "",
  showBackground = false,
}: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PulseBoard logo"
    >
      {showBackground && (
        <rect width="32" height="32" rx="7" fill="rgb(var(--pb-fg))" />
      )}
      <rect
        x="5"
        y="18"
        width="5"
        height="9"
        rx="1.5"
        fill={showBackground ? "rgb(var(--pb-fg-muted))" : "currentColor"}
        opacity={showBackground ? 1 : 0.55}
      />
      <rect
        x="13.5"
        y="8"
        width="5"
        height="19"
        rx="1.5"
        fill={showBackground ? "rgb(var(--pb-lime))" : "rgb(var(--pb-lime))"}
      />
      <rect
        x="22"
        y="13"
        width="5"
        height="14"
        rx="1.5"
        fill={showBackground ? "rgb(var(--pb-bg))" : "currentColor"}
        opacity={showBackground ? 1 : 0.85}
      />
    </svg>
  );
}
