import type { SkillCategoryTab } from "@/data/skills";

export type SkillTreeNode = {
  skillId: string;
  row: number;
  col: number;
};

export type SkillTree = {
  jobId: string;
  tab: SkillCategoryTab;
  track: "physical" | "magic" | "support" | "general";
  nodes: SkillTreeNode[];
};

export const skillTrees: SkillTree[] = [
  {
    jobId: "summoner",
    tab: "second",
    track: "physical",
    nodes: [
      { skillId: "pick-peck", row: 1, col: 5 },
      { skillId: "taro-damage", row: 2, col: 5 },
    ],
  },
  {
    jobId: "high-summoner",
    tab: "advanced",
    track: "physical",
    nodes: [
      { skillId: "wild-boar-soul", row: 1, col: 3 },
      { skillId: "lunatic-carrot-beat", row: 2, col: 3 },
    ],
  },
];

export function getSkillTreesByJobId(jobId: string) {
  return skillTrees.filter((tree) => tree.jobId === jobId);
}
