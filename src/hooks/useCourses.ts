"use client";

import { useEffect, useState } from "react";

import { coursesService } from "@/firebase/firestore/courses.service";
import type { Course } from "@/types/course.types";

export function useCourses() {
  const [courses, setCourses] =
    useState<Course[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe =
      coursesService.subscribePublicCourses(
        (firebaseCourses) => {
          // Firestore es la única fuente de verdad.
          // Nunca se reemplaza con DEFAULT_COURSES.
          setCourses(firebaseCourses);
          setError(null);
          setIsLoading(false);
        },
        () => {
          setCourses([]);
          setError(
            "No fue posible cargar los cursos desde Firebase."
          );
          setIsLoading(false);
        }
      );

    return unsubscribe;
  }, []);

  return {
    courses,
    isLoading,
    error,
  };
}