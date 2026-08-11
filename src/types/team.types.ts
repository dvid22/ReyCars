export interface TeamMember {
  id: string;

  name: string;
  role: string;
  description: string;

  imageUrl: string;
  imageAlt: string;

  active: boolean;
  order: number;

  createdAt?: unknown;
  updatedAt?: unknown;

  updatedByUid?: string;
  updatedByEmail?: string;
}

export type TeamMemberFormData = Pick<
  TeamMember,
  | "name"
  | "role"
  | "description"
  | "imageUrl"
  | "imageAlt"
  | "active"
  | "order"
>;