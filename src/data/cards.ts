export const CARD_RARITY_OPTIONS = ["緑カード", "青カード", "紫カード", "橙カード", "赤カード"] as const;

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

export type CardRarity = (typeof CARD_RARITY_OPTIONS)[number];
export type CardEquipSlot = (typeof CARD_EQUIP_SLOT_OPTIONS)[number];
export type CardStatus = "published" | "draft" | "archived";

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
};

export type CardItem = {
  id: string;
  cardNameJp: string;
  cardNameEn: string | null;
  rarity: CardRarity;
  equipSlot: CardEquipSlot;
  levelBand: string;
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
  { id: 1, categoryKey: "recommended_type", categoryLabel: "推奨タイプ", sortOrder: 10 },
  { id: 2, categoryKey: "status", categoryLabel: "ステータス", sortOrder: 20 },
  { id: 3, categoryKey: "element", categoryLabel: "属性", sortOrder: 30 },
  { id: 4, categoryKey: "race", categoryLabel: "種族", sortOrder: 40 },
  { id: 5, categoryKey: "size", categoryLabel: "サイズ", sortOrder: 50 },
  { id: 6, categoryKey: "penalty", categoryLabel: "ペナルティ", sortOrder: 60 },
  { id: 7, categoryKey: "skill", categoryLabel: "スキル", sortOrder: 70 },
  { id: 8, categoryKey: "other", categoryLabel: "その他", sortOrder: 80 },
  { id: 9, categoryKey: "special_effect", categoryLabel: "特殊効果", sortOrder: 90 },
];

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
  levelBand?: string;
  cardType?: string;
  effectTextBase: string;
  effectTextEvolution?: string | null;
  effectTextStorage?: string | null;
  tags: CardTagItem[];
  categories: CardCategoryItem[];
}) {
  return [
    input.cardNameJp,
    input.cardNameEn ?? "",
    input.rarity,
    input.equipSlot,
    input.levelBand ?? "",
    input.cardType ?? "",
    input.effectTextBase,
    input.effectTextEvolution ?? "",
    input.effectTextStorage ?? "",
    input.tags.map((tag) => `${tag.tagKey} ${tag.tagLabel}`).join(" "),
    input.categories.map((category) => `${category.categoryKey} ${category.categoryLabel}`).join(" "),
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
      levelBand: "Lv.1-Lv.20",
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
        levelBand: "Lv.1-Lv.20",
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
