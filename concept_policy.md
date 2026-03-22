# Concept Policy

## 基本方針

- 辞書の主語は表層語ではなく `concept_id`。
- CSVの行は「概念の出典」であり、「概念そのもの」ではない。
- 1行の長文から複数の `concept_id` を抽出してよい。

## 概念レイヤー

1. 実体概念
   - 装備名
   - 効果名
   - スキル名
   - 属性名
   - 状態名
2. 機械概念
   - PATK, MDEF, ASPD, Healing Taken などの統計・効果軸
3. 条件概念
   - 精錬条件
   - セット数条件
   - 装備同時条件
   - ステータス閾値条件
   - 発動トリガー
4. 構造概念
   - Set Effect ラベル
   - placeholder
   - narrative/flavor 文

## `concept_id` 命名規則

- 形式は `category.subtype.slug` を基本とする。
- 可能な限り語義中心で命名し、出典行IDをそのまま使わない。
- 英数字小文字とドットのみを使い、空白は使わない。

## 推奨例

| concept_id | meaning |
| --- | --- |
| `item_name.accessory.glove_2` | グローブ[2] |
| `item_type.accessory.accessory` | アクセサリー |
| `item_type.weapon.one_h_sword` | 片手剣 |
| `effect_name.style.goibnes_set` | ゴヴニュセット |
| `effect_name.set.ruptured_moon_shadow` | 裂かれた月影 |
| `stat.attack.patk` | PATK / 物理攻撃 / 物理攻擊 |
| `stat.defense.mdef` | MDEF / 魔法防御 / 魔法防禦 |
| `stat.speed.aspd` | ASPD / 攻撃速度 / 攻擊速度 |
| `condition.refine.ge_5` | 精錬+5以上 / Refine +5 |
| `condition.set_piece.two_piece` | 2組のセット効果 / 2-piece Set Effect |
| `skill.active.soul_breaker` | Soul Breaker / マインドショック / 心靈震波 |
| `status.ailment.poisoned` | 中毒 / Poisoned / 中毒 |

## 共有概念と出典行の分離

- `Goibne's Set` のように複数装備で再利用される効果名は、装備ごとに `concept_id` を増やさない。
- 出典側では `source_row_id` と `effect_order` を持ち、概念側では共通IDを参照する。
- つまり「概念の共有」と「出典の複数性」を分離する。

## 長文セグメントの概念化

- 1セグメントに複数概念が含まれてよい。
- 例: `Refine +5: PATK +15` は最低でも以下に分かれる。
- `condition.refine.ge_5`
- `stat.attack.patk`
- `template.flat_bonus`

## `concept_id` を新規発行する条件

- 機械的意味が異なる。
- 条件の種類が異なる。
- ラベルではなく別の実体を指している。
- alias にすると情報が落ちる。

## `concept_id` を共有する条件

- 言語違いだけで意味が一致する。
- 大文字小文字、空白、記号差のみ。
- 同義語、旧訳、誤植修正後の同一概念。
- 同一効果名が複数装備に紐づく。

## `needs_review` にする条件

- 同一表層が複数概念候補を持つ。
- 同一概念候補に対して同一言語の表記が競合する。
- 英語欠損などで3言語対応が埋まらない。
- セット関係が `partner_item_ids` から取得できず、文脈推定に依存する。

