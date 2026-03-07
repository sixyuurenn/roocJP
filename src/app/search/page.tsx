"use client";

import { useMemo, useState } from "react";
import { PageCard } from "@/components/page-card";
import { faqItems } from "@/data/faq";
import { glossaryItems } from "@/data/glossary";
import { jobItems } from "@/data/jobs";

type SearchItem = {
  type: "FAQ" | "用語" | "職業";
  title: string;
  text: string;
};

const sourceItems: SearchItem[] = [
  ...faqItems.map((item) => ({ type: "FAQ" as const, title: item.q, text: item.a })),
  ...glossaryItems.map((item) => ({ type: "用語" as const, title: item.term, text: item.description })),
  ...jobItems.map((item) => ({ type: "職業" as const, title: item.name, text: `${item.role} / ${item.feature}` })),
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return sourceItems;
    }
    return sourceItems.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <PageCard title="検索" description="FAQ・用語集・職業一覧を横断検索できます。">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">キーワード</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例: ASPD / 回復 / ソードマン"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none ring-base-accent/20 transition focus:ring"
        />
      </label>

      <p className="mt-3 text-xs text-slate-500">{results.length} 件ヒット</p>

      <div className="mt-3 space-y-2">
        {results.map((item) => (
          <article key={`${item.type}-${item.title}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-base-accent">{item.type}</p>
            <h3 className="mt-1 text-sm font-semibold text-slate-800">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-700">{item.text}</p>
          </article>
        ))}
      </div>
    </PageCard>
  );
}
