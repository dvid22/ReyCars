"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  faqService,
} from "@/firebase/firestore/faq.service";

import type {
  FaqItem,
} from "@/types/faq.types";

export function useFaq() {
  const [
    items,
    setItems,
  ] =
    useState<FaqItem[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    const unsubscribe =
      faqService.subscribeFaq(
        (nextItems) => {
          setItems(
            nextItems
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

          setItems([]);

          setError(
            "No fue posible cargar las preguntas frecuentes."
          );

          setIsLoading(
            false
          );
        }
      );

    return unsubscribe;
  }, []);

  return {
    items,
    isLoading,
    error,
  };
}