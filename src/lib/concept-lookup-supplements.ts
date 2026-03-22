import type {
  LookupLanguage,
  LookupMatchType,
} from "@/lib/concept-lookup-contract";

type SupplementalConcept = {
  conceptId: string;
  category: string;
  subtype: string;
  canonical: {
    ja: string;
    en: string;
    zh: string;
  };
  lookups: Array<{
    lookupKey: string;
    lang: LookupLanguage;
    matchType?: LookupMatchType;
    priority?: number;
  }>;
};

export const supplementalConcepts: SupplementalConcept[] = [
  {
    conceptId: "glossary_patk",
    category: "glossary_term",
    subtype: "combat_stat",
    canonical: {
      ja: "物理攻撃",
      en: "PATK",
      zh: "物理攻擊",
    },
    lookups: [
      {
        lookupKey: "PATK",
        lang: "en",
      },
      {
        lookupKey: "物理攻撃",
        lang: "ja",
      },
      {
        lookupKey: "物理攻擊",
        lang: "zh",
      },
    ],
  },
];
