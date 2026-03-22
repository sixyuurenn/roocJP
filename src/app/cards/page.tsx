import Image from "next/image";
import Link from "next/link";
import { PageCard } from "@/components/page-card";
import { CARD_EQUIP_SLOT_OPTIONS, CARD_RARITY_OPTIONS } from "@/data/cards";
import { getCardDirectoryData, getCardEffectCategories } from "@/lib/cards";
import { getSingleValue, renderLines } from "@/lib/page-utils";

type CardsPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
    rarity?: string | string[];
    equipSlot?: string | string[];
    category?: string | string[];
    categoryMain?: string | string[];
    categorySub?: string | string[];
    showAll?: string | string[];
  }>;
};

function getRarityFilter(value: string) {
  return CARD_RARITY_OPTIONS.includes(value as (typeof CARD_RARITY_OPTIONS)[number]) ? value : "";
}

function getEquipSlotFilter(value: string) {
  return CARD_EQUIP_SLOT_OPTIONS.includes(value as (typeof CARD_EQUIP_SLOT_OPTIONS)[number]) ? value : "";
}

function getRarityBadgeClass(rarity: (typeof CARD_RARITY_OPTIONS)[number]) {
  switch (rarity) {
    case "緑カード":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "青カード":
      return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
    case "紫カード":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-200";
    case "黄カード":
      return "bg-orange-50 text-orange-700 ring-1 ring-orange-300";
    case "赤カード":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  }
}

export default async function CardsPage({ searchParams }: CardsPageProps) {
  const params = (await searchParams) ?? {};
  const keyword = getSingleValue(params.q).trim();
  const rarity = getRarityFilter(getSingleValue(params.rarity));
  const equipSlot = getEquipSlotFilter(getSingleValue(params.equipSlot));
  const requestedCategoryMainKey = getSingleValue(params.categoryMain) || getSingleValue(params.category);
  const requestedCategorySubKey = getSingleValue(params.categorySub);
  const showAll = getSingleValue(params.showAll) === "1";
  const { cards, categories, categoryDetailsByMainKey, isFallback, source } = await getCardDirectoryData({
    keyword,
    rarity,
    equipSlot,
    categoryKey: getSingleValue(params.category),
    categoryMainKey: requestedCategoryMainKey,
    categorySubKey: requestedCategorySubKey,
    showAll,
  });
  const categoryMainKey = categories.some((category) => category.categoryKey === requestedCategoryMainKey)
    ? requestedCategoryMainKey
    : "";
  const subCategories = categoryMainKey ? (categoryDetailsByMainKey[categoryMainKey] ?? []) : [];
  const categorySubKey = subCategories.some((category) => category.categoryKey === requestedCategorySubKey)
    ? requestedCategorySubKey
    : "";

  return (
    <>
      <PageCard title="カード図鑑" description="カード一覧・キーワード検索・絞り込みで確認できます。">
        {isFallback ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Supabase 読み取りに失敗したため、ローカルフォールバックを表示しています。判定: <code>{source}</code>
          </div>
        ) : null}

        <form className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">キーワード検索</span>
            <input
              type="search"
              name="q"
              defaultValue={keyword}
              placeholder="例: ファブル / vit / スタン / 物理ダメージ"
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-strong)] px-4 py-2.5 text-sm outline-none ring-base-accent/20 transition placeholder:text-slate-400 focus:border-base-accent focus:ring"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">レアリティ</span>
            <select
              name="rarity"
              defaultValue={rarity}
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-strong)] px-4 py-2.5 text-sm text-slate-700 outline-none ring-base-accent/20 transition focus:border-base-accent focus:ring"
            >
              <option value="">すべて</option>
              {CARD_RARITY_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">装備部位</span>
            <select
              name="equipSlot"
              defaultValue={equipSlot}
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-strong)] px-4 py-2.5 text-sm text-slate-700 outline-none ring-base-accent/20 transition focus:border-base-accent focus:ring"
            >
              <option value="">すべて</option>
              {CARD_EQUIP_SLOT_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">主分類</span>
            <select
              name="categoryMain"
              defaultValue={categoryMainKey}
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-strong)] px-4 py-2.5 text-sm text-slate-700 outline-none ring-base-accent/20 transition focus:border-base-accent focus:ring"
            >
              <option value="">すべて</option>
              {categories.map((category) => (
                <option key={category.id} value={category.categoryKey}>
                  {category.categoryLabel}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">細分類</span>
            <select
              name="categorySub"
              defaultValue={categorySubKey}
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-strong)] px-4 py-2.5 text-sm text-slate-700 outline-none ring-base-accent/20 transition focus:border-base-accent focus:ring"
            >
              <option value="">すべて</option>
              {subCategories.map((category) => (
                <option key={category.id} value={category.categoryKey}>
                  {category.categoryLabel}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap items-center gap-3 lg:col-span-5">
            <button
              type="submit"
              className="inline-flex rounded-xl bg-base-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-accent/30"
            >
              絞り込む
            </button>
            <Link
              href="/cards"
              className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-base-accent hover:text-base-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-accent/30"
            >
              条件をリセット
            </Link>
            <p className="text-xs text-slate-500">
              {cards.length} 件表示
              {isFallback ? "・ローカルフォールバック表示中" : ""}
            </p>
          </div>
        </form>
      </PageCard>

      <PageCard title="カード一覧" description="名前・効果本文・タグ語を含む検索と、レアリティ / 部位 / 主分類 / 細分類の絞り込みに対応しています。">
        {cards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] p-6 text-center">
            <p className="text-sm font-medium text-slate-700">該当するカードはありません。</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">キーワードや絞り込み条件を変更して再検索してください。</p>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {cards.map((card) => {
              const effectCategories = getCardEffectCategories(card);

              return (
                <article
                  key={card.id}
                  className="overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] shadow-sm"
                >
                  <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[148px_minmax(0,1fr)] lg:items-start">
                    <div className="space-y-3 lg:sticky lg:top-5">
                      <div className="mx-auto w-full max-w-[148px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <Image
                          src={card.artworkUrl ?? card.iconUrl ?? "/images/cards/placeholder.svg"}
                          alt={card.cardNameJp}
                          width={320}
                          height={440}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{card.cardNameJp}</h3>
                          {card.cardNameEn ? <p className="mt-1 text-sm text-slate-500">{card.cardNameEn}</p> : null}
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                            <span className={`rounded-full px-2.5 py-1 font-medium ${getRarityBadgeClass(card.rarity)}`}>
                              {card.rarity}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                              {card.equipSlot}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-semibold tracking-wide text-base-accent">基本効果</p>
                          <div className="mt-2 space-y-1">{renderLines(card.effectTextBase)}</div>
                        </section>
                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-semibold tracking-wide text-base-accent">進化効果</p>
                          <div className="mt-2 space-y-1">{renderLines(card.effectTextEvolution)}</div>
                        </section>
                        <section className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                          <p className="text-xs font-semibold tracking-wide text-base-accent">収納効果</p>
                          <div className="mt-2 space-y-1">{renderLines(card.effectTextStorage)}</div>
                        </section>
                      </div>

                      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.8fr)]">
                        <section className="space-y-2">
                          <p className="text-xs font-semibold tracking-wide text-slate-500">検索タグ</p>
                          <div className="flex flex-wrap gap-2">
                            {card.tags.map((tag) => (
                              <span
                                key={`${card.id}-${tag.id}`}
                                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                              >
                                {tag.tagLabel}
                              </span>
                            ))}
                          </div>
                        </section>

                        <section className="space-y-2">
                          <p className="text-xs font-semibold tracking-wide text-slate-500">効果カテゴリ</p>
                          <div className="flex flex-wrap gap-2">
                            {effectCategories.map((category) => (
                              <span
                                key={`${card.id}-${category.mainKey}-${category.subKey ?? "main"}`}
                                className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700"
                              >
                                {category.subLabel ? `${category.mainLabel} / ${category.subLabel}` : category.mainLabel}
                              </span>
                            ))}
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </PageCard>
    </>
  );
}
