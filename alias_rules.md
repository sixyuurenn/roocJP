# Alias Rules

## 基本原則

- alias は同一 `concept_id` に属する表記揺れ。
- canonical は各言語で原則1件。
- 同義と断定できないものは alias に入れず `needs_review` とする。

## alias にしてよいもの

- 大文字小文字差
- 空白差
- 記号差
- 範囲記号差
- 同義の短縮形
- 既知の旧訳、誤植修正前表記

## alias にしてはいけないもの

- 効果方向が逆のもの
- 条件が異なるもの
- ダメージ増加とダメージ減少のような極性差があるもの
- CD 系の別概念
- 翻訳が一致していても、日本語原文が競合しているもの

## 代表ルール

| canonical concept | canonical / alias candidates | handling |
| --- | --- | --- |
| `stat.attack.patk` | `PATK`, `物理攻撃`, `物理攻擊` | 同一概念として統合 |
| `stat.attack.matk` | `MATK`, `魔法攻撃`, `魔法攻擊` | 同一概念として統合 |
| `stat.resource.max_hp` | `MaxHP`, `Max HP`, `最大HP`, `生命上限` | 同一概念として統合 |
| `condition.set_piece.two_piece` | `2組のセット効果`, `2-piece Set Effect`, `2件套效果` | 同一概念として統合 |
| `condition.set_piece.three_piece` | `3点セット効果`, `3組のセット効果`, `3-piece Set Effect`, `3件套效果` | 同一概念として統合 |
| `item_type.weapon.book` | `Weapon-Book`, `Weapon·Book` | subtype で統合、表層は alias 保持 |

## `needs_review` にする実例

| candidate concept | competing surfaces | reason |
| --- | --- | --- |
| `effect_name.style.rider_set` | `ウィンドセット`, `疾風セット`, `Rider Set`, `疾風套裝` | JP canonical が競合 |
| `effect_name.style.spike` | `スパイク`, `闇盲`, `Spike`, `闇盲` | JP表記差が大きく、自動同一視は危険 |
| `effect_name.set.tears_of_fensalir_i` | `フリッグの涙 I`, zhあり、en空欄 | 英語 canonical 欠損 |
| `stat.resource.max_sp` | `魔法值`, `最大魔法值` | ZH 側の粒度差の可能性 |

## canonical 選定ルール

1. 3言語が安定して対応し、競合がない場合はその言語の主要表記を canonical にする。
2. 同一言語で競合がある場合は canonical を未確定のままにし、全候補を alias 保持して `needs_review` にする。
3. 翻訳欠損がある場合は他言語から `concept_id` を先に立て、欠損言語は保留にする。

## 逆引き時の扱い

- alias からも必ず `concept_id` を返す。
- `needs_review` な alias は候補一覧を返し、単一確定しない。
- alias の削除はしない。原文追跡のため必ず provenance を残す。

