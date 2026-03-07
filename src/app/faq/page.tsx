import { PageCard } from "@/components/page-card";
import { faqItems } from "@/data/faq";

export default function FaqPage() {
  return (
    <PageCard title="FAQ" description="よくある質問（ダミーデータ）">
      <div className="space-y-3">
        {faqItems.map((item) => (
          <article key={item.q} className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <h3 className="text-sm font-semibold leading-6 text-slate-800">Q. {item.q}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">A. {item.a}</p>
          </article>
        ))}
      </div>
    </PageCard>
  );
}
