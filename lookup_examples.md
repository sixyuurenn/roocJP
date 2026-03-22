# Lookup Examples

## 1. Exact Lookup

入力:

```json
{
  "query": "+100 MATK",
  "lang": "en"
}
```

出力:

```json
{
  "query": "+100 MATK",
  "normalized_query": "100matk",
  "requested_lang": "en",
  "resolved_langs": ["en"],
  "hit_count": 1,
  "hits": [
    {
      "concept_id": "cond_refine_ge_15",
      "category": "condition_phrase",
      "subtype": "",
      "canonical": {
        "ja": "精錬+15時",
        "en": "Refine +15",
        "zh": "精煉+15時"
      },
      "matched_lang": "en",
      "matched_key": "+100 MATK",
      "match_stage": "exact",
      "match_type": "alias",
      "priority": 80,
      "normalized_key": "100matk"
    }
  ]
}
```

## 2. Normalized Lookup

入力:

```json
{
  "query": "CRIT +10",
  "lang": "en"
}
```

出力:

```json
{
  "query": "CRIT +10",
  "normalized_query": "crit10",
  "requested_lang": "en",
  "resolved_langs": ["en"],
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

## 3. Auto Lang Lookup

入力:

```json
{
  "query": "物理攻擊+ 477~530",
  "lang": "auto"
}
```

出力:

```json
{
  "query": "物理攻擊+ 477~530",
  "normalized_query": "物理攻擊477530",
  "requested_lang": "auto",
  "resolved_langs": ["ja", "zh"],
  "hit_count": 1,
  "hits": [
    {
      "concept_id": "effect_phrase_patk_477_530",
      "category": "effect_phrase",
      "subtype": "",
      "canonical": {
        "ja": "物理攻撃+477～530",
        "en": "PATK + 477-530",
        "zh": "物理攻擊+477~530"
      },
      "matched_lang": "zh",
      "matched_key": "物理攻擊+477~530",
      "match_stage": "normalized",
      "match_type": "canonical",
      "priority": 100,
      "normalized_key": "物理攻擊477530"
    }
  ]
}
```

## 4. Exact Japanese Lookup

入力:

```json
{
  "query": "精錬+5以上の時",
  "lang": "ja"
}
```

出力:

```json
{
  "query": "精錬+5以上の時",
  "normalized_query": "精錬5以上の時",
  "requested_lang": "ja",
  "resolved_langs": ["ja"],
  "hit_count": 1,
  "hits": [
    {
      "concept_id": "cond_refine_ge_5",
      "category": "condition_phrase",
      "subtype": "",
      "canonical": {
        "ja": "精錬+5以上の時",
        "en": "Refine +5",
        "zh": "精煉+5時"
      },
      "matched_lang": "ja",
      "matched_key": "精錬+5以上の時",
      "match_stage": "exact",
      "match_type": "canonical",
      "priority": 100,
      "normalized_key": "精錬5以上の時"
    }
  ]
}
```

## 5. No Hit

入力:

```json
{
  "query": "unknown effect",
  "lang": "en"
}
```

出力:

```json
{
  "query": "unknown effect",
  "normalized_query": "unknowneffect",
  "requested_lang": "en",
  "resolved_langs": ["en"],
  "hit_count": 0,
  "hits": [],
  "status": "no_hit"
}
```
