export type RecruitmentContactMode =
  | "whatsapp"
  | "email";

export interface RecruitmentContent {
  enabled: boolean;

  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;


  vacancy: {
    position: string;
    shortDescription: string;
    modality: string;
    contractType: string;
    location: string;
    requirements: string[];
  };

  cta: {
    label: string;
    mode: RecruitmentContactMode;
    whatsapp: string;
    email: string;
    message: string;
  };

  updatedAt?: unknown;
  updatedByUid?: string;
  updatedByEmail?: string;
}