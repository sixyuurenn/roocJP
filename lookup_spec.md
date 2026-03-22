# Lookup Spec

## 1. Scope

- この仕様は `reverse_lookup_index_core.csv` を使った安定運用向け逆引き検索を定義する。
- 検索対象は `concept_dictionary_core.csv` に含まれる `approved` concept のみとする。
- `needs_review` 系データは検索対象に含めない。
- 実装入口は `GET /api/concept-lookup` を基準とする。

## 2. Input

```json
{
  "query": "CRIT +10",
  "lang": "en",
  "mode": "exact_then_normalized"
}
```

- `query`: 必須。ユーザー入力文字列。
- `lang`: 必須。`ja` / `en` / `zh` / `auto`。
- `mode`: 任意。既定値は `exact_then_normalized`。

API 例:

```text
GET /api/concept-lookup?q=CRIT%20%2B10&lang=en&mode=exact_then_normalized&limit=10
```

## 3. Data Sources

- `reverse_lookup_index_core.csv`
  - 列: `lookup_key,lang,concept_id,match_type,priority,normalized_key`
- `concept_dictionary_core.csv`
  - `concept_id` で join し、canonical と `category` / `subtype` を返す。

## 4. Normalization

`normalized_key` は `normalization_rules.md` に沿って次を行う。

- Unicode を NFKC 正規化
- 英字を小文字化
- 全角半角差を吸収
- 連続空白を除去
- `〜` / `～` を `~` に統一
- ダッシュ類を `-` に統一
- `：` を `:`, `／` を `/`, `％` を `%` に統一
- 記号揺れを吸収したうえで、検索に不要な記号を除去

## 5. Lang Resolution

`lang=auto` は次の順で解決する。

1. ひらがな・カタカナを含む場合は `["ja"]`
2. ASCII 英数字と記号のみで構成される場合は `["en"]`
3. 漢字のみを含む場合は `["ja", "zh"]`

補足:

- `auto` で複数言語を検索する場合は、各言語ごとに同じ手順で検索し、`concept_id` 単位で統合する。
- 同一 `concept_id` が複数言語から返る場合は、`exact` 優先、次に `priority` 高い方を採用する。

## 6. Lookup Procedure

1. `query` を trim する。
2. 空文字なら `400` 相当の入力エラーを返す。
3. `lang` を解決する。`auto` の場合は 5章の規則を使う。
4. 各対象言語について `lookup_key == query` の完全一致を検索する。
5. 完全一致が 0 件なら、`query` から `normalized_query` を生成し、`normalized_key == normalized_query` を検索する。
6. `concept_dictionary_core.csv` を `concept_id` で join し、canonical 情報を付与する。
7. 結果を以下の優先順で整列する。

- `match_stage`: `exact` を先、`normalized` を後
- `priority`: 降順。`canonical=100`, `alias=80`
- `concept_id`: 昇順

## 7. Output

```json
{
  "query": "CRIT +10",
  "normalized_query": "crit10",
  "requested_lang": "en",
  "resolved_langs": ["en"],
  "mode": "exact_then_normalized",
  "hit_count": 1,
  "hits": [
    {
      "concept_id": "effect_phrase_crit_10",
      "category": "effect_phrase",
      "subtype": "",
      "canonical": {
        "ja": "クリティカル+10",
        "en": "CRIT+10",
        "zh": "暴擊+10點"
      },
      "matched_lang": "en",
      "matched_key": "CRIT+10",
      "match_stage": "normalized",
      "match_type": "canonical",
      "priority": 100,
      "normalized_key": "crit10"
    }
  ]
}
```

## 8. Priority Rules

- `priority=100`: canonical
- `priority=80`: alias
- 実装では `match_stage` を `priority` より先に評価する
- つまり `exact alias` は `normalized canonical` より上位に置く

推奨ソートキー:

1. `match_stage_rank` (`exact=0`, `normalized=1`)
2. `priority` desc
3. `concept_id` asc

## 9. No-Hit Behavior

ヒット 0 件時は空配列を返す。

```json
{
  "query": "unknown effect",
  "normalized_query": "unknowneffect",
  "requested_lang": "en",
  "resolved_langs": ["en"],
  "mode": "exact_then_normalized",
  "hit_count": 0,
  "hits": [],
  "status": "no_hit"
}
```

補足:

- `no_hit` 時に `review` 辞書へ自動フォールバックしない。
- `lang=ja` / `en` / `zh` 指定時は他言語へ拡張しない。

## 10. Implementation Notes

- `reverse_lookup_index_core.csv` は正規化後の曖昧キーを事前除外しているため、安全側の逆引き index として使える。
- 検索 API は `reverse_lookup_index_core.csv` のみで hit 判定し、表示情報は `concept_dictionary_core.csv` から補う。
- 返却件数制限を設ける場合は `limit=10` を既定値とし、ソート後に先頭から返す。
- 実装ファイル:
  - `src/lib/concept-lookup.ts`
  - `src/app/api/concept-lookup/route.ts`
