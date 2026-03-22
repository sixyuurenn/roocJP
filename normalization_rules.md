# Normalization Rules

## 0. 入力前処理

- 文字コードは UTF-8 として読む。
- 先頭行の説明行はデータに使わない。
- 2行目のスキーマ行を正式カラム名として使う。
- `effects` の説明行先頭セルにある BOM は無視する。
- 全カラムで前後空白を除去する。

## 1. 長文区切りの正規化

- `equipment_attributes_*`, `activation_condition_*`, `effect_text_*` では、実改行ではなくリテラルの `\n` をセグメント境界として扱う。
- CSVロード直後に `\n` を内部セパレータへ変換する。
- セグメント化前に `\n` を単純削除してはならない。

## 2. 共通表記正規化

- Unicode は NFKC ベースで正規化する。
- `+ 462-513`, `+462~513`, `+ 330~367` のような数値範囲は構造化して保持する。
- 範囲記号 `~` と `-` は検索キー上は同値にする。
- 連続空白は1つに畳む。
- `Nil` は概念ではなく null 扱いとする。

## 3. 英語正規化

- ステータス略語は大文字 canonical に寄せる。
- 例: `Str` -> `STR`, `Dex` -> `DEX`, `Int` -> `INT`
- `MaxHP` / `Max HP` は同一概念として扱う。
- `MaxSP` / `Max SP` は同一概念として扱う。
- `Refine +6:` と `Refine +6,` は条件プレフィックスとして同値にする。
- `Weapon-Bow`, `Weapon-Book`, `Weapon-Katar`, `Weapon-Knuckles` のハイフン差は、表層 alias として残しつつ subtype では統一する。

## 4. 日本語正規化

- 英字略語は原文を保持しつつ、検索キーでは大文字へ寄せる。
- `精錬+5以上の時` と `精錬+5時` は構造化条件上は同じ `refine_ge_5` に寄せる。
- `3点セット効果` と `3組のセット効果` は同一のセット数条件として正規化する。
- `Str`, `Dex`, `Agi`, `Int`, `Vit`, `Luk` と、日本語完全語形は同一統計概念に束ねる。
- 例: `Vit` と `体力`、`Str` と `力`、`Int` と `知力`

## 5. 中国語正規化

- 対象データは繁体字中国語として扱う。
- `物理攻擊`, `魔法攻擊`, `魔法防禦` などは繁体字 canonical を優先する。
- `2件套效果`, `3件套效果` はセット条件概念へ構造化する。
- `魔法值` と `最大魔法值` は現状では同一候補があるが、語義差の可能性があるため自動統合せず `needs_review` にする。

## 6. 3言語対応の代表マッピング

| concept_id | jp | en | zh |
| --- | --- | --- | --- |
| `stat.attack.patk` | 物理攻撃 | PATK | 物理攻擊 |
| `stat.attack.matk` | 魔法攻撃 | MATK | 魔法攻擊 |
| `stat.defense.pdef` | 物理防御 | PDEF | 物理防禦 |
| `stat.defense.mdef` | 魔法防御 | MDEF | 魔法防禦 |
| `stat.speed.aspd` | 攻撃速度 | ASPD | 攻擊速度 |
| `stat.resource.max_hp` | MaxHP / 最大HP | Max HP | 生命上限 |
| `stat.resource.max_sp` | MaxSP / 最大MP | Max SP | 魔法值 |

## 7. 自動統合してよい揺れ

- 大文字小文字差
- 空白差
- `:` と `,` のみの条件記号差
- `~` と `-` の範囲記号差
- `MaxHP` と `Max HP`
- `MaxSP` と `Max SP`

## 8. 自動統合してはいけない揺れ

- `PDMG` と `PDMG Reduction`
- `Healing Done` と `Healing Taken`
- `Cooldown` と `Internal CD`
- `Global CD` と `Variable CT` と `Fixed CT`
- `魔法值` と `最大魔法值`
- `Rider Set` に紐づく `ウィンドセット` と `疾風セット`
- `Spike` に紐づく `スパイク` と `闇盲`

