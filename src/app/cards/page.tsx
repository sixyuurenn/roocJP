import { PageCard } from "@/components/page-card";

const cardGuide = ["カード名", "装着部位", "効果", "入手方法"];

export default function CardsPage() {
  return (
    <PageCard title="カード図鑑" description="カード情報の整理に使う土台ページです。">
      <p className="text-sm leading-7 text-slate-700">
        現在は公開前の静的プロトタイプとして、掲載項目の粒度と並び順を確認するための仮置きページです。
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
