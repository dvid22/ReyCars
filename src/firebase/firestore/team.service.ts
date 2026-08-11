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

import {
  db,
} from "../config/firebase";

import type {
  TeamMember,
  TeamMemberFormData,
} from "@/types/team.types";

const TEAM_COLLECTION =
  collection(
    db,
    "teamMembers"
  );

function normalizeTeamMember(
  id: string,
  data: Partial<TeamMember>
): TeamMember {
  return {
    id,

    name:
      data.name ?? "",

    role:
      data.role ?? "",

    description:
      data.description ?? "",

    imageUrl:
      data.imageUrl ?? "",

    imageAlt:
      data.imageAlt ?? "",

    active:
      data.active !== false,

    order:
      typeof data.order ===
      "number"
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

export const teamService = {
  async getTeam() {
    const snapshot =
      await getDocs(
        query(
          TEAM_COLLECTION,
          orderBy(
            "order",
            "asc"
          )
        )
      );

    return snapshot.docs.map(
      (item) =>
        normalizeTeamMember(
          item.id,
          item.data()
        )
    );
  },

  subscribeTeam(
    onData: (
      members: TeamMember[]
    ) => void,
    onError?: (
      error: Error
    ) => void
  ) {
    return onSnapshot(
      query(
        TEAM_COLLECTION,
        orderBy(
          "order",
          "asc"
        )
      ),
      (snapshot) => {
        onData(
          snapshot.docs.map(
            (item) =>
              normalizeTeamMember(
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

  async createMember(
    data: TeamMemberFormData,
    user?: {
      uid?: string;
      email?: string | null;
    }
  ) {
    const ref =
      doc(
        TEAM_COLLECTION
      );

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

  async updateMember(
    id: string,
    data: Partial<TeamMemberFormData>,
    user?: {
      uid?: string;
      email?: string | null;
    }
  ) {
    await updateDoc(
      doc(
        TEAM_COLLECTION,
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

  async deleteMember(
    id: string
  ) {
    await deleteDoc(
      doc(
        TEAM_COLLECTION,
        id
      )
    );
  },

  async setActive(
    id: string,
    active: boolean,
    user?: {
      uid?: string;
      email?: string | null;
    }
  ) {
    await updateDoc(
      doc(
        TEAM_COLLECTION,
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

  async reorder(
    members: TeamMember[],
    user?: {
      uid?: string;
      email?: string | null;
    }
  ) {
    const batch =
      writeBatch(db);

    members.forEach(
      (
        member,
        index
      ) => {
        batch.update(
          doc(
            TEAM_COLLECTION,
            member.id
          ),
          {
            order:
              index + 1,

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

  async importInitialTeam(
    members: TeamMemberFormData[],
    user?: {
      uid?: string;
      email?: string | null;
    }
  ) {
    const current =
      await this.getTeam();

    if (
      current.length > 0
    ) {
      throw new Error(
        "El equipo ya contiene integrantes."
      );
    }

    const batch =
      writeBatch(db);

    members.forEach(
      (
        member,
        index
      ) => {
        const ref =
          doc(
            TEAM_COLLECTION
          );

        batch.set(
          ref,
          {
            ...member,

            order:
              index + 1,

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
  },
};