import Link from "next/link";
import { PageCard } from "@/components/page-card";

const sections = [
  { href: "/search", title: "検索", summary: "FAQ・用語・職業を横断して検索できます。" },
  { href: "/jobs", title: "職業一覧", summary: "職業の特徴を比較しやすく表示します。" },
  { href: "/equipment", title: "装備図鑑", summary: "装備情報を部位や条件ごとに整理していきます。" },
  { href: "/cards", title: "カード図鑑", summary: "カード効果や使いどころをまとめて確認できます。" },
  { href: "/glossary", title: "用語集", summary: "初心者向けに基本用語を整理します。" },
  { href: "/faq", title: "FAQ", summary: "よくある質問と回答を確認できます。" },
  { href: "/updates", title: "更新履歴", summary: "追加・変更した内容を時系列で管理します。" },
];

export default function HomePage() {
  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">ROOC Information Site</p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-800 sm:text-3xl">ROOC 情報サイト</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          この土台は、攻略情報や用語、更新差分を見やすくまとめるためのスタート地点です。現在はダミーデータで表示確認できる構成になっています。
        </p>
      </section>

      <PageCard title="主要ページ" description="主要機能と図鑑系コンテンツへの導線をまとめています。">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex min-h-28 flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-base-accent/60 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-accent/30"
            >
              <p className="text-sm font-semibold text-slate-800">{section.title}</p>
              <p className="mt-1 text-xs leading-6 text-slate-600">{section.summary}</p>
              <p className="mt-3 text-xs font-medium text-base-accent transition group-hover:translate-x-0.5">
                ページを見る
              </p>
            </Link>
          ))}
        </div>
      </PageCard>
    </>
  );
}
