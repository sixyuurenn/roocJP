import { PageCard } from "@/components/page-card";

const equipmentGuide = ["装備部位", "装備条件", "装備可能職業", "効果"];

export default function EquipmentPage() {
  return (
    <PageCard title="装備図鑑" description="装備情報の整理に使う土台ページです。">
      <p className="text-sm leading-7 text-slate-700">
        現在は公開前の静的プロトタイプとして、装備データの見せ方と分類方針を確認するための仮置きページです。
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {equipmentGuide.map((item) => (
          <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {item}
          </div>
        ))}
      </div>
    </PageCard>
  );
}
