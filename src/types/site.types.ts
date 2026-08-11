export interface SiteScheduleItem {
  id: "weekdays" | "saturday" | "sunday";
  short: string;
  label: string;
  open: string;
  close: string;
  days: number[];
  active: boolean;
}

export interface ContactPageContent {
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  heroImageUrl: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  slogan: string;

  phone: string;
  whatsapp: string;
  email: string;
  address: string;

  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;

  contactPage: ContactPageContent;

  schedule: SiteScheduleItem[];
}

export interface SiteConfigDocument
  extends SiteConfig {
  updatedAt?: unknown;
  updatedByUid?: string;
  updatedByEmail?: string;
}