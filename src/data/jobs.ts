export type JobItem = {
  id: string;
  name: string;
  role: string;
  feature: string;
  difficulty: "低" | "中" | "高";
  isBeginnerFriendly: boolean;
  description: string;
};

export const jobItems: JobItem[] = [
  {
    id: "swordsman",
    name: "ソードマン",
    role: "近接前衛",
    feature: "安定した耐久と扱いやすさ。",
    difficulty: "低",
    isBeginnerFriendly: true,
    description:
      "前に出て戦いやすい基本職です。HP と耐久を活かして立ち回りやすく、近接職の入門として扱いやすい構成です。",
  },
  {
    id: "acolyte",
    name: "アコライト",
    role: "支援",
    feature: "回復と補助でパーティを支える。",
    difficulty: "中",
    isBeginnerFriendly: true,
    description:
      "ヒールや補助スキルを軸に味方を支える職業です。ソロでも動けますが、支援の優先順位を覚えるほど活躍しやすくなります。",
  },
  {
    id: "magician",
    name: "マジシャン",
    role: "魔法火力",
    feature: "範囲攻撃で多数戦に強い。",
    difficulty: "中",
    isBeginnerFriendly: false,
    description:
      "魔法による高火力が魅力です。詠唱や位置取りを意識する必要があり、慣れると広い場面で火力役として動けます。",
  },
  {
    id: "thief",
    name: "シーフ",
    role: "近接火力",
    feature: "高い回避と手数で戦う。",
    difficulty: "中",
    isBeginnerFriendly: false,
    description:
      "回避性能と手数を活かして戦う職業です。装備やステータスの方向性で使用感が変わりやすく、育成方針の見極めが重要です。",
  },
  {
    id: "archer",
    name: "アーチャー",
    role: "遠距離火力",
    feature: "射程を活かした立ち回り。",
    difficulty: "低",
    isBeginnerFriendly: true,
    description:
      "遠距離から安定して攻撃できるため、被弾を抑えやすい職業です。基本操作が分かりやすく、狩りのテンポも作りやすいです。",
  },
  {
    id: "merchant",
    name: "マーチャント",
    role: "汎用",
    feature: "経済面と戦闘を両立しやすい。",
    difficulty: "中",
    isBeginnerFriendly: true,
    description:
      "所持量や露店系の特色があり、戦闘以外の利便性も持つ職業です。金策と育成を並行しやすいのが強みです。",
  },
];

export function getJobById(id: string) {
  return jobItems.find((job) => job.id === id);
}
