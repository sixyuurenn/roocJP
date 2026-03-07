export type JobTier = "first" | "second" | "transcendent-second";

export type JobTrack = "physical" | "magic" | "support" | "general";

export type JobItem = {
  id: string;
  name: string;
  classGroupId: string;
  tier: JobTier;
  role: string;
  feature: string;
  difficulty: "低" | "中" | "高";
  isBeginnerFriendly: boolean;
  description: string;
  track: JobTrack;
};

export const jobItems: JobItem[] = [
  {
    id: "lord-knight",
    name: "ロードナイト",
    classGroupId: "swordman",
    tier: "transcendent-second",
    role: "近接前衛",
    feature: "高耐久と前線維持に優れる物理職。",
    difficulty: "中",
    isBeginnerFriendly: true,
    description: "前線で安定して戦いやすい物理職という想定です。耐久と継戦能力の両方を意識した構成として整理しています。",
    track: "physical",
  },
  {
    id: "paladin",
    name: "パラディン",
    classGroupId: "swordman",
    tier: "transcendent-second",
    role: "防御支援",
    feature: "味方保護と耐久寄りの立ち回りが得意。",
    difficulty: "中",
    isBeginnerFriendly: true,
    description: "防御寄りの支援性能を持つ前衛職という想定です。味方を守りながら安定して戦うタイプとして整理しています。",
    track: "support",
  },
  {
    id: "high-priest",
    name: "ハイプリースト",
    classGroupId: "acolyte",
    tier: "transcendent-second",
    role: "回復支援",
    feature: "回復と補助の安定感が高い支援職。",
    difficulty: "中",
    isBeginnerFriendly: true,
    description: "回復と補助をバランスよく扱う支援職という想定です。ソロよりも支援役としての価値が高い職業です。",
    track: "support",
  },
  {
    id: "champion",
    name: "チャンピオン",
    classGroupId: "acolyte",
    tier: "transcendent-second",
    role: "近接火力",
    feature: "高火力の一撃と機動的な接近戦が特徴。",
    difficulty: "高",
    isBeginnerFriendly: false,
    description: "瞬間火力と近接性能が強みの職業という想定です。火力の出しどころを見極める操作が重要です。",
    track: "physical",
  },
  {
    id: "assassin-cross",
    name: "アサシンクロス",
    classGroupId: "thief",
    tier: "transcendent-second",
    role: "近接火力",
    feature: "手数と瞬間火力を両立しやすい。",
    difficulty: "高",
    isBeginnerFriendly: false,
    description: "高い攻撃性能と回避寄りの立ち回りを想定した職業です。装備や型で使用感が変わりやすい前提です。",
    track: "physical",
  },
  {
    id: "chaser",
    name: "チェイサー",
    classGroupId: "thief",
    tier: "transcendent-second",
    role: "妨害支援",
    feature: "搦め手と補助寄りの運用がしやすい。",
    difficulty: "高",
    isBeginnerFriendly: false,
    description: "直接火力よりも独自性のある補助や妨害が強みの職業として想定しています。判断力が必要なテクニカル職です。",
    track: "support",
  },
  {
    id: "creator",
    name: "クリエイター",
    classGroupId: "merchant",
    tier: "transcendent-second",
    role: "特殊火力",
    feature: "道具や特殊スキルを活かした戦い方が特徴。",
    difficulty: "中",
    isBeginnerFriendly: false,
    description: "商人系の発展職として、独自リソースや特殊スキルを使う職業という想定です。戦い方に個性が出やすい構成です。",
    track: "general",
  },
  {
    id: "whitesmith",
    name: "ホワイトスミス",
    classGroupId: "merchant",
    tier: "transcendent-second",
    role: "近接火力",
    feature: "火力と実用性を兼ね備えた前衛寄り職。",
    difficulty: "中",
    isBeginnerFriendly: true,
    description: "商人系の扱いやすさを残しつつ、前衛火力として戦える職業という想定です。育成と実用性の両立がしやすい枠です。",
    track: "physical",
  },
  {
    id: "high-wizard",
    name: "ハイウィザード",
    classGroupId: "mage",
    tier: "transcendent-second",
    role: "魔法火力",
    feature: "範囲殲滅と高火力魔法が主軸。",
    difficulty: "中",
    isBeginnerFriendly: false,
    description: "魔法職の中核として、広範囲火力と制圧力を持つ職業という想定です。詠唱や位置取りの管理が重要になります。",
    track: "magic",
  },
  {
    id: "professor",
    name: "プロフェッサー",
    classGroupId: "mage",
    tier: "transcendent-second",
    role: "魔法支援",
    feature: "魔法支援と制御に長けた職業。",
    difficulty: "高",
    isBeginnerFriendly: false,
    description: "純火力だけでなく、補助や制御も含めて戦う知的な職業という想定です。支援寄りの魔法職として整理しています。",
    track: "magic",
  },
  {
    id: "sniper",
    name: "スナイパー",
    classGroupId: "archer",
    tier: "transcendent-second",
    role: "遠距離火力",
    feature: "高命中と継続火力に優れる。",
    difficulty: "低",
    isBeginnerFriendly: true,
    description: "遠距離から安定してダメージを出しやすい職業として想定しています。扱いやすさと火力の両立が強みです。",
    track: "physical",
  },
  {
    id: "clown-gypsy",
    name: "クラウン&ジプシー",
    classGroupId: "archer",
    tier: "transcendent-second",
    role: "演奏支援",
    feature: "支援効果や独自スキルで戦況を補助。",
    difficulty: "高",
    isBeginnerFriendly: false,
    description: "演奏系の補助や特殊効果を活かす職業という想定です。単独性能よりも編成との相性が重要なタイプです。",
    track: "support",
  },
  {
    id: "summoner",
    name: "サモナー",
    classGroupId: "doram",
    tier: "second",
    role: "万能",
    feature: "物理・魔法・補助へ分岐しやすい特殊職。",
    difficulty: "中",
    isBeginnerFriendly: true,
    description: "独自系統の職業として、ビルド幅が広く柔軟に育成できる想定です。後でスキルツリーを拡張しやすい基準職として扱います。",
    track: "general",
  },
];

export function getJobById(id: string) {
  return jobItems.find((job) => job.id === id);
}

export function getJobsByClassGroupId(classGroupId: string) {
  return jobItems.filter((job) => job.classGroupId === classGroupId);
}
