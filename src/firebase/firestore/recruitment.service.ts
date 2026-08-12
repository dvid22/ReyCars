import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  db,
} from "@/firebase/config/firebase";

import type {
  RecruitmentContent,
} from "@/types/recruitment.types";

const RECRUITMENT_REF =
  doc(
    db,
    "siteContent",
    "recruitment"
  );

function normalizeRecruitment(
  data: Partial<RecruitmentContent>
): RecruitmentContent {
  return {
    enabled:
      data.enabled === true,

    eyebrow:
      data.eyebrow ?? "",

    title:
      data.title ?? "",

    highlightedText:
      data.highlightedText ?? "",

    description:
      data.description ?? "",


    vacancy: {
      position:
        data.vacancy?.position ??
        "",

      shortDescription:
        data.vacancy?.shortDescription ??
        "",

      modality:
        data.vacancy?.modality ??
        "",

      contractType:
        data.vacancy?.contractType ??
        "",

      location:
        data.vacancy?.location ??
        "",

      requirements:
        Array.isArray(
          data.vacancy?.requirements
        )
          ? data.vacancy!.requirements
              .map(
                (item) =>
                  String(item)
                    .trim()
              )
              .filter(Boolean)
          : [],
    },

    cta: {
      label:
        data.cta?.label ??
        "",

      mode:
        data.cta?.mode ===
        "email"
          ? "email"
          : "whatsapp",

      whatsapp:
        data.cta?.whatsapp ??
        "",

      email:
        data.cta?.email ??
        "",

      message:
        data.cta?.message ??
        "",
    },

    updatedAt:
      data.updatedAt,

    updatedByUid:
      data.updatedByUid,

    updatedByEmail:
      data.updatedByEmail,
  };
}

export const recruitmentService = {
  async get() {
    const snapshot =
      await getDoc(
        RECRUITMENT_REF
      );

    if (
      !snapshot.exists()
    ) {
      return null;
    }

    return normalizeRecruitment(
      snapshot.data()
    );
  },

  subscribe(
    onData: (
      content:
        | RecruitmentContent
        | null
    ) => void,
    onError?: (
      error: Error
    ) => void
  ) {
    return onSnapshot(
      RECRUITMENT_REF,
      (snapshot) => {
        if (
          !snapshot.exists()
        ) {
          onData(null);
          return;
        }

        onData(
          normalizeRecruitment(
            snapshot.data()
          )
        );
      },
      (error) => {
        onError?.(
          error
        );
      }
    );
  },

  async save(
    content: RecruitmentContent,
    user?: {
      uid?: string;
      email?: string | null;
    }
  ) {
    await setDoc(
      RECRUITMENT_REF,
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