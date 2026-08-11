"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  siteService,
} from "@/firebase/firestore/site.service";

import type {
  SiteConfig,
} from "@/types/site.types";

export function useSiteConfig() {
  const [
    config,
    setConfig,
  ] =
    useState<SiteConfig | null>(
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
      siteService.subscribeSiteConfig(
        (nextConfig) => {
          setConfig(
            nextConfig
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

          setConfig(null);

          setError(
            "No fue posible cargar la configuración del sitio."
          );

          setIsLoading(
            false
          );
        }
      );

    return unsubscribe;
  }, []);

  return {
    config,
    isLoading,
    error,
  };
}