export type CourseGroup =
  | "Licencias de conducción"
  | "Formación complementaria";

export type CourseIconType =
  | "car"
  | "motorcycle"
  | "steering"
  | "shield"
  | "id";

export interface Course {
  id: string;

  slug: string;
  group: CourseGroup;
  category: string;
  badge: string;
  name: string;
  subtitle: string;
  description: string;

  imageUrl: string;
  imageAlt: string;

  active: boolean;
  order: number;

  price?: number | null;
  priceText?: string;
  priceLabel?: string;

  theoryHours?: number | null;
  theoryLabel?: string;

  practiceHours?: number | null;
  practiceLabel?: string;

  vehicle?: string;
  modality?: string;
  durationLabel?: string;
  audience?: string;

  icon: CourseIconType;
  whatsappLabel?: string;

  features?: string[];
  includes?: string[];
}

export type CourseFormData = Omit<Course, "id">;