export type UpdateItem = {
  date: string;
  title: string;
  detail: string;
};

export const updateItems: UpdateItem[] = [
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
