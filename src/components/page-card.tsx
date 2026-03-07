import { ReactNode } from "react";

export function PageCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-800 sm:text-xl">{title}</h2>
      {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
