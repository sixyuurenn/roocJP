# Test Report

## 1. Current Deliverables

- `concept_dictionary_core.csv`: 398 rows
- `concept_dictionary_review.csv`: 219 rows
- `review_candidates.csv`: 219 rows
- `reverse_lookup_index_core.csv`: 1273 rows
- `test_queries.csv`: 135 rows

## 2. Index Validation Result

- 正規化後に複数 concept へ衝突する曖昧キー 35件は index から除外済み
- 同一 concept 内で正規化後に同一キーへ畳み込まれる 3件は canonical 優先で統合済み
- `reverse_lookup_index_core.csv` 内の `lang + normalized_key` 重複は最終状態で 0件

## 3. Query Replay Result

`test_queries.csv` を `reverse_lookup_index_core.csv` に対して replay した結果:

- 総件数: 135
- exact hit: 132
- normalized fallback hit: 3
- miss: 0
- expected `concept_id` 一致: 135 / 135

言語分布:

- `ja`: 34
- `en`: 45
- `zh`: 56

normalized fallback で解決した代表例:

- `CRIT +10` -> `effect_phrase_crit_10`
- `物理攻撃+477〜530` -> `effect_phrase_patk_477_530`
- `物理攻擊+ 477~530` -> `effect_phrase_patk_477_530`

## 4. Verification Procedure

実行コマンド:

```bash
npm run verify:lookup
```

1. `reverse_lookup_index_core.csv` を読み込む
2. `concept_dictionary_core.csv` を `concept_id` キーで参照できるようにする
3. `test_queries.csv` の各行について `query` と `lang` を入力する
4. `lookup_spec.md` の手順どおりに `exact` を先に実行する
5. `exact` が 0 件なら `normalized` を実行する
6. 先頭 hit の `concept_id` を `expected_concept_id` と比較する
7. `exact_hit`, `normalized_hit`, `miss`, `expected_match_rate` を集計する

合格条件:

- `miss = 0`
- `expected_match_rate = 100%`
- `lang + normalized_key` 重複 = 0

## 5. Known Limitations

- 現在の `test_queries.csv` は `alias_exact` 系に偏っている
- `lang=auto` の専用テストケースは仕様例としては定義済みだが、回帰テスト集合にはまだ十分入っていない
- `needs_review` 側の concept は本 index に含めていない

## 6. Done Criteria

この辞書基盤を「完成」とみなす条件:

- `approved` と `needs_review` が分離され、検索系が `core` のみを参照する
- `reverse_lookup_index_core.csv` に正規化後重複がない
- 曖昧な正規化キーが index から除外されている
- `lookup_spec.md` に exact / normalized / `lang=auto` / no-hit の挙動が固定されている
- `lookup_examples.md` に実装用 JSON 例が揃っている
- `test_queries.csv` を使った replay で 100% 一致が再現できる
- `review_candidates.csv` が人手レビューの入口として運用できる
