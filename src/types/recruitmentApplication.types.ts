export type RecruitmentApplicationStatus =
  | "new"
  | "reviewing"
  | "contacted"
  | "archived";

export interface RecruitmentApplication {
  id: string;

  fullName: string;
  phone: string;
  email: string;
  city: string;
  message: string;

  cvUrl: string;
  cvFileName: string;
  cvContentType: string;

  vacancyPosition: string;

  status: RecruitmentApplicationStatus;

  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface RecruitmentApplicationInput {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  message: string;

  cvUrl: string;
  cvFileName: string;
  cvContentType: string;

  vacancyPosition: string;
}