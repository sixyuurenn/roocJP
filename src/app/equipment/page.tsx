import { PageCard } from "@/components/page-card";

const equipmentGuide = [
  "装備名",
  "部位",
  "装備可能職",
  "効果",
];

export default function EquipmentPage() {
  return (
    <PageCard title="装備図鑑" description="装備情報を整理するための土台ページです。">
      <p className="text-sm leading-7 text-slate-700">
        今後、装備情報を部位や職業、条件ごとに整理し、必要な装備を探しやすい形にしていきます。現在はダミー構成のみ用意しています。
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
