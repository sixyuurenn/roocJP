import { PageCard } from "@/components/page-card";
import { updateItems } from "@/data/updates";

export default function UpdatesPage() {
  return (
    <PageCard title="更新履歴" description="サイトの変更点を時系列で管理します。">
      <ol className="space-y-3">
        {updateItems.map((item) => (
          <li key={`${item.date}-${item.title}`} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold tracking-wide text-base-accent">{item.date}</p>
            <h3 className="mt-1 text-sm font-semibold text-slate-800">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-700">{item.detail}</p>
          </li>
        ))}
      </ol>
    </PageCard>
  );
}
