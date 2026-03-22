import type {
  ConceptLookupResult,
  LookupMode,
  RequestedLookupLanguage,
} from "@/lib/concept-lookup-contract";

type FetchConceptLookupOptions = {
  query: string;
  lang?: RequestedLookupLanguage;
  mode?: LookupMode;
  limit?: number;
  signal?: AbortSignal;
};

type ErrorPayload = {
  error?: string;
};

function buildErrorMessage(payload: ErrorPayload | null, response: Response) {
  if (payload?.error) {
    return payload.error;
  }

  return `lookup request failed (${response.status})`;
}

export async function fetchConceptLookup(options: FetchConceptLookupOptions) {
  const query = options.query.trim();

  if (!query) {
    throw new Error("query must not be empty");
  }

  const searchParams = new URLSearchParams({
    q: query,
    lang: options.lang ?? "auto",
    mode: options.mode ?? "exact_then_normalized",
  });

  if (typeof options.limit === "number" && Number.isFinite(options.limit)) {
    searchParams.set("limit", String(options.limit));
  }

  const response = await fetch(`/api/concept-lookup?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
    signal: options.signal,
  });

  let payload: ConceptLookupResult | ErrorPayload | null = null;

  try {
    payload = (await response.json()) as ConceptLookupResult | ErrorPayload;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(buildErrorMessage(payload as ErrorPayload | null, response));
  }

  return payload as ConceptLookupResult;
}
