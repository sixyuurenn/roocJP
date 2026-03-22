import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MutedAssistText } from "@/components/muted-assist-text";
import { PageCard } from "@/components/page-card";
import { getEquipmentItemById } from "@/lib/equipment";
import { renderLines } from "@/lib/page-utils";

type EquipmentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EquipmentDetailPage({ params }: EquipmentDetailPageProps) {
  const { id } = await params;
  const item = await getEquipmentItemById(id);

  if (!item) {
    notFound();
  }

  return (
    <>
      <PageCard title={item.nameJp} description={item.itemGroup === "equipment" ? "通常装備" : "アクセサリー"}>
        <MutedAssistText text={item.nameAssistText} className="text-sm leading-6 sm:text-[15px]" />
        <div className="grid gap-5 lg:grid-cols-[80px_minmax(0,1fr)]">
          <div className="mx-auto aspect-square w-20 overflow-hidden rounded-2xl border border-slate-200 bg-white lg:mx-0">
            <Image src={item.imageSrc} alt={item.nameJp} width={160} height={160} className="h-full w-full object-contain" />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 text-sm text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1.5">{item.typeJp}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5">Lv {item.level}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold tracking-wide text-base-accent">類型</p>
                <p className="mt-2 text-sm leading-7 text-slate-800">{item.typeJp}</p>
              </article>

              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold tracking-wide text-base-accent">等級</p>
                <p className="mt-2 text-sm leading-7 text-slate-800">{item.level}</p>
              </article>
            </div>
          </div>
        </div>
      </PageCard>

      <PageCard title="装備属性">
        <div className="space-y-1">{renderLines(item.equipmentAttributesJp)}</div>
      </PageCard>

      {item.visibleEffects.length > 0 && item.effectSectionTitle ? (
        <PageCard title={item.effectSectionTitle}>
          <div className="space-y-4">
            {item.visibleEffects.map((effect) => (
              <article key={effect.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{effect.effectNameJp}</h3>
                  <MutedAssistText text={effect.effectNameAssistText} className="mt-1" />
                </div>
                {effect.activationConditionJp ? (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold tracking-wide text-slate-500">発動条件</p>
                    <div className="mt-2 space-y-1">{renderLines(effect.activationConditionJp)}</div>
                  </div>
                ) : null}
                <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold tracking-wide text-slate-500">効果</p>
                  <div className="mt-2 space-y-1">{renderLines(effect.effectTextJp)}</div>
                </div>
              </article>
            ))}
          </div>
        </PageCard>
      ) : null}

      <PageCard title="一覧へ戻る">
        <Link
          href="/equipment"
          className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-base-accent hover:text-base-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-accent/30"
        >
          装備図鑑へ戻る
        </Link>
      </PageCard>
    </>
  );
}
