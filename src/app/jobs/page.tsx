import Link from "next/link";
import { PageCard } from "@/components/page-card";
import { jobItems } from "@/data/jobs";

export default function JobsPage() {
  return (
    <PageCard title="職業一覧" description="主要職業の特徴と役割をダミーデータで表示しています。">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {jobItems.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-base-accent/60 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-accent/30 sm:min-h-36"
          >
            <h3 className="text-sm font-semibold leading-6 text-slate-800">{job.name}</h3>
            <p className="mt-1 text-xs text-base-accent">{job.role}</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{job.feature}</p>
            <p className="mt-3 text-xs font-medium text-base-accent transition group-hover:translate-x-0.5">
              詳細を見る
            </p>
          </Link>
        ))}
      </div>
    </PageCard>
  );
}
