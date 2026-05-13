import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  LabelHTMLAttributes,
} from "react";
import { cn } from "../lib/cn";

const fieldClasses = cn(
  "w-full bg-elev text-fg placeholder:text-muted",
  "border border-app rounded-lg px-3.5 py-2.5 text-sm",
  "transition-colors",
  "focus:outline-none focus:ring-2 ring-app focus:border-[rgb(var(--pb-fg))]",
  "disabled:opacity-50 disabled:pointer-events-none",
);

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...rest} className={cn(fieldClasses, className)} />;
}

export function Textarea({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...rest}
      className={cn(fieldClasses, "min-h-22 resize-y", className)}
    />
  );
}

export function Label({
  className,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...rest}
      className={cn("block text-sm font-medium text-fg mb-1.5", className)}
    />
  );
}
