# Segmentation Rules

## 前提

- `items` の長文は全43件で `\n` 分割を含む。
- `effects` の `effect_text_*` は大半が `\n` 分割を含み、最大12セグメント。
- `activation_condition_*` は12件のみ非空。

## 分割順序

1. 説明行を除外する。
2. リテラルの `\n` を一次セグメント境界として展開する。
3. 空文字を除去する。
4. `Nil` を placeholder セグメントとして分離し、通常の効果句に混ぜない。
5. 各セグメントを条件句・効果句・ラベル句・フレーバー句へ分類する。

## セグメント種別

| segment_type | description | example |
| --- | --- | --- |
| `base_bonus` | 条件なしの基本効果 | `PATK +39` |
| `refine_condition_bonus` | 精錬条件つき効果 | `Refine +5: PATK +15` |
| `stat_scaling_bonus` | ステータス依存スケール | `PATK +3 for every 10 points of DEX` |
| `set_label` | セットラベル | `Set Effect:` |
| `set_activation` | セット数条件 | `2-piece Set Effect` |
| `proc_trigger` | 被弾・攻撃・詠唱などの発動条件 | `When attacked...` |
| `skill_modifier` | 特定スキル修飾 | `[Soul Breaker] deals MATK*300% more damage` |
| `range_stat` | 数値範囲つき基礎値 | `PATK +462~513` |
| `narrative` | 機械効果でない説明文 | `Bad omen lingers...` |
| `placeholder` | 値欠損用の文 | `Nil` |

## 条件プレフィックス抽出

- 日本語
  - `精錬+N以上の時`
  - `精錬+N時`
  - `Xが10ポイント毎に`
  - `2組のセット効果`
  - `3点セット効果`
  - `3組のセット効果`
- 英語
  - `Refine +N:`
  - `Refine +N,`
  - `For every N points of X`
  - `For every Refine +N`
  - `2-piece Set Effect`
  - `3-piece Set Effect`
- 中国語
  - `精煉+N時`
  - `精煉每+N`
  - `每N點X`
  - `2件套效果`
  - `3件套效果`

## 分割してはいけない箇所

- 角括弧で囲まれたスキル名内部
- 丸括弧内の補足
- 1セグメント内のカンマ列挙
- 1セグメント内の `%`, `+`, `-`, `*`

## 分解ルール

- `Set Effect:` は効果本体ではなく構造ラベルとして保持する。
- `2-piece Set Effect` のような行は効果本体ではなく条件概念へ落とす。
- `Refine +5: PATK +15` は1セグメントでも、条件概念と統計概念に分解する。
- `Bad omen lingers...` のような叙述文は `narrative` に落とし、機械効果の canonical にしない。

## 推奨出力単位

- 長文カラムは最終的に「文書」ではなく「セグメント列」として保持する。
- 各セグメントは `segment_order` を持つ。
- 各セグメントに対して `segment_type`, `condition_concept_ids`, `target_concept_ids`, `status` を付与する。

## `needs_review` 条件

- 条件句と効果句の境界が曖昧。
- 1セグメント内に複数の異種効果が混在する。
- narrative と mechanic が連結している。
- `Refine +N,` のように句読点揺れでパーサが不安定。

