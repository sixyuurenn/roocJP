begin;

insert into public.equipment_genres (
  genre_name_jp,
  genre_bucket,
  genre_attribute_text,
  genre_set_effect_text,
  search_text,
  sort_order,
  status
)
values
  (
    'ゴヴニュセット',
    'armor_set',
    E'Vit+1\nMaxHP+2%\n精錬+3時、体力+1\n精錬+6時、物理防御+4%\n精錬+10時、魔法防御+4%',
    E'3組のセット効果\n水・風・地・火属性のダメージを5%軽減、最大HP+8%',
    '',
    10,
    'published'
  ),
  (
    'テュールの祝福',
    'armor_set',
    E'Str+1\n物理ダメージ増加+2%\n精錬+3時、力+1\n精錬+6時、物理攻撃+2\n精錬+10時、物理攻撃+3%',
    E'3組のセット効果\n1ポイントの力ごとに攻撃力が1ポイント追加される',
    '',
    20,
    'published'
  ),
  (
    'スプリントセット',
    'armor_set',
    E'Int+1\n魔法ダメージ増加+2%\n精錬+3時、知力+1\n精錬+6時、魔法攻撃+2\n精錬+10時、魔法攻撃+3%',
    E'3組のセット効果\n最大魔法+5%、共通クールダウン-10%、魔法ダメージ+8%',
    '',
    30,
    'published'
  )
on conflict (genre_name_jp) do update set
  genre_bucket = excluded.genre_bucket,
  genre_attribute_text = excluded.genre_attribute_text,
  genre_set_effect_text = excluded.genre_set_effect_text,
  sort_order = excluded.sort_order,
  status = excluded.status;

insert into public.equipment_tags (tag_key, tag_label, tag_group, sort_order)
values
  ('physical_defense', '物理防御', 'status', 10),
  ('hp', 'HP', 'status', 20),
  ('physical_attack', '物理攻撃', 'status', 30),
  ('agi', 'Agi', 'status', 40),
  ('max_hp', 'MaxHP', 'status', 50),
  ('physical_damage', '物理ダメージ増加', 'effect', 60),
  ('magic_damage', '魔法ダメージ増加', 'effect', 70),
  ('refine_conditional', '精錬条件', 'condition', 80),
  ('job_swordsman', 'ソードマン', 'job', 110),
  ('job_mage', 'マジシャン', 'job', 120),
  ('job_archer', 'アーチャー', 'job', 130),
  ('job_acolyte', 'アコライト', 'job', 140),
  ('job_thief', 'シーフ', 'job', 150),
  ('job_merchant', 'マーチャント', 'job', 160),
  ('job_doram', 'ドラム', 'job', 170)
on conflict (tag_key) do update set
  tag_label = excluded.tag_label,
  tag_group = excluded.tag_group,
  sort_order = excluded.sort_order;

insert into public.equipment_items (
  id,
  item_name_jp_display,
  item_name_jp_raw,
  item_name_en,
  equip_slot,
  genre_bucket,
  level,
  battle_power,
  equipment_score,
  card_slots,
  status_text_core,
  search_text,
  icon_url,
  artwork_url,
  sort_order,
  status
)
values
  (
    'aurora-mantle',
    '曙光のマント',
    '曙光のマント',
    null,
    '肩にかける物',
    'armor_set',
    70,
    null,
    0,
    null,
    E'物理防御+130〜144\nHP+1020〜1200',
    '',
    '/images/equipment/placeholder.svg',
    '/images/equipment/placeholder.svg',
    10,
    'published'
  ),
  (
    'brooch-2',
    'ブローチ',
    'ブローチ[2]',
    null,
    'アクセサリー',
    'accessory',
    85,
    3015,
    null,
    2,
    E'物理攻撃+51\nAgi+2\nAgiが20ポイント毎に、攻撃速度+1%\n精錬+5以上の時、Agi+2',
    '',
    '/images/equipment/placeholder.svg',
    '/images/equipment/placeholder.svg',
    20,
    'published'
  )
on conflict (id) do update set
  item_name_jp_display = excluded.item_name_jp_display,
  item_name_jp_raw = excluded.item_name_jp_raw,
  item_name_en = excluded.item_name_en,
  equip_slot = excluded.equip_slot,
  genre_bucket = excluded.genre_bucket,
  level = excluded.level,
  battle_power = excluded.battle_power,
  equipment_score = excluded.equipment_score,
  card_slots = excluded.card_slots,
  status_text_core = excluded.status_text_core,
  icon_url = excluded.icon_url,
  artwork_url = excluded.artwork_url,
  sort_order = excluded.sort_order,
  status = excluded.status,
  updated_at = now();

delete from public.equipment_genre_members
where equipment_id in ('aurora-mantle', 'brooch-2');

insert into public.equipment_genre_members (equipment_id, genre_id)
select relation.equipment_id, genres.id
from (
  values
    ('aurora-mantle', 'ゴヴニュセット'),
    ('aurora-mantle', 'テュールの祝福'),
    ('aurora-mantle', 'スプリントセット')
) as relation(equipment_id, genre_name_jp)
join public.equipment_genres as genres on genres.genre_name_jp = relation.genre_name_jp
on conflict do nothing;

delete from public.equipment_item_tags
where equipment_id in ('aurora-mantle', 'brooch-2');

insert into public.equipment_item_tags (equipment_id, tag_id)
select relation.equipment_id, tags.id
from (
  values
    ('aurora-mantle', 'physical_defense'),
    ('aurora-mantle', 'hp'),
    ('brooch-2', 'physical_attack'),
    ('brooch-2', 'agi'),
    ('brooch-2', 'refine_conditional')
) as relation(equipment_id, tag_key)
join public.equipment_tags as tags on tags.tag_key = relation.tag_key
on conflict do nothing;

update public.equipment_genres
set search_text = public.build_equipment_genre_search_text(
  public.equipment_genres.genre_name_jp,
  public.equipment_genres.genre_bucket,
  public.equipment_genres.genre_attribute_text,
  public.equipment_genres.genre_set_effect_text
)
where public.equipment_genres.genre_name_jp in ('ゴヴニュセット', 'テュールの祝福', 'スプリントセット');

update public.equipment_items
set search_text = public.build_equipment_search_text(
  public.equipment_items.item_name_jp_display,
  public.equipment_items.item_name_jp_raw,
  public.equipment_items.item_name_en,
  public.equipment_items.equip_slot,
  public.equipment_items.genre_bucket,
  public.equipment_items.level,
  public.equipment_items.battle_power,
  public.equipment_items.equipment_score,
  public.equipment_items.card_slots,
  public.equipment_items.status_text_core,
  (
    select coalesce(array_agg(concat(tags.tag_key, ' ', tags.tag_label) order by tags.sort_order), '{}')
    from public.equipment_item_tags as item_tags
    join public.equipment_tags as tags on tags.id = item_tags.tag_id
    where item_tags.equipment_id = public.equipment_items.id
  ),
  (
    select coalesce(array_agg(concat(genres.genre_name_jp, ' ', genres.genre_bucket) order by genres.sort_order), '{}')
    from public.equipment_genre_members as members
    join public.equipment_genres as genres on genres.id = members.genre_id
    where members.equipment_id = public.equipment_items.id
  )
)
where public.equipment_items.id in ('aurora-mantle', 'brooch-2');

commit;
