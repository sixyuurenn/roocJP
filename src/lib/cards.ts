import {
  CARD_EQUIP_SLOT_OPTIONS,
  CARD_RARITY_OPTIONS,
  buildCardSearchText,
  cardCategoryItems,
  fallbackCards,
  type CardCategoryItem,
  type CardEquipSlot,
  type CardItem,
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
};

type CardTagRow = {
  card_id: string;
  tag_id: IdValue;
};

type CardCategoryRow = {
  card_id: string;
  category_id: IdValue;
};

export type CardDirectoryFilters = {
  keyword: string;
  rarity: string;
  equipSlot: string;
  categoryKey: string;
};

export type CardDirectoryData = {
  cards: CardItem[];
  categories: CardCategoryItem[];
  isFallback: boolean;
  source: "supabase" | "fallback:no-env" | "fallback:master-query-error" | "fallback:category-query-error" | "fallback:card-query-error" | "fallback:relation-query-error";
};

function isCardRarity(value: string | null): value is CardRarity {
  return value !== null && CARD_RARITY_OPTIONS.includes(value as CardRarity);
}

function isCardEquipSlot(value: string | null): value is CardEquipSlot {
  return value !== null && CARD_EQUIP_SLOT_OPTIONS.includes(value as CardEquipSlot);
}

function isCardStatus(value: string | null): value is CardStatus {
  return value === "published" || value === "draft" || value === "archived";
}

function normalizeId(value: IdValue) {
  return typeof value === "number" ? value : Number(value);
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
  };
}

function toCardItem(
  row: CardRow,
  tagsByCardId: Map<string, CardTagItem[]>,
  categoriesByCardId: Map<string, CardCategoryItem[]>,
): CardItem | null {
  if (
    !row.id ||
    !row.card_name_jp ||
    !isCardRarity(row.rarity) ||
    !isCardEquipSlot(row.equip_slot) ||
    !row.level_band ||
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
    rarity: row.rarity,
    equipSlot: row.equip_slot,
    levelBand: row.level_band,
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
    categories: (categoriesByCardId.get(row.id) ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase();
}

function filterCards(cards: CardItem[], filters: CardDirectoryFilters) {
  const keyword = normalizeKeyword(filters.keyword);

  return cards.filter((card) => {
    const matchesKeyword =
      keyword.length === 0 || `${card.cardNameJp} ${card.searchText}`.toLowerCase().includes(keyword);
    const matchesRarity = filters.rarity.length === 0 || card.rarity === filters.rarity;
    const matchesEquipSlot = filters.equipSlot.length === 0 || card.equipSlot === filters.equipSlot;
    const matchesCategory =
      filters.categoryKey.length === 0 ||
      card.categories.some((category) => category.categoryKey === filters.categoryKey);

    return matchesKeyword && matchesRarity && matchesEquipSlot && matchesCategory && card.status === "published";
  });
}

function getFallbackDirectoryData(
  filters: CardDirectoryFilters,
  source: CardDirectoryData["source"],
): CardDirectoryData {
  return {
    cards: filterCards(fallbackCards, filters),
    categories: cardCategoryItems.slice().sort((a, b) => a.sortOrder - b.sortOrder),
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
      .select("id, category_key, category_label, sort_order")
      .order("sort_order", { ascending: true }),
  ]);

  if (tagResponse.error || categoryResponse.error || !tagResponse.data || !categoryResponse.data) {
    return getFallbackDirectoryData(filters, "fallback:master-query-error");
  }

  const tags = tagResponse.data.map((row) => toCardTagItem(row as TagRow)).filter((item): item is CardTagItem => item !== null);
  const categories = categoryResponse.data
    .map((row) => toCardCategoryItem(row as CategoryRow))
    .filter((item): item is CardCategoryItem => item !== null);

  let filteredCardIds: string[] | null = null;

  if (filters.categoryKey.length > 0) {
    const selectedCategory = categories.find((category) => category.categoryKey === filters.categoryKey);

    if (!selectedCategory) {
      return {
        cards: [],
        categories,
        isFallback: false,
        source: "supabase",
      };
    }

    const { data: categoryLinks, error: categoryLinkError } = await supabase
      .from("card_categories")
      .select("card_id, category_id")
      .eq("category_id", selectedCategory.id);

    if (categoryLinkError || !categoryLinks) {
      return getFallbackDirectoryData(filters, "fallback:category-query-error");
    }

    filteredCardIds = categoryLinks.map((row) => (row as CardCategoryRow).card_id);

    if (filteredCardIds.length === 0) {
      return {
        cards: [],
        categories,
        isFallback: false,
        source: "supabase",
      };
    }
  }

  let cardQuery = supabase
    .from("cards")
    .select(
      "id, card_name_jp, card_name_en, rarity, equip_slot, level_band, card_type, icon_url, artwork_url, sort_order, status, effect_text_base, effect_text_evolution, effect_text_storage, search_text",
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("card_name_jp", { ascending: true });

  if (filters.rarity.length > 0) {
    cardQuery = cardQuery.eq("rarity", filters.rarity);
  }

  if (filters.equipSlot.length > 0) {
    cardQuery = cardQuery.eq("equip_slot", filters.equipSlot);
  }

  if (filters.keyword.trim().length > 0) {
    cardQuery = cardQuery.ilike("search_text", `%${filters.keyword.trim()}%`);
  }

  if (filteredCardIds) {
    cardQuery = cardQuery.in("id", filteredCardIds);
  }

  const { data: cardRows, error: cardError } = await cardQuery;

  if (cardError || !cardRows) {
    return getFallbackDirectoryData(filters, "fallback:card-query-error");
  }

  const cardIds = cardRows.map((row) => (row as CardRow).id);

  if (cardIds.length === 0) {
    return {
      cards: [],
      categories,
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
  const categoryMap = new Map(categories.map((category) => [category.id, category]));
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
    const category = categoryMap.get(normalizeId(row.category_id));

    if (!category) {
      continue;
    }

    const current = categoriesByCardId.get(row.card_id) ?? [];
    current.push(category);
    categoriesByCardId.set(row.card_id, current);
  }

  const cards = cardRows
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
    }));

  return {
    cards: cards.filter((card) => card.status === "published"),
    categories,
    isFallback: false,
    source: "supabase",
  };
}
