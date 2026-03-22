"use client";

import { type FormEvent, useRef, useState } from "react";
import { type ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { PageCard } from "@/components/page-card";
import type { GlossaryItem } from "@/data/glossary";
import { useConceptLookup } from "@/hooks/use-concept-lookup";
import { GlossaryLookupResults } from "./glossary-lookup-results";
import { GlossaryTable } from "./glossary-table";

type GlossaryPageClientProps = {
  glossaryItems: GlossaryItem[];
  initialQuery: string;
};

function buildSearchUrl(pathname: string, searchParams: ReadonlyURLSearchParams, query: string) {
  const nextSearchParams = new URLSearchParams(searchParams.toString());

  if (query) {
    nextSearchParams.set("q", query);
  } else {
    nextSearchParams.delete("q");
  }

  const nextQueryString = nextSearchParams.toString();

  return nextQueryString ? `${pathname}?${nextQueryString}` : pathname;
}

function getStatusSummary(state: ReturnType<typeof useConceptLookup>["state"], hitCount: number) {
  switch (state) {
    case "idle":
      return "未入力時は通常の用語一覧を見ながら、必要なときだけ意味検索できます。";
    case "loading":
      return "辞書インデックスを照合しています。";
    case "results":
      return `${hitCount} 件の意味候補を表示しています。下に既存の用語一覧も残しています。`;
    case "no_hit":
      return "候補なしでした。検索結果がなくても通常の用語一覧はそのまま見られます。";
    case "error":
      return "検索結果は取得できませんでしたが、通常の用語一覧は利用できます。";
  }
}

export function GlossaryPageClient({ glossaryItems, initialQuery }: GlossaryPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q")?.trim() ?? initialQuery.trim();
  const inputRef = useRef<HTMLInputElement>(null);
  const [requestKey, setRequestKey] = useState(0);
  const { state, result, errorMessage } = useConceptLookup(urlQuery, requestKey);
  const hasActiveQuery = urlQuery.length > 0;

  function syncUrl(nextQuery: string) {
    router.replace(buildSearchUrl(pathname, searchParams, nextQuery), { scroll: false });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = inputRef.current?.value.trim() ?? "";

    if (nextQuery === urlQuery) {
      setRequestKey((current) => current + 1);
    }

    syncUrl(nextQuery);
  }

  function handleClear() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (!urlQuery) {
      return;
    }

    syncUrl("");
  }

  return (
    <>
      <PageCard title="用語集" description="意味で探せる辞書検索と、既存の基本用語一覧をまとめています。">
        <div className="space-y-5">
          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] p-4">
            <p className="text-sm leading-6 text-slate-700">
              日本語 / English / 中文 を自動判定して、同じ概念へ寄せて検索します。PATK・物理攻撃・物理攻擊のような表記差も拾える設計です。
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">意味検索</span>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  key={urlQuery || "empty-query"}
                  ref={inputRef}
                  type="search"
                  defaultValue={urlQuery}
                  placeholder="例: PATK / 物理攻撃 / 物理攻擊 / CRIT +10"
                  className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-strong)] px-4 py-2.5 text-sm outline-none ring-base-accent/20 transition placeholder:text-slate-400 focus:border-base-accent focus:ring"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-xl bg-base-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-accent/30"
                  >
                    検索
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-base-accent hover:text-base-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    クリア
                  </button>
                </div>
              </div>
            </label>

            <div className="flex flex-wrap gap-2 text-xs leading-5">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 ring-1 ring-emerald-200">
                exact: 入力と辞書キーがそのまま一致
              </span>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700 ring-1 ring-amber-200">
                normalized: 空白や表記ゆれを吸収して一致
              </span>
            </div>
          </form>

          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white p-4">
            <p className="text-sm font-semibold text-slate-800">
              {hasActiveQuery ? `検索語: ${urlQuery}` : "検索待ち"}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{getStatusSummary(state, result?.hitCount ?? 0)}</p>
          </div>

          <GlossaryLookupResults activeQuery={urlQuery} state={state} result={result} errorMessage={errorMessage} />
        </div>
      </PageCard>

      <PageCard
        title={hasActiveQuery ? "通常の用語一覧" : "基本用語一覧"}
        description={
          hasActiveQuery
            ? "意味検索とは別に、既存の静的な用語一覧もそのまま参照できます。"
            : "既存の glossary データを一覧で確認できます。"
        }
      >
        <GlossaryTable items={glossaryItems} />
      </PageCard>
    </>
  );
}
