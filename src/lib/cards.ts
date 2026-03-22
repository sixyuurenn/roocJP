import {
  buildCardSearchText,
  CARD_EFFECT_CATEGORY_SUB_OPTIONS,
  CARD_EQUIP_SLOT_OPTIONS,
  CARD_LEVEL_BAND_OPTIONS,
  CARD_RARITY_OPTIONS,
  cardCategoryItems,
  fallbackCards,
  type CardCategoryItem,
  type CardEquipSlot,
  type CardItem,
  type CardLevelBand,
  type CardRarity,
  type CardStatus,
  type CardTagItem,
} from "@/data/cards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type IdValue = number | string;

type CardRow = {
  id: string;
  card_name_jp: string | null;
  card_name_en: string | null;
  rarity: string | null;
  equip_slot: string | null;
  level_band: string | null;
  card_type: string | null;
  icon_url: string | null;
  artwork_url: string | null;
  sort_order: number | null;
  status: string | null;
  effect_text_base: string | null;
  effect_text_evolution: string | null;
  effect_text_storage: string | null;
  search_text: string | null;
};

type TagRow = {
  id: IdValue;
  tag_key: string | null;
  tag_label: string | null;
  tag_group: string | null;
  sort_order: number | null;
};

type CategoryRow = {
  id: IdValue;
  category_key: string | null;
  category_label: string | null;
  sort_order: number | null;
  parent_category_id: IdValue | null;
};

type CardTagRow = {
  card_id: string;
  tag_id: IdValue;
};

type CardCategoryRow = {
  card_id: string;
  category_id: IdValue;
};

type CardEffectCategoryPair = {
  mainKey: string;
  mainLabel: string;
  subKey: string | null;
  subLabel: string | null;
  sortOrder: number;
};

type CardCategoryCollections = {
  mainCategories: CardCategoryItem[];
  detailCategoryMap: Map<number, CardCategoryItem>;
  categoryDetailsByMainKey: Record<string, CardCategoryItem[]>;
};

const legacyRarityMap: Record<string, CardRarity> = {
  緑カード: "緑カード",
  青カード: "青カード",
  紫カード: "紫カード",
  黄カード: "黄カード",
  橙カード: "黄カード",
  赤カード: "赤カード",
};

const legacyEquipSlotMap: Record<string, CardEquipSlot> = {
  メインウェポン: "メインウェポン",
  サブウェポン: "サブウェポン",
  防具: "防具",
  肩にかける物: "肩にかける物",
  靴: "靴",
  アクセサリー: "アクセサリー",
  頭装備: "頭装備",
  顔飾り: "顔飾り",
  口飾り: "口飾り",
  背中装備: "背中装備",
  衣装: "衣装",
  ファッション: "衣装",
};

export type CardDirectoryFilters = {
  keyword: string;
  rarity: string;
  equipSlot: string;
  categoryKey?: string;
  categoryMainKey: string;
  categorySubKey: string;
  showAll?: boolean;
};

export type CardDirectoryData = {
  cards: CardItem[];
  categories: CardCategoryItem[];
  categoryDetailsByMainKey: Record<string, CardCategoryItem[]>;
  isFallback: boolean;
  source:
    | "supabase"
    | "fallback:no-env"
    | "fallback:master-query-error"
    | "fallback:card-query-error"
    | "fallback:relation-query-error";
};

function isCardStatus(value: string | null): value is CardStatus {
  return value === "published" || value === "draft" || value === "archived";
}

function normalizeId(value: IdValue) {
  return typeof value === "number" ? value : Number(value);
}

function normalizeCardRarity(value: string | null): CardRarity | null {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  if (normalized in legacyRarityMap) {
    return legacyRarityMap[normalized];
  }

  for (const option of CARD_RARITY_OPTIONS) {
    if (normalized.includes(option.slice(0, 1))) {
      return option;
    }
  }

  return null;
}

function normalizeCardEquipSlot(value: string | null): CardEquipSlot | null {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  if (normalized in legacyEquipSlotMap) {
    return legacyEquipSlotMap[normalized];
  }

  const exact = CARD_EQUIP_SLOT_OPTIONS.find((option) => option === normalized);
  return exact ?? null;
}

function normalizeLevelBand(value: string | null): CardLevelBand {
  const label = value?.trim() ?? "";

  if (label.length === 0) {
    return {
      label: "",
      sortOrder: Number.MAX_SAFE_INTEGER,
    };
  }

  const normalized = label.toLowerCase().replace(/\s+/g, "").replace(/[.．]/g, "").replace(/[〜～]/g, "-");
  const bandByKey = new Map<string, CardLevelBand>([
    ["lv1-lv20", CARD_LEVEL_BAND_OPTIONS[0]],
    ["lv1-20", CARD_LEVEL_BAND_OPTIONS[0]],
    ["1-20", CARD_LEVEL_BAND_OPTIONS[0]],
    ["lv21-lv40", CARD_LEVEL_BAND_OPTIONS[1]],
    ["lv21-40", CARD_LEVEL_BAND_OPTIONS[1]],
    ["21-40", CARD_LEVEL_BAND_OPTIONS[1]],
    ["lv41-lv60", CARD_LEVEL_BAND_OPTIONS[2]],
    ["lv41-60", CARD_LEVEL_BAND_OPTIONS[2]],
    ["41-60", CARD_LEVEL_BAND_OPTIONS[2]],
    ["lv61-lv80", CARD_LEVEL_BAND_OPTIONS[3]],
    ["lv61-80", CARD_LEVEL_BAND_OPTIONS[3]],
    ["61-80", CARD_LEVEL_BAND_OPTIONS[3]],
    ["lv81-lv100", CARD_LEVEL_BAND_OPTIONS[4]],
    ["lv81-100", CARD_LEVEL_BAND_OPTIONS[4]],
    ["81-100", CARD_LEVEL_BAND_OPTIONS[4]],
    ["ファッション", CARD_LEVEL_BAND_OPTIONS[5]],
    ["レプリカ", CARD_LEVEL_BAND_OPTIONS[6]],
    ["パペット", CARD_LEVEL_BAND_OPTIONS[6]],
    ["幻影", CARD_LEVEL_BAND_OPTIONS[6]],
    ["パペット＆幻影", CARD_LEVEL_BAND_OPTIONS[6]],
  ]);

  return bandByKey.get(normalized) ?? bandByKey.get(label) ?? { label, sortOrder: Number.MAX_SAFE_INTEGER };
}

function toCardTagItem(row: TagRow): CardTagItem | null {
  if (!row.tag_key || !row.tag_label || !row.tag_group) {
    return null;
  }

  return {
    id: normalizeId(row.id),
    tagKey: row.tag_key,
    tagLabel: row.tag_label,
    tagGroup: row.tag_group,
    sortOrder: row.sort_order ?? 0,
  };
}

function toCardCategoryItem(row: CategoryRow): CardCategoryItem | null {
  if (!row.category_key || !row.category_label) {
    return null;
  }

  return {
    id: normalizeId(row.id),
    categoryKey: row.category_key,
    categoryLabel: row.category_label,
    sortOrder: row.sort_order ?? 0,
    parentCategoryId: row.parent_category_id === null ? null : normalizeId(row.parent_category_id),
    parentCategoryKey: null,
    parentCategoryLabel: null,
    parentSortOrder: null,
  };
}

function dedupeCategoryItems(items: CardCategoryItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = `${item.parentCategoryKey ?? ""}:${item.categoryKey}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function normalizeFilterKeyword(value: string) {
  return value.trim().toLowerCase();
}

function getCategorySortOrder(category: CardCategoryItem) {
  return (category.parentSortOrder ?? category.sortOrder) * 1000 + (category.parentCategoryKey ? category.sortOrder : 0);
}

function buildCategoryCollections(rows: CategoryRow[]): CardCategoryCollections {
  const rawItems = rows
    .map((row) => toCardCategoryItem(row))
    .filter((item): item is CardCategoryItem => item !== null);
  const categoryById = new Map(rawItems.map((item) => [item.id, item]));
  const mainCategories = rawItems
    .filter((item) => item.parentCategoryId === null)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const detailCategoryMap = new Map<number, CardCategoryItem>();
  const categoryDetailsByMainKey: Record<string, CardCategoryItem[]> = {};

  for (const item of rawItems) {
    if (item.parentCategoryId === null) {
      continue;
    }

    const parent = categoryById.get(item.parentCategoryId);

    if (!parent) {
      continue;
    }

    const detailCategory: CardCategoryItem = {
      ...item,
      parentCategoryId: parent.id,
      parentCategoryKey: parent.categoryKey,
      parentCategoryLabel: parent.categoryLabel,
      parentSortOrder: parent.sortOrder,
    };

    detailCategoryMap.set(detailCategory.id, detailCategory);
    const current = categoryDetailsByMainKey[parent.categoryKey] ?? [];
    current.push(detailCategory);
    categoryDetailsByMainKey[parent.categoryKey] = current;
  }

  for (const items of Object.values(categoryDetailsByMainKey)) {
    items.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  return {
    mainCategories,
    detailCategoryMap,
    categoryDetailsByMainKey,
  };
}

function getStaticCategoryDetailsByMainKey() {
  const mainCategoryByKey = new Map(cardCategoryItems.map((category) => [category.categoryKey, category]));

  return Object.fromEntries(
    Object.entries(CARD_EFFECT_CATEGORY_SUB_OPTIONS).map(([mainKey, items]) => {
      const parentCategory = mainCategoryByKey.get(mainKey);

      return [
        mainKey,
        items.map((item, index) => ({
          id: parentCategory ? parentCategory.id * 1000 + index + 1 : index + 1,
          categoryKey: item.key,
          categoryLabel: item.label,
          sortOrder: item.sortOrder,
          parentCategoryId: parentCategory?.id ?? null,
          parentCategoryKey: parentCategory?.categoryKey ?? null,
          parentCategoryLabel: parentCategory?.categoryLabel ?? null,
          parentSortOrder: parentCategory?.sortOrder ?? null,
        })),
      ];
    }),
  ) as Record<string, CardCategoryItem[]>;
}

export function getCardEffectCategories(card: Pick<CardItem, "categories">): CardEffectCategoryPair[] {
  const pairs: CardEffectCategoryPair[] = [];
  const seen = new Set<string>();
  const categories = dedupeCategoryItems(card.categories).sort((a, b) => getCategorySortOrder(a) - getCategorySortOrder(b));

  for (const category of categories) {
    const mainKey = category.parentCategoryKey ?? category.categoryKey;
    const mainLabel = category.parentCategoryLabel ?? category.categoryLabel;
    const subKey = category.parentCategoryKey ? category.categoryKey : null;
    const subLabel = category.parentCategoryKey ? category.categoryLabel : null;
    const key = `${mainKey}:${subKey ?? ""}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    pairs.push({
      mainKey,
      mainLabel,
      subKey,
      subLabel,
      sortOrder: getCategorySortOrder(category),
    });
  }

  return pairs.sort((a, b) => a.sortOrder - b.sortOrder);
}

function toCardItem(
  row: CardRow,
  tagsByCardId: Map<string, CardTagItem[]>,
  categoriesByCardId: Map<string, CardCategoryItem[]>,
): CardItem | null {
  const rarity = normalizeCardRarity(row.rarity);
  const equipSlot = normalizeCardEquipSlot(row.equip_slot);

  if (
    !row.id ||
    !row.card_name_jp ||
    !rarity ||
    !equipSlot ||
    !row.card_type ||
    !isCardStatus(row.status) ||
    !row.effect_text_base ||
    row.search_text === null
  ) {
    return null;
  }

  return {
    id: row.id,
    cardNameJp: row.card_name_jp,
    cardNameEn: row.card_name_en,
    rarity,
    equipSlot,
    levelBand: normalizeLevelBand(row.level_band),
    cardType: row.card_type,
    iconUrl: row.icon_url,
    artworkUrl: row.artwork_url,
    sortOrder: row.sort_order ?? 0,
    status: row.status,
    effectTextBase: row.effect_text_base,
    effectTextEvolution: row.effect_text_evolution,
    effectTextStorage: row.effect_text_storage,
    searchText: row.search_text,
    tags: (tagsByCardId.get(row.id) ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder),
    categories: dedupeCategoryItems((categoriesByCardId.get(row.id) ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder)),
  };
}

function filterCards(cards: CardItem[], filters: CardDirectoryFilters) {
  const keyword = normalizeFilterKeyword(filters.keyword);
  const allowedStatuses = filters.showAll ? new Set<CardStatus>(["published", "draft"]) : new Set<CardStatus>(["published"]);
  const selectedMainKey = filters.categoryMainKey || filters.categoryKey || "";

  return cards.filter((card) => {
    const effectCategories = getCardEffectCategories(card);
    const matchesKeyword =
      keyword.length === 0 || `${card.cardNameJp} ${card.searchText}`.toLowerCase().includes(keyword);
    const matchesRarity = filters.rarity.length === 0 || card.rarity === filters.rarity;
    const matchesEquipSlot = filters.equipSlot.length === 0 || card.equipSlot === filters.equipSlot;
    const matchesCategoryMain =
      selectedMainKey.length === 0 || effectCategories.some((category) => category.mainKey === selectedMainKey);
    const matchesCategorySub =
      filters.categorySubKey.length === 0 ||
      effectCategories.some(
        (category) => category.mainKey === selectedMainKey && category.subKey === filters.categorySubKey,
      );

    return (
      matchesKeyword &&
      matchesRarity &&
      matchesEquipSlot &&
      matchesCategoryMain &&
      matchesCategorySub &&
      allowedStatuses.has(card.status)
    );
  });
}

function getStaticCategoryItems() {
  return cardCategoryItems.slice().sort((a, b) => a.sortOrder - b.sortOrder);
}

function getFallbackDirectoryData(filters: CardDirectoryFilters, source: CardDirectoryData["source"]): CardDirectoryData {
  return {
    cards: filterCards(fallbackCards, filters),
    categories: getStaticCategoryItems(),
    categoryDetailsByMainKey: getStaticCategoryDetailsByMainKey(),
    isFallback: true,
    source,
  };
}

export async function getCardDirectoryData(filters: CardDirectoryFilters): Promise<CardDirectoryData> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return getFallbackDirectoryData(filters, "fallback:no-env");
  }

  const [tagResponse, categoryResponse] = await Promise.all([
    supabase.from("tags").select("id, tag_key, tag_label, tag_group, sort_order").order("sort_order", { ascending: true }),
    supabase
      .from("categories")
      .select("id, category_key, category_label, sort_order, parent_category_id")
      .order("sort_order", { ascending: true }),
  ]);

  if (tagResponse.error || categoryResponse.error || !tagResponse.data || !categoryResponse.data) {
    return getFallbackDirectoryData(filters, "fallback:master-query-error");
  }

  const tags = tagResponse.data.map((row) => toCardTagItem(row as TagRow)).filter((item): item is CardTagItem => item !== null);
  const { mainCategories, detailCategoryMap, categoryDetailsByMainKey } = buildCategoryCollections(
    categoryResponse.data as CategoryRow[],
  );

  let cardQuery = supabase
    .from("cards")
    .select(
      "id, card_name_jp, card_name_en, rarity, equip_slot, level_band, card_type, icon_url, artwork_url, sort_order, status, effect_text_base, effect_text_evolution, effect_text_storage, search_text",
    )
    .order("sort_order", { ascending: true })
    .order("card_name_jp", { ascending: true });

  cardQuery = filters.showAll ? cardQuery.in("status", ["published", "draft"]) : cardQuery.eq("status", "published");

  if (filters.keyword.trim().length > 0) {
    cardQuery = cardQuery.ilike("search_text", `%${filters.keyword.trim()}%`);
  }

  const { data: cardRows, error: cardError } = await cardQuery;

  if (cardError || !cardRows) {
    return getFallbackDirectoryData(filters, "fallback:card-query-error");
  }

  const cardIds = cardRows.map((row) => (row as CardRow).id);

  if (cardIds.length === 0) {
    return {
      cards: [],
      categories: mainCategories,
      categoryDetailsByMainKey,
      isFallback: false,
      source: "supabase",
    };
  }

  const [cardTagResponse, cardCategoryResponse] = await Promise.all([
    supabase.from("card_tags").select("card_id, tag_id").in("card_id", cardIds),
    supabase.from("card_categories").select("card_id, category_id").in("card_id", cardIds),
  ]);

  if (cardTagResponse.error || cardCategoryResponse.error || !cardTagResponse.data || !cardCategoryResponse.data) {
    return getFallbackDirectoryData(filters, "fallback:relation-query-error");
  }

  const tagMap = new Map(tags.map((tag) => [tag.id, tag]));
  const tagsByCardId = new Map<string, CardTagItem[]>();
  const categoriesByCardId = new Map<string, CardCategoryItem[]>();

  for (const row of cardTagResponse.data as CardTagRow[]) {
    const tag = tagMap.get(normalizeId(row.tag_id));

    if (!tag) {
      continue;
    }

    const current = tagsByCardId.get(row.card_id) ?? [];
    current.push(tag);
    tagsByCardId.set(row.card_id, current);
  }

  for (const row of cardCategoryResponse.data as CardCategoryRow[]) {
    const category = detailCategoryMap.get(normalizeId(row.category_id));

    if (!category) {
      continue;
    }

    const current = categoriesByCardId.get(row.card_id) ?? [];
    current.push(category);
    categoriesByCardId.set(row.card_id, current);
  }

  const cards = filterCards(
    cardRows
      .map((row) => toCardItem(row as CardRow, tagsByCardId, categoriesByCardId))
      .filter((item): item is CardItem => item !== null)
      .map((card) => ({
        ...card,
        searchText:
          card.searchText.trim().length > 0
            ? card.searchText
            : buildCardSearchText({
                cardNameJp: card.cardNameJp,
                cardNameEn: card.cardNameEn,
                rarity: card.rarity,
                equipSlot: card.equipSlot,
                levelBand: card.levelBand,
                cardType: card.cardType,
                effectTextBase: card.effectTextBase,
                effectTextEvolution: card.effectTextEvolution,
                effectTextStorage: card.effectTextStorage,
                tags: card.tags,
                categories: card.categories,
              }),
      })),
    filters,
  );

  return {
    cards,
    categories: mainCategories,
    categoryDetailsByMainKey,
    isFallback: false,
    source: "supabase",
  };
}
