export const CARD_RARITY_OPTIONS = ["緑カード", "青カード", "紫カード", "黄カード", "赤カード"] as const;

export const CARD_EQUIP_SLOT_OPTIONS = [
  "メインウェポン",
  "サブウェポン",
  "防具",
  "肩にかける物",
  "靴",
  "アクセサリー",
  "頭装備",
  "顔飾り",
  "口飾り",
  "背中装備",
  "衣装",
] as const;

export const CARD_LEVEL_BAND_OPTIONS = [
  { label: "Lv1-Lv20", sortOrder: 1 },
  { label: "Lv21-Lv40", sortOrder: 2 },
  { label: "Lv41-Lv60", sortOrder: 3 },
  { label: "Lv61-Lv80", sortOrder: 4 },
  { label: "Lv81-Lv100", sortOrder: 5 },
  { label: "ファッション", sortOrder: 6 },
  { label: "パペット＆幻影", sortOrder: 7 },
] as const;

export type CardRarity = (typeof CARD_RARITY_OPTIONS)[number];
export type CardEquipSlot = (typeof CARD_EQUIP_SLOT_OPTIONS)[number];
export type CardStatus = "published" | "draft" | "archived";
export type CardEffectCategoryMainKey =
  | "status"
  | "element"
  | "race"
  | "size"
  | "penalty"
  | "skill"
  | "other"
  | "special_effect";

export type CardEffectCategorySubItem = {
  key: string;
  label: string;
  sortOrder: number;
};

export type CardLevelBand = {
  label: string;
  sortOrder: number;
};

export type CardTagItem = {
  id: number;
  tagKey: string;
  tagLabel: string;
  tagGroup: string;
  sortOrder: number;
};

export type CardCategoryItem = {
  id: number;
  categoryKey: string;
  categoryLabel: string;
  sortOrder: number;
  parentCategoryId: number | null;
  parentCategoryKey: string | null;
  parentCategoryLabel: string | null;
  parentSortOrder: number | null;
};

export type CardItem = {
  id: string;
  cardNameJp: string;
  cardNameEn: string | null;
  rarity: CardRarity;
  equipSlot: CardEquipSlot;
  levelBand: CardLevelBand;
  cardType: string;
  iconUrl: string | null;
  artworkUrl: string | null;
  sortOrder: number;
  status: CardStatus;
  effectTextBase: string;
  // TODO: When evolution effects need structured filtering, split this into stage-based records such as lv5/lv10/lv15.
  effectTextEvolution: string | null;
  effectTextStorage: string | null;
  searchText: string;
  tags: CardTagItem[];
  categories: CardCategoryItem[];
};

export const cardCategoryItems: CardCategoryItem[] = [
  {
    id: 1,
    categoryKey: "status",
    categoryLabel: "ステータス",
    sortOrder: 10,
    parentCategoryId: null,
    parentCategoryKey: null,
    parentCategoryLabel: null,
    parentSortOrder: null,
  },
  {
    id: 2,
    categoryKey: "element",
    categoryLabel: "属性",
    sortOrder: 20,
    parentCategoryId: null,
    parentCategoryKey: null,
    parentCategoryLabel: null,
    parentSortOrder: null,
  },
  {
    id: 3,
    categoryKey: "race",
    categoryLabel: "種族",
    sortOrder: 30,
    parentCategoryId: null,
    parentCategoryKey: null,
    parentCategoryLabel: null,
    parentSortOrder: null,
  },
  {
    id: 4,
    categoryKey: "size",
    categoryLabel: "サイズ",
    sortOrder: 40,
    parentCategoryId: null,
    parentCategoryKey: null,
    parentCategoryLabel: null,
    parentSortOrder: null,
  },
  {
    id: 5,
    categoryKey: "penalty",
    categoryLabel: "ペナルティ",
    sortOrder: 50,
    parentCategoryId: null,
    parentCategoryKey: null,
    parentCategoryLabel: null,
    parentSortOrder: null,
  },
  {
    id: 6,
    categoryKey: "skill",
    categoryLabel: "スキル",
    sortOrder: 60,
    parentCategoryId: null,
    parentCategoryKey: null,
    parentCategoryLabel: null,
    parentSortOrder: null,
  },
  {
    id: 7,
    categoryKey: "other",
    categoryLabel: "その他",
    sortOrder: 70,
    parentCategoryId: null,
    parentCategoryKey: null,
    parentCategoryLabel: null,
    parentSortOrder: null,
  },
  {
    id: 8,
    categoryKey: "special_effect",
    categoryLabel: "特殊効果",
    sortOrder: 80,
    parentCategoryId: null,
    parentCategoryKey: null,
    parentCategoryLabel: null,
    parentSortOrder: null,
  },
];

export const CARD_EFFECT_CATEGORY_SUB_OPTIONS: Record<CardEffectCategoryMainKey, readonly CardEffectCategorySubItem[]> = {
  status: [
    { key: "str", label: "Str", sortOrder: 10 },
    { key: "agi", label: "Agi", sortOrder: 20 },
    { key: "vit", label: "Vit", sortOrder: 30 },
    { key: "int", label: "Int", sortOrder: 40 },
    { key: "dex", label: "Dex", sortOrder: 50 },
    { key: "luk", label: "Luk", sortOrder: 60 },
    { key: "hp", label: "HP", sortOrder: 70 },
    { key: "sp", label: "SP", sortOrder: 80 },
    { key: "physical_attack", label: "物理攻撃", sortOrder: 90 },
    { key: "magic_attack", label: "魔法攻撃", sortOrder: 100 },
    { key: "physical_defense", label: "物理防御", sortOrder: 110 },
    { key: "magic_defense", label: "魔法防御", sortOrder: 120 },
    { key: "cast_time", label: "詠唱時間", sortOrder: 130 },
    { key: "attack_speed", label: "攻撃速度", sortOrder: 140 },
  ],
  element: [
    { key: "damage_up", label: "ダメージアップ", sortOrder: 10 },
    { key: "damage_down", label: "ダメージ軽減", sortOrder: 20 },
    { key: "armor_element", label: "鎧の属性", sortOrder: 30 },
  ],
  race: [
    { key: "damage_up", label: "ダメージアップ", sortOrder: 10 },
    { key: "damage_down", label: "ダメージ軽減", sortOrder: 20 },
  ],
  size: [
    { key: "damage_up", label: "ダメージアップ", sortOrder: 10 },
    { key: "damage_down", label: "ダメージ軽減", sortOrder: 20 },
  ],
  penalty: [
    { key: "attack", label: "攻撃する", sortOrder: 10 },
    { key: "receive_attack", label: "攻撃を受ける", sortOrder: 20 },
    { key: "resistance_up", label: "耐性アップ", sortOrder: 30 },
    { key: "immunity_up", label: "免疫強化", sortOrder: 40 },
    { key: "equipment_break", label: "装備破損", sortOrder: 50 },
  ],
  skill: [
    { key: "learn", label: "スキル取得", sortOrder: 10 },
    { key: "attack_trigger", label: "攻撃で発動", sortOrder: 20 },
    { key: "receive_trigger", label: "攻撃を受けると発動", sortOrder: 30 },
  ],
  other: [
    { key: "hit", label: "Hit", sortOrder: 10 },
    { key: "flee", label: "Flee", sortOrder: 20 },
    { key: "critical_burst", label: "クリティカルバースト", sortOrder: 30 },
    { key: "other_damage", label: "その他のダメージ", sortOrder: 40 },
    { key: "other_damage_down", label: "その他のダメージ軽減", sortOrder: 50 },
    { key: "damage_reflection", label: "ダメージリフレクション", sortOrder: 60 },
    { key: "recovery", label: "回復効果", sortOrder: 70 },
  ],
  special_effect: [
    { key: "other", label: "その他", sortOrder: 10 },
    { key: "ignore_size", label: "サイズ無視", sortOrder: 20 },
    { key: "attack_trigger", label: "攻撃で発動", sortOrder: 30 },
    { key: "invincible", label: "無敵", sortOrder: 40 },
    { key: "endure", label: "インデュア", sortOrder: 50 },
    { key: "skill_cost", label: "スキル消費", sortOrder: 60 },
    { key: "move_speed", label: "移動速度", sortOrder: 70 },
  ],
};

export const cardTagItems: CardTagItem[] = [
  { id: 1, tagKey: "vit", tagLabel: "VIT", tagGroup: "status", sortOrder: 10 },
  { id: 2, tagKey: "max_hp", tagLabel: "MaxHP", tagGroup: "status", sortOrder: 20 },
  { id: 3, tagKey: "main_weapon", tagLabel: "メインウェポン", tagGroup: "equip_slot", sortOrder: 30 },
  { id: 4, tagKey: "str", tagLabel: "STR", tagGroup: "status", sortOrder: 40 },
  { id: 5, tagKey: "dex", tagLabel: "DEX", tagGroup: "status", sortOrder: 50 },
  { id: 6, tagKey: "physical_damage", tagLabel: "物理ダメージ", tagGroup: "effect", sortOrder: 60 },
  { id: 7, tagKey: "magic_damage", tagLabel: "魔法ダメージ", tagGroup: "effect", sortOrder: 70 },
  { id: 8, tagKey: "stun", tagLabel: "スタン", tagGroup: "status_effect", sortOrder: 80 },
  { id: 9, tagKey: "freeze", tagLabel: "凍結", tagGroup: "status_effect", sortOrder: 90 },
  { id: 10, tagKey: "refine_conditional", tagLabel: "精錬条件", tagGroup: "condition", sortOrder: 100 },
  { id: 11, tagKey: "pvp", tagLabel: "PvP", tagGroup: "content", sortOrder: 110 },
  { id: 12, tagKey: "mvp", tagLabel: "MVP", tagGroup: "content", sortOrder: 120 },
];

const tagByKey = Object.fromEntries(cardTagItems.map((tag) => [tag.tagKey, tag])) as Record<string, CardTagItem | undefined>;
const categoryByKey = Object.fromEntries(
  cardCategoryItems.map((category) => [category.categoryKey, category]),
) as Record<string, CardCategoryItem | undefined>;

function pickTags(keys: string[]): CardTagItem[] {
  return keys
    .map((key) => tagByKey[key])
    .filter((tag): tag is CardTagItem => tag !== undefined)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function pickCategories(keys: string[]): CardCategoryItem[] {
  return keys
    .map((key) => categoryByKey[key])
    .filter((category): category is CardCategoryItem => category !== undefined)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function buildCardSearchText(input: {
  cardNameJp: string;
  cardNameEn?: string | null;
  rarity: CardRarity;
  equipSlot: CardEquipSlot;
  levelBand?: CardLevelBand | string;
  cardType?: string;
  effectTextBase: string;
  effectTextEvolution?: string | null;
  effectTextStorage?: string | null;
  tags: CardTagItem[];
  categories: CardCategoryItem[];
}) {
  const levelBandLabel =
    typeof input.levelBand === "string" ? input.levelBand : (input.levelBand?.label ?? "");

  return [
    input.cardNameJp,
    input.cardNameEn ?? "",
    input.rarity,
    input.equipSlot,
    levelBandLabel,
    input.cardType ?? "",
    input.effectTextBase,
    input.effectTextEvolution ?? "",
    input.effectTextStorage ?? "",
    input.tags.map((tag) => `${tag.tagKey} ${tag.tagLabel}`).join(" "),
    input.categories
      .map((category) =>
        [
          category.parentCategoryKey,
          category.parentCategoryLabel,
          category.categoryKey,
          category.categoryLabel,
        ]
          .filter((value): value is string => Boolean(value))
          .join(" "),
      )
      .join(" "),
  ]
    .join(" ")
    .replaceAll("\n", " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const fallbackCards: CardItem[] = [
  (() => {
    const tags = pickTags(["vit", "max_hp", "main_weapon"]);
    const categories = pickCategories(["status", "other"]);
    const effectTextBase = "Vit+1\nMaxHP+100";
    const effectTextEvolution = "Lv.5 MaxHP+1.50%\nLv.10 Vit+2\nLv.15 MaxHP+100";
    const effectTextStorage = "魔法攻撃+2";

    return {
      id: "fabre-card",
      cardNameJp: "ファブルカード",
      cardNameEn: "Fabre Card",
      rarity: "緑カード",
      equipSlot: "メインウェポン",
      levelBand: {
        label: "Lv1-Lv20",
        sortOrder: 1,
      },
      cardType: "normal",
      iconUrl: "/images/cards/placeholder.svg",
      artworkUrl: "/images/cards/placeholder.svg",
      sortOrder: 10,
      status: "published",
      effectTextBase,
      effectTextEvolution,
      effectTextStorage,
      searchText: buildCardSearchText({
        cardNameJp: "ファブルカード",
        cardNameEn: "Fabre Card",
        rarity: "緑カード",
        equipSlot: "メインウェポン",
        levelBand: {
          label: "Lv1-Lv20",
          sortOrder: 1,
        },
        cardType: "normal",
        effectTextBase,
        effectTextEvolution,
        effectTextStorage,
        tags,
        categories,
      }),
      tags,
      categories,
    };
  })(),
];
