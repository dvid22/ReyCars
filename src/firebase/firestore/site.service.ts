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

const HOME_DOC = doc(
  db,
  "siteContent",
  "home"
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
};