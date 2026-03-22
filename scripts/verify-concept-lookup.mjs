import { readFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const conceptCoreCsvPath = path.join(rootDir, "concept_dictionary_core.csv");
const reverseLookupIndexCsvPath = path.join(rootDir, "reverse_lookup_index_core.csv");
const testQueriesCsvPath = path.join(rootDir, "test_queries.csv");

function parseCsv(text) {
  const rows = [];
  let row = [];
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

function toRecords(text) {
  const rows = parseCsv(text);

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0];

  return rows.slice(1).filter((row) => row.some((value) => value.trim().length > 0)).map((row) => {
    const record = {};

    for (let index = 0; index < headers.length; index += 1) {
      const key = headers[index];

      if (!key) {
        continue;
      }

      record[key] = row[index] ?? "";
    }

    return record;
  });
}

function normalizeLookupKey(value) {
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

function hasKana(value) {
  return /[\u3040-\u30ff]/u.test(value);
}

function isAsciiOnly(value) {
  return /^[\x00-\x7f]+$/.test(value);
}

function hasHan(value) {
  return /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u.test(value);
}

function resolveLookupLanguages(query, lang) {
  if (lang !== "auto") {
    return [lang];
  }

  const normalized = query.trim();

  if (hasKana(normalized)) {
    return ["ja"];
  }

  if (isAsciiOnly(normalized)) {
    return ["en"];
  }

  if (hasHan(normalized)) {
    return ["ja", "zh"];
  }

  return ["ja", "en", "zh"];
}

function compareHits(left, right) {
  const leftRank = left.matchStage === "exact" ? 0 : 1;
  const rightRank = right.matchStage === "exact" ? 0 : 1;

  if (leftRank !== rightRank) {
    return leftRank - rightRank;
  }

  if (left.priority !== right.priority) {
    return right.priority - left.priority;
  }

  return left.conceptId.localeCompare(right.conceptId);
}

function buildDataset(coreRows, indexRows) {
  const conceptsById = new Map();
  const exactByLang = new Map();
  const normalizedByLang = new Map();

  for (const row of coreRows) {
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

  for (const row of indexRows) {
    const record = {
      lookupKey: row.lookup_key,
      lang: row.lang,
      conceptId: row.concept_id,
      matchType: row.match_type,
      priority: Number(row.priority) || 0,
      normalizedKey: row.normalized_key,
    };

    const exactMap = exactByLang.get(record.lang) ?? new Map();
    exactMap.set(record.lookupKey, [...(exactMap.get(record.lookupKey) ?? []), record]);
    exactByLang.set(record.lang, exactMap);

    const normalizedMap = normalizedByLang.get(record.lang) ?? new Map();
    normalizedMap.set(record.normalizedKey, [...(normalizedMap.get(record.normalizedKey) ?? []), record]);
    normalizedByLang.set(record.lang, normalizedMap);
  }

  return {
    conceptsById,
    exactByLang,
    normalizedByLang,
  };
}

function collectHits(dataset, langs, key, matchStage) {
  const indexByLang = matchStage === "exact" ? dataset.exactByLang : dataset.normalizedByLang;
  const bestHitByConceptId = new Map();

  for (const lang of langs) {
    const records = indexByLang.get(lang)?.get(key) ?? [];

    for (const record of records) {
      const concept = dataset.conceptsById.get(record.conceptId);

      if (!concept) {
        continue;
      }

      const hit = {
        conceptId: concept.conceptId,
        category: concept.category,
        subtype: concept.subtype,
        canonical: concept.canonical,
        matchedLang: record.lang,
        matchedKey: record.lookupKey,
        matchStage,
        matchType: record.matchType,
        priority: record.priority,
        normalizedKey: record.normalizedKey,
      };

      const current = bestHitByConceptId.get(hit.conceptId);

      if (!current || compareHits(hit, current) < 0) {
        bestHitByConceptId.set(hit.conceptId, hit);
      }
    }
  }

  return [...bestHitByConceptId.values()].sort(compareHits);
}

function lookupConcepts(dataset, { query, lang = "auto", mode = "exact_then_normalized", limit = 10 }) {
  const trimmedQuery = query.trim();
  const resolvedLangs = resolveLookupLanguages(trimmedQuery, lang);
  const normalizedQuery = normalizeLookupKey(trimmedQuery);
  let hits = collectHits(dataset, resolvedLangs, trimmedQuery, "exact");

  if (hits.length === 0 && mode === "exact_then_normalized") {
    hits = collectHits(dataset, resolvedLangs, normalizedQuery, "normalized");
  }

  const limitedHits = hits.slice(0, limit);

  return {
    query: trimmedQuery,
    normalizedQuery,
    requestedLang: lang,
    resolvedLangs,
    hitCount: limitedHits.length,
    hits: limitedHits,
    status: limitedHits.length > 0 ? "ok" : "no_hit",
  };
}

function validateNoDuplicateNormalizedKeys(indexRows) {
  const seen = new Set();

  for (const row of indexRows) {
    const key = `${row.lang}\u0000${row.normalized_key}`;

    if (seen.has(key)) {
      throw new Error(`duplicate normalized key found: ${row.lang} / ${row.normalized_key}`);
    }

    seen.add(key);
  }
}

async function main() {
  const [coreText, indexText, testText] = await Promise.all([
    readFile(conceptCoreCsvPath, "utf8"),
    readFile(reverseLookupIndexCsvPath, "utf8"),
    readFile(testQueriesCsvPath, "utf8"),
  ]);

  const coreRows = toRecords(coreText);
  const indexRows = toRecords(indexText);
  const testRows = toRecords(testText);
  const dataset = buildDataset(coreRows, indexRows);

  validateNoDuplicateNormalizedKeys(indexRows);

  let exactHit = 0;
  let normalizedHit = 0;
  let miss = 0;

  for (const row of testRows) {
    const result = lookupConcepts(dataset, {
      query: row.query,
      lang: row.lang,
      mode: "exact_then_normalized",
      limit: 10,
    });

    if (result.hitCount === 0) {
      miss += 1;
      throw new Error(`miss: ${row.lang} / ${row.query}`);
    }

    const topHit = result.hits[0];

    if (topHit.conceptId !== row.expected_concept_id) {
      throw new Error(
        `unexpected concept: ${row.lang} / ${row.query} -> ${topHit.conceptId} (expected ${row.expected_concept_id})`,
      );
    }

    if (topHit.matchStage === "exact") {
      exactHit += 1;
    } else {
      normalizedHit += 1;
    }
  }

  const smokeCases = [
    {
      name: "auto_han_lookup",
      input: { query: "物理攻擊+ 477~530", lang: "auto", mode: "exact_then_normalized" },
      expectedConceptId: "effect_phrase_patk_477_530",
      expectedStatus: "ok",
    },
    {
      name: "no_hit_lookup",
      input: { query: "unknown effect", lang: "en", mode: "exact_then_normalized" },
      expectedConceptId: null,
      expectedStatus: "no_hit",
    },
  ];

  for (const smokeCase of smokeCases) {
    const result = lookupConcepts(dataset, smokeCase.input);

    if (result.status !== smokeCase.expectedStatus) {
      throw new Error(`smoke case failed: ${smokeCase.name} status=${result.status}`);
    }

    if (smokeCase.expectedConceptId && result.hits[0]?.conceptId !== smokeCase.expectedConceptId) {
      throw new Error(`smoke case failed: ${smokeCase.name} concept=${result.hits[0]?.conceptId}`);
    }
  }

  console.log(
    JSON.stringify({
      coreConcepts: coreRows.length,
      reverseLookupRows: indexRows.length,
      replayQueries: testRows.length,
      exactHit,
      normalizedHit,
      miss,
      smokeCases: smokeCases.length,
      status: "ok",
    }),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
