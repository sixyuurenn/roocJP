import { ReactNode } from "react";

export function PageCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold leading-snug text-slate-800 sm:text-xl">{title}</h2>
      {description ? <p className="mt-1.5 text-sm leading-6 text-slate-600">{description}</p> : null}
      <div className="mt-4 sm:mt-5">{children}</div>
    </section>
  );
}
