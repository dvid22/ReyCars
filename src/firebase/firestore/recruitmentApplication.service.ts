import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  db,
} from "@/firebase/config/firebase";

import type {
  RecruitmentApplication,
  RecruitmentApplicationInput,
  RecruitmentApplicationStatus,
} from "@/types/recruitmentApplication.types";

const APPLICATIONS_COLLECTION =
  collection(
    db,
    "recruitmentApplications"
  );

function normalizeApplication(
  id: string,
  data: Partial<RecruitmentApplication>
): RecruitmentApplication {
  return {
    id,

    fullName:
      data.fullName ?? "",

    phone:
      data.phone ?? "",

    email:
      data.email ?? "",

    city:
      data.city ?? "",

    message:
      data.message ?? "",

    cvUrl:
      data.cvUrl ?? "",

    cvFileName:
      data.cvFileName ?? "",

    cvContentType:
      data.cvContentType ?? "",

    vacancyPosition:
      data.vacancyPosition ?? "",

    status:
      data.status === "reviewing" ||
      data.status === "contacted" ||
      data.status === "archived"
        ? data.status
        : "new",

    createdAt:
      data.createdAt,

    updatedAt:
      data.updatedAt,
  };
}

export const recruitmentApplicationService = {
  subscribe(
    onData: (
      applications: RecruitmentApplication[]
    ) => void,
    onError?: (
      error: Error
    ) => void
  ) {
    return onSnapshot(
      query(
        APPLICATIONS_COLLECTION,
        orderBy(
          "createdAt",
          "desc"
        )
      ),
      (snapshot) => {
        onData(
          snapshot.docs.map(
            (item) =>
              normalizeApplication(
                item.id,
                item.data()
              )
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

  async create(
    data: RecruitmentApplicationInput
  ) {
    const ref =
      await addDoc(
        APPLICATIONS_COLLECTION,
        {
          ...data,

          status:
            "new",

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );

    return ref.id;
  },

  async setStatus(
    id: string,
    status: RecruitmentApplicationStatus
  ) {
    await updateDoc(
      doc(
        APPLICATIONS_COLLECTION,
        id
      ),
      {
        status,

        updatedAt:
          serverTimestamp(),
      }
    );
  },

  async delete(
    id: string
  ) {
    await deleteDoc(
      doc(
        APPLICATIONS_COLLECTION,
        id
      )
    );
  },
};