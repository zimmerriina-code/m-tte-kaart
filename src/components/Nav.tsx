import { Link } from "@tanstack/react-router";
import { ThoughtLogo } from "./ThoughtLogo";
import { useState } from "react";

export function Nav() {
  const [open, setOpen] = useState(false);
  const linkClass = "hover:text-navy transition-colors";
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <ThoughtLogo className="h-7 w-7 text-violet-deep" />
          <span className="font-serif text-lg font-semibold tracking-tight text-navy">
            Otsuse kaart
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
          <Link to="/kuidas-see-toimib" className={linkClass} activeProps={{ className: "text-navy" }}>
            Kuidas see toimib?
          </Link>
          <Link to="/abi" className={linkClass} activeProps={{ className: "text-navy" }}>
            Abi
          </Link>
          <Link to="/privaatsus" className={linkClass} activeProps={{ className: "text-navy" }}>
            Privaatsus
          </Link>
        </nav>

        <button
          aria-label="Menüü"
          className="sm:hidden rounded-md p-2 text-muted-foreground hover:text-navy"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-border/60 bg-background">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3 text-sm">
            <Link to="/kuidas-see-toimib" className="py-2.5 text-foreground" onClick={() => setOpen(false)}>Kuidas see toimib?</Link>
            <Link to="/abi" className="py-2.5 text-foreground" onClick={() => setOpen(false)}>Abi</Link>
            <Link to="/privaatsus" className="py-2.5 text-foreground" onClick={() => setOpen(false)}>Privaatsus</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
