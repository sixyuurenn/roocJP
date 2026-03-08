import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "検索",
  description: "FAQ・用語集・職業一覧を横断検索できます。",
};

export default function SearchLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
