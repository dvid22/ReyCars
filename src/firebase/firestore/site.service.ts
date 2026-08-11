import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";
import type {
  HomeContent,
  HomeContentDocument,
} from "@/types/home.types";
import {
  isProcessIconName,
} from "@/types/process.types";
import type {
  ProcessContent,
  ProcessContentDocument,
  ProcessHighlight,
  ProcessStep,
} from "@/types/process.types";

const HOME_DOC = doc(
  db,
  "siteContent",
  "home"
);

const PROCESS_DOC = doc(
  db,
  "siteContent",
  "process"
);

function normalizeHomeContent(
  data: Partial<HomeContentDocument>
): HomeContent | null {
  if (
    !data.hero ||
    !data.coursesSection ||
    !data.processSection ||
    !data.faqSection ||
    !data.hoursSection
  ) {
    return null;
  }

  return {
    hero: {
      eyebrow: data.hero.eyebrow ?? "",
      title: data.hero.title ?? "",
      highlightedText:
        data.hero.highlightedText ?? "",
      description:
        data.hero.description ?? "",
      primaryCtaLabel:
        data.hero.primaryCtaLabel ?? "",
      secondaryCtaLabel:
        data.hero.secondaryCtaLabel ?? "",
      heroImageUrl:
        data.hero.heroImageUrl ?? "",
      benefits: Array.isArray(
        data.hero.benefits
      )
        ? data.hero.benefits.map(
            (benefit) => ({
              title:
                benefit?.title ?? "",
              description:
                benefit?.description ?? "",
            })
          )
        : [],
    },

    coursesSection: {
      eyebrow:
        data.coursesSection.eyebrow ??
        "",
      title:
        data.coursesSection.title ?? "",
      highlightedText:
        data.coursesSection
          .highlightedText ?? "",
      description:
        data.coursesSection.description ??
        "",
      ctaLabel:
        data.coursesSection.ctaLabel ??
        "",
    },

    processSection: {
      eyebrow:
        data.processSection.eyebrow ??
        "",
      title:
        data.processSection.title ?? "",
      highlightedText:
        data.processSection
          .highlightedText ?? "",
      description:
        data.processSection.description ??
        "",
      ctaLabel:
        data.processSection.ctaLabel ??
        "",
    },

    faqSection: {
      eyebrow:
        data.faqSection.eyebrow ?? "",
      title:
        data.faqSection.title ?? "",
      highlightedText:
        data.faqSection.highlightedText ??
        "",
      description:
        data.faqSection.description ?? "",
      ctaLabel:
        data.faqSection.ctaLabel ?? "",
    },

    hoursSection: {
      eyebrow:
        data.hoursSection.eyebrow ?? "",
      title:
        data.hoursSection.title ?? "",
      highlightedText:
        data.hoursSection
          .highlightedText ?? "",
      description:
        data.hoursSection.description ??
        "",
    },
  };
}


function normalizeHighlight(
  item: Partial<ProcessHighlight>
): ProcessHighlight {
  return {
    icon:
      isProcessIconName(
        item.icon
      )
        ? item.icon
        : "check",
    title: item.title ?? "",
    description: item.description ?? "",
  };
}

function normalizeStep(
  item: Partial<ProcessStep>,
  index: number
): ProcessStep {
  const order =
    typeof item.order === "number"
      ? item.order
      : index + 1;

  return {
    id: item.id || `paso-${order}`,
    order,
    number:
      item.number ||
      String(order).padStart(2, "0"),
    title: item.title ?? "",
    shortTitle:
      item.shortTitle ||
      item.title ||
      "",
    description:
      item.description ?? "",
    imageUrl:
      item.imageUrl ?? "",
    imageAlt:
      item.imageAlt ??
      `${item.title ?? "Etapa"} ReyCars`,
    icon:
      isProcessIconName(
        item.icon
      )
        ? item.icon
        : "route",
    highlights:
      Array.isArray(item.highlights)
        ? item.highlights
            .slice(0, 3)
            .map(normalizeHighlight)
        : [],
    active:
      item.active !== false,
  };
}

function normalizeProcessContent(
  data: Partial<ProcessContentDocument>
): ProcessContent | null {
  if (!Array.isArray(data.steps)) {
    return null;
  }

  return {
    eyebrow: data.eyebrow ?? "",
    title: data.title ?? "",
    highlightedText:
      data.highlightedText ?? "",
    description:
      data.description ?? "",
    selectorTitle:
      data.selectorTitle ?? "",
    steps: data.steps
      .map(normalizeStep)
      .sort(
        (a, b) =>
          a.order - b.order
      ),
  };
}

export const siteService = {
  async getHomeContent() {
    const snapshot =
      await getDoc(HOME_DOC);

    if (!snapshot.exists()) {
      return null;
    }

    return normalizeHomeContent(
      snapshot.data() as Partial<HomeContentDocument>
    );
  },

  subscribeHomeContent(
    onData: (
      content: HomeContent | null
    ) => void,
    onError?: (error: Error) => void
  ) {
    return onSnapshot(
      HOME_DOC,
      (snapshot) => {
        if (!snapshot.exists()) {
          onData(null);
          return;
        }

        onData(
          normalizeHomeContent(
            snapshot.data() as Partial<HomeContentDocument>
          )
        );
      },
      (error) => {
        onError?.(error);
      }
    );
  },

  async saveHomeContent(
    content: HomeContent,
    user?: {
      uid?: string;
      email?: string | null;
    }
  ) {
    await setDoc(
      HOME_DOC,
      {
        ...content,
        updatedAt: serverTimestamp(),
        updatedByUid:
          user?.uid ?? "",
        updatedByEmail:
          user?.email ?? "",
      },
      {
        merge: true,
      }
    );
  },

  async getProcessContent() {
    const snapshot =
      await getDoc(PROCESS_DOC);

    if (!snapshot.exists()) {
      return null;
    }

    return normalizeProcessContent(
      snapshot.data() as Partial<ProcessContentDocument>
    );
  },

  subscribeProcessContent(
    onData: (
      content: ProcessContent | null
    ) => void,
    onError?: (error: Error) => void
  ) {
    return onSnapshot(
      PROCESS_DOC,
      (snapshot) => {
        if (!snapshot.exists()) {
          onData(null);
          return;
        }

        onData(
          normalizeProcessContent(
            snapshot.data() as Partial<ProcessContentDocument>
          )
        );
      },
      (error) => {
        onError?.(error);
      }
    );
  },

  async saveProcessContent(
    content: ProcessContent,
    user?: {
      uid?: string;
      email?: string | null;
    }
  ) {
    await setDoc(
      PROCESS_DOC,
      {
        ...content,
        updatedAt:
          serverTimestamp(),
        updatedByUid:
          user?.uid ?? "",
        updatedByEmail:
          user?.email ?? "",
      },
      {
        merge: true,
      }
    );
  },
};