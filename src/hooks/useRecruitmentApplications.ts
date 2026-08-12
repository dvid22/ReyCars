"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  recruitmentApplicationService,
} from "@/firebase/firestore/recruitmentApplication.service";

import type {
  RecruitmentApplication,
} from "@/types/recruitmentApplication.types";

export function useRecruitmentApplications() {
  const [
    applications,
    setApplications,
  ] =
    useState<RecruitmentApplication[]>([]);

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
      recruitmentApplicationService.subscribe(
        (
          nextApplications
        ) => {
          setApplications(
            nextApplications
          );

          setError(
            null
          );

          setIsLoading(
            false
          );
        },
        (
          error
        ) => {
          console.error(
            error
          );

          setApplications(
            []
          );

          setError(
            "No fue posible cargar las postulaciones."
          );

          setIsLoading(
            false
          );
        }
      );

    return unsubscribe;
  }, []);

  const newCount =
    useMemo(
      () =>
        applications.filter(
          (item) =>
            item.status ===
            "new"
        ).length,
      [applications]
    );

  return {
    applications,
    isLoading,
    error,
    newCount,
  };
}