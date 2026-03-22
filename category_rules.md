# Category Rules

## 基本方針

- `category` は概念の大分類。
- `subtype` はその category 内の細分類。
- `item_group`, `type_*`, `effect_type` は category/subtype 設計へ変換して使う。

## category 一覧

| category | subtype examples | source columns |
| --- | --- | --- |
| `item_name` | `accessory`, `equipment` | `name_*`, `item_group` |
| `item_type` | `accessory`, `armor`, `cloak`, `shoes`, `off_hand`, `weapon.*` | `type_*` |
| `effect_name` | `style`, `set` | `effect_name_*`, `effect_type` |
| `stat` | `primary`, `attack`, `defense`, `damage`, `resource`, `speed`, `critical`, `cooldown` | 長文分解結果 |
| `condition` | `refine`, `set_piece`, `stat_threshold`, `per_refine`, `equip_combo`, `base_level`, `trigger` | `activation_condition_*`, 長文分解結果 |
| `skill_name` | `active`, `passive`, `proc` | 長文分解結果 |
| `status_name` | `ailment`, `buff`, `debuff` | 長文分解結果 |
| `element_name` | `fire`, `water`, `wind`, `earth`, `shadow`, `undead` | 長文分解結果 |
| `text_marker` | `set_label`, `placeholder`, `narrative` | 長文分解結果 |
| `template` | `flat_bonus`, `percent_bonus`, `range_bonus`, `reduction`, `proc`, `auto_cast`, `shield` | 長文分解結果 |

## `item_name` ルール

- `item_group=accessory` は `category=item_name`, `subtype=accessory`。
- `item_group=equipment` は `category=item_name`, `subtype=equipment`。
- 装備名そのものと装備種別は別概念にする。

## `item_type` ルール

- `Accessory`, `Armor`, `Cloak`, `Shoes`, `Off-Hand` は独立 subtype。
- 武器型は `weapon.<normalized_type>` に統一する。

## 現データで想定する `item_type` subtype

- `accessory`
- `armor`
- `cloak`
- `shoes`
- `off_hand`
- `weapon.dagger`
- `weapon.one_h_sword`
- `weapon.two_h_sword`
- `weapon.one_h_spear`
- `weapon.two_h_spear`
- `weapon.one_h_axe`
- `weapon.two_h_axe`
- `weapon.mace`
- `weapon.wand`
- `weapon.staff`
- `weapon.bow`
- `weapon.knuckles`
- `weapon.musical_instrument`
- `weapon.whip`
- `weapon.book`
- `weapon.katar`
- `weapon.crossbow_blade`
- `weapon.foxtail_grass`

## `effect_name` ルール

- `effect_type=style` は `category=effect_name`, `subtype=style`。
- `effect_type=set` は `category=effect_name`, `subtype=set`。
- 同名効果が複数装備に付いていても、概念が同じなら同一 `concept_id` を使う。

## `stat` ルール

- `STR`, `DEX`, `AGI`, `INT`, `VIT`, `LUK` は `subtype=primary`。
- `PATK`, `MATK` は `subtype=attack`。
- `PDEF`, `MDEF` は `subtype=defense`。
- `PDMG`, `MDMG`, `Healing Done`, `Healing Taken`, `DMG Reduction` は `subtype=damage`。
- `Max HP`, `Max SP`, `HP Recovery`, `SP Consumption` は `subtype=resource`。
- `ASPD`, `MSPD` は `subtype=speed`。
- `CRIT`, `CRIT DMG`, `CRIT RES`, `CRIT DMG RES` は `subtype=critical`。
- `Global CD`, `Fixed CT`, `Variable CT`, `Cooldown`, `Internal CD` は `subtype=cooldown`。

## `condition` ルール

- `Refine +N` 系は `subtype=refine`。
- `For every Refine +N` 系は `subtype=per_refine`。
- `2-piece Set Effect`, `3件套效果` 系は `subtype=set_piece`。
- `For every 10 points of STR` 系は `subtype=stat_threshold`。
- `If equipped together with ...` 系は `subtype=equip_combo`。
- `When attacked`, `When healed`, `When casting` 系は `subtype=trigger`。
- `Based on your Base level` 系は `subtype=base_level`。

## `text_marker` ルール

- `Set Effect:` は `subtype=set_label`。
- `Nil` は `subtype=placeholder`。
- `Bad omen lingers...` のような叙述文は `subtype=narrative`。

## `needs_review` ルール

- `partner_item_ids` が空のため、セット相手装備を推定で補う場合。
- `item_type` の句読点だけでなく語そのものが競合する場合。
- `effect_name` で同一英中に対して日本語が複数ある場合。
- 長文セグメントから category/subtype を一意に振れない場合。

