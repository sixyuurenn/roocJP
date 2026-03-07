export type SkillCategoryTab = "basic" | "first" | "second" | "advanced";

export type SkillType = "物理" | "魔法" | "補助" | "設置" | "特殊";

export type SkillElement =
  | "無属性"
  | "火"
  | "水"
  | "風"
  | "地"
  | "聖"
  | "闇"
  | "念"
  | "毒"
  | "不死";

export type SkillItem = {
  id: string;
  jobId: string;
  name: string;
  categoryTab: SkillCategoryTab;
  maxLevel: number;
  type: SkillType;
  element: SkillElement;
  description: string;
  castTime: string;
  cooldown: string;
  spCost: string;
  globalDelay: string;
  notes?: string;
};

export const skillItems: SkillItem[] = [
  {
    id: "pick-peck",
    jobId: "summoner",
    name: "ピッキつつき",
    categoryTab: "second",
    maxLevel: 10,
    type: "物理",
    element: "無属性",
    description: "単体を対象に連続で攻撃する物理スキルです。サモナー物理系の主力候補として扱いやすい構成です。",
    castTime: "なし",
    cooldown: "短い",
    spCost: "低め",
    globalDelay: "短い",
  },
  {
    id: "taro-damage",
    jobId: "summoner",
    name: "タロウのダメージ",
    categoryTab: "second",
    maxLevel: 10,
    type: "物理",
    element: "無属性",
    description: "対象に安定したダメージを与えるスキルです。単体向けの回しに組み込みやすいのが特徴です。",
    castTime: "なし",
    cooldown: "短い",
    spCost: "中",
    globalDelay: "短い",
  },
  {
    id: "wild-boar-soul",
    jobId: "summoner",
    name: "野ブタの魂",
    categoryTab: "advanced",
    maxLevel: 10,
    type: "物理",
    element: "無属性",
    description: "物理寄りの上位スキル群へ繋がる中心スキルです。高レベルで次段の火力スキル解放条件になりやすい想定です。",
    castTime: "なし",
    cooldown: "中",
    spCost: "中",
    globalDelay: "ASPD影響",
  },
  {
    id: "lunatic-carrot-beat",
    jobId: "summoner",
    name: "ルナティックキャロット強攻撃",
    categoryTab: "advanced",
    maxLevel: 10,
    type: "物理",
    element: "無属性",
    description: "5メートル範囲内の敵に複数回攻撃し、追加効果を持つ物理スキルです。召喚時ダメージもある主力候補です。",
    castTime: "なし",
    cooldown: "7.0s",
    spCost: "14",
    globalDelay: "1.0s",
    notes: "画像例をもとにした仮データです。",
  },
];

export function getSkillsByJobId(jobId: string) {
  return skillItems.filter((skill) => skill.jobId === jobId);
}
