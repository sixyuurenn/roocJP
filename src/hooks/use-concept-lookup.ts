"use client";

import { useEffect, useState } from "react";
import { fetchConceptLookup } from "@/lib/concept-lookup-client";
import type { ConceptLookupResult } from "@/lib/concept-lookup-contract";

export type ConceptLookupUiState = "idle" | "loading" | "results" | "no_hit" | "error";

type UseConceptLookupResult = {
  state: ConceptLookupUiState;
  result: ConceptLookupResult | null;
  errorMessage: string | null;
};

export function useConceptLookup(query: string, requestKey: number): UseConceptLookupResult {
  const [result, setResult] = useState<ConceptLookupResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [settledQuery, setSettledQuery] = useState("");
  const [settledRequestKey, setSettledRequestKey] = useState(-1);
  const normalizedQuery = query.trim();
  const isIdle = normalizedQuery.length === 0;
  const isCurrentRequestSettled = settledQuery === normalizedQuery && settledRequestKey === requestKey;

  useEffect(() => {
    if (!normalizedQuery) {
      return;
    }

    const controller = new AbortController();

    fetchConceptLookup({
      query: normalizedQuery,
      lang: "auto",
      mode: "exact_then_normalized",
      signal: controller.signal,
    })
      .then((nextResult) => {
        setErrorMessage(null);
        setResult(nextResult);
        setSettledQuery(normalizedQuery);
        setSettledRequestKey(requestKey);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setResult(null);
        setErrorMessage(error instanceof Error ? error.message : "unexpected lookup error");
        setSettledQuery(normalizedQuery);
        setSettledRequestKey(requestKey);
      });

    return () => {
      controller.abort();
    };
  }, [normalizedQuery, requestKey]);

  let state: ConceptLookupUiState = "idle";

  if (!isIdle) {
    if (!isCurrentRequestSettled) {
      state = "loading";
    } else if (errorMessage) {
      state = "error";
    } else if (!result || result.status === "no_hit") {
      state = "no_hit";
    } else {
      state = "results";
    }
  }

  return {
    state,
    result: isCurrentRequestSettled ? result : null,
    errorMessage: isCurrentRequestSettled ? errorMessage : null,
  };
}
