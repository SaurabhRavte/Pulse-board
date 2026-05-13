import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine conditional class names and resolve conflicting Tailwind classes.
 * Used by every component in the app.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
