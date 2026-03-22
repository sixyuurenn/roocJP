import Image from "next/image";
import Link from "next/link";
import { MutedAssistText } from "@/components/muted-assist-text";
import { PageCard } from "@/components/page-card";
import { getEquipmentDirectoryData, type EquipmentItem } from "@/lib/equipment";
import { renderLines } from "@/lib/page-utils";

export const dynamic = "force-dynamic";

const EQUIPMENT_LIST_HIDDEN_ATTRIBUTE_LINES = new Set([
  "凶兆が残り、ステータスが不安定になっている。神域属性を有効化すると、神域武装の真の力を解放できる。",
]);

function renderAttributePreview(item: EquipmentItem) {
  const lines = item.equipmentAttributesJp
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !EQUIPMENT_LIST_HIDDEN_ATTRIBUTE_LINES.has(line))
    .slice(0, 3)
    .join("\n");
  return renderLines(lines);
}

function EquipmentSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: EquipmentItem[];
}) {
  return (
    <PageCard title={title} description={description}>
      {items.length === 0 ? (
        <p className="text-sm leading-7 text-slate-600">該当する装備はありません。</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/equipment/${item.id}`}
              className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] p-4 shadow-sm transition hover:border-base-accent/40 hover:shadow-md"
            >
              <div className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)]">
                <div className="aspect-square w-24 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <Image src={item.imageSrc} alt={item.nameJp} width={192} height={192} className="h-full w-full object-contain" />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{item.nameJp}</h3>
                    <MutedAssistText text={item.nameAssistText} truncate className="mt-1 pr-2" />
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">{item.typeJp}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">Lv {item.level}</span>
                      {item.visibleEffects.length > 0 && item.effectSectionTitle ? (
                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">
                          {item.effectSectionTitle} {item.visibleEffects.length}件
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold tracking-wide text-base-accent">装備属性</p>
                    <div className="mt-2 space-y-1">{renderAttributePreview(item)}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageCard>
  );
}

export default async function EquipmentPage() {
  const { equipmentItems, accessoryItems } = await getEquipmentDirectoryData();

  return (
    <>
      <PageCard title="装備図鑑">
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1.5">通常装備 {equipmentItems.length}件</span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5">アクセサリー {accessoryItems.length}件</span>
        </div>
      </PageCard>

      <EquipmentSection
        title="通常装備"
        description="装備属性と流派効果を確認できます。"
        items={equipmentItems}
      />

      <EquipmentSection
        title="アクセサリー"
        description="装備属性とセット属性を確認できます。"
        items={accessoryItems}
      />
    </>
  );
}
