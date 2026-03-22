import { readFile } from "node:fs/promises";
import { cache } from "react";
import type { JobTier, SkillDiffItem, SkillItem } from "@/data/skills";

const SUMMONER_SKILL_TSV_PATH = "src/data/skills-tsv/summoner-skills.tsv";

type SummonerSkillTsvRow = {
  id: string;
  job_id: string;
  job_tier: string;
  name: string;
  icon_url: string;
  max_level: string;
  sort_order: string;
  body_lv1: string;
  body_lvmax: string;
  cast_time_lv1: string;
  cast_time_lvmax: string;
  cooldown_lv1: string;
  cooldown_lvmax: string;
  sp_cost_lv1: string;
  sp_cost_lvmax: string;
  global_delay_lv1: string;
  global_delay_lvmax: string;
  tags: string;
  diff_summary: string;
  name_ja: string;
  body_lv1_ja: string;
  body_lvmax_ja: string;
  diff_summary_ja: string;
  source_lang_priority: string;
  translation_status: string;
};

type SkillTsvDirectory = {
  keyHeaders: string[];
  records: Array<SummonerSkillTsvRow & { sourceRow: number }>;
};

function parseTsv(text: string) {
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

    if (char === "\t") {
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

function toTwoHeaderTsvRecords(text: string): SkillTsvDirectory {
  const rows = parseTsv(text);

  if (rows.length < 3) {
    return {
      keyHeaders: [],
      records: [],
    };
  }

  const keyHeaders = rows[1];
  const records: Array<SummonerSkillTsvRow & { sourceRow: number }> = [];

  for (let rowIndex = 2; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];

    if (!row || row.every((value) => value.trim().length === 0)) {
      continue;
    }

    const record = { sourceRow: rowIndex - 2 } as SummonerSkillTsvRow & { sourceRow: number };

    for (let columnIndex = 0; columnIndex < keyHeaders.length; columnIndex += 1) {
      const key = keyHeaders[columnIndex];

      if (!key) {
        continue;
      }

      record[key as keyof SummonerSkillTsvRow] = (row[columnIndex] ?? "") as SummonerSkillTsvRow[keyof SummonerSkillTsvRow];
    }

    records.push(record);
  }

  return {
    keyHeaders,
    records,
  };
}

function normalizeText(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function normalizeOptionalText(value: string) {
  const normalized = normalizeText(value);
  return normalized.length > 0 ? normalized : "";
}

function parseOptionalNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function mapJobTier(value: string): JobTier | null {
  if (value === "t1") {
    return "first";
  }

  if (value === "t2") {
    return "second";
  }

  if (value === "u2") {
    return "advancedSecond";
  }

  return null;
}

function parseTags(value: string) {
  return value
    .split("|")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

function parseDiffSummary(value: string): SkillDiffItem[] {
  return value
    .split("||")
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((part) => {
      const colonIndex = part.indexOf(":") >= 0 ? part.indexOf(":") : part.indexOf("：");
      const label = colonIndex >= 0 ? part.slice(0, colonIndex).trim() : "";
      const body = colonIndex >= 0 ? part.slice(colonIndex + 1).trim() : part;
      const [from, to] = body.split("→").map((item) => item.trim());

      if (!label || !from || !to) {
        return null;
      }

      return { label, from, to };
    })
    .filter((item): item is SkillDiffItem => item !== null);
}

function getPreferredJapaneseText(primary: string, fallback: string) {
  const preferred = normalizeOptionalText(primary);
  return preferred.length > 0 ? preferred : normalizeOptionalText(fallback);
}

function toSkillItem(row: SummonerSkillTsvRow & { sourceRow: number }): SkillItem | null {
  const jobTier = mapJobTier(row.job_tier);

  if (!jobTier) {
    return null;
  }

  const sortOrder = parseOptionalNumber(row.sort_order) ?? row.sourceRow + 1;

  return {
    id: normalizeOptionalText(row.id),
    jobId: normalizeOptionalText(row.job_id),
    jobTier,
    name: getPreferredJapaneseText(row.name_ja, row.name),
    icon: normalizeOptionalText(row.icon_url) || undefined,
    maxLevel: parseOptionalNumber(row.max_level),
    sortOrder,
    tags: parseTags(row.tags),
    levelVariants: {
      lv1: {
        body: getPreferredJapaneseText(row.body_lv1_ja, row.body_lv1),
        castTime: normalizeOptionalText(row.cast_time_lv1),
        cooldown: normalizeOptionalText(row.cooldown_lv1),
        spCost: normalizeOptionalText(row.sp_cost_lv1),
        globalDelay: normalizeOptionalText(row.global_delay_lv1),
      },
      lvMax: {
        body: getPreferredJapaneseText(row.body_lvmax_ja, row.body_lvmax),
        castTime: normalizeOptionalText(row.cast_time_lvmax),
        cooldown: normalizeOptionalText(row.cooldown_lvmax),
        spCost: normalizeOptionalText(row.sp_cost_lvmax),
        globalDelay: normalizeOptionalText(row.global_delay_lvmax),
      },
    },
    diffStats: parseDiffSummary(getPreferredJapaneseText(row.diff_summary_ja, row.diff_summary)),
  };
}

const loadSummonerSkillItems = cache(async (): Promise<SkillItem[] | null> => {
  try {
    const text = await readFile(SUMMONER_SKILL_TSV_PATH, "utf8");
    const { records } = toTwoHeaderTsvRecords(text);
    const items = records
      .filter((row) => row.job_id === "summoner" || row.job_id === "high_summoner")
      .map(toSkillItem)
      .filter((item): item is SkillItem => item !== null)
      .sort((left, right) => {
        const tierOrder = {
          first: 0,
          second: 1,
          advancedSecond: 2,
          basic: 3,
        } satisfies Record<JobTier, number>;

        return (
          tierOrder[left.jobTier] - tierOrder[right.jobTier] ||
          left.sortOrder - right.sortOrder ||
          left.name.localeCompare(right.name, "ja")
        );
      });

    return items.length > 0 ? items : null;
  } catch {
    return null;
  }
});

export async function getSummonerSkillItemsFromTsv() {
  return loadSummonerSkillItems();
}
