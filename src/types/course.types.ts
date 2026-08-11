export interface Course {
  id: string;
  slug: string;
  category: string;
  name: string;
  description: string;
  imageUrl: string;
  active: boolean;
  order: number;

  price?: number | null;
  priceLabel?: string;
  theoryHours?: number | null;
  practiceHours?: number | null;
  durationLabel?: string;
  modality?: string;
  audience?: string;
  features?: string[];
  includes?: string[];
}

export type CourseFormData = Omit<Course, "id">;