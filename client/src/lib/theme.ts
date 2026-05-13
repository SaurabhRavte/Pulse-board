import { createStore } from "./store";

export type Theme = "light" | "dark";

const STORAGE_KEY = "pb-theme";

const readInitial = (): Theme => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore
  }
  // Default to dark
  return "dark";
};

export const themeStore = createStore<Theme>(readInitial());

const apply = (t: Theme) => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", t === "dark");
  }
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    // ignore
  }
};

// Apply once on load
apply(themeStore.get());
themeStore.subscribe(apply);

export const toggleTheme = () => {
  themeStore.set(themeStore.get() === "dark" ? "light" : "dark");
};
