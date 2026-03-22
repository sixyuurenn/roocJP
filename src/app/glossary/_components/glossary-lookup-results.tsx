import type {
  ConceptLookupHit,
  ConceptLookupResult,
  LookupLanguage,
  LookupStage,
} from "@/lib/concept-lookup-contract";
import type { ConceptLookupUiState } from "@/hooks/use-concept-lookup";

type GlossaryLookupResultsProps = {
  activeQuery: string;
  state: ConceptLookupUiState;
  result: ConceptLookupResult | null;
  errorMessage: string | null;
};

const languageLabels: Record<LookupLanguage, string> = {
  ja: "日本語",
  en: "English",
  zh: "中文",
};

const matchStageLabels: Record<LookupStage, string> = {
  exact: "exact",
  normalized: "normalized",
};

function getMatchStageClass(matchStage: LookupStage) {
  return matchStage === "exact"
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
    : "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
}

function getCanonicalTerm(hit: ConceptLookupHit) {
  return hit.canonical[hit.matchedLang] || hit.canonical.ja || hit.canonical.en || hit.canonical.zh;
}

function getCanonicalSummary(hit: ConceptLookupHit) {
  return [
    hit.canonical.ja ? `ja: ${hit.canonical.ja}` : null,
    hit.canonical.en ? `en: ${hit.canonical.en}` : null,
    hit.canonical.zh ? `zh: ${hit.canonical.zh}` : null,
  ]
    .filter((value): value is string => Boolean(value))
    .join(" / ");
}

function StateMessage({
  title,
  description,
  accentClass = "text-slate-700",
  detail,
}: {
  title: string;
  description: string;
  accentClass?: string;
  detail?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] p-5">
      <p className={`text-sm font-semibold ${accentClass}`}>{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      {detail ? <p className="mt-2 text-xs leading-5 text-slate-500">開発メモ: {detail}</p> : null}
    </div>
  );
}

export function GlossaryLookupResults({
  activeQuery,
  state,
  result,
  errorMessage,
}: GlossaryLookupResultsProps) {
  if (state === "idle") {
    return (
      <StateMessage
        title="意味検索はまだ実行されていません"
        description="PATK / 物理攻撃 / 物理攻擊 のように、日本語・英語・中国語をまたいで同じ概念を探せます。"
      />
    );
  }

  if (state === "loading") {
    return (
      <StateMessage
        title={`「${activeQuery}」を辞書で照合しています`}
        description="exact 一致を先に確認し、必要なら normalized 一致まで自動で広げます。"
        accentClass="text-base-accent"
      />
    );
  }

  if (state === "error") {
    return (
      <StateMessage
        title="検索結果を取得できませんでした"
        description="時間をおいて再試行してください。画面はそのまま使えます。"
        accentClass="text-rose-700"
        detail={errorMessage}
      />
    );
  }

  if (state === "no_hit" || !result || result.hits.length === 0) {
    return (
      <StateMessage
        title="候補なし"
        description={`「${activeQuery}」に一致する概念は見つかりませんでした。別表記や英語表記でも試せます。`}
        accentClass="text-amber-700"
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] p-4">
        <p className="text-sm font-semibold text-slate-800">
          「{result.query}」の検索結果 {result.hitCount} 件
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          lang=auto resolved: {result.resolvedLangs.map((lang) => languageLabels[lang]).join(" / ")}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-[70rem] w-full border-collapse bg-white text-sm">
          <thead className="bg-slate-100 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">concept_id</th>
              <th className="px-4 py-3 font-semibold">canonical term</th>
              <th className="px-4 py-3 font-semibold">category</th>
              <th className="px-4 py-3 font-semibold">matched term</th>
              <th className="px-4 py-3 font-semibold">matched_by</th>
              <th className="px-4 py-3 font-semibold">language</th>
              <th className="px-4 py-3 font-semibold">priority</th>
            </tr>
          </thead>
          <tbody>
            {result.hits.map((hit) => (
              <tr key={`${hit.conceptId}-${hit.matchedLang}-${hit.matchStage}`} className="border-t border-slate-200">
                <td className="px-4 py-3 align-top">
                  <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">{hit.conceptId}</code>
                </td>
                <td className="px-4 py-3 align-top">
                  <p className="font-medium text-slate-800">{getCanonicalTerm(hit)}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{getCanonicalSummary(hit)}</p>
                </td>
                <td className="px-4 py-3 align-top text-slate-700">
                  <p>{hit.category}</p>
                  {hit.subtype ? <p className="mt-1 text-xs text-slate-500">{hit.subtype}</p> : null}
                </td>
                <td className="px-4 py-3 align-top">
                  <p className="font-medium text-slate-800">{hit.matchedKey}</p>
                  <p className="mt-1 text-xs text-slate-500">{hit.matchType}</p>
                </td>
                <td className="px-4 py-3 align-top">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getMatchStageClass(hit.matchStage)}`}
                  >
                    {matchStageLabels[hit.matchStage]}
                  </span>
                </td>
                <td className="px-4 py-3 align-top text-slate-700">{languageLabels[hit.matchedLang]}</td>
                <td className="px-4 py-3 align-top text-slate-700">{hit.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
