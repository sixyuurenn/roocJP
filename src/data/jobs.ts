export type JobItem = {
  name: string;
  role: string;
  feature: string;
};

export const jobItems: JobItem[] = [
  { name: "ソードマン", role: "近接前衛", feature: "安定した耐久と扱いやすさ。" },
  { name: "アコライト", role: "支援", feature: "回復と補助でパーティを支える。" },
  { name: "マジシャン", role: "魔法火力", feature: "範囲攻撃で多数戦に強い。" },
  { name: "シーフ", role: "近接火力", feature: "高い回避と手数で戦う。" },
  { name: "アーチャー", role: "遠距離火力", feature: "射程を活かした立ち回り。" },
  { name: "マーチャント", role: "汎用", feature: "経済面と戦闘を両立しやすい。" },
];
