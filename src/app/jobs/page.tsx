import { PageCard } from "@/components/page-card";
import { jobItems } from "@/data/jobs";

export default function JobsPage() {
  return (
    <PageCard title="職業一覧" description="主要職業の役割と特徴をダミーデータで表示しています。">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {jobItems.map((job) => (
          <article key={job.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-800">{job.name}</h3>
            <p className="mt-1 text-xs text-base-accent">{job.role}</p>
            <p className="mt-2 text-sm text-slate-700">{job.feature}</p>
          </article>
        ))}
      </div>
    </PageCard>
  );
}
