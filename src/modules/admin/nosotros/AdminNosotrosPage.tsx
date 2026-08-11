"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowDown,
  ArrowUp,
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
  AboutContent,
  AboutGalleryAlbum,
  AboutValueItem,
} from "@/types/about.types";

import styles from "./AdminNosotrosPage.module.css";

const CURRENT_CONTENT: AboutContent = {
  hero: {
    eyebrow: "Nosotros",
    title:
      "Formamos conductores, creamos caminos más seguros.",
    highlightedText:
      "caminos más seguros.",
    description:
      "En ReyCars creemos que conducir es mucho más que desplazarse de un lugar a otro. Por eso, acompañamos cada etapa del proceso con una formación clara, responsable y cercana.",
    imageUrl:
      "/assets/images/nosotros/nosotros-principal.png",
    imageAlt:
      "Instructor acompañando a estudiantes de ReyCars",
    highlights: [
      {
        id: "responsable",
        icon: "shield",
        title:
          "Formación responsable",
      },
      {
        id: "acompanamiento",
        icon: "users",
        title:
          "Acompañamiento cercano",
      },
      {
        id: "metodologia",
        icon: "sparkles",
        title:
          "Metodología clara",
      },
      {
        id: "confianza",
        icon: "heart",
        title:
          "Confianza en cada paso",
      },
    ],
  },

  story: [
    {
      id: "esencia",
      number: "01",
      title: "Nuestra esencia",
      description:
        "Impulsamos una formación vial cercana, responsable y enfocada en acompañar a cada estudiante durante su proceso de aprendizaje.",
      icon: "sparkles",
    },
    {
      id: "mision",
      number: "02",
      title: "Nuestra misión",
      description:
        "Formar conductores conscientes, seguros y preparados para desenvolverse con responsabilidad en la vía.",
      icon: "target",
    },
    {
      id: "vision",
      number: "03",
      title: "Nuestra visión",
      description:
        "Continuar fortaleciendo una experiencia de formación confiable, moderna y cercana para quienes eligen ReyCars.",
      icon: "sparkles",
    },
  ],

  teamSection: {
    eyebrow: "Nuestro equipo",
    title:
      "Personas que acompañan tu recorrido.",
    highlightedText:
      "tu recorrido.",
    description:
      "Un equipo cercano que orienta y acompaña cada etapa de tu proceso de formación en ReyCars.",
    statement:
      "Acompañamos cada proceso con cercanía, claridad y responsabilidad.",
  },

  gallerySection: {
    eyebrow: "Conoce ReyCars",
    title:
      "Un vistazo a nuestro día a día.",
    highlightedText:
      "nuestro día a día.",
    description:
      "Espacios, vehículos y momentos que hacen parte del proceso de formación de nuestros estudiantes.",
    footerTitle:
      "Más que un lugar, una experiencia de formación.",
    footerDescription:
      "Cada espacio acompaña una parte distinta del recorrido.",
    albums: [
      {
        id: "en-ruta",
        order: 1,
        title: "En ruta",
        description:
          "Práctica real para ganar confianza y seguridad detrás del volante.",
        images: [
          "/assets/images/nosotros/galeria-01.jpg",
          "/assets/images/nosotros/galeria-06.jpg",
        ],
        active: true,
      },
      {
        id: "formacion",
        order: 2,
        title: "Formación",
        description:
          "Aprendizaje teórico claro para comprender la vía y tomar mejores decisiones.",
        images: [
          "/assets/images/nosotros/galeria-02.jpg",
        ],
        active: true,
      },
      {
        id: "practica",
        order: 3,
        title: "Práctica",
        description:
          "Acompañamiento cercano para convertir la teoría en experiencia.",
        images: [
          "/assets/images/nosotros/galeria-03.jpg",
        ],
        active: true,
      },
      {
        id: "nuestra-sede",
        order: 4,
        title: "Nuestra sede",
        description:
          "Un espacio preparado para recibir, orientar y acompañar cada proceso.",
        images: [
          "/assets/images/nosotros/galeria-04.jpg",
        ],
        active: true,
      },
      {
        id: "vehiculos",
        order: 5,
        title: "Vehículos",
        description:
          "Herramientas de formación que hacen parte del aprendizaje práctico.",
        images: [
          "/assets/images/nosotros/galeria-05.jpg",
        ],
        active: true,
      },
      {
        id: "en-practica",
        order: 6,
        title: "En práctica",
        description:
          "Cada clase suma experiencia, control y confianza para avanzar.",
        images: [
          "/assets/images/nosotros/galeria-06.jpg",
        ],
        active: true,
      },
      {
        id: "experiencia-reycars",
        order: 7,
        title:
          "Experiencia ReyCars",
        description:
          "Momentos que reflejan cercanía, aprendizaje y acompañamiento.",
        images: [
          "/assets/images/nosotros/galeria-07.jpg",
        ],
        active: true,
      },
    ],
  },

  values: [
    {
      id: "seguridad",
      icon: "shield",
      title: "Seguridad",
      description:
        "Promovemos hábitos responsables para una mejor experiencia en la vía.",
    },
    {
      id: "acompanamiento",
      icon: "users",
      title:
        "Acompañamiento",
      description:
        "Guiamos cada etapa del proceso de formación con cercanía y claridad.",
    },
    {
      id: "confianza",
      icon: "thumbs-up",
      title: "Confianza",
      description:
        "Buscamos que cada estudiante avance con mayor seguridad y tranquilidad.",
    },
    {
      id: "responsabilidad",
      icon: "heart",
      title:
        "Responsabilidad",
      description:
        "Formamos conductores conscientes del entorno y de sus decisiones.",
    },
  ],
};

function cloneContent(
  value: AboutContent
) {
  return JSON.parse(
    JSON.stringify(value)
  ) as AboutContent;
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

async function uploadImage(
  file: File,
  folder: string
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
      file.name || "imagen"
    )}`;

  const storageRef =
    ref(
      storage,
      `site/about/${folder}/${fileName}`
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

function createId(
  prefix: string
) {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

const FIXED_GALLERY_ALBUM_IDS = [
  "en-ruta",
  "formacion",
  "practica",
  "nuestra-sede",
  "vehiculos",
  "en-practica",
  "experiencia-reycars",
] as const;

function withFixedGalleryAlbums(
  value: AboutContent
): AboutContent {
  const defaults =
    CURRENT_CONTENT.gallerySection.albums;

  const savedById =
    new Map(
      value.gallerySection.albums.map(
        (album) => [
          album.id,
          album,
        ]
      )
    );

  const albums =
    FIXED_GALLERY_ALBUM_IDS.map(
      (id, index) => {
        const fallback =
          defaults.find(
            (album) =>
              album.id === id
          )!;

        const saved =
          savedById.get(id);

        return {
          ...fallback,
          ...(saved ?? {}),
          id,
          order: index + 1,
          active: true,
          images:
            saved?.images?.length
              ? [...saved.images]
              : [...fallback.images],
        };
      }
    );

  return {
    ...value,
    gallerySection: {
      ...value.gallerySection,
      albums,
    },
  };
}

function validateContent(
  content: AboutContent
) {
  if (
    !content.hero.eyebrow.trim() ||
    !content.hero.title.trim() ||
    !content.hero.description.trim() ||
    !content.hero.imageUrl.trim()
  ) {
    return "Completa el Hero de Nosotros.";
  }

  if (
    content.story.some(
      (item) =>
        !item.title.trim() ||
        !item.description.trim()
    )
  ) {
    return "Completa Esencia, Misión y Visión.";
  }

  if (
    content.values.some(
      (item) =>
        !item.title.trim() ||
        !item.description.trim()
    )
  ) {
    return "Completa los valores institucionales.";
  }

  if (
    content.gallerySection.albums.length !== 7
  ) {
    return "La galería debe conservar sus 7 álbumes originales.";
  }

  if (
    content.gallerySection.albums.some(
      (album) =>
        !album.title.trim() ||
        !album.description.trim() ||
        album.images.length === 0
    )
  ) {
    return "Cada uno de los 7 álbumes necesita título, descripción y al menos una imagen.";
  }

  return "";
}

export function AdminNosotrosPage() {
  const [
    content,
    setContent,
  ] =
    useState<AboutContent>(
      cloneContent(
        CURRENT_CONTENT
      )
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
    uploadingKey,
    setUploadingKey,
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
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<{
      type: "value";
      id: string;
      title: string;
    } | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setIsLoading(true);

        const saved =
          await siteService.getAboutContent();

        if (saved) {
          setContent(
            withFixedGalleryAlbums(
              saved
            )
          );
          setHasDocument(true);
        } else {
          setContent(
            cloneContent(
              CURRENT_CONTENT
            )
          );
          setHasDocument(false);
        }
      } catch (error) {
        console.error(error);

        setError(
          "No fue posible cargar Nosotros."
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  function updateHero(
    key:
      | "eyebrow"
      | "title"
      | "highlightedText"
      | "description"
      | "imageUrl"
      | "imageAlt",
    value: string
  ) {
    setContent(
      (current) => ({
        ...current,
        hero: {
          ...current.hero,
          [key]: value,
        },
      })
    );
  }

  function updateHighlight(
    index: number,
    value: string
  ) {
    setContent(
      (current) => ({
        ...current,
        hero: {
          ...current.hero,
          highlights:
            current.hero.highlights.map(
              (item, itemIndex) =>
                itemIndex === index
                  ? {
                      ...item,
                      title: value,
                    }
                  : item
            ),
        },
      })
    );
  }

  function updateStory(
    index: number,
    patch:
      Partial<
        AboutContent["story"][number]
      >
  ) {
    setContent(
      (current) => ({
        ...current,
        story:
          current.story.map(
            (item, itemIndex) =>
              itemIndex === index
                ? {
                    ...item,
                    ...patch,
                  }
                : item
          ),
      })
    );
  }

  function updateTeam(
    key:
      | "eyebrow"
      | "title"
      | "highlightedText"
      | "description"
      | "statement",
    value: string
  ) {
    setContent(
      (current) => ({
        ...current,
        teamSection: {
          ...current.teamSection,
          [key]: value,
        },
      })
    );
  }

  function updateGalleryCopy(
    key:
      | "eyebrow"
      | "title"
      | "highlightedText"
      | "description"
      | "footerTitle"
      | "footerDescription",
    value: string
  ) {
    setContent(
      (current) => ({
        ...current,
        gallerySection: {
          ...current.gallerySection,
          [key]: value,
        },
      })
    );
  }

  function updateAlbum(
    id: string,
    patch:
      Partial<AboutGalleryAlbum>
  ) {
    setContent(
      (current) => ({
        ...current,
        gallerySection: {
          ...current.gallerySection,
          albums:
            current.gallerySection.albums.map(
              (album) =>
                album.id === id
                  ? {
                      ...album,
                      ...patch,
                    }
                  : album
            ),
        },
      })
    );
  }

  function updateValue(
    index: number,
    patch:
      Partial<
        AboutContent["values"][number]
      >
  ) {
    setContent(
      (current) => ({
        ...current,
        values:
          current.values.map(
            (item, itemIndex) =>
              itemIndex === index
                ? {
                    ...item,
                    ...patch,
                  }
                : item
          ),
      })
    );
  }


  function addValue() {
    const nextValue: AboutValueItem = {
      id: createId("value"),
      icon: "shield",
      title: "Nuevo valor",
      description:
        "Describe brevemente este valor institucional.",
    };

    setContent(
      (current) => ({
        ...current,
        values: [
          ...current.values,
          nextValue,
        ],
      })
    );

    setError("");
    setSuccess("");
  }

  function moveValue(
    index: number,
    direction: -1 | 1
  ) {
    const target =
      index + direction;

    if (
      target < 0 ||
      target >= content.values.length
    ) {
      return;
    }

    setContent(
      (current) => {
        const values =
          [...current.values];

        [
          values[index],
          values[target],
        ] = [
          values[target],
          values[index],
        ];

        return {
          ...current,
          values,
        };
      }
    );

    setError("");
    setSuccess("");
  }

  function requestDeleteValue(
    item: AboutValueItem
  ) {
    if (
      content.values.length <= 1
    ) {
      setError(
        "Debes conservar al menos un valor institucional."
      );
      return;
    }

    setDeleteTarget({
      type: "value",
      id: item.id,
      title:
        item.title ||
        "este valor",
    });
  }

  function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setContent(
      (current) => ({
        ...current,
        values:
          current.values.filter(
            (item) =>
              item.id !==
              deleteTarget.id
          ),
      })
    );

    setDeleteTarget(null);
    setError("");
    setSuccess("");
  }

  async function handleHeroImage(
    file?: File
  ) {
    if (!file) return;

    try {
      setUploadingKey(
        "hero"
      );
      setError("");
      setSuccess("");

      const url =
        await uploadImage(
          file,
          "hero"
        );

      updateHero(
        "imageUrl",
        url
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No fue posible subir la imagen."
      );
    } finally {
      setUploadingKey(
        null
      );
    }
  }

  async function handleAlbumImage(
    album: AboutGalleryAlbum,
    file?: File
  ) {
    if (!file) return;

    try {
      setUploadingKey(
        album.id
      );
      setError("");
      setSuccess("");

      const url =
        await uploadImage(
          file,
          `gallery/${album.id}`
        );

      updateAlbum(
        album.id,
        {
          images: [
            ...album.images,
            url,
          ],
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
      setUploadingKey(
        null
      );
    }
  }

  function removeAlbumImage(
    album: AboutGalleryAlbum,
    imageIndex: number
  ) {
    updateAlbum(
      album.id,
      {
        images:
          album.images.filter(
            (_, index) =>
              index !==
              imageIndex
          ),
      }
    );

    setError("");
    setSuccess("");
  }

  async function handleSave() {
    if (
      isSaving ||
      uploadingKey
    ) {
      return;
    }

    const fixedContent =
      withFixedGalleryAlbums(
        content
      );

    const validation =
      validateContent(
        fixedContent
      );

    if (validation) {
      setError(validation);
      setSuccess("");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const user =
        getAuth().currentUser;

      await siteService.saveAboutContent(
        fixedContent,
        {
          uid: user?.uid,
          email: user?.email,
        }
      );

      setContent(
        fixedContent
      );

      setHasDocument(true);

      setSuccess(
        "Nosotros se actualizó correctamente."
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
          Cargando Nosotros...
        </p>
      </section>
    );
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
            CONTENIDO · NOSOTROS
          </span>

          <h1>
            Nosotros
          </h1>

          <p>
            Administra la información
            institucional y la galería
            que se publican en la página.
          </p>
        </div>

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
            Boolean(uploadingKey)
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
      </header>

      {!hasDocument ? (
        <div
          className={
            styles.notice
          }
        >
          Los textos e imágenes actuales
          están precargados. Pulsa
          <strong>
            {" "}Guardar cambios{" "}
          </strong>
          una sola vez para crear
          `siteContent/about`.
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
          styles.layout
        }
      >
        <section
          className={
            styles.card
          }
        >
          <SectionHeading
            eyebrow="01 · HERO"
            title="Presentación principal"
          />

          <div
            className={
              styles.formGrid
            }
          >
            <Field
              label="Etiqueta"
              value={
                content.hero.eyebrow
              }
              onChange={(value) =>
                updateHero(
                  "eyebrow",
                  value
                )
              }
            />

            <Field
              label="Texto resaltado"
              value={
                content.hero
                  .highlightedText
              }
              onChange={(value) =>
                updateHero(
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
                  content.hero.title
                }
                onChange={(value) =>
                  updateHero(
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
                  content.hero
                    .description
                }
                onChange={(value) =>
                  updateHero(
                    "description",
                    value
                  )
                }
                textarea
              />
            </div>
          </div>

          <div
            className={
              styles.imageEditor
            }
          >
            <div>
              <strong>
                Imagen principal
              </strong>

              <p>
                Mantiene el recorte
                diagonal actual.
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
                    void handleHeroImage(
                      event.target
                        .files?.[0]
                    )
                  }
                />

                <ImagePlus
                  size={15}
                  strokeWidth={1.8}
                />

                {uploadingKey ===
                "hero"
                  ? "Subiendo..."
                  : "Cambiar imagen"}
              </label>
            </div>

            {content.hero
              .imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={
                  content.hero
                    .imageUrl
                }
                alt=""
              />
            ) : null}
          </div>

          <div
            className={
              styles.miniGrid
            }
          >
            {content.hero.highlights.map(
              (
                item,
                index
              ) => (
                <Field
                  key={
                    item.id
                  }
                  label={`Destacado ${String(
                    index + 1
                  ).padStart(
                    2,
                    "0"
                  )}`}
                  value={
                    item.title
                  }
                  onChange={(
                    value
                  ) =>
                    updateHighlight(
                      index,
                      value
                    )
                  }
                />
              )
            )}
          </div>
        </section>

        <section
          className={
            styles.card
          }
        >
          <SectionHeading
            eyebrow="02 · IDENTIDAD"
            title="Esencia, misión y visión"
          />

          <div
            className={
              styles.storyGrid
            }
          >
            {content.story.map(
              (
                item,
                index
              ) => (
                <article
                  key={
                    item.id
                  }
                  className={
                    styles.storyEditor
                  }
                >
                  <span>
                    {
                      item.number
                    }
                  </span>

                  <Field
                    label="Título"
                    value={
                      item.title
                    }
                    onChange={(
                      value
                    ) =>
                      updateStory(
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
                      item.description
                    }
                    onChange={(
                      value
                    ) =>
                      updateStory(
                        index,
                        {
                          description:
                            value,
                        }
                      )
                    }
                    textarea
                  />
                </article>
              )
            )}
          </div>
        </section>

        <section
          className={
            styles.card
          }
        >
          <SectionHeading
            eyebrow="03 · EQUIPO"
            title="Presentación del equipo"
            description="Aquí solo se editan los textos del bloque. Los integrantes se administrarán en Equipo."
          />

          <div
            className={
              styles.formGrid
            }
          >
            <Field
              label="Etiqueta"
              value={
                content.teamSection
                  .eyebrow
              }
              onChange={(value) =>
                updateTeam(
                  "eyebrow",
                  value
                )
              }
            />

            <Field
              label="Texto resaltado"
              value={
                content.teamSection
                  .highlightedText
              }
              onChange={(value) =>
                updateTeam(
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
                  content.teamSection
                    .title
                }
                onChange={(value) =>
                  updateTeam(
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
                  content.teamSection
                    .description
                }
                onChange={(value) =>
                  updateTeam(
                    "description",
                    value
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
                label="Frase inferior"
                value={
                  content.teamSection
                    .statement
                }
                onChange={(value) =>
                  updateTeam(
                    "statement",
                    value
                  )
                }
              />
            </div>
          </div>
        </section>

        <section
          className={
            styles.card
          }
        >
          <div
            className={
              styles.sectionToolbar
            }
          >
            <SectionHeading
              eyebrow="04 · VALORES"
              title="Valores institucionales"
              description="Agrega, reordena o elimina valores sin tocar código."
            />

            <button
              type="button"
              className={
                styles.addButton
              }
              onClick={
                addValue
              }
            >
              <Plus
                size={14}
                strokeWidth={1.8}
              />
              Agregar valor
            </button>
          </div>

          <div
            className={
              styles.valuesGrid
            }
          >
            {content.values.map(
              (
                item,
                index
              ) => (
                <article
                  key={
                    item.id
                  }
                  className={
                    styles.valueEditor
                  }
                >
                  <div
                    className={
                      styles.itemToolbar
                    }
                  >
                    <span>
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          moveValue(
                            index,
                            -1
                          )
                        }
                        disabled={
                          index === 0
                        }
                        aria-label="Mover valor arriba"
                      >
                        <ArrowUp
                          size={13}
                          strokeWidth={1.8}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moveValue(
                            index,
                            1
                          )
                        }
                        disabled={
                          index ===
                          content.values.length -
                            1
                        }
                        aria-label="Mover valor abajo"
                      >
                        <ArrowDown
                          size={13}
                          strokeWidth={1.8}
                        />
                      </button>

                      <button
                        type="button"
                        className={
                          styles.deleteMiniButton
                        }
                        onClick={() =>
                          requestDeleteValue(
                            item
                          )
                        }
                        aria-label="Eliminar valor"
                      >
                        <Trash2
                          size={13}
                          strokeWidth={1.8}
                        />
                      </button>
                    </div>
                  </div>

                  <Field
                    label="Título"
                    value={
                      item.title
                    }
                    onChange={(
                      value
                    ) =>
                      updateValue(
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
                      item.description
                    }
                    onChange={(
                      value
                    ) =>
                      updateValue(
                        index,
                        {
                          description:
                            value,
                        }
                      )
                    }
                    textarea
                  />
                </article>
              )
            )}
          </div>
        </section>

        <section
          className={
            styles.card
          }
        >
          <SectionHeading
            eyebrow="05 · GALERÍA"
            title="Galería ReyCars"
            description="Los 7 álbumes son fijos. Edita su contenido y agrega todas las fotografías que necesites dentro de cada uno."
          />

          <div
            className={
              styles.formGrid
            }
          >
            <Field
              label="Etiqueta"
              value={
                content.gallerySection
                  .eyebrow
              }
              onChange={(value) =>
                updateGalleryCopy(
                  "eyebrow",
                  value
                )
              }
            />

            <Field
              label="Texto resaltado"
              value={
                content.gallerySection
                  .highlightedText
              }
              onChange={(value) =>
                updateGalleryCopy(
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
                  content.gallerySection
                    .title
                }
                onChange={(value) =>
                  updateGalleryCopy(
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
                  content.gallerySection
                    .description
                }
                onChange={(value) =>
                  updateGalleryCopy(
                    "description",
                    value
                  )
                }
                textarea
              />
            </div>

            <Field
              label="Título inferior"
              value={
                content.gallerySection
                  .footerTitle
              }
              onChange={(value) =>
                updateGalleryCopy(
                  "footerTitle",
                  value
                )
              }
            />

            <Field
              label="Descripción inferior"
              value={
                content.gallerySection
                  .footerDescription
              }
              onChange={(value) =>
                updateGalleryCopy(
                  "footerDescription",
                  value
                )
              }
            />
          </div>

          <div
            className={
              styles.albumList
            }
          >
            {content.gallerySection.albums.map(
              (
                album,
                albumIndex
              ) => (
                <article
                  key={
                    album.id
                  }
                  className={`${styles.albumEditor} ${
                    !album.active
                      ? styles.albumHidden
                      : ""
                  }`}
                >
                  <div
                    className={
                      styles.albumHeader
                    }
                  >
                    <div>
                      <span>
                        ÁLBUM{" "}
                        {String(
                          albumIndex +
                            1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <strong>
                        {
                          album.title
                        }
                      </strong>
                    </div>

                    <span
                      className={
                        styles.fixedAlbumBadge
                      }
                    >
                      Álbum fijo
                    </span>
                  </div>

                  <div
                    className={
                      styles.formGrid
                    }
                  >
                    <Field
                      label="Título"
                      value={
                        album.title
                      }
                      onChange={(
                        value
                      ) =>
                        updateAlbum(
                          album.id,
                          {
                            title:
                              value,
                          }
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
                          album.description
                        }
                        onChange={(
                          value
                        ) =>
                          updateAlbum(
                            album.id,
                            {
                              description:
                                value,
                            }
                          )
                        }
                        textarea
                      />
                    </div>
                  </div>

                  <div
                    className={
                      styles.albumMedia
                    }
                  >
                    <div
                      className={
                        styles.thumbnails
                      }
                    >
                      {album.images.map(
                        (
                          image,
                          imageIndex
                        ) => (
                          <div
                            key={`${image}-${imageIndex}`}
                            className={
                              styles.thumbnail
                            }
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                image
                              }
                              alt=""
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeAlbumImage(
                                  album,
                                  imageIndex
                                )
                              }
                              aria-label="Quitar imagen"
                            >
                              <Trash2
                                size={
                                  13
                                }
                                strokeWidth={
                                  1.8
                                }
                              />
                            </button>
                          </div>
                        )
                      )}
                    </div>

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
                          void handleAlbumImage(
                            album,
                            event.target
                              .files?.[0]
                          )
                        }
                      />

                      <ImagePlus
                        size={15}
                        strokeWidth={
                          1.8
                        }
                      />

                      {uploadingKey ===
                      album.id
                        ? "Subiendo..."
                        : "Agregar imagen"}
                    </label>
                  </div>
                </article>
              )
            )}
          </div>
        </section>
      </div>

      {deleteTarget ? (
        <DeleteDialog
          type={
            deleteTarget.type
          }
          title={
            deleteTarget.title
          }
          onCancel={() =>
            setDeleteTarget(
              null
            )
          }
          onConfirm={
            confirmDelete
          }
        />
      ) : null}
    </section>
  );
}

function DeleteDialog({
  type,
  title,
  onCancel,
  onConfirm,
}: {
  type: "value";
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const label =
    "valor";

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
        <button
          type="button"
          className={
            styles.dialogClose
          }
          onClick={
            onCancel
          }
          aria-label="Cerrar"
        >
          <X
            size={15}
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
            ELIMINAR{" "}
            {label.toUpperCase()}
          </span>

          <h2>
            ¿Eliminar{" "}
            <strong>
              {title}
            </strong>
            ?
          </h2>

          <p>
            El cambio quedará definitivo
            cuando pulses Guardar cambios.
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
            onClick={
              onCancel
            }
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
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div
      className={
        styles.sectionHeading
      }
    >
      <span>
        {eyebrow}
      </span>

      <strong>
        {title}
      </strong>

      {description ? (
        <p>
          {description}
        </p>
      ) : null}
    </div>
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
    </label>
  );
}