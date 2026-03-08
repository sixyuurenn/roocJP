import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "ROOC 情報サイト",
    template: "%s | ROOC 情報サイト",
  },
  description: "RO系の職業・用語・FAQ・更新履歴を整理した静的プロトタイプです。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[var(--color-page-base)] text-base-text">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 bg-[var(--color-page-base)] px-4 py-5 sm:gap-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
