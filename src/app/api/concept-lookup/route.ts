import { NextRequest, NextResponse } from "next/server";
import {
  isLookupMode,
  isRequestedLookupLanguage,
} from "@/lib/concept-lookup-contract";
import {
  lookupConcepts,
} from "@/lib/concept-lookup";

export const runtime = "nodejs";

function parseLimit(value: string | null) {
  if (!value) {
    return 10;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  const normalized = Math.floor(parsed);

  if (normalized < 1) {
    return null;
  }

  return Math.min(normalized, 50);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim() ?? "";
  const lang = searchParams.get("lang") ?? "auto";
  const mode = searchParams.get("mode") ?? "exact_then_normalized";
  const limit = parseLimit(searchParams.get("limit"));

  if (query.length === 0) {
    return NextResponse.json(
      {
        error: "q is required",
      },
      { status: 400 },
    );
  }

  if (!isRequestedLookupLanguage(lang)) {
    return NextResponse.json(
      {
        error: "lang must be one of ja, en, zh, auto",
      },
      { status: 400 },
    );
  }

  if (!isLookupMode(mode)) {
    return NextResponse.json(
      {
        error: "mode must be exact_only or exact_then_normalized",
      },
      { status: 400 },
    );
  }

  if (limit === null) {
    return NextResponse.json(
      {
        error: "limit must be a positive integer",
      },
      { status: 400 },
    );
  }

  const result = await lookupConcepts({
    query,
    lang,
    mode,
    limit,
  });

  return NextResponse.json(result);
}
