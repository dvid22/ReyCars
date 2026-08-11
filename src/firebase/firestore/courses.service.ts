import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { db, storage } from "../config/firebase";
import type { Course, CourseFormData } from "@/types/course.types";

const COLLECTION_NAME = "courses";

const coursesCollection = collection(db, COLLECTION_NAME);

function normalizeCourse(
  id: string,
  data: Record<string, unknown>
): Course {
  return {
    id,
    slug: String(data.slug ?? ""),
    category: String(data.category ?? ""),
    name: String(data.name ?? ""),
    description: String(data.description ?? ""),
    imageUrl: String(data.imageUrl ?? ""),
    active: Boolean(data.active ?? true),
    order: Number(data.order ?? 0),

    price:
      typeof data.price === "number"
        ? data.price
        : null,

    priceLabel:
      typeof data.priceLabel === "string"
        ? data.priceLabel
        : "",

    theoryHours:
      typeof data.theoryHours === "number"
        ? data.theoryHours
        : null,

    practiceHours:
      typeof data.practiceHours === "number"
        ? data.practiceHours
        : null,

    durationLabel:
      typeof data.durationLabel === "string"
        ? data.durationLabel
        : "",

    modality:
      typeof data.modality === "string"
        ? data.modality
        : "",

    audience:
      typeof data.audience === "string"
        ? data.audience
        : "",

    features: Array.isArray(data.features)
      ? data.features.map(String)
      : [],

    includes: Array.isArray(data.includes)
      ? data.includes.map(String)
      : [],
  };
}

function cleanPayload(course: CourseFormData) {
  return {
    slug: course.slug.trim(),
    category: course.category.trim(),
    name: course.name.trim(),
    description: course.description.trim(),
    imageUrl: course.imageUrl.trim(),
    active: course.active,
    order: Number(course.order) || 0,

    price:
      typeof course.price === "number" &&
      Number.isFinite(course.price)
        ? course.price
        : null,

    priceLabel: course.priceLabel?.trim() ?? "",

    theoryHours:
      typeof course.theoryHours === "number" &&
      Number.isFinite(course.theoryHours)
        ? course.theoryHours
        : null,

    practiceHours:
      typeof course.practiceHours === "number" &&
      Number.isFinite(course.practiceHours)
        ? course.practiceHours
        : null,

    durationLabel: course.durationLabel?.trim() ?? "",
    modality: course.modality?.trim() ?? "",
    audience: course.audience?.trim() ?? "",

    features: (course.features ?? [])
      .map((item) => item.trim())
      .filter(Boolean),

    includes: (course.includes ?? [])
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

async function getCourses(): Promise<Course[]> {
  const snapshot = await getDocs(
    query(coursesCollection, orderBy("order", "asc"))
  );

  return snapshot.docs.map((item) =>
    normalizeCourse(
      item.id,
      item.data() as Record<string, unknown>
    )
  );
}

async function createCourse(
  course: CourseFormData
): Promise<string> {
  const document = await addDoc(coursesCollection, {
    ...cleanPayload(course),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return document.id;
}

async function updateCourse(
  id: string,
  course: CourseFormData
): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, id), {
    ...cleanPayload(course),
    updatedAt: serverTimestamp(),
  });
}

async function deleteCourse(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}

async function setCourseActive(
  id: string,
  active: boolean
): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, id), {
    active,
    updatedAt: serverTimestamp(),
  });
}

async function uploadCourseImage(
  file: File
): Promise<string> {
  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName =
    `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const storageRef = ref(
    storage,
    `courses/${fileName}`
  );

  await uploadBytes(storageRef, file, {
    contentType: file.type || undefined,
  });

  return getDownloadURL(storageRef);
}

export const coursesService = {
  db,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  setCourseActive,
  uploadCourseImage,
};