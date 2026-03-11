export const EQUIPMENT_EQUIP_SLOT_OPTIONS = [
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

export const EQUIPMENT_GENRE_BUCKET_ITEMS = [
  { value: "main_weapon", label: "武器ジャンル" },
  { value: "sub_weapon", label: "盾/副武器ジャンル" },
  { value: "armor_set", label: "防具セット系ジャンル" },
  { value: "accessory", label: "アクセ系ジャンル" },
  { value: "other", label: "その他" },
] as const;

export const EQUIPMENT_JOB_TAG_ITEMS = [
  { value: "job_swordsman", label: "ソードマン" },
  { value: "job_mage", label: "マジシャン" },
  { value: "job_archer", label: "アーチャー" },
  { value: "job_acolyte", label: "アコライト" },
  { value: "job_thief", label: "シーフ" },
  { value: "job_merchant", label: "マーチャント" },
  { value: "job_doram", label: "ドラム" },
] as const;

export type EquipmentEquipSlot = (typeof EQUIPMENT_EQUIP_SLOT_OPTIONS)[number];
export type EquipmentGenreBucket = (typeof EQUIPMENT_GENRE_BUCKET_ITEMS)[number]["value"];
export type EquipmentJobTag = (typeof EQUIPMENT_JOB_TAG_ITEMS)[number]["value"];
export type EquipmentStatus = "published" | "draft" | "archived";

export type EquipmentTagItem = {
  id: number;
  tagKey: string;
  tagLabel: string;
  tagGroup: string;
  sortOrder: number;
};

export type EquipmentGenreItem = {
  id: number;
  genreNameJp: string;
  genreBucket: EquipmentGenreBucket;
  genreAttributeText: string;
  genreSetEffectText: string;
  searchText: string;
  sortOrder: number;
  status: EquipmentStatus;
};

export type EquipmentItem = {
  id: string;
  itemNameJpDisplay: string;
  itemNameJpRaw: string | null;
  itemNameEn: string | null;
  equipSlot: EquipmentEquipSlot;
  genreBucket: EquipmentGenreBucket;
  level: number;
  battlePower: number | null;
  equipmentScore: number | null;
  cardSlots: number | null;
  statusTextCore: string;
  searchText: string;
  iconUrl: string | null;
  artworkUrl: string | null;
  sortOrder: number;
  status: EquipmentStatus;
  tags: EquipmentTagItem[];
  genres: EquipmentGenreItem[];
};

export const equipmentTagItems: EquipmentTagItem[] = [
  { id: 1, tagKey: "physical_defense", tagLabel: "物理防御", tagGroup: "status", sortOrder: 10 },
  { id: 2, tagKey: "hp", tagLabel: "HP", tagGroup: "status", sortOrder: 20 },
  { id: 3, tagKey: "physical_attack", tagLabel: "物理攻撃", tagGroup: "status", sortOrder: 30 },
  { id: 4, tagKey: "agi", tagLabel: "Agi", tagGroup: "status", sortOrder: 40 },
  { id: 5, tagKey: "max_hp", tagLabel: "MaxHP", tagGroup: "status", sortOrder: 50 },
  { id: 6, tagKey: "physical_damage", tagLabel: "物理ダメージ増加", tagGroup: "effect", sortOrder: 60 },
  { id: 7, tagKey: "magic_damage", tagLabel: "魔法ダメージ増加", tagGroup: "effect", sortOrder: 70 },
  { id: 8, tagKey: "refine_conditional", tagLabel: "精錬条件", tagGroup: "condition", sortOrder: 80 },
  { id: 9, tagKey: "job_swordsman", tagLabel: "ソードマン", tagGroup: "job", sortOrder: 110 },
  { id: 10, tagKey: "job_mage", tagLabel: "マジシャン", tagGroup: "job", sortOrder: 120 },
  { id: 11, tagKey: "job_archer", tagLabel: "アーチャー", tagGroup: "job", sortOrder: 130 },
  { id: 12, tagKey: "job_acolyte", tagLabel: "アコライト", tagGroup: "job", sortOrder: 140 },
  { id: 13, tagKey: "job_thief", tagLabel: "シーフ", tagGroup: "job", sortOrder: 150 },
  { id: 14, tagKey: "job_merchant", tagLabel: "マーチャント", tagGroup: "job", sortOrder: 160 },
  { id: 15, tagKey: "job_doram", tagLabel: "ドラム", tagGroup: "job", sortOrder: 170 },
];

const tagByKey = Object.fromEntries(
  equipmentTagItems.map((tag) => [tag.tagKey, tag]),
) as Record<string, EquipmentTagItem | undefined>;

export function buildEquipmentGenreSearchText(input: {
  genreNameJp: string;
  genreBucket: EquipmentGenreBucket;
  genreAttributeText: string;
  genreSetEffectText: string;
}) {
  return [input.genreNameJp, input.genreBucket, input.genreAttributeText, input.genreSetEffectText]
    .join(" ")
    .replaceAll("\n", " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const fallbackEquipmentGenres: EquipmentGenreItem[] = [
  {
    id: 1,
    genreNameJp: "ゴヴニュセット",
    genreBucket: "armor_set",
    genreAttributeText: "Vit+1\nMaxHP+2%\n精錬+3時、体力+1\n精錬+6時、物理防御+4%\n精錬+10時、魔法防御+4%",
    genreSetEffectText: "3組のセット効果\n水・風・地・火属性のダメージを5%軽減、最大HP+8%",
    searchText: buildEquipmentGenreSearchText({
      genreNameJp: "ゴヴニュセット",
      genreBucket: "armor_set",
      genreAttributeText: "Vit+1\nMaxHP+2%\n精錬+3時、体力+1\n精錬+6時、物理防御+4%\n精錬+10時、魔法防御+4%",
      genreSetEffectText: "3組のセット効果\n水・風・地・火属性のダメージを5%軽減、最大HP+8%",
    }),
    sortOrder: 10,
    status: "published",
  },
  {
    id: 2,
    genreNameJp: "テュールの祝福",
    genreBucket: "armor_set",
    genreAttributeText: "Str+1\n物理ダメージ増加+2%\n精錬+3時、力+1\n精錬+6時、物理攻撃+2\n精錬+10時、物理攻撃+3%",
    genreSetEffectText: "3組のセット効果\n1ポイントの力ごとに攻撃力が1ポイント追加される",
    searchText: buildEquipmentGenreSearchText({
      genreNameJp: "テュールの祝福",
      genreBucket: "armor_set",
      genreAttributeText: "Str+1\n物理ダメージ増加+2%\n精錬+3時、力+1\n精錬+6時、物理攻撃+2\n精錬+10時、物理攻撃+3%",
      genreSetEffectText: "3組のセット効果\n1ポイントの力ごとに攻撃力が1ポイント追加される",
    }),
    sortOrder: 20,
    status: "published",
  },
  {
    id: 3,
    genreNameJp: "スプリントセット",
    genreBucket: "armor_set",
    genreAttributeText: "Int+1\n魔法ダメージ増加+2%\n精錬+3時、知力+1\n精錬+6時、魔法攻撃+2\n精錬+10時、魔法攻撃+3%",
    genreSetEffectText: "3組のセット効果\n最大魔法+5%、共通クールダウン-10%、魔法ダメージ+8%",
    searchText: buildEquipmentGenreSearchText({
      genreNameJp: "スプリントセット",
      genreBucket: "armor_set",
      genreAttributeText: "Int+1\n魔法ダメージ増加+2%\n精錬+3時、知力+1\n精錬+6時、魔法攻撃+2\n精錬+10時、魔法攻撃+3%",
      genreSetEffectText: "3組のセット効果\n最大魔法+5%、共通クールダウン-10%、魔法ダメージ+8%",
    }),
    sortOrder: 30,
    status: "published",
  },
];

const genreByName = Object.fromEntries(
  fallbackEquipmentGenres.map((genre) => [genre.genreNameJp, genre]),
) as Record<string, EquipmentGenreItem | undefined>;

function pickTags(keys: string[]) {
  return keys
    .map((key) => tagByKey[key])
    .filter((tag): tag is EquipmentTagItem => tag !== undefined)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function pickGenres(names: string[]) {
  return names
    .map((name) => genreByName[name])
    .filter((genre): genre is EquipmentGenreItem => genre !== undefined)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function buildEquipmentSearchText(input: {
  itemNameJpDisplay: string;
  itemNameJpRaw?: string | null;
  itemNameEn?: string | null;
  equipSlot: EquipmentEquipSlot;
  genreBucket: EquipmentGenreBucket;
  level: number;
  battlePower?: number | null;
  equipmentScore?: number | null;
  cardSlots?: number | null;
  statusTextCore: string;
  tags: EquipmentTagItem[];
  genres: EquipmentGenreItem[];
}) {
  return [
    input.itemNameJpDisplay,
    input.itemNameJpRaw ?? "",
    input.itemNameEn ?? "",
    input.equipSlot,
    input.genreBucket,
    String(input.level),
    input.battlePower === null || input.battlePower === undefined ? "" : String(input.battlePower),
    input.equipmentScore === null || input.equipmentScore === undefined ? "" : String(input.equipmentScore),
    input.cardSlots === null || input.cardSlots === undefined ? "" : String(input.cardSlots),
    input.statusTextCore,
    input.tags.map((tag) => `${tag.tagKey} ${tag.tagLabel}`).join(" "),
    input.genres.map((genre) => `${genre.genreNameJp} ${genre.genreBucket}`).join(" "),
  ]
    .join(" ")
    .replaceAll("\n", " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const fallbackEquipmentItems: EquipmentItem[] = [
  (() => {
    const tags = pickTags(["physical_defense", "hp"]);
    const genres = pickGenres(["ゴヴニュセット", "テュールの祝福", "スプリントセット"]);
    const statusTextCore = "物理防御+130〜144\nHP+1020〜1200";

    return {
      id: "aurora-mantle",
      itemNameJpDisplay: "曙光のマント",
      itemNameJpRaw: "曙光のマント",
      itemNameEn: null,
      equipSlot: "肩にかける物",
      genreBucket: "armor_set",
      level: 70,
      battlePower: null,
      equipmentScore: 0,
      cardSlots: null,
      statusTextCore,
      searchText: buildEquipmentSearchText({
        itemNameJpDisplay: "曙光のマント",
        itemNameJpRaw: "曙光のマント",
        equipSlot: "肩にかける物",
        genreBucket: "armor_set",
        level: 70,
        equipmentScore: 0,
        statusTextCore,
        tags,
        genres,
      }),
      iconUrl: "/images/equipment/placeholder.svg",
      artworkUrl: "/images/equipment/placeholder.svg",
      sortOrder: 10,
      status: "published",
      tags,
      genres,
    };
  })(),
  (() => {
    const tags = pickTags(["physical_attack", "agi", "refine_conditional"]);
    const genres: EquipmentGenreItem[] = [];
    const statusTextCore = "物理攻撃+51\nAgi+2\nAgiが20ポイント毎に、攻撃速度+1%\n精錬+5以上の時、Agi+2";

    return {
      id: "brooch-2",
      itemNameJpDisplay: "ブローチ",
      itemNameJpRaw: "ブローチ[2]",
      itemNameEn: null,
      equipSlot: "アクセサリー",
      genreBucket: "accessory",
      level: 85,
      battlePower: 3015,
      equipmentScore: null,
      cardSlots: 2,
      statusTextCore,
      searchText: buildEquipmentSearchText({
        itemNameJpDisplay: "ブローチ",
        itemNameJpRaw: "ブローチ[2]",
        equipSlot: "アクセサリー",
        genreBucket: "accessory",
        level: 85,
        battlePower: 3015,
        cardSlots: 2,
        statusTextCore,
        tags,
        genres,
      }),
      iconUrl: "/images/equipment/placeholder.svg",
      artworkUrl: "/images/equipment/placeholder.svg",
      sortOrder: 20,
      status: "published",
      tags,
      genres,
    };
  })(),
];
