export type UpdateItem = {
  date: string;
  title: string;
  detail: string;
};

export const updateItems: UpdateItem[] = [
  {
    date: "2026-03-09",
    title: "装備図鑑をDB読みに切替",
    detail:
      "equipment_items・equipment_genres・equipment_genre_members・equipment_tags・equipment_item_tags を前提に、装備図鑑を Supabase / フォールバック対応のDB読みに切り替えました。装備ステータス本体のみを保持し、ジャンル効果を長文で扱える構成に整理しました。",
  },
  {
    date: "2026-03-09",
    title: "装備名とスロット数を正規化",
    detail:
      "アクセサリー名の [2] のような表記を display 名から外し、raw 名と card_slots を分離しました。装備部位、ジャンルバケット、Lv、戦闘力、装備評価で整理できる土台を追加しました。",
  },
  {
    date: "2026-03-09",
    title: "カード図鑑の表示を整理",
    detail:
      "カード図鑑に収納効果を追加し、中文表示を削除しました。PC表示では不要な補助文・type・status・Lv帯表示を外し、基本効果 / 進化効果 / 収納効果を見やすく整理しました。",
  },
  {
    date: "2026-03-08",
    title: "カード図鑑をDBファースト化",
    detail:
      "cards・tags・card_tags・categories・card_categories を追加し、カード名検索、効果本文検索、レアリティ / 部位 / 効果カテゴリの絞り込みに対応しました。ファブルカードを基準データとして seed し、フォールバック判別も画面で確認できるようにしました。",
  },
  {
    date: "2026-03-08",
    title: "FAQと職業スキル一覧をSupabase対応",
    detail:
      "FAQ は public.faq を参照し、取得失敗時はローカルデータへフォールバックする構成に変更しました。職業詳細のスキル一覧は public.skills・public.skill_tags・public.skill_diff_stats を参照するDB読みへ切り替えました。",
  },
  {
    date: "2026-03-08",
    title: "職業詳細のスキル比較UIを追加",
    detail:
      "職層タブと Lv1 / LvMAX 切替を追加し、LvMAX 時のみ本文中と数値欄の変化値を赤太字で強調する表示を実装しました。空状態も含めて一覧内で完結できる構成に整理しました。",
  },
  {
    date: "2026-03-08",
    title: "サイト骨組みを作成",
    detail: "トップ、FAQ、用語集、更新履歴、職業一覧、検索を追加しました。",
  },
  {
    date: "2026-03-08",
    title: "ダミーデータを追加",
    detail: "各ページで表示確認できる仮データを配置しました。",
  },
  {
    date: "2026-03-08",
    title: "図鑑ページを追加",
    detail: "カード図鑑と装備図鑑の土台ページを追加しました。",
  },
];
