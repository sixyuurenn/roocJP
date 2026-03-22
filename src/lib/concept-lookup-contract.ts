export const LOOKUP_LANGUAGES = ["ja", "en", "zh"] as const;
export const LOOKUP_MODES = ["exact_only", "exact_then_normalized"] as const;

export type LookupLanguage = (typeof LOOKUP_LANGUAGES)[number];
export type RequestedLookupLanguage = LookupLanguage | "auto";
export type LookupMode = (typeof LOOKUP_MODES)[number];
export type LookupStage = "exact" | "normalized";
export type LookupMatchType = "canonical" | "alias";

export type ConceptLookupHit = {
  conceptId: string;
  category: string;
  subtype: string;
  canonical: {
    ja: string;
    en: string;
    zh: string;
  };
  matchedLang: LookupLanguage;
  matchedKey: string;
  matchStage: LookupStage;
  matchType: LookupMatchType;
  priority: number;
  normalizedKey: string;
};

export type ConceptLookupResult = {
  query: string;
  normalizedQuery: string;
  requestedLang: RequestedLookupLanguage;
  resolvedLangs: LookupLanguage[];
  mode: LookupMode;
  hitCount: number;
  hits: ConceptLookupHit[];
  status: "ok" | "no_hit";
};

export function isRequestedLookupLanguage(value: string): value is RequestedLookupLanguage {
  return value === "auto" || LOOKUP_LANGUAGES.includes(value as LookupLanguage);
}

export function isLookupMode(value: string): value is LookupMode {
  return LOOKUP_MODES.includes(value as LookupMode);
}
