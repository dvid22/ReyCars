"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Archive,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Download,
  Eye,
  FileText,
  Inbox,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Phone,
  Plus,
  Save,
  Search,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";

import {
  getAuth,
} from "firebase/auth";

import {
  recruitmentService,
} from "@/firebase/firestore/recruitment.service";

import {
  recruitmentApplicationService,
} from "@/firebase/firestore/recruitmentApplication.service";

import {
  useRecruitmentApplications,
} from "@/hooks/useRecruitmentApplications";

import type {
  RecruitmentContent,
} from "@/types/recruitment.types";

import type {
  RecruitmentApplication,
  RecruitmentApplicationStatus,
} from "@/types/recruitmentApplication.types";

import styles from "./AdminRecruitmentPage.module.css";

const INITIAL_CONTENT: RecruitmentContent = {
  enabled: false,

  eyebrow:
    "Trabaja con nosotros",

  title:
    "Haz parte del equipo que mueve nuevos caminos.",

  highlightedText:
    "nuevos caminos.",

  description:
    "En ReyCars buscamos personas responsables, cercanas y comprometidas con una formación vial de calidad.",


  vacancy: {
    position:
      "Vacante disponible",

    shortDescription:
      "Cuéntanos sobre tu experiencia y por qué te gustaría hacer parte de ReyCars.",

    modality:
      "Presencial",

    contractType:
      "A convenir",

    location:
      "Ubaté, Cundinamarca",

    requirements: [
      "Actitud de servicio y responsabilidad.",
      "Buena comunicación y trabajo en equipo.",
      "Disponibilidad para trabajar de forma presencial.",
    ],
  },

  cta: {
    label:
      "Quiero postularme",

    mode:
      "whatsapp",

    whatsapp:
      "+57 310 2062512",

    email:
      "",

    message:
      "Hola ReyCars, quiero postularme a la vacante disponible.",
  },
};

type AdminView =
  | "vacancy"
  | "inbox";

function cloneContent(
  content: RecruitmentContent
) {
  return JSON.parse(
    JSON.stringify(
      content
    )
  ) as RecruitmentContent;
}

function formatApplicationDate(
  value: unknown
) {
  try {
    if (
      value &&
      typeof value ===
        "object" &&
      "toDate" in value &&
      typeof (
        value as {
          toDate?: unknown;
        }
      ).toDate ===
        "function"
    ) {
      const date =
        (
          value as {
            toDate: () => Date;
          }
        ).toDate();

      return new Intl.DateTimeFormat(
        "es-CO",
        {
          day:
            "2-digit",
          month:
            "short",
          hour:
            "numeric",
          minute:
            "2-digit",
        }
      ).format(
        date
      );
    }
  } catch {
    // ignore
  }

  return "Ahora";
}

function statusLabel(
  status: RecruitmentApplicationStatus
) {
  if (
    status ===
    "reviewing"
  ) {
    return "En revisión";
  }

  if (
    status ===
    "contacted"
  ) {
    return "Contactado";
  }

  if (
    status ===
    "archived"
  ) {
    return "Archivado";
  }

  return "Nuevo";
}

export function AdminRecruitmentPage() {
  const [
    view,
    setView,
  ] =
    useState<AdminView>(
      "vacancy"
    );

  const [
    content,
    setContent,
  ] =
    useState<RecruitmentContent>(
      cloneContent(
        INITIAL_CONTENT
      )
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isSaving,
    setIsSaving,
  ] =
    useState(false);

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

  const {
    applications,
    isLoading:
      applicationsLoading,
    newCount,
  } =
    useRecruitmentApplications();

  const [
    selectedId,
    setSelectedId,
  ] =
    useState<string | null>(
      null
    );

  const [
    queryText,
    setQueryText,
  ] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<
      | "all"
      | RecruitmentApplicationStatus
    >(
      "all"
    );

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<RecruitmentApplication | null>(
      null
    );

  useEffect(() => {
    void (async () => {
      try {
        setIsLoading(
          true
        );

        const saved =
          await recruitmentService.get();

        if (
          saved
        ) {
          setContent(
            saved
          );
        }
      } catch (error) {
        console.error(
          error
        );

        setError(
          "No fue posible cargar Trabaja con nosotros."
        );
      } finally {
        setIsLoading(
          false
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (
      selectedId &&
      applications.some(
        (item) =>
          item.id ===
          selectedId
      )
    ) {
      return;
    }

    setSelectedId(
      applications[0]?.id ??
        null
    );
  }, [
    applications,
    selectedId,
  ]);

  const filteredApplications =
    useMemo(
      () => {
        const search =
          queryText
            .trim()
            .toLowerCase();

        return applications.filter(
          (
            item
          ) => {
            if (
              statusFilter !==
                "all" &&
              item.status !==
                statusFilter
            ) {
              return false;
            }

            if (
              !search
            ) {
              return true;
            }

            return [
              item.fullName,
              item.email,
              item.phone,
              item.city,
              item.vacancyPosition,
            ].some(
              (value) =>
                value
                  .toLowerCase()
                  .includes(
                    search
                  )
            );
          }
        );
      },
      [
        applications,
        queryText,
        statusFilter,
      ]
    );

  const selected =
    applications.find(
      (item) =>
        item.id ===
        selectedId
    ) ??
    null;

  function updateRoot(
    key:
      | "eyebrow"
      | "title"
      | "highlightedText"
      | "description",
    value: string
  ) {
    setContent(
      (current) => ({
        ...current,
        [key]:
          value,
      })
    );

    setError("");
    setSuccess("");
  }

  function updateVacancy(
    key:
      keyof RecruitmentContent["vacancy"],
    value:
      RecruitmentContent["vacancy"][keyof RecruitmentContent["vacancy"]]
  ) {
    setContent(
      (current) => ({
        ...current,

        vacancy: {
          ...current.vacancy,

          [key]:
            value,
        },
      })
    );

    setError("");
    setSuccess("");
  }

  function addRequirement() {
    updateVacancy(
      "requirements",
      [
        ...content.vacancy
          .requirements,
        "Nuevo requisito",
      ]
    );
  }

  function updateRequirement(
    index: number,
    value: string
  ) {
    const requirements =
      [
        ...content.vacancy
          .requirements,
      ];

    requirements[
      index
    ] =
      value;

    updateVacancy(
      "requirements",
      requirements
    );
  }

  function removeRequirement(
    index: number
  ) {
    if (
      content.vacancy
        .requirements.length <=
      1
    ) {
      setError(
        "Debes conservar al menos un requisito."
      );

      return;
    }

    updateVacancy(
      "requirements",
      content.vacancy
        .requirements.filter(
          (
            _,
            itemIndex
          ) =>
            itemIndex !==
            index
        )
    );
  }

  async function saveVacancy() {
    if (
      isSaving
    ) {
      return;
    }

    try {
      setIsSaving(
        true
      );

      setError("");
      setSuccess("");

      const user =
        getAuth().currentUser;

      await recruitmentService.save(
        content,
        {
          uid:
            user?.uid,

          email:
            user?.email,
        }
      );

      setSuccess(
        content.enabled
          ? "Vacante publicada correctamente."
          : "Cambios guardados. El módulo sigue oculto."
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        "No fue posible guardar los cambios."
      );
    } finally {
      setIsSaving(
        false
      );
    }
  }

  async function changeStatus(
    application: RecruitmentApplication,
    status: RecruitmentApplicationStatus
  ) {
    try {
      await recruitmentApplicationService.setStatus(
        application.id,
        status
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        "No fue posible actualizar el estado."
      );
    }
  }

  async function deleteApplication() {
    if (
      !deleteTarget
    ) {
      return;
    }

    try {
      await recruitmentApplicationService.delete(
        deleteTarget.id
      );

      setDeleteTarget(
        null
      );

      setSuccess(
        "Postulación eliminada."
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        "No fue posible eliminar la postulación."
      );
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
          Cargando reclutamiento...
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
      <div
        className={
          styles.stickyControls
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
            CONTENIDO · RECLUTAMIENTO
          </span>

          <h1>
            Trabaja con nosotros
          </h1>

          <p>
            Publica la vacante y gestiona
            las hojas de vida recibidas.
          </p>
        </div>

        {view ===
        "vacancy" ? (
          <button
            type="button"
            className={
              styles.saveButton
            }
            onClick={() =>
              void saveVacancy()
            }
            disabled={
              isSaving ||
              isLoading
            }
          >
            <Save
              size={15}
              strokeWidth={1.8}
            />

            {isSaving
              ? "Guardando..."
              : "Guardar cambios"}
          </button>
        ) : null}
      </header>

      <div
        className={
          styles.tabs
        }
      >
        <button
          type="button"
          className={
            view ===
            "vacancy"
              ? styles.tabActive
              : ""
          }
          onClick={() =>
            setView(
              "vacancy"
            )
          }
        >
          <BriefcaseBusiness
            size={15}
            strokeWidth={1.75}
          />

          Vacante
        </button>

        <button
          type="button"
          className={
            view ===
            "inbox"
              ? styles.tabActive
              : ""
          }
          onClick={() =>
            setView(
              "inbox"
            )
          }
        >
          <Inbox
            size={15}
            strokeWidth={1.75}
          />

          Postulaciones

          {newCount > 0 ? (
            <span>
              {
                newCount
              }
            </span>
          ) : null}
        </button>
      </div>

      </div>

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

      {view ===
      "vacancy" ? (
        <VacancyEditor
          content={
            content
          }
          updateRoot={
            updateRoot
          }
          updateVacancy={
            updateVacancy
          }
          addRequirement={
            addRequirement
          }
          updateRequirement={
            updateRequirement
          }
          removeRequirement={
            removeRequirement
          }
          onToggle={() =>
            setContent(
              (
                current
              ) => ({
                ...current,

                enabled:
                  !current.enabled,
              })
            )
          }
        />
      ) : (
        <div
          className={
            styles.inboxShell
          }
        >
          <aside
            className={
              styles.inboxListPane
            }
          >
            <div
              className={
                styles.inboxToolbar
              }
            >
              <div
                className={
                  styles.searchBox
                }
              >
                <Search
                  size={14}
                  strokeWidth={1.7}
                />

                <input
                  value={
                    queryText
                  }
                  onChange={(
                    event
                  ) =>
                    setQueryText(
                      event.target.value
                    )
                  }
                  placeholder="Buscar postulante..."
                />
              </div>

              <select
                value={
                  statusFilter
                }
                onChange={(
                  event
                ) =>
                  setStatusFilter(
                    event.target.value as
                      | "all"
                      | RecruitmentApplicationStatus
                  )
                }
              >
                <option value="all">
                  Todos
                </option>

                <option value="new">
                  Nuevos
                </option>

                <option value="reviewing">
                  En revisión
                </option>

                <option value="contacted">
                  Contactados
                </option>

                <option value="archived">
                  Archivados
                </option>
              </select>
            </div>

            <div
              className={
                styles.inboxCount
              }
            >
              <span>
                {
                  filteredApplications.length
                }{" "}
                postulaciones
              </span>

              {newCount > 0 ? (
                <strong>
                  {
                    newCount
                  }{" "}
                  nuevas
                </strong>
              ) : null}
            </div>

            <div
              className={
                styles.messageList
              }
            >
              {applicationsLoading ? (
                <div
                  className={
                    styles.inboxEmpty
                  }
                >
                  Cargando...
                </div>
              ) : filteredApplications.length ===
                0 ? (
                <div
                  className={
                    styles.inboxEmpty
                  }
                >
                  <Inbox
                    size={25}
                    strokeWidth={1.5}
                  />

                  <strong>
                    No hay postulaciones
                  </strong>

                  <span>
                    Las hojas de vida
                    aparecerán aquí.
                  </span>
                </div>
              ) : (
                filteredApplications.map(
                  (
                    application
                  ) => (
                    <button
                      key={
                        application.id
                      }
                      type="button"
                      className={`${styles.messageRow} ${
                        selectedId ===
                        application.id
                          ? styles.messageRowActive
                          : ""
                      } ${
                        application.status ===
                        "new"
                          ? styles.messageRowUnread
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedId(
                          application.id
                        );

                        if (
                          application.status ===
                          "new"
                        ) {
                          void changeStatus(
                            application,
                            "reviewing"
                          );
                        }
                      }}
                    >
                      <span
                        className={
                          styles.messageAvatar
                        }
                      >
                        {
                          application.fullName
                            .charAt(
                              0
                            )
                            .toUpperCase() ||
                          "?"
                        }
                      </span>

                      <span
                        className={
                          styles.messageCopy
                        }
                      >
                        <span>
                          <strong>
                            {
                              application.fullName
                            }
                          </strong>

                          <small>
                            {formatApplicationDate(
                              application.createdAt
                            )}
                          </small>
                        </span>

                        <b>
                          {
                            application.vacancyPosition
                          }
                        </b>

                        <p>
                          {application.message ||
                            `${application.city} · ${application.email}`}
                        </p>
                      </span>

                      <ChevronRight
                        size={14}
                        strokeWidth={1.7}
                      />
                    </button>
                  )
                )
              )}
            </div>
          </aside>

          <section
            className={
              styles.messageDetail
            }
          >
            {selected ? (
              <>
                <div
                  className={
                    styles.detailHeader
                  }
                >
                  <div
                    className={
                      styles.detailIdentity
                    }
                  >
                    <span
                      className={
                        styles.detailAvatar
                      }
                    >
                      {
                        selected.fullName
                          .charAt(
                            0
                          )
                          .toUpperCase() ||
                        "?"
                      }
                    </span>

                    <div>
                      <strong>
                        {
                          selected.fullName
                        }
                      </strong>

                      <span>
                        {
                          selected.email
                        }
                      </span>
                    </div>
                  </div>

                  <div
                    className={
                      styles.detailActions
                    }
                  >
                    <select
                      value={
                        selected.status
                      }
                      onChange={(
                        event
                      ) =>
                        void changeStatus(
                          selected,
                          event.target.value as RecruitmentApplicationStatus
                        )
                      }
                    >
                      <option value="new">
                        Nuevo
                      </option>

                      <option value="reviewing">
                        En revisión
                      </option>

                      <option value="contacted">
                        Contactado
                      </option>

                      <option value="archived">
                        Archivado
                      </option>
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget(
                          selected
                        )
                      }
                      aria-label="Eliminar postulación"
                    >
                      <Trash2
                        size={15}
                        strokeWidth={1.7}
                      />
                    </button>
                  </div>
                </div>

                <div
                  className={
                    styles.detailSubject
                  }
                >
                  <div>
                    <span>
                      POSTULACIÓN
                    </span>

                    <h2>
                      {
                        selected.vacancyPosition
                      }
                    </h2>
                  </div>

                  <span
                    className={`${styles.statusBadge} ${styles[`status_${selected.status}`]}`}
                  >
                    {
                      statusLabel(
                        selected.status
                      )
                    }
                  </span>
                </div>

                <div
                  className={
                    styles.contactGrid
                  }
                >
                  <a
                    href={`tel:${selected.phone}`}
                  >
                    <Phone
                      size={15}
                      strokeWidth={1.7}
                    />

                    <span>
                      Teléfono
                    </span>

                    <strong>
                      {
                        selected.phone
                      }
                    </strong>
                  </a>

                  <a
                    href={`mailto:${selected.email}`}
                  >
                    <Mail
                      size={15}
                      strokeWidth={1.7}
                    />

                    <span>
                      Correo
                    </span>

                    <strong>
                      {
                        selected.email
                      }
                    </strong>
                  </a>

                  <div>
                    <MapPin
                      size={15}
                      strokeWidth={1.7}
                    />

                    <span>
                      Ciudad
                    </span>

                    <strong>
                      {
                        selected.city
                      }
                    </strong>
                  </div>
                </div>

                <div
                  className={
                    styles.detailBody
                  }
                >
                  <span>
                    MENSAJE DEL POSTULANTE
                  </span>

                  <p>
                    {selected.message ||
                      "El postulante no agregó un mensaje adicional."}
                  </p>
                </div>

                <div
                  className={
                    styles.cvCard
                  }
                >
                  <span
                    className={
                      styles.cvFileIcon
                    }
                  >
                    <FileText
                      size={24}
                      strokeWidth={1.55}
                    />
                  </span>

                  <div>
                    <span>
                      HOJA DE VIDA
                    </span>

                    <strong>
                      {
                        selected.cvFileName
                      }
                    </strong>

                    <small>
                      Archivo adjunto por el postulante
                    </small>
                  </div>

                  <a
                    href={
                      selected.cvUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye
                      size={15}
                      strokeWidth={1.7}
                    />

                    Abrir hoja de vida
                  </a>
                </div>

                <div
                  className={
                    styles.detailFooter
                  }
                >
                  <span>
                    <Clock3
                      size={13}
                      strokeWidth={1.7}
                    />

                    Recibido{" "}
                    {formatApplicationDate(
                      selected.createdAt
                    )}
                  </span>

                  <div>
                    <a
                      href={`https://wa.me/${selected.phone.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle
                        size={14}
                        strokeWidth={1.7}
                      />

                      WhatsApp
                    </a>

                    <a
                      href={`mailto:${selected.email}`}
                    >
                      <Mail
                        size={14}
                        strokeWidth={1.7}
                      />

                      Escribir correo
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div
                className={
                  styles.noSelection
                }
              >
                <CircleUserRound
                  size={35}
                  strokeWidth={1.4}
                />

                <strong>
                  Selecciona una postulación
                </strong>

                <span>
                  Aquí verás los datos y
                  la hoja de vida adjunta.
                </span>
              </div>
            )}
          </section>
        </div>
      )}

      {deleteTarget ? (
        <div
          className={
            styles.dialogBackdrop
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
              styles.deleteDialog
            }
          >
            <button
              type="button"
              className={
                styles.dialogClose
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

            <small>
              ELIMINAR POSTULACIÓN
            </small>

            <h2>
              ¿Eliminar la hoja de vida de{" "}
              <strong>
                {
                  deleteTarget.fullName
                }
              </strong>
              ?
            </h2>

            <p>
              Esta acción elimina el
              registro de la bandeja.
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
                  void deleteApplication()
                }
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function VacancyEditor({
  content,
  updateRoot,
  updateVacancy,
  addRequirement,
  updateRequirement,
  removeRequirement,
  onToggle,
}: {
  content: RecruitmentContent;
  updateRoot: (
    key:
      | "eyebrow"
      | "title"
      | "highlightedText"
      | "description",
    value: string
  ) => void;

  updateVacancy: (
    key:
      keyof RecruitmentContent["vacancy"],
    value:
      RecruitmentContent["vacancy"][keyof RecruitmentContent["vacancy"]]
  ) => void;

  addRequirement: () => void;

  updateRequirement: (
    index: number,
    value: string
  ) => void;

  removeRequirement: (
    index: number
  ) => void;

  onToggle: () => void;
}) {
  return (
    <>
      <section
        className={
          styles.publishCard
        }
      >
        <div>
          <span
            className={
              styles.publishIcon
            }
          >
            <BriefcaseBusiness
              size={18}
              strokeWidth={1.7}
            />
          </span>

          <div>
            <strong>
              Mostrar módulo en el sitio
            </strong>

            <p>
              Activa u oculta la página
              pública de reclutamiento.
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`${styles.switch} ${
            content.enabled
              ? styles.switchActive
              : ""
          }`}
          onClick={
            onToggle
          }
        >
          <span />

          <strong>
            {content.enabled
              ? "Visible"
              : "Oculto"}
          </strong>
        </button>
      </section>

      <div
        className={
          styles.vacancyLayout
        }
      >
        <div
          className={
            styles.editorColumn
          }
        >
          <section
            className={
              styles.card
            }
          >
            <SectionHeading
              number="01"
              title="Presentación"
            />

            <div
              className={
                styles.formGrid
              }
            >
              <Field
                label="Etiqueta"
                value={
                  content.eyebrow
                }
                onChange={(
                  value
                ) =>
                  updateRoot(
                    "eyebrow",
                    value
                  )
                }
              />

              <Field
                label="Texto resaltado"
                value={
                  content.highlightedText
                }
                onChange={(
                  value
                ) =>
                  updateRoot(
                    "highlightedText",
                    value
                  )
                }
              />

              <div
                className={
                  styles.full
                }
              >
                <Field
                  label="Título"
                  value={
                    content.title
                  }
                  onChange={(
                    value
                  ) =>
                    updateRoot(
                      "title",
                      value
                    )
                  }
                />
              </div>

              <div
                className={
                  styles.full
                }
              >
                <Field
                  label="Descripción"
                  value={
                    content.description
                  }
                  onChange={(
                    value
                  ) =>
                    updateRoot(
                      "description",
                      value
                    )
                  }
                  textarea
                />
              </div>
            </div>
          </section>

          <section
            className={
              styles.card
            }
          >
            <SectionHeading
              number="02"
              title="Vacante"
            />

            <div
              className={
                styles.formGrid
              }
            >
              <Field
                label="Cargo"
                value={
                  content.vacancy
                    .position
                }
                onChange={(
                  value
                ) =>
                  updateVacancy(
                    "position",
                    value
                  )
                }
              />

              <Field
                label="Modalidad"
                value={
                  content.vacancy
                    .modality
                }
                onChange={(
                  value
                ) =>
                  updateVacancy(
                    "modality",
                    value
                  )
                }
              />

              <Field
                label="Tipo de vinculación"
                value={
                  content.vacancy
                    .contractType
                }
                onChange={(
                  value
                ) =>
                  updateVacancy(
                    "contractType",
                    value
                  )
                }
              />

              <Field
                label="Ubicación"
                value={
                  content.vacancy
                    .location
                }
                onChange={(
                  value
                ) =>
                  updateVacancy(
                    "location",
                    value
                  )
                }
              />

              <div
                className={
                  styles.full
                }
              >
                <Field
                  label="Descripción de la vacante"
                  value={
                    content.vacancy
                      .shortDescription
                  }
                  onChange={(
                    value
                  ) =>
                    updateVacancy(
                      "shortDescription",
                      value
                    )
                  }
                  textarea
                />
              </div>
            </div>

            <div
              className={
                styles.requirementBlock
              }
            >
              <div
                className={
                  styles.requirementHeader
                }
              >
                <strong>
                  Requisitos
                </strong>

                <button
                  type="button"
                  onClick={
                    addRequirement
                  }
                >
                  <Plus
                    size={14}
                    strokeWidth={1.8}
                  />

                  Agregar
                </button>
              </div>

              {content.vacancy.requirements.map(
                (
                  requirement,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className={
                      styles.requirementRow
                    }
                  >
                    <span>
                      <Check
                        size={13}
                        strokeWidth={2}
                      />
                    </span>

                    <input
                      value={
                        requirement
                      }
                      onChange={(
                        event
                      ) =>
                        updateRequirement(
                          index,
                          event.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeRequirement(
                          index
                        )
                      }
                    >
                      <Trash2
                        size={13}
                        strokeWidth={1.8}
                      />
                    </button>
                  </div>
                )
              )}
            </div>
          </section>
        </div>

      </div>
    </>
  );
}

function SectionHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <header
      className={
        styles.sectionHeading
      }
    >
      <span>
        {number}
      </span>

      <strong>
        {title}
      </strong>
    </header>
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
        />
      )}
    </label>
  );
}