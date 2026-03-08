begin;

insert into public.categories (category_key, category_label, sort_order)
values
  ('recommended_type', '推奨タイプ', 10),
  ('status', 'ステータス', 20),
  ('element', '属性', 30),
  ('race', '種族', 40),
  ('size', 'サイズ', 50),
  ('penalty', 'ペナルティ', 60),
  ('skill', 'スキル', 70),
  ('other', 'その他', 80),
  ('special_effect', '特殊効果', 90)
on conflict (category_key) do update set
  category_label = excluded.category_label,
  sort_order = excluded.sort_order;

insert into public.tags (tag_key, tag_label, tag_group, sort_order)
values
  ('vit', 'VIT', 'status', 10),
  ('max_hp', 'MaxHP', 'status', 20),
  ('main_weapon', 'メインウェポン', 'equip_slot', 30),
  ('str', 'STR', 'status', 40),
  ('dex', 'DEX', 'status', 50),
  ('physical_damage', '物理ダメージ', 'effect', 60),
  ('magic_damage', '魔法ダメージ', 'effect', 70),
  ('stun', 'スタン', 'status_effect', 80),
  ('freeze', '凍結', 'status_effect', 90),
  ('refine_conditional', '精錬条件', 'condition', 100),
  ('pvp', 'PvP', 'content', 110),
  ('mvp', 'MVP', 'content', 120)
on conflict (tag_key) do update set
  tag_label = excluded.tag_label,
  tag_group = excluded.tag_group,
  sort_order = excluded.sort_order;

delete from public.cards
where id in ('dummy-assault-card', 'dummy-freeze-card', 'dummy-stun-card', 'dummy-arcane-card');

insert into public.cards (
  id,
  card_name_jp,
  card_name_en,
  rarity,
  equip_slot,
  level_band,
  card_type,
  icon_url,
  artwork_url,
  sort_order,
  status,
  effect_text_base,
  effect_text_evolution,
  effect_text_storage,
  search_text
)
values
  (
    'fabre-card',
    'ファブルカード',
    'Fabre Card',
    '緑カード',
    'メインウェポン',
    'Lv.1-Lv.20',
    'normal',
    '/images/cards/placeholder.svg',
    '/images/cards/placeholder.svg',
    10,
    'published',
    E'Vit+1\nMaxHP+100',
    E'Lv.5 MaxHP+1.50%\nLv.10 Vit+2\nLv.15 MaxHP+100',
    '魔法攻撃+2',
    ''
  )
on conflict (id) do update set
  card_name_jp = excluded.card_name_jp,
  card_name_en = excluded.card_name_en,
  rarity = excluded.rarity,
  equip_slot = excluded.equip_slot,
  level_band = excluded.level_band,
  card_type = excluded.card_type,
  icon_url = excluded.icon_url,
  artwork_url = excluded.artwork_url,
  sort_order = excluded.sort_order,
  status = excluded.status,
  effect_text_base = excluded.effect_text_base,
  effect_text_evolution = excluded.effect_text_evolution,
  effect_text_storage = excluded.effect_text_storage,
  search_text = excluded.search_text,
  updated_at = now();

delete from public.card_tags
where card_id in (
  'fabre-card'
);

insert into public.card_tags (card_id, tag_id)
select relation.card_id, tags.id
from (
  values
    ('fabre-card', 'vit'),
    ('fabre-card', 'max_hp'),
    ('fabre-card', 'main_weapon')
) as relation(card_id, tag_key)
join public.tags on tags.tag_key = relation.tag_key
on conflict do nothing;

delete from public.card_categories
where card_id in (
  'fabre-card'
);

insert into public.card_categories (card_id, category_id)
select relation.card_id, categories.id
from (
  values
    ('fabre-card', 'status'),
    ('fabre-card', 'other')
) as relation(card_id, category_key)
join public.categories on categories.category_key = relation.category_key
on conflict do nothing;

update public.cards
set search_text = public.build_card_search_text(
  public.cards.card_name_jp,
  public.cards.card_name_en,
  public.cards.rarity,
  public.cards.equip_slot,
  public.cards.level_band,
  public.cards.card_type,
  public.cards.effect_text_base,
  public.cards.effect_text_evolution,
  public.cards.effect_text_storage,
  (
    select coalesce(array_agg(concat(tags.tag_key, ' ', tags.tag_label) order by tags.sort_order), '{}')
    from public.card_tags
    join public.tags on tags.id = public.card_tags.tag_id
    where public.card_tags.card_id = public.cards.id
  ),
  (
    select coalesce(array_agg(concat(categories.category_key, ' ', categories.category_label) order by categories.sort_order), '{}')
    from public.card_categories
    join public.categories on categories.id = public.card_categories.category_id
    where public.card_categories.card_id = public.cards.id
  )
)
where public.cards.id = 'fabre-card';

commit;
