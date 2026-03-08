# Cards Supabase Apply

## Apply order

1. Run [supabase/migrations/20260308_create_card_tables.sql](/F:/20241107/仕事/2026ROOC/roocJP/supabase/migrations/20260308_create_card_tables.sql)
2. Run [supabase/seed/cards_seed.sql](/F:/20241107/仕事/2026ROOC/roocJP/supabase/seed/cards_seed.sql)

## What to verify

```sql
select id, card_name_jp, rarity, equip_slot, level_band, card_type, status
from public.cards
order by sort_order;
```

```sql
select c.id, t.tag_key, t.tag_label
from public.card_tags ct
join public.cards c on c.id = ct.card_id
join public.tags t on t.id = ct.tag_id
order by c.sort_order, t.sort_order;
```

```sql
select c.id, g.category_key, g.category_label
from public.card_categories cc
join public.cards c on c.id = cc.card_id
join public.categories g on g.id = cc.category_id
order by c.sort_order, g.sort_order;
```

```sql
select id, search_text
from public.cards
where id = 'fabre-card';
```

## App verification

1. Open `/cards`
2. Confirm the green status box shows `supabase`
3. Search `ファブル`, `vit`, `max_hp`
4. Filter `緑カード`, `メインウェポン`, `ステータス`
