"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Check,
  ImagePlus,
  Save,
} from "lucide-react";
import {
  getAuth,
} from "firebase/auth";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { siteService } from "@/firebase/firestore/site.service";
import { storage } from "@/firebase/config/firebase";
import type {
  HomeContent,
  HomeHeroBenefit,
} from "@/types/home.types";

import styles from "./AdminInicioPage.module.css";

type SectionKey =
  | "hero"
  | "courses"
  | "process"
  | "faq"
  | "hours";

const CURRENT_HOME: HomeContent = {
  hero: {
    eyebrow:
      "CENTRO DE ENSEÑANZA AUTOMOVILÍSTICA",
    title: "Tramita tu Licencia con nosotros.",
    highlightedText: "Licencia",
    description:
      "Formación completa para conductores responsables. Teoría, práctica y acompañamiento en cada etapa de tu proceso.",
    primaryCtaLabel: "Conocer servicios",
    secondaryCtaLabel: "Cómo funciona",
    heroImageUrl:
      "/assets/images/home/hero-driving-lesson.jpg",
    benefits: [
      {
        title:
          "Formación responsable",
        description:
          "Aprende con una metodología clara y enfocada en la seguridad.",
      },
      {
        title:
          "Acompañamiento cercano",
        description:
          "Te guiamos durante cada etapa de tu proceso.",
      },
      {
        title:
          "Proceso claro y organizado",
        description:
          "Una ruta de formación pensada para avanzar con confianza.",
      },
    ],
  },

  coursesSection: {
    eyebrow: "Nuestros servicios",
    title:
      "¿Qué quieres lograr con ReyCars?",
    highlightedText: "ReyCars?",
    description:
      "Elige una opción y descubre la formación indicada para ti.",
    ctaLabel: "Explorar servicios",
  },

  processSection: {
    eyebrow: "Así es tu proceso",
    title:
      "De tu inscripción a tu licencia, paso a paso.",
    highlightedText: "paso a paso.",
    description:
      "Un recorrido claro, organizado y acompañado para que sepas qué sigue en cada etapa.",
    ctaLabel:
      "Conocer el proceso",
  },

  faqSection: {
    eyebrow:
      "Preguntas frecuentes",
    title: "¿Tienes dudas?",
    highlightedText: "dudas?",
    description:
      "Respondemos las preguntas más comunes antes de que comiences tu proceso.",
    ctaLabel:
      "Hablemos por WhatsApp",
  },

  hoursSection: {
    eyebrow: "Nuestro horario",
    title: "Horarios de atención",
    highlightedText: "atención",
    description:
      "En ReyCars estamos para acompañarte. Conoce nuestros horarios de atención y planifica tu próxima visita.",
  },
};

function cloneContent(
  content: HomeContent
): HomeContent {
  return JSON.parse(
    JSON.stringify(content)
  ) as HomeContent;
}

function safeFileName(
  value: string
) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

async function uploadHeroImage(
  file: File
) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "La imagen debe ser JPG, PNG o WEBP."
    );
  }

  const maxSize =
    8 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      "La imagen no puede superar 8 MB."
    );
  }

  const fileName =
    `${Date.now()}-${safeFileName(
      file.name || "hero"
    )}`;

  const storagePath =
    `site/home/hero/${fileName}`;

  const storageRef =
    ref(storage, storagePath);

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

export function AdminInicioPage() {
  const [content, setContent] =
    useState<HomeContent>(
      cloneContent(CURRENT_HOME)
    );

  const [activeSection, setActiveSection] =
    useState<SectionKey>("hero");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isUploading, setIsUploading] =
    useState(false);

  const [hasDocument, setHasDocument] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    void (async () => {
      try {
        setIsLoading(true);
        setError("");

        const saved =
          await siteService.getHomeContent();

        if (saved) {
          setContent(saved);
          setHasDocument(true);
        } else {
          // Únicamente precargamos la Home actual
          // para la primera inicialización.
          setContent(
            cloneContent(CURRENT_HOME)
          );
          setHasDocument(false);
        }
      } catch (error) {
        console.error(error);
        setError(
          "No fue posible cargar el contenido de Inicio."
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const sectionLabel =
    useMemo(() => {
      switch (activeSection) {
        case "hero":
          return "Hero";
        case "courses":
          return "Servicios";
        case "process":
          return "Proceso";
        case "faq":
          return "FAQ";
        case "hours":
          return "Horario";
      }
    }, [activeSection]);

  function updateHero(
    key: keyof HomeContent["hero"],
    value:
      | string
      | HomeHeroBenefit[]
  ) {
    setContent((current) => ({
      ...current,
      hero: {
        ...current.hero,
        [key]: value,
      },
    }));
  }

  function updateBenefit(
    index: number,
    key: keyof HomeHeroBenefit,
    value: string
  ) {
    updateHero(
      "benefits",
      content.hero.benefits.map(
        (item, currentIndex) =>
          currentIndex === index
            ? {
                ...item,
                [key]: value,
              }
            : item
      )
    );
  }

  function updateSection(
    section:
      | "coursesSection"
      | "processSection"
      | "faqSection"
      | "hoursSection",
    key: string,
    value: string
  ) {
    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }));
  }

  async function handleImage(
    file?: File
  ) {
    if (!file) return;

    try {
      setIsUploading(true);
      setError("");

      const url =
        await uploadHeroImage(file);

      updateHero(
        "heroImageUrl",
        url
      );
    } catch (error) {
      console.error(error);
      setError(
        "No fue posible subir la imagen."
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSave() {
    if (isSaving) return;

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const auth = getAuth();
      const user =
        auth.currentUser;

      await siteService.saveHomeContent(
        content,
        {
          uid: user?.uid,
          email: user?.email,
        }
      );

      setHasDocument(true);
      setSuccess(
        "Contenido de Inicio guardado correctamente."
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
        className={styles.loadingState}
      >
        <span />
        <p>
          Cargando contenido de Inicio...
        </p>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>
            CONTENIDO · INICIO
          </span>

          <h1>
            Página principal
          </h1>

          <p>
            Edita únicamente el contenido
            propio de la Home. Servicios,
            Proceso y FAQ mantienen sus
            datos en sus módulos.
          </p>
        </div>

        <button
          type="button"
          className={styles.saveButton}
          onClick={() =>
            void handleSave()
          }
          disabled={
            isSaving ||
            isUploading
          }
        >
          {isSaving ? (
            "Guardando..."
          ) : (
            <>
              <Save
                size={15}
                strokeWidth={1.8}
              />
              Guardar cambios
            </>
          )}
        </button>
      </header>

      {!hasDocument ? (
        <div
          className={styles.initNotice}
        >
          <Check
            size={15}
            strokeWidth={1.9}
          />

          <p>
            Esta es la primera
            configuración. Los textos que
            ves corresponden a la Home
            actual. Al pulsar
            <strong>
              {" "}Guardar cambios{" "}
            </strong>
            se creará el documento en
            Firestore.
          </p>
        </div>
      ) : null}

      {error ? (
        <div
          className={styles.error}
        >
          {error}
        </div>
      ) : null}

      {success ? (
        <div
          className={styles.success}
        >
          {success}
        </div>
      ) : null}

      <div className={styles.editor}>
        <nav
          className={styles.sectionNav}
          aria-label="Secciones de Inicio"
        >
          <NavButton
            label="Hero"
            description="Portada principal"
            active={
              activeSection === "hero"
            }
            onClick={() =>
              setActiveSection("hero")
            }
          />

          <NavButton
            label="Servicios"
            description="Encabezado"
            active={
              activeSection === "courses"
            }
            onClick={() =>
              setActiveSection("courses")
            }
          />

          <NavButton
            label="Proceso"
            description="Encabezado"
            active={
              activeSection === "process"
            }
            onClick={() =>
              setActiveSection("process")
            }
          />

          <NavButton
            label="FAQ"
            description="Presentación"
            active={
              activeSection === "faq"
            }
            onClick={() =>
              setActiveSection("faq")
            }
          />

          <NavButton
            label="Horario"
            description="Presentación"
            active={
              activeSection === "hours"
            }
            onClick={() =>
              setActiveSection("hours")
            }
          />
        </nav>

        <div className={styles.panel}>
          <div
            className={styles.panelHeader}
          >
            <span>
              {sectionLabel}
            </span>

            <strong>
              Contenido visible en la Home
            </strong>
          </div>

          {activeSection ===
          "hero" ? (
            <HeroEditor
              content={content}
              updateHero={updateHero}
              updateBenefit={
                updateBenefit
              }
              handleImage={
                handleImage
              }
              isUploading={
                isUploading
              }
            />
          ) : null}

          {activeSection ===
          "courses" ? (
            <GenericSectionEditor
              eyebrow={
                content.coursesSection
                  .eyebrow
              }
              title={
                content.coursesSection
                  .title
              }
              highlightedText={
                content.coursesSection
                  .highlightedText
              }
              description={
                content.coursesSection
                  .description
              }
              ctaLabel={
                content.coursesSection
                  .ctaLabel ?? ""
              }
              onChange={(
                key,
                value
              ) =>
                updateSection(
                  "coursesSection",
                  key,
                  value
                )
              }
            />
          ) : null}

          {activeSection ===
          "process" ? (
            <GenericSectionEditor
              eyebrow={
                content.processSection
                  .eyebrow
              }
              title={
                content.processSection
                  .title
              }
              highlightedText={
                content.processSection
                  .highlightedText
              }
              description={
                content.processSection
                  .description
              }
              ctaLabel={
                content.processSection
                  .ctaLabel ?? ""
              }
              onChange={(
                key,
                value
              ) =>
                updateSection(
                  "processSection",
                  key,
                  value
                )
              }
            />
          ) : null}

          {activeSection ===
          "faq" ? (
            <GenericSectionEditor
              eyebrow={
                content.faqSection
                  .eyebrow
              }
              title={
                content.faqSection
                  .title
              }
              highlightedText={
                content.faqSection
                  .highlightedText
              }
              description={
                content.faqSection
                  .description
              }
              ctaLabel={
                content.faqSection
                  .ctaLabel ?? ""
              }
              onChange={(
                key,
                value
              ) =>
                updateSection(
                  "faqSection",
                  key,
                  value
                )
              }
            />
          ) : null}

          {activeSection ===
          "hours" ? (
            <GenericSectionEditor
              eyebrow={
                content.hoursSection
                  .eyebrow
              }
              title={
                content.hoursSection
                  .title
              }
              highlightedText={
                content.hoursSection
                  .highlightedText
              }
              description={
                content.hoursSection
                  .description
              }
              onChange={(
                key,
                value
              ) =>
                updateSection(
                  "hoursSection",
                  key,
                  value
                )
              }
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function NavButton({
  label,
  description,
  active,
  onClick,
}: {
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.navButton} ${
        active
          ? styles.navButtonActive
          : ""
      }`}
      onClick={onClick}
    >
      <span>{label}</span>
      <small>{description}</small>
    </button>
  );
}

function HeroEditor({
  content,
  updateHero,
  updateBenefit,
  handleImage,
  isUploading,
}: {
  content: HomeContent;
  updateHero: (
    key: keyof HomeContent["hero"],
    value:
      | string
      | HomeHeroBenefit[]
  ) => void;
  updateBenefit: (
    index: number,
    key: keyof HomeHeroBenefit,
    value: string
  ) => void;
  handleImage: (
    file?: File
  ) => Promise<void>;
  isUploading: boolean;
}) {
  return (
    <div className={styles.form}>
      <Field
        label="Texto superior"
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
        label="Título principal"
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
        help="Debe ser una parte exacta del título."
      />

      <Field
        label="Descripción"
        value={
          content.hero.description
        }
        onChange={(value) =>
          updateHero(
            "description",
            value
          )
        }
        textarea
      />

      <div
        className={styles.twoCols}
      >
        <Field
          label="Botón principal"
          value={
            content.hero
              .primaryCtaLabel
          }
          onChange={(value) =>
            updateHero(
              "primaryCtaLabel",
              value
            )
          }
        />

        <Field
          label="Botón secundario"
          value={
            content.hero
              .secondaryCtaLabel
          }
          onChange={(value) =>
            updateHero(
              "secondaryCtaLabel",
              value
            )
          }
        />
      </div>

      <div
        className={styles.imageField}
      >
        <div>
          <span>
            Imagen principal
          </span>

          <p>
            Esta fotografía ocupa el lado
            derecho del Hero.
          </p>
        </div>

        <label
          className={styles.upload}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) =>
              void handleImage(
                event.target.files?.[0]
              )
            }
          />

          <ImagePlus
            size={17}
            strokeWidth={1.7}
          />

          {isUploading
            ? "Subiendo..."
            : "Cambiar imagen"}
        </label>

        {content.hero
          .heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={
              content.hero
                .heroImageUrl
            }
            alt=""
          />
        ) : null}
      </div>

      <div
        className={styles.benefits}
      >
        <div
          className={
            styles.blockHeading
          }
        >
          <strong>
            Beneficios del Hero
          </strong>

          <p>
            Son los tres mensajes que
            aparecen debajo de la
            descripción.
          </p>
        </div>

        {content.hero.benefits.map(
          (benefit, index) => (
            <div
              key={index}
              className={
                styles.benefitEditor
              }
            >
              <span>
                {String(
                  index + 1
                ).padStart(2, "0")}
              </span>

              <Field
                label="Título"
                value={
                  benefit.title
                }
                onChange={(value) =>
                  updateBenefit(
                    index,
                    "title",
                    value
                  )
                }
              />

              <Field
                label="Descripción"
                value={
                  benefit.description
                }
                onChange={(value) =>
                  updateBenefit(
                    index,
                    "description",
                    value
                  )
                }
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}

function GenericSectionEditor({
  eyebrow,
  title,
  highlightedText,
  description,
  ctaLabel,
  onChange,
}: {
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  ctaLabel?: string;
  onChange: (
    key: string,
    value: string
  ) => void;
}) {
  return (
    <div className={styles.form}>
      <Field
        label="Etiqueta superior"
        value={eyebrow}
        onChange={(value) =>
          onChange(
            "eyebrow",
            value
          )
        }
      />

      <Field
        label="Título"
        value={title}
        onChange={(value) =>
          onChange(
            "title",
            value
          )
        }
      />

      <Field
        label="Texto resaltado"
        value={
          highlightedText
        }
        onChange={(value) =>
          onChange(
            "highlightedText",
            value
          )
        }
        help="Debe formar parte del título."
      />

      <Field
        label="Descripción"
        value={description}
        onChange={(value) =>
          onChange(
            "description",
            value
          )
        }
        textarea
      />

      {ctaLabel !== undefined ? (
        <Field
          label="Texto del botón"
          value={ctaLabel}
          onChange={(value) =>
            onChange(
              "ctaLabel",
              value
            )
          }
        />
      ) : null}
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
    <label className={styles.field}>
      <span>{label}</span>

      {textarea ? (
        <textarea
          rows={4}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={`Escribe ${label.toLowerCase()}`}
        />
      ) : (
        <input
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={`Escribe ${label.toLowerCase()}`}
        />
      )}

      {help ? (
        <small>{help}</small>
      ) : null}
    </label>
  );
}