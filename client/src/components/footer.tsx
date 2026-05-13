import { Github, Twitter, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-app mt-24 bg-app">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <p className="text-sm text-muted inline-flex items-center gap-1.5 flex-wrap justify-center">
            Made with{" "}
            <Heart className="h-3.5 w-3.5 text-[rgb(var(--pb-danger))] fill-[rgb(var(--pb-danger))]" />{" "}
            by <span className="font-medium text-fg">Saurabh Ravte</span>
          </p>

          <p className="text-xs text-muted mt-1">
            © 2026 PulseBoard. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/SaurabhRavte"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="h-9 w-9 grid place-items-center rounded-full border border-app hover:bg-elev transition-colors"
          >
            <Github className="h-4 w-4 text-fg" />
          </a>

          <a
            href="https://x.com/iamsaurabhr"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Twitter / X"
            className="h-9 w-9 grid place-items-center rounded-full border border-app hover:bg-elev transition-colors"
          >
            <Twitter className="h-4 w-4 text-fg" />
          </a>
        </div>
      </div>
    </footer>
  );
}
