export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  active: boolean;
  order: number;

  createdAt?: unknown;
  updatedAt?: unknown;
  updatedByUid?: string;
  updatedByEmail?: string;
}

export type FaqFormData = Omit<
  FaqItem,
  "id" |
  "createdAt" |
  "updatedAt" |
  "updatedByUid" |
  "updatedByEmail"
>;