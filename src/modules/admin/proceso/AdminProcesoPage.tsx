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
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Plus,
  Save,
  Trash2,
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
  siteService,
} from "@/firebase/firestore/site.service";

import type {
  ProcessContent,
  ProcessHighlight,
  ProcessIconName,
  ProcessStep,
} from "@/types/process.types";

import {
  getProcessIconLabel,
  PROCESS_ICON_OPTIONS,
  ProcessIconGlyph,
} from "@/components/process/ProcessIcon";

import styles from "./AdminProcesoPage.module.css";

const CURRENT_PROCESS: ProcessContent = {
  eyebrow: "Proceso",
  title: "Proceso completo en ReyCars.",
  highlightedText: "ReyCars.",
  description:
    "Conoce cada etapa para iniciar y completar tu proceso de formación en ReyCars.",
  selectorTitle: "Tu ruta de formación",
  steps: [
    {
      id: "elige-formacion",
      order: 1,
      number: "01",
      title: "Elige tu formación",
      shortTitle: "Elige tu formación",
      description:
        "Explora las categorías y programas disponibles para identificar la opción que mejor se ajusta a tu recorrido.",
      imageUrl:
        "/assets/images/proceso/01-elige-formacion.png",
      imageAlt:
        "Persona revisando las opciones de formación de ReyCars",
      icon: "route",
      active: true,
      highlights: [
        {
          icon: "route",
          title: "Opciones claras",
          description:
            "Compara categorías y programas desde un solo lugar.",
        },
        {
          icon: "file",
          title: "Información completa",
          description:
            "Consulta horas, modalidad y características principales.",
        },
        {
          icon: "check",
          title: "Decisión informada",
          description:
            "Elige con mayor claridad la formación que necesitas.",
        },
      ],
    },
    {
      id: "inicia-proceso",
      order: 2,
      number: "02",
      title: "Inicia tu proceso",
      shortTitle: "Inicia tu proceso",
      description:
        "Recibe orientación para comenzar tu formación y organizar los pasos iniciales de manera clara.",
      imageUrl:
        "/assets/images/proceso/02-inicia-proceso.png",
      imageAlt:
        "Persona iniciando su proceso de formación con ReyCars",
      icon: "clipboard",
      active: true,
      highlights: [
        {
          icon: "file",
          title: "Orientación inicial",
          description:
            "Conoce qué necesitas para empezar tu proceso.",
        },
        {
          icon: "check",
          title: "Proceso organizado",
          description:
            "Avanza paso a paso con información clara.",
        },
        {
          icon: "shield",
          title: "Acompañamiento",
          description:
            "Resuelve tus dudas durante el inicio del proceso.",
        },
      ],
    },
    {
      id: "formacion-teorica",
      order: 3,
      number: "03",
      title: "Formación teórica",
      shortTitle: "Formación teórica",
      description:
        "Aprende conceptos fundamentales de tránsito, señales, prevención y conducción responsable antes de pasar a la práctica.",
      imageUrl:
        "/assets/images/proceso/03-formacion-teorica.png",
      imageAlt:
        "Clase teórica de conducción en ReyCars",
      icon: "book",
      active: true,
      highlights: [
        {
          icon: "graduation",
          title: "Clases guiadas",
          description:
            "Avanza paso a paso durante tu proceso de aprendizaje.",
        },
        {
          icon: "file",
          title: "Contenido organizado",
          description:
            "Estudia los temas necesarios antes de la etapa práctica.",
        },
        {
          icon: "shield",
          title: "Preparación responsable",
          description:
            "Fortalece conocimientos para desenvolverte mejor en la vía.",
        },
      ],
    },
    {
      id: "practica-ruta",
      order: 4,
      number: "04",
      title: "Práctica en ruta",
      shortTitle: "Práctica en ruta",
      description:
        "Lleva la teoría a situaciones reales de conducción y desarrolla seguridad, control y confianza durante la práctica.",
      imageUrl:
        "/assets/images/proceso/04-practica-ruta.png",
      imageAlt:
        "Práctica de conducción en ruta con vehículo ReyCars",
      icon: "car",
      active: true,
      highlights: [
        {
          icon: "route",
          title: "Práctica progresiva",
          description:
            "Aplica lo aprendido en situaciones reales de conducción.",
        },
        {
          icon: "shield",
          title: "Conducción segura",
          description:
            "Refuerza hábitos responsables y prevención en la vía.",
        },
        {
          icon: "check",
          title: "Más confianza",
          description:
            "Desarrolla control y seguridad durante cada práctica.",
        },
      ],
    },
    {
      id: "completa-recorrido",
      order: 5,
      number: "05",
      title: "Completa tu recorrido",
      shortTitle: "Completa tu recorrido",
      description:
        "Finaliza las etapas de tu formación y continúa tu camino con los conocimientos y la práctica adquiridos durante el proceso.",
      imageUrl:
        "/assets/images/proceso/05-completa-recorrido.png",
      imageAlt:
        "Persona completando su recorrido de formación en ReyCars",
      icon: "flag",
      active: true,
      highlights: [
        {
          icon: "check",
          title: "Etapas completadas",
          description:
            "Finaliza el recorrido definido para tu formación.",
        },
        {
          icon: "shield",
          title: "Conducción responsable",
          description:
            "Conserva hábitos seguros después de terminar el proceso.",
        },
        {
          icon: "route",
          title: "Tu recorrido continúa",
          description:
            "Lleva lo aprendido a cada experiencia en la vía.",
        },
      ],
    },
  ],
};

function cloneContent(
  value: ProcessContent
) {
  return JSON.parse(
    JSON.stringify(value)
  ) as ProcessContent;
}

function safeFileName(
  value: string
) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(
      /[^a-z0-9._-]/g,
      ""
    );
}

function createStepId() {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return `etapa-${crypto.randomUUID()}`;
  }

  return `etapa-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function renumberSteps(
  steps: ProcessStep[]
) {
  return steps.map(
    (step, index) => ({
      ...step,
      order: index + 1,
      number: String(
        index + 1
      ).padStart(2, "0"),
    })
  );
}

function createEmptyStep(
  order: number
): ProcessStep {
  return {
    id: createStepId(),
    order,
    number:
      String(order).padStart(
        2,
        "0"
      ),
    title: "Nueva etapa",
    shortTitle:
      "Nueva etapa",
    description: "",
    imageUrl: "",
    imageAlt:
      "Etapa del proceso ReyCars",
    icon: "route",
    active: false,
    highlights: [
      {
        icon: "route",
        title: "",
        description: "",
      },
      {
        icon: "shield",
        title: "",
        description: "",
      },
      {
        icon: "check",
        title: "",
        description: "",
      },
    ],
  };
}

async function uploadProcessImage(
  file: File,
  stepId: string
) {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (
    !allowed.includes(file.type)
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
      file.name || "proceso"
    )}`;

  const storageRef =
    ref(
      storage,
      `site/process/${stepId}/${fileName}`
    );

  await uploadBytes(
    storageRef,
    file,
    {
      contentType:
        file.type || undefined,
    }
  );

  return getDownloadURL(
    storageRef
  );
}

function validateProcess(
  content: ProcessContent
) {
  if (
    content.steps.length === 0
  ) {
    return "Debes tener al menos una etapa.";
  }

  const activeSteps =
    content.steps.filter(
      (step) => step.active
    );

  if (
    activeSteps.length === 0
  ) {
    return "Debes dejar al menos una etapa visible.";
  }

  for (
    const step of activeSteps
  ) {
    if (
      !step.title.trim()
    ) {
      return `La etapa ${step.number} necesita un título.`;
    }

    if (
      !step.shortTitle.trim()
    ) {
      return `La etapa ${step.number} necesita un título corto.`;
    }

    if (
      !step.description.trim()
    ) {
      return `La etapa ${step.number} necesita una descripción.`;
    }

    if (
      !step.imageUrl.trim()
    ) {
      return `La etapa ${step.number} necesita una imagen antes de publicarse.`;
    }

    for (
      let index = 0;
      index <
      step.highlights.length;
      index += 1
    ) {
      const highlight =
        step.highlights[index];

      if (
        !highlight.title.trim() ||
        !highlight.description.trim()
      ) {
        return `Completa los 3 detalles de la etapa ${step.number} antes de publicarla.`;
      }
    }
  }

  return "";
}

export function AdminProcesoPage() {
  const [
    content,
    setContent,
  ] =
    useState<ProcessContent>(
      cloneContent(
        CURRENT_PROCESS
      )
    );

  const [
    selectedId,
    setSelectedId,
  ] =
    useState(
      CURRENT_PROCESS.steps[0].id
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    uploadingId,
    setUploadingId,
  ] =
    useState<string | null>(
      null
    );

  const [
    hasDocument,
    setHasDocument,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    deleteTargetId,
    setDeleteTargetId,
  ] =
    useState<string | null>(
      null
    );

  const [
    openIconSelectorId,
    setOpenIconSelectorId,
  ] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    void (async () => {
      try {
        setIsLoading(true);
        setError("");

        const saved =
          await siteService.getProcessContent();

        if (
          saved &&
          saved.steps.length > 0
        ) {
          const normalized =
            {
              ...saved,
              steps:
                renumberSteps(
                  saved.steps
                ),
            };

          setContent(
            normalized
          );

          setSelectedId(
            normalized.steps[0].id
          );

          setHasDocument(true);
        } else {
          setContent(
            cloneContent(
              CURRENT_PROCESS
            )
          );

          setHasDocument(false);
        }
      } catch (error) {
        console.error(error);

        setError(
          "No fue posible cargar el proceso."
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const selectedStep =
    useMemo(
      () =>
        content.steps.find(
          (step) =>
            step.id ===
            selectedId
        ) ??
        content.steps[0],
      [
        content.steps,
        selectedId,
      ]
    );

  const selectedIndex =
    useMemo(
      () =>
        content.steps.findIndex(
          (step) =>
            step.id ===
            selectedId
        ),
      [
        content.steps,
        selectedId,
      ]
    );

  function updateHeader(
    key:
      | "eyebrow"
      | "title"
      | "highlightedText"
      | "description"
      | "selectorTitle",
    value: string
  ) {
    setContent(
      (current) => ({
        ...current,
        [key]: value,
      })
    );
  }

  function updateStep(
    id: string,
    patch:
      Partial<ProcessStep>
  ) {
    setContent(
      (current) => ({
        ...current,
        steps:
          current.steps.map(
            (step) =>
              step.id === id
                ? {
                    ...step,
                    ...patch,
                  }
                : step
          ),
      })
    );
  }

  function updateHighlight(
    stepId: string,
    index: number,
    patch:
      Partial<ProcessHighlight>
  ) {
    setContent(
      (current) => ({
        ...current,
        steps:
          current.steps.map(
            (step) => {
              if (
                step.id !==
                stepId
              ) {
                return step;
              }

              return {
                ...step,
                highlights:
                  step.highlights.map(
                    (
                      highlight,
                      currentIndex
                    ) =>
                      currentIndex ===
                      index
                        ? {
                            ...highlight,
                            ...patch,
                          }
                        : highlight
                  ),
              };
            }
          ),
      })
    );
  }

  function handleAddStep() {
    setOpenIconSelectorId(null);
    setError("");
    setSuccess("");

    const newStep =
      createEmptyStep(
        content.steps.length +
          1
      );

    setContent(
      (current) => ({
        ...current,
        steps:
          renumberSteps([
            ...current.steps,
            newStep,
          ]),
      })
    );

    setSelectedId(
      newStep.id
    );
  }

  function handleMove(
    direction: -1 | 1
  ) {
    setContent(
      (current) => {
        const currentIndex =
          current.steps.findIndex(
            (step) =>
              step.id ===
              selectedId
          );

        if (
          currentIndex < 0
        ) {
          return current;
        }

        const nextIndex =
          currentIndex +
          direction;

        if (
          nextIndex < 0 ||
          nextIndex >=
            current.steps.length
        ) {
          return current;
        }

        const steps =
          [...current.steps];

        [
          steps[currentIndex],
          steps[nextIndex],
        ] = [
          steps[nextIndex],
          steps[currentIndex],
        ];

        return {
          ...current,
          steps:
            renumberSteps(
              steps
            ),
        };
      }
    );
  }

  function handleDeleteStep() {
    setOpenIconSelectorId(null);

    if (!selectedStep) {
      return;
    }

    if (
      content.steps.length <=
      1
    ) {
      setError(
        "Debes conservar al menos una etapa en el proceso."
      );
      return;
    }

    setDeleteTargetId(
      selectedStep.id
    );
  }

  function confirmDeleteStep() {
    if (!deleteTargetId) {
      return;
    }

    const deleteIndex =
      content.steps.findIndex(
        (step) =>
          step.id ===
          deleteTargetId
      );

    if (deleteIndex < 0) {
      setDeleteTargetId(null);
      return;
    }

    const nextSteps =
      renumberSteps(
        content.steps.filter(
          (step) =>
            step.id !==
            deleteTargetId
        )
      );

    const nextSelection =
      nextSteps[
        Math.min(
          Math.max(
            deleteIndex - 1,
            0
          ),
          nextSteps.length - 1
        )
      ];

    setContent(
      (current) => ({
        ...current,
        steps: nextSteps,
      })
    );

    setSelectedId(
      nextSelection.id
    );

    setDeleteTargetId(null);
    setError("");
    setSuccess("");
  }

  function goStep(
    direction: -1 | 1
  ) {
    if (
      selectedIndex < 0
    ) {
      return;
    }

    const nextIndex =
      Math.min(
        content.steps.length -
          1,
        Math.max(
          0,
          selectedIndex +
            direction
        )
      );

    setSelectedId(
      content.steps[
        nextIndex
      ].id
    );
  }

  async function handleImage(
    step: ProcessStep,
    file?: File
  ) {
    if (!file) {
      return;
    }

    try {
      setUploadingId(
        step.id
      );

      setError("");
      setSuccess("");

      const url =
        await uploadProcessImage(
          file,
          step.id
        );

      updateStep(
        step.id,
        {
          imageUrl: url,
          imageAlt:
            step.imageAlt.trim() ||
            `${step.title} ReyCars`,
        }
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No fue posible subir la imagen."
      );
    } finally {
      setUploadingId(null);
    }
  }

  async function handleSave() {
    if (
      isSaving ||
      uploadingId
    ) {
      return;
    }

    const validationError =
      validateProcess(
        content
      );

    if (
      validationError
    ) {
      setError(
        validationError
      );
      setSuccess("");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const finalContent:
        ProcessContent = {
          ...content,
          steps:
            renumberSteps(
              content.steps
            ),
        };

      const user =
        getAuth().currentUser;

      await siteService.saveProcessContent(
        finalContent,
        {
          uid: user?.uid,
          email: user?.email,
        }
      );

      setContent(
        finalContent
      );

      setHasDocument(true);

      setSuccess(
        "Proceso guardado correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No fue posible guardar los cambios."
      );
    } finally {
      setIsSaving(false);
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
          Cargando proceso...
        </p>
      </section>
    );
  }

  if (!selectedStep) {
    return null;
  }

  return (
    <section
      className={styles.page}
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
            CONTENIDO · PROCESO
          </span>

          <h1>
            Ruta de formación
          </h1>

          <p>
            Crea, edita,
            reordena, oculta o
            elimina las etapas del
            proceso.
          </p>
        </div>

        <div
          className={
            styles.headerActions
          }
        >
          <button
            type="button"
            className={
              styles.addButton
            }
            onClick={
              handleAddStep
            }
            disabled={
              isSaving ||
              !!uploadingId
            }
          >
            <Plus
              size={15}
              strokeWidth={1.8}
            />
            Nueva etapa
          </button>

          <button
            type="button"
            className={
              styles.saveButton
            }
            onClick={() =>
              void handleSave()
            }
            disabled={
              isSaving ||
              !!uploadingId
            }
          >
            {isSaving
              ? "Guardando..."
              : (
                <>
                  <Save
                    size={15}
                    strokeWidth={
                      1.8
                    }
                  />
                  Guardar cambios
                </>
              )}
          </button>
        </div>
      </header>

      {!hasDocument ? (
        <div
          className={
            styles.notice
          }
        >
          <Check
            size={15}
            strokeWidth={2}
          />

          <p>
            Primera
            configuración. Los
            pasos actuales están
            precargados solo para
            inicializar Firestore.
            Pulsa
            <strong>
              {" "}Guardar cambios{" "}
            </strong>
            una vez.
          </p>
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
          styles.pageSettings
        }
      >
        <div
          className={
            styles.blockHeading
          }
        >
          <span>
            PRESENTACIÓN
          </span>

          <strong>
            Encabezado de la página
          </strong>
        </div>

        <div
          className={
            styles.settingsGrid
          }
        >
          <Field
            label="Etiqueta superior"
            value={
              content.eyebrow
            }
            onChange={(value) =>
              updateHeader(
                "eyebrow",
                value
              )
            }
          />

          <Field
            label="Título"
            value={
              content.title
            }
            onChange={(value) =>
              updateHeader(
                "title",
                value
              )
            }
          />

          <Field
            label="Texto resaltado"
            value={
              content.highlightedText
            }
            onChange={(value) =>
              updateHeader(
                "highlightedText",
                value
              )
            }
            help="Debe ser una parte exacta del título."
          />

          <Field
            label="Título del selector"
            value={
              content.selectorTitle
            }
            onChange={(value) =>
              updateHeader(
                "selectorTitle",
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
              label="Descripción"
              value={
                content.description
              }
              onChange={(value) =>
                updateHeader(
                  "description",
                  value
                )
              }
              textarea
            />
          </div>
        </div>
      </div>

      <div
        className={
          styles.editor
        }
      >
        <aside
          className={
            styles.stepNav
          }
        >
          <div
            className={
              styles.stepNavHeader
            }
          >
            <div>
              <span>
                ETAPAS
              </span>

              <strong>
                {
                  content.steps.filter(
                    (step) =>
                      step.active
                  ).length
                }
                {" / "}
                {
                  content.steps.length
                }
                {" "}visibles
              </strong>
            </div>

            <button
              type="button"
              className={
                styles.miniAddButton
              }
              onClick={
                handleAddStep
              }
              aria-label="Agregar etapa"
            >
              <Plus
                size={14}
                strokeWidth={2}
              />
            </button>
          </div>

          <div
            className={
              styles.stepNavList
            }
          >
            {content.steps.map(
              (step) => (
                <button
                  key={step.id}
                  type="button"
                  className={`${styles.stepNavButton} ${
                    step.id ===
                    selectedId
                      ? styles.stepNavButtonActive
                      : ""
                  }`}
                  onClick={() => {
                    setOpenIconSelectorId(
                      null
                    );
                    setSelectedId(
                      step.id
                    );
                  }}
                >
                  <span>
                    {step.number}
                  </span>

                  <div>
                    <strong>
                      {
                        step.shortTitle ||
                        "Sin título"
                      }
                    </strong>

                    <small>
                      {step.active
                        ? "Visible"
                        : "Oculto"}
                    </small>
                  </div>

                  <ChevronRight
                    size={14}
                    strokeWidth={1.8}
                  />
                </button>
              )
            )}
          </div>
        </aside>

        <div
          className={
            styles.stepEditor
          }
        >
          <div
            className={
              styles.stepEditorHeader
            }
          >
            <div>
              <span>
                ETAPA
                {" "}
                {
                  selectedStep.number
                }
              </span>

              <strong>
                {
                  selectedStep.title ||
                  "Nueva etapa"
                }
              </strong>
            </div>

            <label
              className={
                styles.switch
              }
            >
              <div>
                <strong>
                  Mostrar etapa
                </strong>

                <small>
                  Solo publícala
                  cuando esté completa.
                </small>
              </div>

              <input
                type="checkbox"
                checked={
                  selectedStep.active
                }
                onChange={(
                  event
                ) =>
                  updateStep(
                    selectedStep.id,
                    {
                      active:
                        event.target
                          .checked,
                    }
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
              styles.stageToolbar
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
                  handleMove(-1)
                }
                disabled={
                  selectedIndex <=
                  0
                }
              >
                <ArrowUp
                  size={14}
                  strokeWidth={1.8}
                />
                Subir
              </button>

              <button
                type="button"
                onClick={() =>
                  handleMove(1)
                }
                disabled={
                  selectedIndex >=
                  content.steps.length -
                    1
                }
              >
                <ArrowDown
                  size={14}
                  strokeWidth={1.8}
                />
                Bajar
              </button>
            </div>

            <button
              type="button"
              className={
                styles.deleteButton
              }
              onClick={
                handleDeleteStep
              }
              disabled={
                content.steps.length <=
                1
              }
            >
              <Trash2
                size={14}
                strokeWidth={1.8}
              />
              Eliminar etapa
            </button>
          </div>

          <div
            className={
              styles.form
            }
          >
            <div
              className={
                styles.twoCols
              }
            >
              <Field
                label="Título"
                value={
                  selectedStep.title
                }
                onChange={(value) =>
                  updateStep(
                    selectedStep.id,
                    {
                      title:
                        value,
                    }
                  )
                }
              />

              <Field
                label="Título corto"
                value={
                  selectedStep.shortTitle
                }
                onChange={(value) =>
                  updateStep(
                    selectedStep.id,
                    {
                      shortTitle:
                        value,
                    }
                  )
                }
                help="Se usa en el selector lateral."
              />
            </div>

            <Field
              label="Descripción"
              value={
                selectedStep.description
              }
              onChange={(value) =>
                updateStep(
                  selectedStep.id,
                  {
                    description:
                      value,
                  }
                )
              }
              textarea
            />

            <IconSelector
              id={`stage-${selectedStep.id}`}
              label="Icono de la etapa"
              value={
                selectedStep.icon
              }
              onChange={(value) =>
                updateStep(
                  selectedStep.id,
                  {
                    icon: value,
                  }
                )
              }
              help="Selecciona el símbolo que mejor representa esta etapa."
              openId={
                openIconSelectorId
              }
              onOpenChange={
                setOpenIconSelectorId
              }
            />

            <div
              className={
                styles.imageBlock
              }
            >
              <div
                className={
                  styles.imageCopy
                }
              >
                <span>
                  Imagen de la etapa
                </span>

                <p>
                  Las etapas nuevas
                  permanecen ocultas
                  hasta que tengan
                  contenido e imagen.
                </p>

                <label
                  className={
                    styles.uploadButton
                  }
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(
                      event
                    ) =>
                      void handleImage(
                        selectedStep,
                        event.target
                          .files?.[0]
                      )
                    }
                  />

                  <ImagePlus
                    size={15}
                    strokeWidth={1.8}
                  />

                  {uploadingId ===
                  selectedStep.id
                    ? "Subiendo..."
                    : "Cambiar imagen"}
                </label>
              </div>

              {selectedStep.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={
                    selectedStep.imageUrl
                  }
                  alt=""
                />
              ) : (
                <div
                  className={
                    styles.emptyImage
                  }
                >
                  <ImagePlus
                    size={22}
                    strokeWidth={1.4}
                  />
                  <span>
                    Sin imagen
                  </span>
                </div>
              )}
            </div>

            <div
              className={
                styles.highlightsBlock
              }
            >
              <div
                className={
                  styles.blockHeading
                }
              >
                <span>
                  DETALLES
                </span>

                <strong>
                  Qué destaca en esta
                  etapa
                </strong>
              </div>

              <div
                className={
                  styles.highlightList
                }
              >
                {selectedStep.highlights.map(
                  (
                    highlight,
                    index
                  ) => (
                    <div
                      className={
                        styles.highlightEditor
                      }
                      key={index}
                    >
                      <span>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <IconSelector
                        id={`detail-${selectedStep.id}-${index}`}
                        label="Icono"
                        compact
                        value={
                          highlight.icon
                        }
                        onChange={(value) =>
                          updateHighlight(
                            selectedStep.id,
                            index,
                            {
                              icon:
                                value,
                            }
                          )
                        }
                        openId={
                          openIconSelectorId
                        }
                        onOpenChange={
                          setOpenIconSelectorId
                        }
                      />

                      <Field
                        label="Título"
                        value={
                          highlight.title
                        }
                        onChange={(
                          value
                        ) =>
                          updateHighlight(
                            selectedStep.id,
                            index,
                            {
                              title:
                                value,
                            }
                          )
                        }
                      />

                      <Field
                        label="Descripción"
                        value={
                          highlight.description
                        }
                        onChange={(
                          value
                        ) =>
                          updateHighlight(
                            selectedStep.id,
                            index,
                            {
                              description:
                                value,
                            }
                          )
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <footer
            className={
              styles.stepFooter
            }
          >
            <button
              type="button"
              onClick={() =>
                goStep(-1)
              }
              disabled={
                selectedIndex <=
                0
              }
            >
              <ChevronLeft
                size={14}
                strokeWidth={1.8}
              />
              Anterior
            </button>

            <span>
              {selectedIndex + 1}
              {" de "}
              {
                content.steps.length
              }
            </span>

            <button
              type="button"
              onClick={() =>
                goStep(1)
              }
              disabled={
                selectedIndex >=
                content.steps.length -
                  1
              }
            >
              Siguiente
              <ChevronRight
                size={14}
                strokeWidth={1.8}
              />
            </button>
          </footer>
        </div>
      </div>

      {deleteTargetId ? (
        <DeleteStageDialog
          title={
            content.steps.find(
              (step) =>
                step.id ===
                deleteTargetId
            )?.title ||
            "esta etapa"
          }
          onCancel={() =>
            setDeleteTargetId(
              null
            )
          }
          onConfirm={
            confirmDeleteStep
          }
        />
      ) : null}
    </section>
  );
}

function IconSelector({
  id,
  label,
  value,
  onChange,
  help,
  compact = false,
  openId,
  onOpenChange,
}: {
  id: string;
  label: string;
  value: ProcessIconName;
  onChange: (
    value: ProcessIconName
  ) => void;
  help?: string;
  compact?: boolean;
  openId: string | null;
  onOpenChange: (
    value: string | null
  ) => void;
}) {
  const open =
    openId === id;

  return (
    <div
      className={`${styles.iconSelector} ${
        compact
          ? styles.iconSelectorCompact
          : ""
      }`}
    >
      <span
        className={
          styles.iconSelectorLabel
        }
      >
        {label}
      </span>

      <button
        type="button"
        className={
          styles.iconSelectorTrigger
        }
        onClick={() =>
          onOpenChange(
            open
              ? null
              : id
          )
        }
        aria-expanded={open}
      >
        <span
          className={
            styles.selectedIcon
          }
        >
          <ProcessIconGlyph
            type={value}
            size={18}
            strokeWidth={1.7}
          />
        </span>

        <span
          className={
            styles.selectedIconCopy
          }
        >
          <strong>
            {
              getProcessIconLabel(
                value
              )
            }
          </strong>

          {!compact ? (
            <small>
              Cambiar icono
            </small>
          ) : null}
        </span>

        <ChevronRight
          size={14}
          strokeWidth={1.8}
          className={`${styles.iconChevron} ${
            open
              ? styles.iconChevronOpen
              : ""
          }`}
        />
      </button>

      {help && !compact ? (
        <small
          className={
            styles.iconHelp
          }
        >
          {help}
        </small>
      ) : null}

      {open ? (
        <div
          className={
            styles.iconGallery
          }
        >
          <div
            className={
              styles.iconGalleryHeader
            }
          >
            <div>
              <span>
                GALERÍA DE ICONOS
              </span>

              <strong>
                Elige una opción
              </strong>
            </div>

            <button
              type="button"
              onClick={() =>
                onOpenChange(null)
              }
              aria-label="Cerrar galería de iconos"
            >
              <X
                size={15}
                strokeWidth={1.8}
              />
            </button>
          </div>

          <div
            className={
              styles.iconGrid
            }
          >
            {PROCESS_ICON_OPTIONS.map(
              (option) => {
                const active =
                  option.value ===
                  value;

                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    className={`${styles.iconOption} ${
                      active
                        ? styles.iconOptionActive
                        : ""
                    }`}
                    onClick={() => {
                      onChange(
                        option.value
                      );

                      onOpenChange(
                        null
                      );
                    }}
                    aria-pressed={
                      active
                    }
                    title={
                      option.label
                    }
                  >
                    <ProcessIconGlyph
                      type={
                        option.value
                      }
                      size={19}
                      strokeWidth={
                        1.7
                      }
                    />

                    <span>
                      {
                        option.label
                      }
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DeleteStageDialog({
  title,
  onCancel,
  onConfirm,
}: {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className={
        styles.dialogBackdrop
      }
      role="presentation"
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
          styles.dialog
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-process-title"
      >
        <button
          type="button"
          className={
            styles.dialogClose
          }
          onClick={onCancel}
          aria-label="Cerrar"
        >
          <X
            size={16}
            strokeWidth={1.8}
          />
        </button>

        <span
          className={
            styles.dialogIcon
          }
        >
          <Trash2
            size={20}
            strokeWidth={1.7}
          />
        </span>

        <div
          className={
            styles.dialogCopy
          }
        >
          <span>
            ELIMINAR ETAPA
          </span>

          <h2
            id="delete-process-title"
          >
            ¿Eliminar
            {" "}
            <strong>
              {title}
            </strong>
            ?
          </h2>

          <p>
            La etapa se quitará del
            editor. El cambio quedará
            definitivo cuando guardes
            el proceso.
          </p>
        </div>

        <div
          className={
            styles.dialogActions
          }
        >
          <button
            type="button"
            className={
              styles.dialogCancel
            }
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={
              styles.dialogConfirm
            }
            onClick={
              onConfirm
            }
          >
            <Trash2
              size={14}
              strokeWidth={1.8}
            />
            Eliminar etapa
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  help,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  textarea?: boolean;
  help?: string;
}) {
  return (
    <label
      className={
        styles.field
      }
    >
      <span>{label}</span>

      {textarea ? (
        <textarea
          rows={4}
          value={value}
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
          value={value}
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

      {help ? (
        <small>
          {help}
        </small>
      ) : null}
    </label>
  );
}