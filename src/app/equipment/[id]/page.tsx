import Image from "next/image";
import Link from "next/link";
import { PageCard } from "@/components/page-card";
import { EQUIPMENT_GENRE_BUCKET_ITEMS, type EquipmentTagItem } from "@/data/equipment";
import { getEquipmentDetailData } from "@/lib/equipment";
import { renderLines } from "@/lib/page-utils";

type EquipmentDetailPageProps = {
  params: Promise<{ id: string }>;
};

function getGenreBucketLabel(value: string) {
  return EQUIPMENT_GENRE_BUCKET_ITEMS.find((item) => item.value === value)?.label ?? value;
}

function getJobTags(tags: EquipmentTagItem[]) {
  return tags.filter((tag) => tag.tagGroup === "job");
}

function getDetailTags(tags: EquipmentTagItem[]) {
  return tags.filter((tag) => tag.tagGroup !== "job");
}

export default async function EquipmentDetailPage({ params }: EquipmentDetailPageProps) {
  const { id } = await params;
  const { item, isFallback, source } = await getEquipmentDetailData(id);

  if (!item) {
    return (
      <PageCard title="装備詳細" description="指定された装備データを表示します。">
        <div className="rounded-xl border border-dashed border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] p-6 text-center">
          <p className="text-base font-semibold text-slate-800">装備が見つかりません</p>
          <Link
            href="/equipment"
            className="mt-4 inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-base-accent hover:text-base-accent"
          >
            一覧に戻る
          </Link>
        </div>
      </PageCard>
    );
  }

  return (
    <PageCard title="装備詳細" description="装備の基本情報・ジャンル効果・タグを確認できます。">
      {isFallback ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Supabase 読み取りに失敗したため、ローカルフォールバックを表示しています。判定: <code>{source}</code>
        </div>
      ) : null}

      <article className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] p-4 shadow-sm sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)]">
          <div className="space-y-3">
            <div className="mx-auto w-full max-w-[180px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <Image
                src={item.iconUrl ?? "/images/equipment/placeholder.svg"}
                alt={item.itemNameJpDisplay}
                width={320}
                height={320}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-4">
            <header>
              <h1 className="text-xl font-semibold text-slate-900">{item.itemNameJpDisplay}</h1>
              {item.itemNameEn ? <p className="mt-1 text-sm text-slate-500">{item.itemNameEn}</p> : null}
            </header>

            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-2.5 py-1">{item.equipSlot}</span>
              <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">{getGenreBucketLabel(item.genreBucket)}</span>
              {getJobTags(item.tags).map((tag) => (
                <span key={`${item.id}-${tag.id}`} className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  {tag.tagLabel}
                </span>
              ))}
              <span className="rounded-full bg-slate-100 px-2.5 py-1">Lv {item.level}</span>
              {item.battlePower !== null ? <span className="rounded-full bg-slate-100 px-2.5 py-1">戦闘力 {item.battlePower}</span> : null}
              {item.cardSlots !== null ? <span className="rounded-full bg-slate-100 px-2.5 py-1">カードスロット {item.cardSlots}</span> : null}
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold tracking-wide text-base-accent">装備ステータス</p>
              <div className="mt-2 space-y-1">{renderLines(item.statusTextCore)}</div>
            </section>

            {item.genres.length > 0 ? (
              <section className="rounded-xl border border-slate-200 bg-white p-4">
                <details>
                  <summary className="cursor-pointer list-none text-xs font-semibold tracking-wide text-base-accent marker:hidden">
                    紐づくジャンルを開く
                  </summary>
                  <div className="mt-3 space-y-4">
                    {item.genres.map((genre) => (
                      <article key={`${item.id}-${genre.id}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <h2 className="text-sm font-semibold text-slate-800">{genre.genreNameJp}</h2>
                        <div className="mt-2 grid gap-3 md:grid-cols-2">
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

      <div className="mt-6 text-center">
        <Link
          href="/equipment"
          className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-base-accent hover:text-base-accent"
        >
          装備図鑑に戻る
        </Link>
      </div>
    </PageCard>
  );
}
