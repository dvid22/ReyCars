"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";

import {
  getAuth,
} from "firebase/auth";

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import {
  storage,
} from "@/firebase/config/firebase";

import {
  teamService,
} from "@/firebase/firestore/team.service";

import {
  useTeam,
} from "@/hooks/useTeam";

import type {
  TeamMember,
  TeamMemberFormData,
} from "@/types/team.types";

import styles from "./AdminEquipoPage.module.css";

const INITIAL_TEAM: TeamMemberFormData[] = [
  {
    name:
      "Carlos Ramírez",

    role:
      "Instructor de conducción",

    description:
      "Acompañamiento práctico con claridad, paciencia y enfoque responsable.",

    imageUrl:
      "/assets/images/equipo/instructor-01.png",

    imageAlt:
      "Carlos Ramírez, instructor de conducción de ReyCars",

    active: true,
    order: 1,
  },
  {
    name:
      "Mariana López",

    role:
      "Coordinación académica",

    description:
      "Organización y acompañamiento durante cada etapa del proceso de formación.",

    imageUrl:
      "/assets/images/equipo/instructor-02.png",

    imageAlt:
      "Mariana López, coordinación académica de ReyCars",

    active: true,
    order: 2,
  },
  {
    name:
      "Valentina Torres",

    role:
      "Atención al estudiante",

    description:
      "Orientación cercana para resolver dudas y acompañar el recorrido del estudiante.",

    imageUrl:
      "/assets/images/equipo/instructor-03.png",

    imageAlt:
      "Valentina Torres, atención al estudiante de ReyCars",

    active: true,
    order: 3,
  },
  {
    name:
      "Andrés Mejía",

    role:
      "Acompañamiento práctico",

    description:
      "Guía en la experiencia de conducción con atención y responsabilidad.",

    imageUrl:
      "/assets/images/equipo/instructor-04.png",

    imageAlt:
      "Andrés Mejía, acompañamiento práctico de ReyCars",

    active: true,
    order: 4,
  },
];

type EditorState = {
  id: string | null;

  name: string;
  role: string;
  description: string;

  imageUrl: string;
  imageAlt: string;

  active: boolean;
};

const EMPTY_EDITOR: EditorState = {
  id: null,

  name: "",
  role: "",
  description: "",

  imageUrl: "",
  imageAlt: "",

  active: true,
};

function safeFileName(
  value: string
) {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      "-"
    )
    .replace(
      /[^a-z0-9._-]/g,
      ""
    );
}

async function uploadTeamImage(
  file: File
) {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (
    !allowed.includes(
      file.type
    )
  ) {
    throw new Error(
      "La imagen debe ser JPG, PNG o WEBP."
    );
  }

  if (
    file.size >
    8 * 1024 * 1024
  ) {
    throw new Error(
      "La imagen no puede superar 8 MB."
    );
  }

  const fileName =
    `${Date.now()}-${safeFileName(
      file.name ||
        "equipo"
    )}`;

  const storageRef =
    ref(
      storage,
      `site/team/${fileName}`
    );

  await uploadBytes(
    storageRef,
    file,
    {
      contentType:
        file.type ||
        undefined,
    }
  );

  return getDownloadURL(
    storageRef
  );
}

export function AdminEquipoPage() {
  const {
    members,
    isLoading,
  } =
    useTeam();

  const [
    editor,
    setEditor,
  ] =
    useState<EditorState>(
      EMPTY_EDITOR
    );

  const [
    isEditorOpen,
    setIsEditorOpen,
  ] =
    useState(false);

  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    importing,
    setImporting,
  ] =
    useState(false);

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<TeamMember | null>(
      null
    );

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const activeCount =
    useMemo(
      () =>
        members.filter(
          (member) =>
            member.active
        ).length,
      [members]
    );

  function openCreate() {
    setEditor({
      ...EMPTY_EDITOR,
    });

    setError("");
    setSuccess("");
    setIsEditorOpen(true);
  }

  function openEdit(
    member: TeamMember
  ) {
    setEditor({
      id:
        member.id,

      name:
        member.name,

      role:
        member.role,

      description:
        member.description,

      imageUrl:
        member.imageUrl,

      imageAlt:
        member.imageAlt,

      active:
        member.active,
    });

    setError("");
    setSuccess("");
    setIsEditorOpen(true);
  }

  function closeEditor() {
    if (
      saving ||
      uploading
    ) {
      return;
    }

    setIsEditorOpen(false);
  }

  async function handleImage(
    file?: File
  ) {
    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const url =
        await uploadTeamImage(
          file
        );

      setEditor(
        (current) => ({
          ...current,

          imageUrl:
            url,

          imageAlt:
            current.imageAlt ||
            (
              current.name
                ? `${current.name} - equipo ReyCars`
                : "Integrante del equipo ReyCars"
            ),
        })
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        error instanceof
          Error
          ? error.message
          : "No fue posible subir la imagen."
      );
    } finally {
      setUploading(false);
    }
  }

  async function saveMember() {
    if (
      saving ||
      uploading
    ) {
      return;
    }

    if (
      !editor.name.trim() ||
      !editor.role.trim() ||
      !editor.description.trim() ||
      !editor.imageUrl.trim()
    ) {
      setError(
        "Completa nombre, cargo, descripción y fotografía."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const user =
        getAuth().currentUser;

      if (
        editor.id
      ) {
        await teamService.updateMember(
          editor.id,
          {
            name:
              editor.name.trim(),

            role:
              editor.role.trim(),

            description:
              editor.description.trim(),

            imageUrl:
              editor.imageUrl.trim(),

            imageAlt:
              editor.imageAlt.trim() ||
              `${editor.name.trim()} - equipo ReyCars`,

            active:
              editor.active,
          },
          {
            uid:
              user?.uid,

            email:
              user?.email,
          }
        );

        setSuccess(
          "Integrante actualizado correctamente."
        );
      } else {
        await teamService.createMember(
          {
            name:
              editor.name.trim(),

            role:
              editor.role.trim(),

            description:
              editor.description.trim(),

            imageUrl:
              editor.imageUrl.trim(),

            imageAlt:
              editor.imageAlt.trim() ||
              `${editor.name.trim()} - equipo ReyCars`,

            active:
              editor.active,

            order:
              members.length +
              1,
          },
          {
            uid:
              user?.uid,

            email:
              user?.email,
          }
        );

        setSuccess(
          "Integrante agregado correctamente."
        );
      }

      setIsEditorOpen(false);
    } catch (error) {
      console.error(
        error
      );

      setError(
        "No fue posible guardar el integrante."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(
    member: TeamMember
  ) {
    try {
      setError("");
      setSuccess("");

      const user =
        getAuth().currentUser;

      await teamService.setActive(
        member.id,
        !member.active,
        {
          uid:
            user?.uid,

          email:
            user?.email,
        }
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        "No fue posible cambiar la visibilidad."
      );
    }
  }

  async function moveMember(
    index: number,
    direction: -1 | 1
  ) {
    const target =
      index +
      direction;

    if (
      target < 0 ||
      target >=
        members.length
    ) {
      return;
    }

    const reordered =
      [...members];

    [
      reordered[index],
      reordered[target],
    ] = [
      reordered[target],
      reordered[index],
    ];

    try {
      setError("");
      setSuccess("");

      const user =
        getAuth().currentUser;

      await teamService.reorder(
        reordered,
        {
          uid:
            user?.uid,

          email:
            user?.email,
        }
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        "No fue posible cambiar el orden."
      );
    }
  }

  async function confirmDelete() {
    if (
      !deleteTarget
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await teamService.deleteMember(
        deleteTarget.id
      );

      setDeleteTarget(
        null
      );

      setSuccess(
        "Integrante eliminado."
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        "No fue posible eliminar el integrante."
      );
    }
  }

  async function importCurrentTeam() {
    if (
      importing ||
      members.length > 0
    ) {
      return;
    }

    try {
      setImporting(true);
      setError("");
      setSuccess("");

      const user =
        getAuth().currentUser;

      await teamService.importInitialTeam(
        INITIAL_TEAM,
        {
          uid:
            user?.uid,

          email:
            user?.email,
        }
      );

      setSuccess(
        "Equipo inicial importado correctamente."
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        error instanceof
          Error
          ? error.message
          : "No fue posible importar el equipo."
      );
    } finally {
      setImporting(false);
    }
  }

  if (
    isLoading
  ) {
    return (
      <section
        className={
          styles.loadingState
        }
      >
        <span />

        <p>
          Cargando equipo...
        </p>
      </section>
    );
  }

  return (
    <section
      className={
        styles.page
      }
    >
      <header
        className={
          styles.header
        }
      >
        <div>
          <span
            className={
              styles.eyebrow
            }
          >
            CONTENIDO · EQUIPO
          </span>

          <h1>
            Equipo
          </h1>

          <p>
            Administra las personas
            que aparecen en la sección
            Nuestro equipo de Nosotros.
          </p>
        </div>

        <button
          type="button"
          className={
            styles.primaryButton
          }
          onClick={
            openCreate
          }
        >
          <Plus
            size={15}
            strokeWidth={1.8}
          />

          Nuevo integrante
        </button>
      </header>

      {error ? (
        <div
          className={
            styles.error
          }
        >
          {error}
        </div>
      ) : null}

      {success ? (
        <div
          className={
            styles.success
          }
        >
          {success}
        </div>
      ) : null}

      <div
        className={
          styles.summary
        }
      >
        <div>
          <span
            className={
              styles.summaryIcon
            }
          >
            <UsersRound
              size={18}
              strokeWidth={1.7}
            />
          </span>

          <div>
            <strong>
              {
                members.length
              }{" "}
              {members.length ===
              1
                ? "integrante"
                : "integrantes"}
            </strong>

            <span>
              {activeCount} visibles
              en el sitio
            </span>
          </div>
        </div>

        <p>
          El orden de esta lista es
          el mismo que verá el usuario
          en Nosotros.
        </p>
      </div>

      {members.length ===
      0 ? (
        <div
          className={
            styles.empty
          }
        >
          <span>
            <UsersRound
              size={25}
              strokeWidth={1.6}
            />
          </span>

          <div>
            <strong>
              Aún no hay integrantes
            </strong>

            <p>
              Puedes importar los cuatro
              perfiles que estaban en el
              sitio o crear el equipo
              manualmente.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void importCurrentTeam()
            }
            disabled={
              importing
            }
          >
            {importing
              ? "Importando..."
              : "Importar equipo actual"}
          </button>
        </div>
      ) : (
        <div
          className={
            styles.teamGrid
          }
        >
          {members.map(
            (
              member,
              index
            ) => (
              <article
                key={
                  member.id
                }
                className={`${styles.memberCard} ${
                  !member.active
                    ? styles.memberCardHidden
                    : ""
                }`}
              >
                <div
                  className={
                    styles.memberTop
                  }
                >
                  <span>
                    {String(
                      index +
                        1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <div
                    className={
                      styles.cardActions
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        void moveMember(
                          index,
                          -1
                        )
                      }
                      disabled={
                        index ===
                        0
                      }
                      aria-label="Mover arriba"
                    >
                      <ArrowUp
                        size={13}
                        strokeWidth={1.8}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void moveMember(
                          index,
                          1
                        )
                      }
                      disabled={
                        index ===
                        members.length -
                          1
                      }
                      aria-label="Mover abajo"
                    >
                      <ArrowDown
                        size={13}
                        strokeWidth={1.8}
                      />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className={
                    styles.memberMain
                  }
                  onClick={() =>
                    openEdit(
                      member
                    )
                  }
                >
                  <span
                    className={
                      styles.avatar
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        member.imageUrl
                      }
                      alt={
                        member.imageAlt ||
                        member.name
                      }
                    />
                  </span>

                  <span
                    className={
                      styles.memberCopy
                    }
                  >
                    <strong>
                      {
                        member.name
                      }
                    </strong>

                    <small>
                      {
                        member.role
                      }
                    </small>

                    <p>
                      {
                        member.description
                      }
                    </p>
                  </span>
                </button>

                <div
                  className={
                    styles.memberFooter
                  }
                >
                  <button
                    type="button"
                    className={
                      styles.visibilityButton
                    }
                    onClick={() =>
                      void toggleActive(
                        member
                      )
                    }
                  >
                    {member.active ? (
                      <>
                        <Eye
                          size={14}
                          strokeWidth={1.8}
                        />
                        Visible
                      </>
                    ) : (
                      <>
                        <EyeOff
                          size={14}
                          strokeWidth={1.8}
                        />
                        Oculto
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className={
                      styles.editButton
                    }
                    onClick={() =>
                      openEdit(
                        member
                      )
                    }
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className={
                      styles.deleteButton
                    }
                    onClick={() =>
                      setDeleteTarget(
                        member
                      )
                    }
                    aria-label={`Eliminar ${member.name}`}
                  >
                    <Trash2
                      size={14}
                      strokeWidth={1.8}
                    />
                  </button>
                </div>
              </article>
            )
          )}
        </div>
      )}

      {isEditorOpen ? (
        <div
          className={
            styles.modalBackdrop
          }
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeEditor();
            }
          }}
        >
          <div
            className={
              styles.editorModal
            }
            role="dialog"
            aria-modal="true"
          >
            <header
              className={
                styles.modalHeader
              }
            >
              <div>
                <span>
                  {editor.id
                    ? "EDITAR INTEGRANTE"
                    : "NUEVO INTEGRANTE"}
                </span>

                <strong>
                  {editor.id
                    ? editor.name ||
                      "Integrante"
                    : "Agregar al equipo"}
                </strong>
              </div>

              <button
                type="button"
                onClick={
                  closeEditor
                }
                aria-label="Cerrar"
              >
                <X
                  size={17}
                  strokeWidth={1.8}
                />
              </button>
            </header>

            <div
              className={
                styles.editorBody
              }
            >
              <div
                className={
                  styles.photoEditor
                }
              >
                <span
                  className={
                    styles.photoPreview
                  }
                >
                  {editor.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={
                        editor.imageUrl
                      }
                      alt=""
                    />
                  ) : (
                    <UsersRound
                      size={30}
                      strokeWidth={1.4}
                    />
                  )}
                </span>

                <label
                  className={
                    styles.uploadButton
                  }
                >
                  <ImagePlus
                    size={15}
                    strokeWidth={1.8}
                  />

                  {uploading
                    ? "Subiendo..."
                    : "Cambiar fotografía"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={
                      uploading
                    }
                    onChange={(
                      event
                    ) => {
                      const file =
                        event.target.files?.[0];

                      void handleImage(
                        file
                      );

                      event.target.value =
                        "";
                    }}
                  />
                </label>
              </div>

              <div
                className={
                  styles.formGrid
                }
              >
                <Field
                  label="Nombre"
                  value={
                    editor.name
                  }
                  onChange={(
                    value
                  ) =>
                    setEditor(
                      (current) => ({
                        ...current,
                        name:
                          value,
                      })
                    )
                  }
                />

                <Field
                  label="Cargo"
                  value={
                    editor.role
                  }
                  onChange={(
                    value
                  ) =>
                    setEditor(
                      (current) => ({
                        ...current,
                        role:
                          value,
                      })
                    )
                  }
                />

                <div
                  className={
                    styles.full
                  }
                >
                  <Field
                    label="Descripción"
                    value={
                      editor.description
                    }
                    onChange={(
                      value
                    ) =>
                      setEditor(
                        (current) => ({
                          ...current,
                          description:
                            value,
                        })
                      )
                    }
                    textarea
                  />
                </div>

                <div
                  className={
                    styles.full
                  }
                >
                  <Field
                    label="Texto alternativo de la foto"
                    value={
                      editor.imageAlt
                    }
                    onChange={(
                      value
                    ) =>
                      setEditor(
                        (current) => ({
                          ...current,
                          imageAlt:
                            value,
                        })
                      )
                    }
                  />
                </div>
              </div>

              <button
                type="button"
                className={`${styles.statusToggle} ${
                  editor.active
                    ? styles.statusToggleActive
                    : ""
                }`}
                onClick={() =>
                  setEditor(
                    (current) => ({
                      ...current,
                      active:
                        !current.active,
                    })
                  )
                }
              >
                {editor.active ? (
                  <Eye
                    size={15}
                    strokeWidth={1.8}
                  />
                ) : (
                  <EyeOff
                    size={15}
                    strokeWidth={1.8}
                  />
                )}

                {editor.active
                  ? "Visible en el sitio"
                  : "Oculto en el sitio"}
              </button>
            </div>

            <footer
              className={
                styles.modalFooter
              }
            >
              <button
                type="button"
                className={
                  styles.cancelButton
                }
                onClick={
                  closeEditor
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className={
                  styles.saveButton
                }
                onClick={() =>
                  void saveMember()
                }
                disabled={
                  saving ||
                  uploading
                }
              >
                <Save
                  size={14}
                  strokeWidth={1.8}
                />

                {saving
                  ? "Guardando..."
                  : "Guardar integrante"}
              </button>
            </footer>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div
          className={
            styles.modalBackdrop
          }
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setDeleteTarget(
                null
              );
            }
          }}
        >
          <div
            className={
              styles.deleteModal
            }
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className={
                styles.deleteClose
              }
              onClick={() =>
                setDeleteTarget(
                  null
                )
              }
              aria-label="Cerrar"
            >
              <X
                size={16}
                strokeWidth={1.8}
              />
            </button>

            <span
              className={
                styles.deleteIcon
              }
            >
              <Trash2
                size={20}
                strokeWidth={1.7}
              />
            </span>

            <span
              className={
                styles.deleteEyebrow
              }
            >
              ELIMINAR INTEGRANTE
            </span>

            <h2>
              ¿Eliminar a{" "}
              <strong>
                {
                  deleteTarget.name
                }
              </strong>
              ?
            </h2>

            <p>
              Se retirará del equipo
              publicado en Nosotros.
            </p>

            <div
              className={
                styles.deleteActions
              }
            >
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(
                    null
                  )
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className={
                  styles.confirmDelete
                }
                onClick={() =>
                  void confirmDelete()
                }
              >
                <Trash2
                  size={14}
                  strokeWidth={1.8}
                />

                Eliminar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;

  value: string;

  onChange: (
    value: string
  ) => void;

  textarea?: boolean;
}) {
  return (
    <label
      className={
        styles.field
      }
    >
      <span>
        {label}
      </span>

      {textarea ? (
        <textarea
          rows={4}
          value={
            value
          }
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
          placeholder={`Escribe ${label.toLowerCase()}`}
        />
      ) : (
        <input
          value={
            value
          }
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
          placeholder={`Escribe ${label.toLowerCase()}`}
        />
      )}
    </label>
  );
}