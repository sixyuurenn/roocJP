export type SkillCategoryTab = "basic" | "first" | "second" | "advanced";

export type JobTier = "basic" | "first" | "second" | "advancedSecond";

export type SkillDisplayLevel = "lv1" | "lvMax";

export type SkillLevelView = {
  body: string;
  castTime: string;
  cooldown: string;
  spCost: string;
  globalDelay: string;
};

export type SkillDiffItem = {
  label: string;
  from: string;
  to: string;
};

export type SkillItem = {
  id: string;
  jobId: string;
  jobTier: JobTier;
  name: string;
  icon?: string;
  maxLevel: number;
  sortOrder: number;
  tags: string[];
  levelVariants: {
    lv1: SkillLevelView;
    lvMax: SkillLevelView;
  };
  diffStats: SkillDiffItem[];
};
