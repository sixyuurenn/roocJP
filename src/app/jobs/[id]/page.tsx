import Link from "next/link";
import { notFound } from "next/navigation";
import { PageCard } from "@/components/page-card";
import { getJobById, jobItems } from "@/data/jobs";
import { getSkillsByJobId } from "@/data/skills";
import { getSkillTreesByJobId } from "@/data/skill-trees";

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

  const skills = getSkillsByJobId(job.id);
  const skillTrees = getSkillTreesByJobId(job.id);
  const skillById = new Map(skills.map((skill) => [skill.id, skill]));
  const visibleSkillIds = Array.from(
    new Set(
      skillTrees.flatMap((tree) =>
        tree.nodes.map((node) => node.skillId).filter((skillId) => skillById.has(skillId)),
      ),
    ),
  );
  const visibleSkills = visibleSkillIds
    .map((skillId) => skillById.get(skillId))
    .filter((skill): skill is NonNullable<typeof skill> => Boolean(skill));

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

      {visibleSkills.length > 0 ? (
        <PageCard title="スキル一覧" description="この職業に接続済みのスキルだけを表示しています。">
          <div className="grid gap-3">
            {visibleSkills.map((skill) => (
              <article key={skill.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-slate-800 sm:text-base">{skill.name}</h3>
                    <p className="mt-1 text-xs font-medium text-base-accent">
                      {skill.categoryTab} / {skill.type} / Lv.{skill.maxLevel}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 sm:text-right">
                    <span>属性: {skill.element}</span>
                    <span>詠唱: {skill.castTime}</span>
                    <span>CT: {skill.cooldown}</span>
                    <span>SP: {skill.spCost}</span>
                    <span className="col-span-2">ディレイ: {skill.globalDelay}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-700">{skill.description}</p>
                {skill.notes ? <p className="mt-2 text-xs leading-6 text-slate-500">補足: {skill.notes}</p> : null}
              </article>
            ))}
          </div>
        </PageCard>
      ) : null}

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
