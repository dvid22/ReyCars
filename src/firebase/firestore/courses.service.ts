import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
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
import { DEFAULT_COURSES } from "@/constants/defaultCourses";
import type {
  Course,
  CourseFormData,
  CourseGroup,
  CourseIconType,
} from "@/types/course.types";

const COLLECTION_NAME = "courses";
const coursesCollection = collection(db, COLLECTION_NAME);

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}

function asNumberOrNull(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : null;
}

function normalizeGroup(value: unknown): CourseGroup {
  if (value === "Licencias de conducción") {
    return "Licencias de conducción";
  }

  if (value === "Otros servicios") {
    return "Otros servicios";
  }

  return "Formación complementaria";
}

function normalizeIcon(value: unknown): CourseIconType {
  if (
    value === "motorcycle" ||
    value === "steering" ||
    value === "shield" ||
    value === "id" ||
    value === "soat"
  ) {
    return value;
  }

  return "car";
}

function normalizeCourse(
  id: string,
  data: Record<string, unknown>
): Course {
  const legacyCategory = asString(data.category);

  return {
    id,
    slug: asString(data.slug),
    group: normalizeGroup(data.group),
    category: legacyCategory,
    badge: asString(data.badge) || legacyCategory,
    name: asString(data.name),
    subtitle: asString(data.subtitle),
    description: asString(data.description),

    imageUrl: asString(data.imageUrl),
    imageAlt: asString(data.imageAlt),

    active:
      typeof data.active === "boolean"
        ? data.active
        : true,

    order:
      typeof data.order === "number"
        ? data.order
        : 0,

    price: asNumberOrNull(data.price),
    priceText: asString(data.priceText),
    priceLabel: asString(data.priceLabel),

    theoryHours: asNumberOrNull(data.theoryHours),
    theoryLabel: asString(data.theoryLabel),

    practiceHours: asNumberOrNull(data.practiceHours),
    practiceLabel: asString(data.practiceLabel),

    vehicle: asString(data.vehicle),
    modality: asString(data.modality),
    durationLabel: asString(data.durationLabel),
    audience: asString(data.audience),

    icon: normalizeIcon(data.icon),
    whatsappLabel: asString(data.whatsappLabel),

    features: asStringArray(data.features),
    includes: asStringArray(data.includes),
  };
}

function cleanPayload(course: CourseFormData) {
  return {
    slug: course.slug.trim(),
    group: course.group,
    category: course.category.trim(),
    badge: course.badge.trim(),
    name: course.name.trim(),
    subtitle: course.subtitle.trim(),
    description: course.description.trim(),

    imageUrl: course.imageUrl.trim(),
    imageAlt: course.imageAlt.trim(),

    active: course.active,
    order: Number(course.order) || 0,

    price:
      typeof course.price === "number" &&
      Number.isFinite(course.price)
        ? course.price
        : null,

    priceText: course.priceText?.trim() ?? "",
    priceLabel: course.priceLabel?.trim() ?? "",

    theoryHours:
      typeof course.theoryHours === "number" &&
      Number.isFinite(course.theoryHours)
        ? course.theoryHours
        : null,

    theoryLabel: course.theoryLabel?.trim() ?? "",

    practiceHours:
      typeof course.practiceHours === "number" &&
      Number.isFinite(course.practiceHours)
        ? course.practiceHours
        : null,

    practiceLabel: course.practiceLabel?.trim() ?? "",

    vehicle: course.vehicle?.trim() ?? "",
    modality: course.modality?.trim() ?? "",
    durationLabel: course.durationLabel?.trim() ?? "",
    audience: course.audience?.trim() ?? "",

    icon: course.icon,
    whatsappLabel: course.whatsappLabel?.trim() ?? "",

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

async function getPublicCourses(): Promise<Course[]> {
  const courses = await getCourses();

  return courses.filter((course) => course.active);
}

function subscribePublicCourses(
  onData: (courses: Course[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    query(coursesCollection, orderBy("order", "asc")),
    (snapshot) => {
      const courses = snapshot.docs
        .map((item) =>
          normalizeCourse(
            item.id,
            item.data() as Record<string, unknown>
          )
        )
        .filter((course) => course.active);

      onData(courses);
    },
    (error) => {
      console.error(error);
      onError?.(error);
    }
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

async function importDefaultCourses(): Promise<number> {
  const current = await getCourses();

  if (current.length > 0) {
    return 0;
  }

  await Promise.all(
    DEFAULT_COURSES.map((course) =>
      addDoc(coursesCollection, {
        ...cleanPayload(course),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    )
  );

  return DEFAULT_COURSES.length;
}

export const coursesService = {
  db,
  getCourses,
  getPublicCourses,
  subscribePublicCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  setCourseActive,
  uploadCourseImage,
  importDefaultCourses,
};