import Link from "next/link";
import { PageCard } from "@/components/page-card";

export default function JobNotFound() {
  return (
    <PageCard title="職業が見つかりません" description="指定された ID に対応する職業データがありません。">
      <p className="text-sm leading-7 text-slate-700">
        一覧ページから選び直すか、URL に誤りがないか確認してください。
      </p>
      <div className="mt-5">
        <Link
          href="/jobs"
          className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-base-accent hover:text-base-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-accent/30"
        >
          職業一覧へ戻る
        </Link>
      </div>
    </PageCard>
  );
}
