import { PageCard } from "@/components/page-card";

const cardGuide = [
  "カード名",
  "装着部位",
  "効果",
  "入手経路",
];

export default function CardsPage() {
  return (
    <PageCard title="カード図鑑" description="カードの効果や用途を整理するための土台ページです。">
      <p className="text-sm leading-7 text-slate-700">
        今後、カード情報を一覧化し、部位や効果で絞り込める形に整えていきます。現在はダミー構成のみ用意しています。
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {cardGuide.map((item) => (
          <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {item}
          </div>
        ))}
      </div>
    </PageCard>
  );
}
