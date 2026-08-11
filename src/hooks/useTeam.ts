"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  teamService,
} from "@/firebase/firestore/team.service";

import type {
  TeamMember,
} from "@/types/team.types";

export function useTeam() {
  const [
    members,
    setMembers,
  ] =
    useState<TeamMember[]>([]);

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
      teamService.subscribeTeam(
        (
          nextMembers
        ) => {
          setMembers(
            nextMembers
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

          setMembers([]);

          setError(
            "No fue posible cargar el equipo."
          );

          setIsLoading(
            false
          );
        }
      );

    return unsubscribe;
  }, []);

  return {
    members,
    isLoading,
    error,
  };
}