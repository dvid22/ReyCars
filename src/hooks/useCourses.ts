"use client";

import { useEffect, useState } from "react";

import { DEFAULT_COURSES } from "@/constants/defaultCourses";
import { coursesService } from "@/firebase/firestore/courses.service";
import type { Course } from "@/types/course.types";

function defaultsAsCourses(): Course[] {
  return DEFAULT_COURSES.map((course, index) => ({
    ...course,
    id: `default-${index + 1}`,
  }));
}

export function useCourses() {
  const [courses, setCourses] =
    useState<Course[]>(defaultsAsCourses);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const unsubscribe =
      coursesService.subscribePublicCourses(
        (firebaseCourses) => {
          if (firebaseCourses.length > 0) {
            setCourses(firebaseCourses);
          } else {
            setCourses(defaultsAsCourses());
          }

          setError(null);
          setIsLoading(false);
        },
        () => {
          setError(
            "No fue posible actualizar los cursos desde Firebase."
          );

          setCourses(defaultsAsCourses());
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