"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  getAuth,
} from "firebase/auth";

import {
  faqService,
} from "@/firebase/firestore/faq.service";

import {
  useFaq,
} from "@/hooks/useFaq";

import type {
  FaqFormData,
  FaqItem,
} from "@/types/faq.types";

import styles from "./AdminFaqPage.module.css";

const CURRENT_FAQ: FaqFormData[] = [
  {
    question:
      "¿Qué documentos necesito para iniciar?",
    answer:
      "Los requisitos pueden variar según el trámite y la categoría. Escríbenos y te indicamos exactamente qué necesitas para comenzar tu proceso.",
    active: true,
    order: 1,
  },
  {
    question:
      "¿El curso incluye formación práctica?",
    answer:
      "Sí. Los cursos de licencia combinan formación teórica y práctica de acuerdo con la categoría seleccionada.",
    active: true,
    order: 2,
  },
  {
    question:
      "¿Cuánto dura el proceso?",
    answer:
      "La duración depende de la categoría, la programación de clases y el avance de cada estudiante. Podemos orientarte según el curso que quieras realizar.",
    active: true,
    order: 3,
  },
  {
    question:
      "¿En qué horarios puedo tomar las clases?",
    answer:
      "La disponibilidad puede variar. Contáctanos para consultar los horarios disponibles y organizar tu proceso.",
    active: true,
    order: 4,
  },
  {
    question:
      "¿Cómo sé qué categoría de licencia necesito?",
    answer:
      "Depende del tipo de vehículo que deseas conducir y del uso que tendrá. En ReyCars te ayudamos a identificar la categoría adecuada antes de iniciar.",
    active: true,
    order: 5,
  },
  {
    question:
      "¿Puedo solicitar clases de refuerzo?",
    answer:
      "Sí. Contamos con refuerzo práctico para automóvil y motocicleta, pensado para fortalecer confianza, control y experiencia en la conducción.",
    active: true,
    order: 6,
  },
];

type ModalState =
  | {
      mode: "create";
      item: null;
    }
  | {
      mode: "edit";
      item: FaqItem;
    }
  | null;

export function AdminFaqPage() {
  const {
    items,
    isLoading,
    error: loadError,
  } = useFaq();

  const [
    modal,
    setModal,
  ] =
    useState<ModalState>(
      null
    );

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<FaqItem | null>(
      null
    );

  const [
    isWorking,
    setIsWorking,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const visibleCount =
    useMemo(
      () =>
        items.filter(
          (item) =>
            item.active
        ).length,
      [items]
    );

  useEffect(() => {
    if (loadError) {
      setError(
        loadError
      );
    }
  }, [loadError]);

  function getUser() {
    const user =
      getAuth().currentUser;

    return {
      uid: user?.uid,
      email: user?.email,
    };
  }

  async function handleImport() {
    if (isWorking) return;

    try {
      setIsWorking(true);
      setError("");
      setMessage("");

      const imported =
        await faqService.importFaq(
          CURRENT_FAQ,
          getUser()
        );

      if (!imported) {
        setError(
          "Ya existen preguntas guardadas."
        );
        return;
      }

      setMessage(
        "Preguntas actuales importadas correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No fue posible importar las preguntas."
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleToggle(
    item: FaqItem
  ) {
    if (isWorking) return;

    try {
      setIsWorking(true);
      setError("");
      setMessage("");

      await faqService.setFaqActive(
        item.id,
        !item.active,
        getUser()
      );
    } catch (error) {
      console.error(error);

      setError(
        "No fue posible cambiar la visibilidad."
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleMove(
    item: FaqItem,
    direction: -1 | 1
  ) {
    if (isWorking) return;

    const index =
      items.findIndex(
        (current) =>
          current.id ===
          item.id
      );

    const nextIndex =
      index + direction;

    if (
      index < 0 ||
      nextIndex < 0 ||
      nextIndex >=
        items.length
    ) {
      return;
    }

    const reordered =
      [...items];

    [
      reordered[index],
      reordered[nextIndex],
    ] = [
      reordered[nextIndex],
      reordered[index],
    ];

    try {
      setIsWorking(true);
      setError("");
      setMessage("");

      await faqService.reorderFaq(
        reordered,
        getUser()
      );
    } catch (error) {
      console.error(error);

      setError(
        "No fue posible cambiar el orden."
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleDelete() {
    if (
      !deleteTarget ||
      isWorking
    ) {
      return;
    }

    try {
      setIsWorking(true);
      setError("");
      setMessage("");

      await faqService.deleteFaq(
        deleteTarget.id
      );

      const remaining =
        items.filter(
          (item) =>
            item.id !==
            deleteTarget.id
        );

      if (
        remaining.length >
        0
      ) {
        await faqService.reorderFaq(
          remaining,
          getUser()
        );
      }

      setDeleteTarget(
        null
      );

      setMessage(
        "Pregunta eliminada correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No fue posible eliminar la pregunta."
      );
    } finally {
      setIsWorking(false);
    }
  }

  if (isLoading) {
    return (
      <section
        className={
          styles.loadingState
        }
      >
        <span />

        <p>
          Cargando preguntas...
        </p>
      </section>
    );
  }

  return (
    <section
      className={styles.page}
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
            CONTENIDO · FAQ
          </span>

          <h1>
            Preguntas frecuentes
          </h1>

          <p>
            Administra las preguntas
            que se muestran en la Home.
          </p>
        </div>

        <button
          type="button"
          className={
            styles.primaryButton
          }
          onClick={() =>
            setModal({
              mode: "create",
              item: null,
            })
          }
        >
          <Plus
            size={15}
            strokeWidth={1.8}
          />
          Nueva pregunta
        </button>
      </header>
      </div>

      {items.length === 0 ? (
        <div
          className={
            styles.emptyState
          }
        >
          <span
            className={
              styles.emptyIcon
            }
          >
            <Check
              size={20}
              strokeWidth={1.7}
            />
          </span>

          <div>
            <strong>
              Aún no hay preguntas
              guardadas
            </strong>

            <p>
              Puedes importar las 6
              preguntas que actualmente
              utiliza la Home o crear una
              nueva desde cero.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void handleImport()
            }
            disabled={
              isWorking
            }
          >
            {isWorking
              ? "Importando..."
              : "Importar preguntas actuales"}
          </button>
        </div>
      ) : null}

      {error ? (
        <div
          className={
            styles.error
          }
        >
          {error}
        </div>
      ) : null}

      {message ? (
        <div
          className={
            styles.success
          }
        >
          {message}
        </div>
      ) : null}

      {items.length > 0 ? (
        <div
          className={
            styles.board
          }
        >
          <div
            className={
              styles.boardHeader
            }
          >
            <div>
              <span>
                PREGUNTAS
              </span>

              <strong>
                {visibleCount}
                {" de "}
                {items.length}
                {" visibles"}
              </strong>
            </div>

            <span
              className={
                styles.orderNote
              }
            >
              El orden se refleja en la
              Home
            </span>
          </div>

          <div
            className={
              styles.list
            }
          >
            {items.map(
              (
                item,
                index
              ) => (
                <article
                  key={
                    item.id
                  }
                  className={`${styles.card} ${
                    !item.active
                      ? styles.cardHidden
                      : ""
                  }`}
                >
                  <div
                    className={
                      styles.number
                    }
                  >
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div
                    className={
                      styles.content
                    }
                  >
                    <div
                      className={
                        styles.questionRow
                      }
                    >
                      <strong>
                        {
                          item.question
                        }
                      </strong>

                      <span
                        className={`${styles.status} ${
                          item.active
                            ? styles.statusActive
                            : styles.statusHidden
                        }`}
                      >
                        {item.active
                          ? "Visible"
                          : "Oculta"}
                      </span>
                    </div>

                    <p>
                      {item.answer}
                    </p>
                  </div>

                  <div
                    className={
                      styles.actions
                    }
                  >
                    <div
                      className={
                        styles.orderActions
                      }
                    >
                      <button
                        type="button"
                        onClick={() =>
                          void handleMove(
                            item,
                            -1
                          )
                        }
                        disabled={
                          index ===
                            0 ||
                          isWorking
                        }
                        aria-label="Mover arriba"
                      >
                        <ArrowUp
                          size={14}
                          strokeWidth={
                            1.8
                          }
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void handleMove(
                            item,
                            1
                          )
                        }
                        disabled={
                          index ===
                            items.length -
                              1 ||
                          isWorking
                        }
                        aria-label="Mover abajo"
                      >
                        <ArrowDown
                          size={14}
                          strokeWidth={
                            1.8
                          }
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void handleToggle(
                          item
                        )
                      }
                      disabled={
                        isWorking
                      }
                      aria-label={
                        item.active
                          ? "Ocultar pregunta"
                          : "Mostrar pregunta"
                      }
                    >
                      {item.active ? (
                        <EyeOff
                          size={14}
                          strokeWidth={
                            1.8
                          }
                        />
                      ) : (
                        <Eye
                          size={14}
                          strokeWidth={
                            1.8
                          }
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setModal({
                          mode: "edit",
                          item,
                        })
                      }
                      aria-label="Editar pregunta"
                    >
                      <Edit3
                        size={14}
                        strokeWidth={
                          1.8
                        }
                      />
                    </button>

                    <button
                      type="button"
                      className={
                        styles.deleteAction
                      }
                      onClick={() =>
                        setDeleteTarget(
                          item
                        )
                      }
                      aria-label="Eliminar pregunta"
                    >
                      <Trash2
                        size={14}
                        strokeWidth={
                          1.8
                        }
                      />
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      ) : null}

      {modal ? (
        <FaqModal
          modal={modal}
          nextOrder={
            items.length + 1
          }
          onClose={() =>
            setModal(null)
          }
          onSaved={() => {
            setModal(null);
            setMessage(
              modal.mode ===
                "create"
                ? "Pregunta creada correctamente."
                : "Pregunta actualizada correctamente."
            );
          }}
          onError={
            setError
          }
        />
      ) : null}

      {deleteTarget ? (
        <DeleteDialog
          question={
            deleteTarget.question
          }
          disabled={
            isWorking
          }
          onCancel={() =>
            setDeleteTarget(
              null
            )
          }
          onConfirm={() =>
            void handleDelete()
          }
        />
      ) : null}
    </section>
  );
}

function FaqModal({
  modal,
  nextOrder,
  onClose,
  onSaved,
  onError,
}: {
  modal: Exclude<
    ModalState,
    null
  >;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
  onError: (
    message: string
  ) => void;
}) {
  const isEdit =
    modal.mode === "edit";

  const [
    question,
    setQuestion,
  ] = useState(
    isEdit
      ? modal.item.question
      : ""
  );

  const [
    answer,
    setAnswer,
  ] = useState(
    isEdit
      ? modal.item.answer
      : ""
  );

  const [
    active,
    setActive,
  ] = useState(
    isEdit
      ? modal.item.active
      : true
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  async function handleSave() {
    const cleanQuestion =
      question.trim();

    const cleanAnswer =
      answer.trim();

    if (
      cleanQuestion.length <
      5
    ) {
      onError(
        "La pregunta debe tener al menos 5 caracteres."
      );
      return;
    }

    if (
      cleanAnswer.length <
      10
    ) {
      onError(
        "La respuesta debe tener al menos 10 caracteres."
      );
      return;
    }

    try {
      setSaving(true);

      const user =
        getAuth().currentUser;

      const userData = {
        uid: user?.uid,
        email: user?.email,
      };

      if (isEdit) {
        await faqService.updateFaq(
          modal.item.id,
          {
            question:
              cleanQuestion,
            answer:
              cleanAnswer,
            active,
          },
          userData
        );
      } else {
        await faqService.createFaq(
          {
            question:
              cleanQuestion,
            answer:
              cleanAnswer,
            active,
            order:
              nextOrder,
          },
          userData
        );
      }

      onSaved();
    } catch (error) {
      console.error(error);

      onError(
        "No fue posible guardar la pregunta."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
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
          onClose();
        }
      }}
    >
      <div
        className={
          styles.modal
        }
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className={
            styles.modalClose
          }
          onClick={
            onClose
          }
          aria-label="Cerrar"
        >
          <X
            size={16}
            strokeWidth={1.8}
          />
        </button>

        <div
          className={
            styles.modalHeader
          }
        >
          <span>
            {isEdit
              ? "EDITAR PREGUNTA"
              : "NUEVA PREGUNTA"}
          </span>

          <h2>
            {isEdit
              ? "Actualizar contenido"
              : "Agregar pregunta"}
          </h2>

          <p>
            Este contenido se publicará
            en la sección de preguntas
            frecuentes.
          </p>
        </div>

        <div
          className={
            styles.form
          }
        >
          <label
            className={
              styles.field
            }
          >
            <span>
              Pregunta
            </span>

            <input
              value={
                question
              }
              onChange={(
                event
              ) =>
                setQuestion(
                  event.target
                    .value
                )
              }
              placeholder="Escribe la pregunta"
            />
          </label>

          <label
            className={
              styles.field
            }
          >
            <span>
              Respuesta
            </span>

            <textarea
              rows={6}
              value={
                answer
              }
              onChange={(
                event
              ) =>
                setAnswer(
                  event.target
                    .value
                )
              }
              placeholder="Escribe una respuesta clara"
            />
          </label>

          <label
            className={
              styles.visibility
            }
          >
            <div>
              <strong>
                Mostrar pregunta
              </strong>

              <small>
                Puedes dejarla oculta
                hasta que esté lista.
              </small>
            </div>

            <input
              type="checkbox"
              checked={active}
              onChange={(
                event
              ) =>
                setActive(
                  event.target
                    .checked
                )
              }
            />

            <span>
              <i />
            </span>
          </label>
        </div>

        <div
          className={
            styles.modalActions
          }
        >
          <button
            type="button"
            className={
              styles.secondaryButton
            }
            onClick={
              onClose
            }
          >
            Cancelar
          </button>

          <button
            type="button"
            className={
              styles.primaryButton
            }
            onClick={() =>
              void handleSave()
            }
            disabled={
              saving
            }
          >
            {saving
              ? "Guardando..."
              : isEdit
                ? "Guardar cambios"
                : "Crear pregunta"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteDialog({
  question,
  disabled,
  onCancel,
  onConfirm,
}: {
  question: string;
  disabled: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
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
          onCancel();
        }
      }}
    >
      <div
        className={
          styles.deleteDialog
        }
        role="dialog"
        aria-modal="true"
      >
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

        <div>
          <span
            className={
              styles.deleteEyebrow
            }
          >
            ELIMINAR PREGUNTA
          </span>

          <h2>
            ¿Eliminar esta pregunta?
          </h2>

          <p>
            {question}
          </p>

          <small>
            Se eliminará de Firebase y
            dejará de aparecer en la
            Home.
          </small>
        </div>

        <div
          className={
            styles.modalActions
          }
        >
          <button
            type="button"
            className={
              styles.secondaryButton
            }
            onClick={
              onCancel
            }
            disabled={
              disabled
            }
          >
            Cancelar
          </button>

          <button
            type="button"
            className={
              styles.dangerButton
            }
            onClick={
              onConfirm
            }
            disabled={
              disabled
            }
          >
            <Trash2
              size={14}
              strokeWidth={1.8}
            />
            {disabled
              ? "Eliminando..."
              : "Eliminar pregunta"}
          </button>
        </div>
      </div>
    </div>
  );
}