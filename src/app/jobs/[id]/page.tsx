import Link from "next/link";
import { notFound } from "next/navigation";
import { JobSkillList } from "@/components/job-skill-list";
import { PageCard } from "@/components/page-card";
import { getJobById, jobItems } from "@/data/jobs";
import { getSkillsByJobId } from "@/lib/skills";

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return jobItems.map((job) => ({ id: job.id }));
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  const skills = await getSkillsByJobId(job.id);

  return (
    <>
      <PageCard title={job.name} description="職業の基本情報をまとめています。">
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold tracking-wide text-base-accent">特徴</p>
            <p className="mt-2 text-sm leading-7 text-slate-800">{job.feature}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold tracking-wide text-base-accent">役割</p>
            <p className="mt-2 text-sm font-medium text-slate-800">{job.role}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold tracking-wide text-base-accent">難易度</p>
            <p className="mt-2 text-sm font-medium text-slate-800">{job.difficulty}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold tracking-wide text-base-accent">初心者向け</p>
            <p className="mt-2 text-sm font-medium text-slate-800">{job.isBeginnerFriendly ? "はい" : "いいえ"}</p>
          </article>
        </div>
      </PageCard>

      <PageCard title="スキル一覧" description="職層タブと Lv 切替で一覧内だけの比較ができる構成です。">
        <JobSkillList skills={skills} />
      </PageCard>

      <PageCard title="概要と解説" description="操作感や運用イメージを簡単にまとめています。">
        <p className="text-sm leading-7 text-slate-700">{job.description}</p>
        <div className="mt-5">
          <Link
            href="/jobs"
            className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-base-accent hover:text-base-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-accent/30"
          >
            職業一覧へ戻る
          </Link>
        </div>
      </PageCard>
    </>
  );
}
