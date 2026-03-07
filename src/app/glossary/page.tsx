import { PageCard } from "@/components/page-card";
import { glossaryItems } from "@/data/glossary";

export default function GlossaryPage() {
  return (
    <PageCard title="用語集" description="基本用語を簡単に確認できます。">
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full border-collapse bg-white text-sm">
          <thead className="bg-slate-100 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">用語</th>
              <th className="px-4 py-3 font-semibold">説明</th>
            </tr>
          </thead>
          <tbody>
            {glossaryItems.map((item) => (
              <tr key={item.term} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-slate-800">{item.term}</td>
                <td className="px-4 py-3 text-slate-700">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageCard>
  );
}
