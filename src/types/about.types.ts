export type AboutIconName =
  | "shield"
  | "users"
  | "sparkles"
  | "heart"
  | "target"
  | "thumbs-up";

export type AboutStoryId =
  | "esencia"
  | "mision"
  | "vision";

export interface AboutHighlight {
  id: string;
  icon: AboutIconName;
  title: string;
}

export interface AboutStoryItem {
  id: AboutStoryId;
  number: string;
  icon: AboutIconName;
  title: string;
  description: string;
}

export interface AboutValueItem {
  id: string;
  icon: AboutIconName;
  title: string;
  description: string;
}

export interface AboutGalleryAlbum {
  id: string;
  order: number;
  title: string;
  description: string;
  images: string[];
  active: boolean;
}

export interface AboutContent {
  hero: {
    eyebrow: string;
    title: string;
    highlightedText: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    highlights: AboutHighlight[];
  };

  story: AboutStoryItem[];

  teamSection: {
    eyebrow: string;
    title: string;
    highlightedText: string;
    description: string;
    statement: string;
  };

  gallerySection: {
    eyebrow: string;
    title: string;
    highlightedText: string;
    description: string;
    footerTitle: string;
    footerDescription: string;
    albums: AboutGalleryAlbum[];
  };

  values: AboutValueItem[];
}

export interface AboutContentDocument
  extends AboutContent {
  updatedAt?: unknown;
  updatedByUid?: string;
  updatedByEmail?: string;
}

export const ABOUT_ICON_NAMES:
  readonly AboutIconName[] = [
    "shield",
    "users",
    "sparkles",
    "heart",
    "target",
    "thumbs-up",
  ];

export function isAboutIconName(
  value: unknown
): value is AboutIconName {
  return (
    typeof value === "string" &&
    ABOUT_ICON_NAMES.includes(
      value as AboutIconName
    )
  );
}