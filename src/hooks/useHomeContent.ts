"use client";

import {
  useEffect,
  useState,
} from "react";

import { siteService } from "@/firebase/firestore/site.service";
import type { HomeContent } from "@/types/home.types";

export function useHomeContent() {
  const [content, setContent] =
    useState<HomeContent | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const unsubscribe =
      siteService.subscribeHomeContent(
        (nextContent) => {
          setContent(nextContent);
          setError(null);
          setIsLoading(false);
        },
        (error) => {
          console.error(error);
          setContent(null);
          setError(
            "No fue posible cargar el contenido de Inicio."
          );
          setIsLoading(false);
        }
      );

    return unsubscribe;
  }, []);

  return {
    content,
    isLoading,
    error,
  };
}