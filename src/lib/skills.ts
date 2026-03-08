import type { JobTier, SkillDiffItem, SkillItem } from "@/data/skills";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SkillTagRow = {
  tag: string | null;
  sort_order: number | null;
};

type SkillDiffStatRow = {
  label: string | null;
  from_value: string | null;
  to_value: string | null;
  sort_order: number | null;
};

type SkillRow = {
  id: string;
  job_id: string | null;
  job_tier: JobTier | null;
  name: string | null;
  icon_url: string | null;
  max_level: number | null;
  body_lv1: string | null;
  body_lvmax: string | null;
  cast_time_lv1: string | null;
  cast_time_lvmax: string | null;
  cooldown_lv1: string | null;
  cooldown_lvmax: string | null;
  sp_cost_lv1: string | null;
  sp_cost_lvmax: string | null;
  global_delay_lv1: string | null;
  global_delay_lvmax: string | null;
  sort_order: number | null;
  skill_tags?: SkillTagRow[] | null;
  skill_diff_stats?: SkillDiffStatRow[] | null;
};

function isJobTier(value: string | null): value is JobTier {
  return value === "basic" || value === "first" || value === "second" || value === "advancedSecond";
}

function toSkillDiffItem(row: SkillDiffStatRow): SkillDiffItem | null {
  if (!row.label || row.from_value === null || row.to_value === null) {
    return null;
  }

  return {
    label: row.label,
    from: row.from_value,
    to: row.to_value,
  };
}

function toSkillItem(row: SkillRow): SkillItem | null {
  if (
    !row.job_id ||
    !isJobTier(row.job_tier) ||
    !row.name ||
    row.max_level === null ||
    row.body_lv1 === null ||
    row.body_lvmax === null ||
    row.cast_time_lv1 === null ||
    row.cast_time_lvmax === null ||
    row.cooldown_lv1 === null ||
    row.cooldown_lvmax === null ||
    row.sp_cost_lv1 === null ||
    row.sp_cost_lvmax === null ||
    row.global_delay_lv1 === null ||
    row.global_delay_lvmax === null
  ) {
    return null;
  }

  const tags = (row.skill_tags ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((item) => item.tag)
    .filter((item): item is string => typeof item === "string" && item.length > 0);

  const diffStats = (row.skill_diff_stats ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(toSkillDiffItem)
    .filter((item): item is SkillDiffItem => item !== null);

  return {
    id: row.id,
    jobId: row.job_id,
    jobTier: row.job_tier,
    name: row.name,
    icon: row.icon_url ?? undefined,
    maxLevel: row.max_level,
    sortOrder: row.sort_order ?? 0,
    tags,
    levelVariants: {
      lv1: {
        body: row.body_lv1,
        castTime: row.cast_time_lv1,
        cooldown: row.cooldown_lv1,
        spCost: row.sp_cost_lv1,
        globalDelay: row.global_delay_lv1,
      },
      lvMax: {
        body: row.body_lvmax,
        castTime: row.cast_time_lvmax,
        cooldown: row.cooldown_lvmax,
        spCost: row.sp_cost_lvmax,
        globalDelay: row.global_delay_lvmax,
      },
    },
    diffStats,
  };
}

export async function getSkillsByJobId(jobId: string): Promise<SkillItem[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("skills")
    .select(
      "id, job_id, job_tier, name, icon_url, max_level, body_lv1, body_lvmax, cast_time_lv1, cast_time_lvmax, cooldown_lv1, cooldown_lvmax, sp_cost_lv1, sp_cost_lvmax, global_delay_lv1, global_delay_lvmax, sort_order, skill_tags(tag, sort_order), skill_diff_stats(label, from_value, to_value, sort_order)",
    )
    .eq("job_id", jobId)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => toSkillItem(row as SkillRow)).filter((item): item is SkillItem => item !== null);
}
