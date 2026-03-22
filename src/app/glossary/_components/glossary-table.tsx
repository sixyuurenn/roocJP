import type { GlossaryItem } from "@/data/glossary";

type GlossaryTableProps = {
  items: GlossaryItem[];
};

export function GlossaryTable({ items }: GlossaryTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-[36rem] w-full border-collapse bg-white text-sm">
        <thead className="bg-slate-100 text-left text-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold">用語</th>
            <th className="px-4 py-3 font-semibold">説明</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.term} className="border-t border-slate-200">
              <td className="px-4 py-3 font-medium text-slate-800">{item.term}</td>
              <td className="px-4 py-3 leading-6 text-slate-700">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
