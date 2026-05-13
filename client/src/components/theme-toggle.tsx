import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { themeStore, toggleTheme, type Theme } from "../lib/theme";
import { cn } from "../lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(themeStore.get());

  useEffect(() => themeStore.subscribe(setTheme), []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "h-9 w-9 grid place-items-center rounded-full",
        "border border-app bg-elev/60 backdrop-blur",
        "transition-colors hover:bg-elev",
        "focus-visible:outline-none focus-visible:ring-2 ring-app",
        className,
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-fg" />
      ) : (
        <Moon className="h-4 w-4 text-fg" />
      )}
    </button>
  );
}
