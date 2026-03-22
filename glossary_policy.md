# Glossary Policy

## 対象

- 指定の `ver1` CSV はワークスペース内に存在しなかったため、実際に参照されている以下の2ファイルを分析対象とする。
- `src/data/equipment-csv/PATH_TO_EQUIPMENT_ITEMS_final.csv`
- `src/data/equipment-csv/PATH_TO_EQUIPMENT_EFFECTS_final.csv`

## 観察サマリ

- 両CSVとも 1行目は説明行、2行目はスキーマ行、3行目以降がデータ本体。
- `items` は 43件 / 15列、`effects` は 92件 / 14列。
- 短語カラムは `name_*`, `type_*`, `effect_name_*`。
- 長文カラムは `equipment_attributes_*`, `activation_condition_*`, `effect_text_*`。
- 長文の区切りは実改行ではなくリテラルの `\n`。
- `effects` には英語欠損が1件ある。
- `partner_item_ids` は現時点で全件空。

## 目的

- 3言語対応の日英中逆引き辞書を、表層語ベースではなく `concept_id` ベースで構築する。
- 1つの概念に対して、各言語の canonical と alias を分離して保持する。
- 長文はそのまま辞書化せず、分解後の最小単位を辞書対象とする。

## 用語エントリの単位

- 辞書の基本単位は「語」ではなく「概念」。
- 1つの概念には複数言語・複数表記をぶら下げる。
- 1つの表層語が複数概念を指す場合は、語ではなく概念側を増やし、当該表層語を `needs_review` にする。

## 推奨レコード構造

| field | purpose |
| --- | --- |
| `concept_id` | 概念の主キー |
| `category` | 概念の大分類 |
| `subtype` | 概念の細分類 |
| `language` | `jp` / `en` / `zh` |
| `surface` | 元の表層 |
| `surface_norm` | 正規化後の検索キー |
| `term_role` | `canonical` / `alias` |
| `source_file` | 出典CSV |
| `source_column` | 出典カラム |
| `source_row_id` | `item_id` または `effect_id` |
| `status` | `approved` / `needs_review` |
| `notes` | 曖昧性や補足 |

## canonical と alias

- 各 `concept_id` について、各言語で canonical は原則1件。
- 大文字小文字差、空白差、句読点差、翻訳揺れ、旧訳は alias に落とす。
- canonical 未確定の言語は空欄のままにせず、暫定 alias を保持しつつ `needs_review` にする。

## 短語の扱い

- `name_*` は `item_name` として扱う。
- `type_*` は `item_type` として扱う。
- `effect_name_*` は `effect_name` として扱う。
- 同一名が複数装備にまたがる場合でも、概念が同じなら同一 `concept_id` を再利用する。

## 長文の扱い

- `equipment_attributes_*` と `effect_text_*` は辞書の直接投入対象にしない。
- まず `\n` で分割し、各セグメントを条件句・効果句・ラベル句・フレーバー句に分解する。
- 分解後に抽出される統計語、条件語、スキル名、状態名、属性名を辞書化する。

## 逆引き要件

- `surface_norm` から `concept_id` を引けることを必須とする。
- 逆引き結果は単一候補に限定せず、複数候補を返せる設計にする。
- 複数候補時は `category`, `subtype`, `source_row_id`, `status` で絞り込めるようにする。

## `needs_review` の必須条件

- 同一言語内で複数表記が競合している。
- 翻訳が空欄、または `Nil` のようなプレースホルダしかない。
- 同一表層が別概念でも使われている。
- 長文セグメントから機械的に概念分解できない。
- 物語文と機械効果文が混在している。

