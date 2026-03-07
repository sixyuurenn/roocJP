import { PageCard } from "@/components/page-card";
import { faqItems } from "@/data/faq";

export default function FaqPage() {
  return (
    <PageCard title="FAQ" description="よくある質問（ダミーデータ）">
      <div className="space-y-3">
        {faqItems.map((item) => (
          <article key={item.q} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-800">Q. {item.q}</h3>
            <p className="mt-2 text-sm text-slate-700">A. {item.a}</p>
          </article>
        ))}
      </div>
    </PageCard>
  );
}
