import { glossaryItems } from "@/data/glossary";
import { getSingleValue } from "@/lib/page-utils";
import { GlossaryPageClient } from "./_components/glossary-page-client";

type GlossaryPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
};

export default async function GlossaryPage({ searchParams }: GlossaryPageProps) {
  const params = (await searchParams) ?? {};
  const initialQuery = getSingleValue(params.q).trim();

  return <GlossaryPageClient glossaryItems={glossaryItems} initialQuery={initialQuery} />;
}
