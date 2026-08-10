export type ApplicationStatus = "new" | "reviewing" | "contacted" | "rejected" | "selected";
export interface JobApplication {
  id: string; vacancyId: string; fullName: string; phone: string; email: string;
  city?: string; experience?: string; message?: string; resumeUrl?: string;
  status: ApplicationStatus; createdAt?: unknown;
}
