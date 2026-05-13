import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        "bg-elev border border-app rounded-2xl",
        "shadow-[0_1px_0_0_rgb(var(--pb-border))]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={cn("p-6 pb-3", className)} />;
}

export function CardBody({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={cn("p-6 pt-3", className)} />;
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight text-fg", className)}
    >
      {children}
    </h3>
  );
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "success" | "danger" | "warning";
}

export function Badge({
  className,
  tone = "neutral",
  children,
  ...rest
}: BadgeProps) {
  const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
    neutral: "bg-elev text-muted border-app",
    success:
      "bg-[rgb(var(--pb-success)/0.12)] text-[rgb(var(--pb-success))] border-[rgb(var(--pb-success)/0.4)]",
    danger:
      "bg-[rgb(var(--pb-danger)/0.12)] text-[rgb(var(--pb-danger))] border-[rgb(var(--pb-danger)/0.4)]",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  };
  return (
    <span
      {...rest}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full",
        "text-[11px] font-medium uppercase tracking-wide border",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
