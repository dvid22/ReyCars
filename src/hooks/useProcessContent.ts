"use client";

import { useEffect, useState } from "react";
import { siteService } from "@/firebase/firestore/site.service";
import type { ProcessContent } from "@/types/process.types";

export function useProcessContent() {
  const [content, setContent] = useState<ProcessContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = siteService.subscribeProcessContent(
      (nextContent) => {
        setContent(nextContent);
        setError(null);
        setIsLoading(false);
      },
      (error) => {
        console.error(error);
        setContent(null);
        setError("No fue posible cargar el proceso desde Firebase.");
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { content, isLoading, error };
}