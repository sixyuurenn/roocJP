"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageCard } from "@/components/page-card";
import { faqItems } from "@/data/faq";
import { glossaryItems } from "@/data/glossary";
import { jobItems } from "@/data/jobs";

type SearchCategory = "すべて" | "FAQ" | "用語集" | "職業";

type SearchItem = {
  type: Exclude<SearchCategory, "すべて">;
  title: string;
  text: string;
  href?: string;
  searchText: string;
};

const categories: SearchCategory[] = ["すべて", "FAQ", "用語集", "職業"];

function normalizeSearchText(value: string) {
  return value.normalize("NFKC").toLowerCase().trim().replace(/\s+/g, " ");
}

const sourceItems: SearchItem[] = [
  ...faqItems.map((item) => ({
    type: "FAQ" as const,
    title: item.q,
    text: item.a,
    searchText: normalizeSearchText(`${item.q} ${item.a}`),
  })),
  ...glossaryItems.map((item) => ({
    type: "用語集" as const,
    title: item.term,
    text: item.description,
    searchText: normalizeSearchText(`${item.term} ${item.description}`),
  })),
  ...jobItems.map((item) => ({
    type: "職業" as const,
    title: item.name,
    text: `${item.role} / ${item.feature}`,
    href: `/jobs/${item.id}`,
    searchText: normalizeSearchText(`${item.name} ${item.role} ${item.feature} ${item.description}`),
  })),
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>("すべて");

  const filteredItems = useMemo(() => {
    const normalized = normalizeSearchText(query);

    return sourceItems.filter((item) => {
      const matchesCategory = selectedCategory === "すべて" || item.type === selectedCategory;
      const matchesQuery = normalized.length === 0 || item.searchText.includes(normalized);

      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  const groupedItems = useMemo(
    () => ({
      FAQ: filteredItems.filter((item) => item.type === "FAQ"),
      用語集: filteredItems.filter((item) => item.type === "用語集"),
      職業: filteredItems.filter((item) => item.type === "職業"),
    }),
    [filteredItems],
  );

  const hasQuery = query.trim().length > 0;
  const visibleCategories =
    selectedCategory === "すべて"
      ? (["FAQ", "用語集", "職業"] as const)
      : ([selectedCategory] as const);

  return (
    <PageCard title="検索" description="FAQ・用語集・職業一覧をカテゴリ別に検索できます。">
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">キーワード</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例: ASPD / 回復 / ロードナイト"
            className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-strong)] px-4 py-2.5 text-sm outline-none ring-base-accent/20 transition placeholder:text-slate-400 focus:border-base-accent focus:ring"
          />
        </label>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">カテゴリ</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "border-base-accent bg-base-accent text-white"
                      : "border-[var(--color-border-soft)] bg-[var(--color-surface-strong)] text-slate-700 hover:border-base-accent hover:text-base-accent"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          {hasQuery ? `検索結果 ${filteredItems.length} 件` : `表示中 ${filteredItems.length} 件`}
        </p>

        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] p-5 text-center">
            <p className="text-sm font-medium text-slate-700">該当するデータはありません。</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              キーワードやカテゴリを変更して、もう一度検索してください。
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {visibleCategories.map((category) => {
              const items = groupedItems[category];

              if (items.length === 0) {
                return null;
              }

              return (
                <section key={category} className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-semibold text-slate-800">{category}</h3>
                    <p className="text-xs text-slate-500">{items.length} 件</p>
                  </div>

                  <div className="space-y-2">
                    {items.map((item) => {
                      const content = (
                        <>
                          <p className="text-xs font-semibold text-base-accent">{item.type}</p>
                          <h4 className="mt-1 text-sm font-semibold leading-6 text-slate-800">{item.title}</h4>
                          <p className="mt-1 text-sm leading-7 text-slate-700">{item.text}</p>
                          {item.href ? (
                            <p className="mt-3 text-xs font-medium text-base-accent">職業詳細を見る</p>
                          ) : null}
                        </>
                      );

                      if (item.href) {
                        return (
                          <Link
                            key={`${item.type}-${item.title}`}
                            href={item.href}
                            className="block rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] p-3 transition hover:border-base-accent/60 hover:bg-[var(--color-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-accent/30 sm:p-4"
                          >
                            {content}
                          </Link>
                        );
                      }

                      return (
                        <article
                          key={`${item.type}-${item.title}`}
                          className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] p-3 sm:p-4"
                        >
                          {content}
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </PageCard>
  );
}
