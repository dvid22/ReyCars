import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import { db } from "../config/firebase";

import type {
  FaqFormData,
  FaqItem,
} from "@/types/faq.types";

const FAQ_COLLECTION =
  collection(
    db,
    "faqItems"
  );

function normalizeFaq(
  id: string,
  data: Partial<FaqItem>
): FaqItem {
  return {
    id,
    question:
      data.question ?? "",
    answer:
      data.answer ?? "",
    active:
      data.active !== false,
    order:
      typeof data.order === "number"
        ? data.order
        : 0,

    createdAt:
      data.createdAt,
    updatedAt:
      data.updatedAt,
    updatedByUid:
      data.updatedByUid,
    updatedByEmail:
      data.updatedByEmail,
  };
}

export const faqService = {
  async getFaq() {
    const snapshot =
      await getDocs(
        query(
          FAQ_COLLECTION,
          orderBy(
            "order",
            "asc"
          )
        )
      );

    return snapshot.docs.map(
      (item) =>
        normalizeFaq(
          item.id,
          item.data()
        )
    );
  },

  subscribeFaq(
    onData: (
      items: FaqItem[]
    ) => void,
    onError?: (
      error: Error
    ) => void
  ) {
    return onSnapshot(
      query(
        FAQ_COLLECTION,
        orderBy(
          "order",
          "asc"
        )
      ),
      (snapshot) => {
        onData(
          snapshot.docs.map(
            (item) =>
              normalizeFaq(
                item.id,
                item.data()
              )
          )
        );
      },
      (error) => {
        onError?.(error);
      }
    );
  },

  async createFaq(
    data: FaqFormData,
    user?: {
      uid?: string;
      email?: string | null;
    }
  ) {
    const ref =
      doc(FAQ_COLLECTION);

    await setDoc(
      ref,
      {
        ...data,
        createdAt:
          serverTimestamp(),
        updatedAt:
          serverTimestamp(),
        updatedByUid:
          user?.uid ?? "",
        updatedByEmail:
          user?.email ?? "",
      }
    );

    return ref.id;
  },

  async updateFaq(
    id: string,
    data: Partial<FaqFormData>,
    user?: {
      uid?: string;
      email?: string | null;
    }
  ) {
    await updateDoc(
      doc(
        FAQ_COLLECTION,
        id
      ),
      {
        ...data,
        updatedAt:
          serverTimestamp(),
        updatedByUid:
          user?.uid ?? "",
        updatedByEmail:
          user?.email ?? "",
      }
    );
  },

  async deleteFaq(
    id: string
  ) {
    await deleteDoc(
      doc(
        FAQ_COLLECTION,
        id
      )
    );
  },

  async setFaqActive(
    id: string,
    active: boolean,
    user?: {
      uid?: string;
      email?: string | null;
    }
  ) {
    await updateDoc(
      doc(
        FAQ_COLLECTION,
        id
      ),
      {
        active,
        updatedAt:
          serverTimestamp(),
        updatedByUid:
          user?.uid ?? "",
        updatedByEmail:
          user?.email ?? "",
      }
    );
  },

  async reorderFaq(
    items: FaqItem[],
    user?: {
      uid?: string;
      email?: string | null;
    }
  ) {
    const batch =
      writeBatch(db);

    items.forEach(
      (item, index) => {
        batch.update(
          doc(
            FAQ_COLLECTION,
            item.id
          ),
          {
            order: index + 1,
            updatedAt:
              serverTimestamp(),
            updatedByUid:
              user?.uid ?? "",
            updatedByEmail:
              user?.email ?? "",
          }
        );
      }
    );

    await batch.commit();
  },

  async importFaq(
    items: FaqFormData[],
    user?: {
      uid?: string;
      email?: string | null;
    }
  ) {
    const existing =
      await getDocs(
        FAQ_COLLECTION
      );

    if (!existing.empty) {
      return false;
    }

    const batch =
      writeBatch(db);

    items.forEach(
      (item) => {
        const ref =
          doc(
            FAQ_COLLECTION
          );

        batch.set(
          ref,
          {
            ...item,
            createdAt:
              serverTimestamp(),
            updatedAt:
              serverTimestamp(),
            updatedByUid:
              user?.uid ?? "",
            updatedByEmail:
              user?.email ?? "",
          }
        );
      }
    );

    await batch.commit();

    return true;
  },
};