import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import {
  type ConceptLookupHit,
  type ConceptLookupResult,
  LOOKUP_LANGUAGES,
  type LookupLanguage,
  type LookupMatchType,
  type LookupMode,
  type LookupStage,
  type RequestedLookupLanguage,
} from "@/lib/concept-lookup-contract";
import { supplementalConcepts } from "@/lib/concept-lookup-supplements";

const CONCEPT_CORE_CSV_PATH = path.join(process.cwd(), "concept_dictionary_core.csv");
const REVERSE_LOOKUP_INDEX_CSV_PATH = path.join(process.cwd(), "reverse_lookup_index_core.csv");

type ConceptCoreCsvRow = {
  concept_id: string;
  category: string;
  subtype: string;
  canonical_ja: string;
  canonical_en: string;
  canonical_zh: string;
  aliases_ja: string;
  aliases_en: string;
  aliases_zh: string;
  source: string;
  source_row: string;
  status: string;
  notes: string;
};

type ReverseLookupIndexCsvRow = {
  lookup_key: string;
  lang: string;
  concept_id: string;
  match_type: string;
  priority: string;
  normalized_key: string;
};

type ConceptRecord = {
  conceptId: string;
  category: string;
  subtype: string;
  canonical: {
    ja: string;
    en: string;
    zh: string;
  };
};

type ReverseLookupRecord = {
  lookupKey: string;
  lang: LookupLanguage;
  conceptId: string;
  matchType: LookupMatchType;
  priority: number;
  normalizedKey: string;
};

type ConceptLookupDataset = {
  conceptsById: Map<string, ConceptRecord>;
  exactIndexByLang: Map<LookupLanguage, Map<string, ReverseLookupRecord[]>>;
  normalizedIndexByLang: Map<LookupLanguage, Map<string, ReverseLookupRecord[]>>;
};

type LookupConceptsOptions = {
  query: string;
  lang?: RequestedLookupLanguage;
  mode?: LookupMode;
  limit?: number;
};

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (inQuotes) {
      if (char === "\"") {
        if (text[index + 1] === "\"") {
          field += "\"";
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }

      continue;
    }

    if (char === "\"") {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    if (char === "\r") {
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (rows.length > 0 && rows[0]?.[0]?.charCodeAt(0) === 0xfeff) {
    rows[0][0] = rows[0][0].slice(1);
  }

  return rows;
}

function toRecords<T extends Record<string, string>>(text: string): T[] {
  const rows = parseCsv(text);

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0] ?? [];
  const records: T[] = [];

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];

    if (!row || row.every((value) => value.trim().length === 0)) {
      continue;
    }

    const record = {} as T;

    for (let columnIndex = 0; columnIndex < headers.length; columnIndex += 1) {
      const key = headers[columnIndex];

      if (!key) {
        continue;
      }

      record[key as keyof T] = (row[columnIndex] ?? "") as T[keyof T];
    }

    records.push(record);
  }

  return records;
}

function normalizeText(value: string) {
  return value.trim();
}

function hasKana(value: string) {
  return /[\u3040-\u30ff]/u.test(value);
}

function isAsciiOnly(value: string) {
  return /^[\x00-\x7f]+$/.test(value);
}

function hasHan(value: string) {
  return /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u.test(value);
}

export function normalizeLookupKey(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[·‐‑–—−]/gu, "-")
    .replace(/[〜～]/gu, "~")
    .replace(/：/gu, ":")
    .replace(/／/gu, "/")
    .replace(/％/gu, "%")
    .replace(/\s+/gu, "")
    .replace(/[^0-9a-z\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+/gu, "");
}

export function resolveLookupLanguages(query: string, lang: RequestedLookupLanguage): LookupLanguage[] {
  if (lang !== "auto") {
    return [lang];
  }

  const normalizedQuery = normalizeText(query);

  if (hasKana(normalizedQuery)) {
    return ["ja"];
  }

  if (isAsciiOnly(normalizedQuery)) {
    return ["en"];
  }

  if (hasHan(normalizedQuery)) {
    return ["ja", "zh"];
  }

  return ["ja", "en", "zh"];
}

function compareLookupHits(left: ConceptLookupHit, right: ConceptLookupHit) {
  const leftStageRank = left.matchStage === "exact" ? 0 : 1;
  const rightStageRank = right.matchStage === "exact" ? 0 : 1;

  if (leftStageRank !== rightStageRank) {
    return leftStageRank - rightStageRank;
  }

  if (left.priority !== right.priority) {
    return right.priority - left.priority;
  }

  return left.conceptId.localeCompare(right.conceptId);
}

function pushIndexRecord(
  map: Map<LookupLanguage, Map<string, ReverseLookupRecord[]>>,
  row: ReverseLookupRecord,
  key: string,
) {
  const langMap = map.get(row.lang) ?? new Map<string, ReverseLookupRecord[]>();
  const records = langMap.get(key) ?? [];
  records.push(row);
  langMap.set(key, records);
  map.set(row.lang, langMap);
}

const loadConceptLookupDataset = cache(async (): Promise<ConceptLookupDataset> => {
  const [conceptCoreText, reverseLookupIndexText] = await Promise.all([
    readFile(CONCEPT_CORE_CSV_PATH, "utf8"),
    readFile(REVERSE_LOOKUP_INDEX_CSV_PATH, "utf8"),
  ]);

  const conceptRows = toRecords<ConceptCoreCsvRow>(conceptCoreText);
  const reverseLookupRows = toRecords<ReverseLookupIndexCsvRow>(reverseLookupIndexText);

  const conceptsById = new Map<string, ConceptRecord>();
  const exactIndexByLang = new Map<LookupLanguage, Map<string, ReverseLookupRecord[]>>();
  const normalizedIndexByLang = new Map<LookupLanguage, Map<string, ReverseLookupRecord[]>>();

  for (const row of conceptRows) {
    if (!row.concept_id) {
      continue;
    }

    conceptsById.set(row.concept_id, {
      conceptId: row.concept_id,
      category: row.category,
      subtype: row.subtype,
      canonical: {
        ja: row.canonical_ja,
        en: row.canonical_en,
        zh: row.canonical_zh,
      },
    });
  }

  for (const concept of supplementalConcepts) {
    conceptsById.set(concept.conceptId, {
      conceptId: concept.conceptId,
      category: concept.category,
      subtype: concept.subtype,
      canonical: concept.canonical,
    });
  }

  for (const row of reverseLookupRows) {
    if (!row.concept_id || !LOOKUP_LANGUAGES.includes(row.lang as LookupLanguage)) {
      continue;
    }

    const record: ReverseLookupRecord = {
      lookupKey: row.lookup_key,
      lang: row.lang as LookupLanguage,
      conceptId: row.concept_id,
      matchType: row.match_type === "alias" ? "alias" : "canonical",
      priority: Number(row.priority) || 0,
      normalizedKey: row.normalized_key,
    };

    pushIndexRecord(exactIndexByLang, record, record.lookupKey);
    pushIndexRecord(normalizedIndexByLang, record, record.normalizedKey);
  }

  for (const concept of supplementalConcepts) {
    for (const lookup of concept.lookups) {
      const record: ReverseLookupRecord = {
        lookupKey: lookup.lookupKey,
        lang: lookup.lang,
        conceptId: concept.conceptId,
        matchType: lookup.matchType ?? "canonical",
        priority: lookup.priority ?? 100,
        normalizedKey: normalizeLookupKey(lookup.lookupKey),
      };

      pushIndexRecord(exactIndexByLang, record, record.lookupKey);
      pushIndexRecord(normalizedIndexByLang, record, record.normalizedKey);
    }
  }

  return {
    conceptsById,
    exactIndexByLang,
    normalizedIndexByLang,
  };
});

function buildLookupHits(
  dataset: ConceptLookupDataset,
  rows: ReverseLookupRecord[],
  matchStage: LookupStage,
) {
  const bestHitByConceptId = new Map<string, ConceptLookupHit>();

  for (const row of rows) {
    const concept = dataset.conceptsById.get(row.conceptId);

    if (!concept) {
      continue;
    }

    const candidate: ConceptLookupHit = {
      conceptId: concept.conceptId,
      category: concept.category,
      subtype: concept.subtype,
      canonical: concept.canonical,
      matchedLang: row.lang,
      matchedKey: row.lookupKey,
      matchStage,
      matchType: row.matchType,
      priority: row.priority,
      normalizedKey: row.normalizedKey,
    };

    const current = bestHitByConceptId.get(candidate.conceptId);

    if (!current || compareLookupHits(candidate, current) < 0) {
      bestHitByConceptId.set(candidate.conceptId, candidate);
    }
  }

  return Array.from(bestHitByConceptId.values()).sort(compareLookupHits);
}

function collectIndexMatches(
  dataset: ConceptLookupDataset,
  langs: LookupLanguage[],
  query: string,
  matchStage: LookupStage,
) {
  const indexByLang = matchStage === "exact" ? dataset.exactIndexByLang : dataset.normalizedIndexByLang;
  const rows: ReverseLookupRecord[] = [];

  for (const lang of langs) {
    const records = indexByLang.get(lang)?.get(query) ?? [];
    rows.push(...records);
  }

  return buildLookupHits(dataset, rows, matchStage);
}

export async function lookupConcepts(options: LookupConceptsOptions): Promise<ConceptLookupResult> {
  const query = normalizeText(options.query);

  if (query.length === 0) {
    throw new Error("query must not be empty");
  }

  const requestedLang = options.lang ?? "auto";
  const mode = options.mode ?? "exact_then_normalized";
  const limit = Number.isFinite(options.limit) ? Math.max(1, Math.floor(options.limit ?? 10)) : 10;
  const resolvedLangs = resolveLookupLanguages(query, requestedLang);
  const dataset = await loadConceptLookupDataset();
  const normalizedQuery = normalizeLookupKey(query);

  let hits = collectIndexMatches(dataset, resolvedLangs, query, "exact");

  if (hits.length === 0 && mode === "exact_then_normalized" && normalizedQuery.length > 0) {
    hits = collectIndexMatches(dataset, resolvedLangs, normalizedQuery, "normalized");
  }

  const limitedHits = hits.slice(0, limit);

  return {
    query,
    normalizedQuery,
    requestedLang,
    resolvedLangs,
    mode,
    hitCount: limitedHits.length,
    hits: limitedHits,
    status: limitedHits.length > 0 ? "ok" : "no_hit",
  };
}
