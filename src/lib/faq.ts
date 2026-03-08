import { faqItems, type FaqItem } from "@/data/faq";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type FaqRow = {
  question: string | null;
  answer: string | null;
  sort_order: number | null;
  is_published: boolean | null;
};

function toFaqItem(row: FaqRow): FaqItem | null {
  if (
    typeof row.question !== "string" ||
    row.question.length === 0 ||
    typeof row.answer !== "string" ||
    row.answer.length === 0
  ) {
    return null;
  }

  return {
    q: row.question,
    a: row.answer,
  };
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return faqItems;
  }

  const { data, error } = await supabase
    .from("faq")
    .select("question, answer, sort_order, is_published")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return faqItems;
  }

  const remoteItems = data.map(toFaqItem).filter((item): item is FaqItem => item !== null);

  return remoteItems.length > 0 ? remoteItems : faqItems;
}
