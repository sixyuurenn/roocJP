import {
  EQUIPMENT_EQUIP_SLOT_OPTIONS,
  EQUIPMENT_GENRE_BUCKET_ITEMS,
  buildEquipmentGenreSearchText,
  buildEquipmentSearchText,
  fallbackEquipmentItems,
  type EquipmentEquipSlot,
  type EquipmentGenreBucket,
  type EquipmentGenreItem,
  type EquipmentItem,
  type EquipmentStatus,
  type EquipmentTagItem,
} from "@/data/equipment";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type IdValue = number | string;

type EquipmentItemRow = {
  id: string;
  item_name_jp_display: string | null;
  item_name_jp_raw: string | null;
  item_name_en: string | null;
  equip_slot: string | null;
  genre_bucket: string | null;
  level: number | null;
  battle_power: number | null;
  equipment_score: number | null;
  card_slots: number | null;
  status_text_core: string | null;
  search_text: string | null;
  icon_url: string | null;
  artwork_url: string | null;
  sort_order: number | null;
  status: string | null;
};

type EquipmentGenreRow = {
  id: IdValue;
  genre_name_jp: string | null;
  genre_bucket: string | null;
  genre_attribute_text: string | null;
  genre_set_effect_text: string | null;
  search_text: string | null;
  sort_order: number | null;
  status: string | null;
};

type EquipmentTagRow = {
  id: IdValue;
  tag_key: string | null;
  tag_label: string | null;
  tag_group: string | null;
  sort_order: number | null;
};

type EquipmentGenreMemberRow = {
  equipment_id: string;
  genre_id: IdValue;
};

type EquipmentItemTagRow = {
  equipment_id: string;
  tag_id: IdValue;
};

export type EquipmentDirectoryFilters = {
  keyword: string;
  equipSlot: string;
  genreBucket: string;
  minLevel: string;
};

export type EquipmentDirectoryData = {
  items: EquipmentItem[];
  isFallback: boolean;
  source: "supabase" | "fallback:no-env" | "fallback:master-query-error" | "fallback:item-query-error" | "fallback:relation-query-error";
};

function isEquipmentEquipSlot(value: string | null): value is EquipmentEquipSlot {
  return value !== null && EQUIPMENT_EQUIP_SLOT_OPTIONS.includes(value as EquipmentEquipSlot);
}

function isEquipmentGenreBucket(value: string | null): value is EquipmentGenreBucket {
  return value !== null && EQUIPMENT_GENRE_BUCKET_ITEMS.some((item) => item.value === value);
}

function isEquipmentStatus(value: string | null): value is EquipmentStatus {
  return value === "published" || value === "draft" || value === "archived";
}

function normalizeId(value: IdValue) {
  return typeof value === "number" ? value : Number(value);
}

function toEquipmentGenreItem(row: EquipmentGenreRow): EquipmentGenreItem | null {
  if (
    !row.genre_name_jp ||
    !isEquipmentGenreBucket(row.genre_bucket) ||
    row.genre_attribute_text === null ||
    row.genre_set_effect_text === null ||
    !isEquipmentStatus(row.status)
  ) {
    return null;
  }

  return {
    id: normalizeId(row.id),
    genreNameJp: row.genre_name_jp,
    genreBucket: row.genre_bucket,
    genreAttributeText: row.genre_attribute_text,
    genreSetEffectText: row.genre_set_effect_text,
    searchText:
      row.search_text && row.search_text.trim().length > 0
        ? row.search_text
        : buildEquipmentGenreSearchText({
            genreNameJp: row.genre_name_jp,
            genreBucket: row.genre_bucket,
            genreAttributeText: row.genre_attribute_text,
            genreSetEffectText: row.genre_set_effect_text,
          }),
    sortOrder: row.sort_order ?? 0,
    status: row.status,
  };
}

function toEquipmentTagItem(row: EquipmentTagRow): EquipmentTagItem | null {
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

function toEquipmentItem(
  row: EquipmentItemRow,
  tagsByEquipmentId: Map<string, EquipmentTagItem[]>,
  genresByEquipmentId: Map<string, EquipmentGenreItem[]>,
): EquipmentItem | null {
  if (
    !row.id ||
    !row.item_name_jp_display ||
    !isEquipmentEquipSlot(row.equip_slot) ||
    !isEquipmentGenreBucket(row.genre_bucket) ||
    row.level === null ||
    row.status_text_core === null ||
    row.search_text === null ||
    !isEquipmentStatus(row.status)
  ) {
    return null;
  }

  const tags = (tagsByEquipmentId.get(row.id) ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder);
  const genres = (genresByEquipmentId.get(row.id) ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    id: row.id,
    itemNameJpDisplay: row.item_name_jp_display,
    itemNameJpRaw: row.item_name_jp_raw,
    itemNameEn: row.item_name_en,
    equipSlot: row.equip_slot,
    genreBucket: row.genre_bucket,
    level: row.level,
    battlePower: row.battle_power,
    equipmentScore: row.equipment_score,
    cardSlots: row.card_slots,
    statusTextCore: row.status_text_core,
    searchText:
      row.search_text.trim().length > 0
        ? row.search_text
        : buildEquipmentSearchText({
            itemNameJpDisplay: row.item_name_jp_display,
            itemNameJpRaw: row.item_name_jp_raw,
            itemNameEn: row.item_name_en,
            equipSlot: row.equip_slot,
            genreBucket: row.genre_bucket,
            level: row.level,
            battlePower: row.battle_power,
            equipmentScore: row.equipment_score,
            cardSlots: row.card_slots,
            statusTextCore: row.status_text_core,
            tags,
            genres,
          }),
    iconUrl: row.icon_url,
    artworkUrl: row.artwork_url,
    sortOrder: row.sort_order ?? 0,
    status: row.status,
    tags,
    genres,
  };
}

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase();
}

function normalizeMinLevel(value: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.floor(parsed);
}

function filterFallbackItems(items: EquipmentItem[], filters: EquipmentDirectoryFilters) {
  const keyword = normalizeKeyword(filters.keyword);
  const minLevel = normalizeMinLevel(filters.minLevel);

  return items.filter((item) => {
    const matchesKeyword =
      keyword.length === 0 ||
      `${item.itemNameJpDisplay} ${item.itemNameJpRaw ?? ""} ${item.searchText}`.toLowerCase().includes(keyword);
    const matchesEquipSlot = filters.equipSlot.length === 0 || item.equipSlot === filters.equipSlot;
    const matchesGenreBucket = filters.genreBucket.length === 0 || item.genreBucket === filters.genreBucket;
    const matchesMinLevel = minLevel === null || item.level >= minLevel;

    return matchesKeyword && matchesEquipSlot && matchesGenreBucket && matchesMinLevel && item.status === "published";
  });
}

function getFallbackDirectoryData(
  filters: EquipmentDirectoryFilters,
  source: EquipmentDirectoryData["source"],
): EquipmentDirectoryData {
  return {
    items: filterFallbackItems(fallbackEquipmentItems, filters),
    isFallback: true,
    source,
  };
}

export async function getEquipmentDirectoryData(filters: EquipmentDirectoryFilters): Promise<EquipmentDirectoryData> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return getFallbackDirectoryData(filters, "fallback:no-env");
  }

  const [genreResponse, tagResponse] = await Promise.all([
    supabase
      .from("equipment_genres")
      .select("id, genre_name_jp, genre_bucket, genre_attribute_text, genre_set_effect_text, search_text, sort_order, status")
      .eq("status", "published")
      .order("sort_order", { ascending: true }),
    supabase.from("equipment_tags").select("id, tag_key, tag_label, tag_group, sort_order").order("sort_order", { ascending: true }),
  ]);

  if (genreResponse.error || tagResponse.error || !genreResponse.data || !tagResponse.data) {
    return getFallbackDirectoryData(filters, "fallback:master-query-error");
  }

  const genres = genreResponse.data
    .map((row) => toEquipmentGenreItem(row as EquipmentGenreRow))
    .filter((item): item is EquipmentGenreItem => item !== null);
  const tags = tagResponse.data
    .map((row) => toEquipmentTagItem(row as EquipmentTagRow))
    .filter((item): item is EquipmentTagItem => item !== null);

  const minLevel = normalizeMinLevel(filters.minLevel);

  let itemQuery = supabase
    .from("equipment_items")
    .select(
      "id, item_name_jp_display, item_name_jp_raw, item_name_en, equip_slot, genre_bucket, level, battle_power, equipment_score, card_slots, status_text_core, search_text, icon_url, artwork_url, sort_order, status",
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("level", { ascending: true });

  if (filters.equipSlot.length > 0) {
    itemQuery = itemQuery.eq("equip_slot", filters.equipSlot);
  }

  if (filters.genreBucket.length > 0) {
    itemQuery = itemQuery.eq("genre_bucket", filters.genreBucket);
  }

  if (minLevel !== null) {
    itemQuery = itemQuery.gte("level", minLevel);
  }

  if (filters.keyword.trim().length > 0) {
    itemQuery = itemQuery.ilike("search_text", `%${filters.keyword.trim()}%`);
  }

  const { data: itemRows, error: itemError } = await itemQuery;

  if (itemError || !itemRows) {
    return getFallbackDirectoryData(filters, "fallback:item-query-error");
  }

  const equipmentIds = itemRows.map((row) => (row as EquipmentItemRow).id);

  if (equipmentIds.length === 0) {
    return {
      items: [],
      isFallback: false,
      source: "supabase",
    };
  }

  const [memberResponse, itemTagResponse] = await Promise.all([
    supabase.from("equipment_genre_members").select("equipment_id, genre_id").in("equipment_id", equipmentIds),
    supabase.from("equipment_item_tags").select("equipment_id, tag_id").in("equipment_id", equipmentIds),
  ]);

  if (memberResponse.error || itemTagResponse.error || !memberResponse.data || !itemTagResponse.data) {
    return getFallbackDirectoryData(filters, "fallback:relation-query-error");
  }

  const genreMap = new Map(genres.map((genre) => [genre.id, genre]));
  const tagMap = new Map(tags.map((tag) => [tag.id, tag]));
  const genresByEquipmentId = new Map<string, EquipmentGenreItem[]>();
  const tagsByEquipmentId = new Map<string, EquipmentTagItem[]>();

  for (const row of memberResponse.data as EquipmentGenreMemberRow[]) {
    const genre = genreMap.get(normalizeId(row.genre_id));

    if (!genre) {
      continue;
    }

    const current = genresByEquipmentId.get(row.equipment_id) ?? [];
    current.push(genre);
    genresByEquipmentId.set(row.equipment_id, current);
  }

  for (const row of itemTagResponse.data as EquipmentItemTagRow[]) {
    const tag = tagMap.get(normalizeId(row.tag_id));

    if (!tag) {
      continue;
    }

    const current = tagsByEquipmentId.get(row.equipment_id) ?? [];
    current.push(tag);
    tagsByEquipmentId.set(row.equipment_id, current);
  }

  const items = itemRows
    .map((row) => toEquipmentItem(row as EquipmentItemRow, tagsByEquipmentId, genresByEquipmentId))
    .filter((item): item is EquipmentItem => item !== null)
    .filter((item) => item.status === "published");

  return {
    items,
    isFallback: false,
    source: "supabase",
  };
}
