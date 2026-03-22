export type GlossaryItem = {
  term: string;
  description: string;
};

export const glossaryItems: GlossaryItem[] = [
  { term: "PATK", description: "物理攻撃力を表す用語です。検索では「物理攻撃」「物理攻擊」と同じ概念として扱います。" },
  { term: "ASPD", description: "攻撃速度を表すステータスです。" },
  { term: "Flee", description: "回避率に関わるステータスです。" },
  { term: "MVP", description: "フィールドに出現する強力なボスモンスターです。" },
  { term: "ET", description: "エンドレスタワーの略称です。" },
];
