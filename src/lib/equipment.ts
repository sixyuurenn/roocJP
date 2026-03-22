import { readFile } from "node:fs/promises";
import { cache } from "react";

const EQUIPMENT_ITEMS_CSV_PATH = "src/data/equipment-csv/PATH_TO_EQUIPMENT_ITEMS_final.csv";
const EQUIPMENT_EFFECTS_CSV_PATH = "src/data/equipment-csv/PATH_TO_EQUIPMENT_EFFECTS_final.csv";

const EQUIPMENT_PLACEHOLDER_IMAGE = "/images/equipment/placeholder.svg";
const ACCESSORY_IMAGE_BASE_PATH = "/images/equipment/akuse";
const EQUIPMENT_IMAGE_BASE_PATH = "/images/equipment/soubi";

type EquipmentItemGroup = "equipment" | "accessory";
type EquipmentEffectType = "style" | "set";

type EquipmentCsvItemRow = {
  item_id: string;
  sort_order: string;
  status: string;
  item_group: string;
  name_jp: string;
  name_en: string;
  name_zh: string;
  type_jp: string;
  type_en: string;
  type_zh: string;
  level: string;
  image_path: string;
  equipment_attributes_jp: string;
  equipment_attributes_en: string;
  equipment_attributes_zh: string;
};

type EquipmentCsvEffectRow = {
  effect_id: string;
  item_id: string;
  effect_type: string;
  effect_order: string;
  effect_name_jp: string;
  effect_name_en: string;
  effect_name_zh: string;
  partner_item_ids: string;
  activation_condition_jp: string;
  activation_condition_en: string;
  activation_condition_zh: string;
  effect_text_jp: string;
  effect_text_en: string;
  effect_text_zh: string;
};

type TwoHeaderCsvTable<T extends Record<string, string>> = {
  displayHeaders: string[];
  keyHeaders: string[];
  records: T[];
};

export type EquipmentEffect = {
  id: string;
  itemId: string;
  effectType: EquipmentEffectType;
  effectOrder: number;
  effectNameJp: string;
  effectNameAssistText: string | null;
  effectNameEn: string | null;
  effectNameZh: string | null;
  activationConditionJp: string | null;
  activationConditionEn: string | null;
  activationConditionZh: string | null;
  effectTextJp: string;
  effectTextEn: string | null;
  effectTextZh: string | null;
  partnerItemIds: string[];
};

export type EquipmentItem = {
  id: string;
  itemGroup: EquipmentItemGroup;
  nameJp: string;
  nameAssistText: string | null;
  nameEn: string | null;
  nameZh: string | null;
  typeJp: string;
  typeEn: string | null;
  typeZh: string | null;
  level: number;
  imagePath: string | null;
  imageSrc: string;
  equipmentAttributesJp: string;
  equipmentAttributesEn: string | null;
  equipmentAttributesZh: string | null;
  sortOrder: number;
  status: string | null;
  effects: EquipmentEffect[];
  visibleEffects: EquipmentEffect[];
  effectSectionTitle: "流派効果" | "セット属性" | null;
};

export type EquipmentDirectoryData = {
  items: EquipmentItem[];
  equipmentItems: EquipmentItem[];
  accessoryItems: EquipmentItem[];
  source: "csv";
};

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (inQuotes) {
      if (char === "\"") {
        if (text[index + 1] === "\"") {
          field += "\"";
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }

      continue;
    }

    if (char === "\"") {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    if (char === "\r") {
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (rows.length > 0 && rows[0]?.[0]?.charCodeAt(0) === 0xfeff) {
    rows[0][0] = rows[0][0].slice(1);
  }

  return rows;
}

function toTwoHeaderRecords<T extends Record<string, string>>(text: string): TwoHeaderCsvTable<T> {
  const rows = parseCsv(text);

  if (rows.length < 2) {
    return {
      displayHeaders: [],
      keyHeaders: [],
      records: [],
    };
  }

  const displayHeaders = rows[0];
  const keyHeaders = rows[1];
  const records: T[] = [];

  for (let rowIndex = 2; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];

    if (!row || row.every((value) => value.trim().length === 0)) {
      continue;
    }

    const record = {} as T;

    for (let columnIndex = 0; columnIndex < keyHeaders.length; columnIndex += 1) {
      const key = keyHeaders[columnIndex];

      if (!key) {
        continue;
      }

      record[key as keyof T] = (row[columnIndex] ?? "") as T[keyof T];
    }

    records.push(record);
  }

  return {
    displayHeaders,
    keyHeaders,
    records,
  };
}

function parseOptionalNumber(value: string, fallbackValue: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallbackValue;
}

function normalizeNewlines(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/\\n/g, "\n").trim();
}

function normalizeOptionalText(value: string) {
  const normalized = normalizeNewlines(value);
  return normalized.length > 0 ? normalized : null;
}

function normalizeTitleAssistText(value: string) {
  const normalized = normalizeOptionalText(value);

  if (!normalized) {
    return null;
  }

  const singleLine = normalized.replace(/\s+/g, " ").trim();

  if (singleLine.length === 0) {
    return null;
  }

  if (/^\[?不明\]?$/u.test(singleLine) || /^nil$/i.test(singleLine)) {
    return null;
  }

  return singleLine;
}

function buildTitleAssistText(...values: Array<string | null>) {
  const visibleValues = values.filter((value): value is string => value !== null);
  return visibleValues.length > 0 ? visibleValues.join(" / ") : null;
}

function normalizeItemGroup(value: string): EquipmentItemGroup {
  return value === "accessory" ? "accessory" : "equipment";
}

function normalizeEffectType(value: string): EquipmentEffectType {
  return value === "set" ? "set" : "style";
}

function normalizeImagePath(value: string) {
  const normalized = normalizeOptionalText(value);

  if (!normalized) {
    return null;
  }

  return normalized;
}

function resolveImageSrc(itemGroup: EquipmentItemGroup, imagePath: string | null) {
  if (!imagePath) {
    return EQUIPMENT_PLACEHOLDER_IMAGE;
  }

  if (imagePath.startsWith("/")) {
    return imagePath;
  }

  const imageId = Number(imagePath);

  if (!Number.isInteger(imageId) || imageId <= 0) {
    return EQUIPMENT_PLACEHOLDER_IMAGE;
  }

  if (itemGroup === "accessory") {
    return `${ACCESSORY_IMAGE_BASE_PATH}/${imageId}_purple_icon_crops.png`;
  }

  return `${EQUIPMENT_IMAGE_BASE_PATH}/${imageId}_soubi_crops.png`;
}

function buildEffectRecord(row: EquipmentCsvEffectRow): EquipmentEffect {
  const effectNameEn = normalizeTitleAssistText(row.effect_name_en);
  const effectNameZh = normalizeTitleAssistText(row.effect_name_zh);

  return {
    id: row.effect_id,
    itemId: row.item_id,
    effectType: normalizeEffectType(row.effect_type),
    effectOrder: parseOptionalNumber(row.effect_order, 0),
    effectNameJp: normalizeNewlines(row.effect_name_jp),
    effectNameAssistText: buildTitleAssistText(effectNameEn, effectNameZh),
    effectNameEn,
    effectNameZh,
    activationConditionJp: normalizeOptionalText(row.activation_condition_jp),
    activationConditionEn: normalizeOptionalText(row.activation_condition_en),
    activationConditionZh: normalizeOptionalText(row.activation_condition_zh),
    effectTextJp: normalizeNewlines(row.effect_text_jp),
    effectTextEn: normalizeOptionalText(row.effect_text_en),
    effectTextZh: normalizeOptionalText(row.effect_text_zh),
    partnerItemIds: row.partner_item_ids
      .split("|")
      .map((itemId) => itemId.trim())
      .filter((itemId) => itemId.length > 0),
  };
}

function getVisibleEffects(itemGroup: EquipmentItemGroup, effects: EquipmentEffect[]) {
  const effectType = itemGroup === "accessory" ? "set" : "style";

  return effects
    .filter((effect) => effect.effectType === effectType)
    .slice()
    .sort((left, right) => left.effectOrder - right.effectOrder || left.id.localeCompare(right.id));
}

function getEffectSectionTitle(itemGroup: EquipmentItemGroup, effects: EquipmentEffect[]) {
  if (effects.length === 0) {
    return null;
  }

  return itemGroup === "accessory" ? "セット属性" : "流派効果";
}

const loadEquipmentDataset = cache(async (): Promise<EquipmentDirectoryData> => {
  const [itemsText, effectsText] = await Promise.all([
    readFile(EQUIPMENT_ITEMS_CSV_PATH, "utf8"),
    readFile(EQUIPMENT_EFFECTS_CSV_PATH, "utf8"),
  ]);
  const itemRows = toTwoHeaderRecords<EquipmentCsvItemRow>(itemsText).records;
  const effectRows = toTwoHeaderRecords<EquipmentCsvEffectRow>(effectsText).records;
  const effectsByItemId = new Map<string, EquipmentEffect[]>();

  for (const row of effectRows) {
    if (!row.effect_id || !row.item_id || !row.effect_text_jp) {
      continue;
    }

    const current = effectsByItemId.get(row.item_id) ?? [];
    current.push(buildEffectRecord(row));
    effectsByItemId.set(row.item_id, current);
  }

  const items = itemRows
    .map((row, index) => {
      if (!row.item_id || !row.name_jp || !row.type_jp || !row.level || !row.equipment_attributes_jp) {
        return null;
      }

      const itemGroup = normalizeItemGroup(row.item_group);
      const effects = (effectsByItemId.get(row.item_id) ?? [])
        .slice()
        .sort((left, right) => left.effectOrder - right.effectOrder || left.id.localeCompare(right.id));
      const visibleEffects = getVisibleEffects(itemGroup, effects);
      const imagePath = normalizeImagePath(row.image_path);
      const nameEn = normalizeTitleAssistText(row.name_en);
      const nameZh = normalizeTitleAssistText(row.name_zh);

      return {
        id: row.item_id,
        itemGroup,
        nameJp: normalizeNewlines(row.name_jp),
        nameAssistText: buildTitleAssistText(nameEn, nameZh),
        nameEn,
        nameZh,
        typeJp: normalizeNewlines(row.type_jp),
        typeEn: normalizeOptionalText(row.type_en),
        typeZh: normalizeOptionalText(row.type_zh),
        level: parseOptionalNumber(row.level, 0),
        imagePath,
        imageSrc: resolveImageSrc(itemGroup, imagePath),
        equipmentAttributesJp: normalizeNewlines(row.equipment_attributes_jp),
        equipmentAttributesEn: normalizeOptionalText(row.equipment_attributes_en),
        equipmentAttributesZh: normalizeOptionalText(row.equipment_attributes_zh),
        sortOrder: parseOptionalNumber(row.sort_order, index),
        status: normalizeOptionalText(row.status),
        effects,
        visibleEffects,
        effectSectionTitle: getEffectSectionTitle(itemGroup, visibleEffects),
      } satisfies EquipmentItem;
    })
    .filter((item): item is EquipmentItem => item !== null)
    .sort((left, right) => left.sortOrder - right.sortOrder || left.level - right.level || left.nameJp.localeCompare(right.nameJp));

  return {
    items,
    equipmentItems: items.filter((item) => item.itemGroup === "equipment"),
    accessoryItems: items.filter((item) => item.itemGroup === "accessory"),
    source: "csv",
  };
});

export async function getEquipmentDirectoryData() {
  return loadEquipmentDataset();
}

export async function getEquipmentItemById(id: string) {
  const { items } = await loadEquipmentDataset();
  return items.find((item) => item.id === id) ?? null;
}
