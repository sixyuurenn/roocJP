import Link from "next/link";
import { navItems } from "@/data/dummy";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          href="/"
          className="text-sm font-bold tracking-[0.08em] text-base-accent transition hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-accent/30 sm:text-base"
        >
          RO コンパニオン
        </Link>
        <nav className="flex flex-wrap gap-2 text-xs sm:justify-end sm:text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-slate-700 shadow-sm transition hover:border-base-accent hover:bg-slate-50 hover:text-base-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-accent/30"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
