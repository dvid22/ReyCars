"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  siteService,
} from "@/firebase/firestore/site.service";

import type {
  AboutContent,
} from "@/types/about.types";

export function useAboutContent() {
  const [
    content,
    setContent,
  ] =
    useState<AboutContent | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    const unsubscribe =
      siteService.subscribeAboutContent(
        (nextContent) => {
          setContent(
            nextContent
          );
          setError(null);
          setIsLoading(
            false
          );
        },
        (error) => {
          console.error(
            error
          );

          setContent(null);

          setError(
            "No fue posible cargar la información de Nosotros."
          );

          setIsLoading(
            false
          );
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