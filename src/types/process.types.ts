export const PROCESS_ICON_NAMES = [
  "route",
  "map-pin",
  "clipboard",
  "book",
  "car",
  "bike",
  "flag",
  "graduation",
  "file",
  "shield",
  "check",
  "id-card",
  "user",
  "calendar",
  "clock",
] as const;

export type ProcessIconName =
  (typeof PROCESS_ICON_NAMES)[number];

export type ProcessStepIcon =
  ProcessIconName;

export type ProcessHighlightIcon =
  ProcessIconName;

export function isProcessIconName(
  value: unknown
): value is ProcessIconName {
  return (
    typeof value === "string" &&
    (
      PROCESS_ICON_NAMES as readonly string[]
    ).includes(value)
  );
}

export interface ProcessHighlight {
  icon: ProcessHighlightIcon;
  title: string;
  description: string;
}

export interface ProcessStep {
  id: string;
  order: number;
  number: string;
  title: string;
  shortTitle: string;
  description: string;

  imageUrl: string;
  imageAlt: string;

  icon: ProcessStepIcon;
  highlights: ProcessHighlight[];

  active: boolean;
}

export interface ProcessContent {
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  selectorTitle: string;
  steps: ProcessStep[];
}

export interface ProcessContentDocument
  extends ProcessContent {
  updatedAt?: unknown;
  updatedByUid?: string;
  updatedByEmail?: string;
}