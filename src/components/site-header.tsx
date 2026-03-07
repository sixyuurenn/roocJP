import Link from "next/link";
import { navItems } from "@/data/dummy";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="text-sm font-bold tracking-wide text-base-accent sm:text-base">
          RO コンパニオン
        </Link>
        <nav className="flex flex-wrap gap-2 text-xs sm:text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-slate-700 transition hover:border-base-accent hover:text-base-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
