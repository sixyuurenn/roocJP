import Image from "next/image";
import Link from "next/link";
import { PageCard } from "@/components/page-card";
import {
  EQUIPMENT_EQUIP_SLOT_OPTIONS,
  EQUIPMENT_GENRE_BUCKET_ITEMS,
  EQUIPMENT_JOB_TAG_ITEMS,
  type EquipmentTagItem,
} from "@/data/equipment";
import { getEquipmentDirectoryData } from "@/lib/equipment";
import { getSingleValue, renderLines } from "@/lib/page-utils";

type EquipmentPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
    equipSlot?: string | string[];
    genreBucket?: string | string[];
    minLevel?: string | string[];
    jobTag?: string | string[];
  }>;
};

function getEquipSlotFilter(value: string) {
  return EQUIPMENT_EQUIP_SLOT_OPTIONS.includes(value as (typeof EQUIPMENT_EQUIP_SLOT_OPTIONS)[number]) ? value : "";
}

function getGenreBucketFilter(value: string) {
  return EQUIPMENT_GENRE_BUCKET_ITEMS.some((item) => item.value === value) ? value : "";
}

function getJobTagFilter(value: string) {
  return EQUIPMENT_JOB_TAG_ITEMS.some((item) => item.value === value) ? value : "";
}

function getGenreBucketLabel(value: string) {
  return EQUIPMENT_GENRE_BUCKET_ITEMS.find((item) => item.value === value)?.label ?? value;
}

function getJobTags(tags: EquipmentTagItem[]) {
  return tags.filter((tag) => tag.tagGroup === "job");
}

function getDetailTags(tags: EquipmentTagItem[]) {
  return tags.filter((tag) => tag.tagGroup !== "job");
}

export default async function EquipmentPage({ searchParams }: EquipmentPageProps) {
  const params = (await searchParams) ?? {};
  const keyword = getSingleValue(params.q).trim();
  const equipSlot = getEquipSlotFilter(getSingleValue(params.equipSlot));
  const genreBucket = getGenreBucketFilter(getSingleValue(params.genreBucket));
  const minLevel = getSingleValue(params.minLevel);
  const jobTag = getJobTagFilter(getSingleValue(params.jobTag));
  const { items, isFallback, source } = await getEquipmentDirectoryData({
    keyword,
    equipSlot,
    genreBucket,
    minLevel,
    jobTag,
  });

  return (
    <>
      <PageCard title="装備図鑑" description="装備名・部位・Lv・カードスロット・装備ステータス・ジャンル効果を整理して確認できます。">
        {isFallback ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Supabase 読み取りに失敗したため、ローカルフォールバックを表示しています。判定: <code>{source}</code>
          </div>
        ) : null}

        <form className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">装備名検索</span>
            <input
              type="search"
              name="q"
              defaultValue={keyword}
              placeholder="例: 曙光のマント / ブローチ / Agi"
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-strong)] px-4 py-2.5 text-sm outline-none ring-base-accent/20 transition placeholder:text-slate-400 focus:border-base-accent focus:ring"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">装備部位</span>
            <select
              name="equipSlot"
              defaultValue={equipSlot}
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-strong)] px-4 py-2.5 text-sm text-slate-700 outline-none ring-base-accent/20 transition focus:border-base-accent focus:ring"
            >
              <option value="">すべて</option>
              {EQUIPMENT_EQUIP_SLOT_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">ジャンルバケット</span>
            <select
              name="genreBucket"
              defaultValue={genreBucket}
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-strong)] px-4 py-2.5 text-sm text-slate-700 outline-none ring-base-accent/20 transition focus:border-base-accent focus:ring"
            >
              <option value="">すべて</option>
              {EQUIPMENT_GENRE_BUCKET_ITEMS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Lv 下限</span>
            <input
              type="number"
              name="minLevel"
              min="1"
              defaultValue={minLevel}
              placeholder="70"
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-strong)] px-4 py-2.5 text-sm outline-none ring-base-accent/20 transition placeholder:text-slate-400 focus:border-base-accent focus:ring"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">対象職業</span>
            <select
              name="jobTag"
              defaultValue={jobTag}
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-strong)] px-4 py-2.5 text-sm text-slate-700 outline-none ring-base-accent/20 transition focus:border-base-accent focus:ring"
            >
              <option value="">すべて</option>
              {EQUIPMENT_JOB_TAG_ITEMS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
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
              href="/equipment"
              className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-base-accent hover:text-base-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-accent/30"
            >
              条件をリセット
            </Link>
            <p className="text-xs text-slate-500">
              {items.length} 件表示
              {isFallback ? "・ローカルフォールバック表示中" : ""}
            </p>
          </div>
        </form>
      </PageCard>

      <PageCard title="装備一覧" description="装備ステータス本体のみを表示し、ジャンル効果は長文テキストのまま確認できる構成です。">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] p-6 text-center">
            <p className="text-sm font-medium text-slate-700">該当する装備はありません。</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">キーワードや絞り込み条件を変更して再検索してください。</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] p-4 shadow-sm sm:p-5"
              >
                <div className="grid gap-5 lg:grid-cols-[148px_minmax(0,1fr)]">
                  <div className="space-y-3">
                    <div className="mx-auto w-full max-w-[148px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <Image
                        src={item.artworkUrl ?? item.iconUrl ?? "/images/equipment/placeholder.svg"}
                        alt={item.itemNameJpDisplay}
                        width={320}
                        height={440}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{item.itemNameJpDisplay}</h3>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1">{item.equipSlot}</span>
                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">{getGenreBucketLabel(item.genreBucket)}</span>
                        {getJobTags(item.tags).map((tag) => (
                          <span key={`${item.id}-${tag.id}`} className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                            {tag.tagLabel}
                          </span>
                        ))}
                        <span className="rounded-full bg-slate-100 px-2.5 py-1">Lv {item.level}</span>
                        {item.cardSlots !== null ? (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1">カードスロット {item.cardSlots}</span>
                        ) : null}
                        {item.battlePower !== null ? (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1">戦闘力 {item.battlePower}</span>
                        ) : null}
                        {item.equipmentScore !== null && item.equipmentScore > 0 ? (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1">装備評価 {item.equipmentScore}</span>
                        ) : null}
                      </div>
                    </div>

                    <div className={`grid gap-4 ${item.genres.length > 0 ? "xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" : ""}`}>
                      <section className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold tracking-wide text-base-accent">装備ステータス</p>
                        <div className="mt-2 space-y-1">{renderLines(item.statusTextCore)}</div>
                      </section>

                      {item.genres.length > 0 ? (
                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                          <details>
                            <summary className="cursor-pointer list-none text-xs font-semibold tracking-wide text-base-accent marker:hidden">
                              ジャンル効果を開く
                            </summary>
                            <div className="mt-3 space-y-4">
                              {item.genres.map((genre) => (
                                <article key={`${item.id}-${genre.id}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                  <h4 className="text-sm font-semibold text-slate-800">{genre.genreNameJp}</h4>
                                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                                      <p className="text-xs font-semibold tracking-wide text-slate-500">ジャンル属性</p>
                                      <div className="mt-2 space-y-1">{renderLines(genre.genreAttributeText)}</div>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                                      <p className="text-xs font-semibold tracking-wide text-slate-500">セット効果</p>
                                      <div className="mt-2 space-y-1">{renderLines(genre.genreSetEffectText)}</div>
                                    </div>
                                  </div>
                                </article>
                              ))}
                            </div>
                          </details>
                        </section>
                      ) : null}
                    </div>

                    <section className="space-y-2">
                      <p className="text-xs font-semibold tracking-wide text-slate-500">検索タグ</p>
                      <div className="flex flex-wrap gap-2">
                        {getDetailTags(item.tags).map((tag) => (
                          <span
                            key={`${item.id}-${tag.id}`}
                            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                          >
                            {tag.tagLabel}
                          </span>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </PageCard>
    </>
  );
}
