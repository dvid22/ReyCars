"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clock3,
  FileText,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  MessageSquareText,
  Paperclip,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import {
  useState,
} from "react";

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import {
  storage,
} from "@/firebase/config/firebase";

import {
  recruitmentApplicationService,
} from "@/firebase/firestore/recruitmentApplication.service";

import {
  useRecruitment,
} from "@/hooks/useRecruitment";

import styles from "./RecruitmentPage.module.css";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  message: string;
};

const EMPTY_FORM: FormState = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  message: "",
};

const TEAM_REASONS = [
  {
    icon: GraduationCap,
    title:
      "Crecimiento y formación",
    description:
      "Capacitación constante para tu desarrollo.",
  },
  {
    icon: UsersRound,
    title:
      "Ambiente colaborativo",
    description:
      "Equipo unido, respetuoso y con propósito.",
  },
  {
    icon: Sparkles,
    title:
      "Impacto positivo",
    description:
      "Ayudas a formar conductores más seguros cada día.",
  },
  {
    icon: CalendarDays,
    title:
      "Estabilidad y confianza",
    description:
      "Una institución sólida con visión a largo plazo.",
  },
] as const;

const REQUIREMENT_ICONS = [
  ShieldCheck,
  MessageSquareText,
  UserRound,
  Heart,
] as const;

function renderTitle(
  title: string,
  highlightedText: string
) {
  const highlight =
    highlightedText.trim();

  if (
    !highlight ||
    !title.includes(
      highlight
    )
  ) {
    return title;
  }

  const index =
    title.indexOf(
      highlight
    );

  return (
    <>
      {title.slice(
        0,
        index
      )}

      <strong>
        {highlight}
      </strong>

      {title.slice(
        index +
          highlight.length
      )}
    </>
  );
}

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

function validateCv(
  file: File
) {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (
    !allowed.includes(
      file.type
    )
  ) {
    return "Adjunta tu hoja de vida en PDF, DOC o DOCX.";
  }

  if (
    file.size >
    10 * 1024 * 1024
  ) {
    return "La hoja de vida no puede superar 10 MB.";
  }

  return "";
}

async function uploadCv(
  file: File
) {
  const fileName =
    `${Date.now()}-${safeFileName(
      file.name ||
        "hoja-de-vida"
    )}`;

  const storageRef =
    ref(
      storage,
      `site/recruitment/applications/${fileName}`
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

export function RecruitmentPage() {
  const {
    content,
    isLoading,
  } =
    useRecruitment();

  const reduceMotion =
    useReducedMotion();

  const [
    form,
    setForm,
  ] =
    useState<FormState>(
      EMPTY_FORM
    );

  const [
    cvFile,
    setCvFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    sent,
    setSent,
  ] =
    useState(false);

  if (
    isLoading ||
    !content ||
    !content.enabled
  ) {
    return null;
  }

  function updateForm(
    key: keyof FormState,
    value: string
  ) {
    setForm(
      (
        current
      ) => ({
        ...current,
        [key]:
          value,
      })
    );

    setError("");
  }

  async function submitApplication() {
    if (
      submitting
    ) {
      return;
    }

    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.city.trim()
    ) {
      setError(
        "Completa tus datos de contacto."
      );

      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      setError(
        "Escribe un correo electrónico válido."
      );

      return;
    }

    if (
      !cvFile
    ) {
      setError(
        "Adjunta tu hoja de vida."
      );

      return;
    }

    const cvValidation =
      validateCv(
        cvFile
      );

    if (
      cvValidation
    ) {
      setError(
        cvValidation
      );

      return;
    }

    try {
      setSubmitting(
        true
      );

      setError("");

      const cvUrl =
        await uploadCv(
          cvFile
        );

      await recruitmentApplicationService.create(
        {
          fullName:
            form.fullName.trim(),

          phone:
            form.phone.trim(),

          email:
            form.email.trim(),

          city:
            form.city.trim(),

          message:
            form.message.trim(),

          cvUrl,

          cvFileName:
            cvFile.name,

          cvContentType:
            cvFile.type,

          vacancyPosition:
            content?.vacancy?.position ?? "",
        }
      );

      setForm(
        EMPTY_FORM
      );

      setCvFile(
        null
      );

      setSent(
        true
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        "No fue posible enviar tu postulación. Inténtalo nuevamente."
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  return (
    <main
      className={
        styles.page
      }
    >
      <section
        className={
          styles.heroSection
        }
      >
        {/* =====================================================
            LADO IZQUIERDO
            ===================================================== */}
        <motion.div
          className={
            styles.leftColumn
          }
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  x: -24,
                }
          }
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.62,
            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
        >
          <div
            className={
              styles.headingBlock
            }
          >
            <span
              className={
                styles.eyebrow
              }
            >
              <UserRound
                size={15}
                strokeWidth={1.8}
              />

              {
                content.eyebrow
              }
            </span>

            <h1>
              {renderTitle(
                content.title,
                content.highlightedText
              )}
            </h1>

            <p>
              {
                content.description
              }
            </p>
          </div>

          <article
            className={
              styles.vacancyCard
            }
          >
            <div
              className={
                styles.vacancyHeading
              }
            >
              <span
                className={
                  styles.vacancyIcon
                }
              >
                <BriefcaseBusiness
                  size={22}
                  strokeWidth={1.65}
                />
              </span>

              <div>
                <small>
                  VACANTE DISPONIBLE
                </small>

                <strong>
                  {
                    content.vacancy
                      .position
                  }
                </strong>

                <p>
                  {
                    content.vacancy
                      .shortDescription
                  }
                </p>
              </div>
            </div>

            <div
              className={
                styles.vacancyMeta
              }
            >
              <span>
                <MapPin
                  size={14}
                  strokeWidth={1.75}
                />

                {
                  content.vacancy
                    .location
                }
              </span>

              <span>
                <UsersRound
                  size={14}
                  strokeWidth={1.75}
                />

                {
                  content.vacancy
                    .modality
                }
              </span>

              <span>
                <Clock3
                  size={14}
                  strokeWidth={1.75}
                />

                {
                  content.vacancy
                    .contractType
                }
              </span>
            </div>
          </article>

          <section
            className={
              styles.requirementsSection
            }
          >
            <span
              className={
                styles.sectionLabel
              }
            >
              LO QUE BUSCAMOS EN NUESTRO EQUIPO
            </span>

            <div
              className={
                styles.requirementsGrid
              }
            >
              {content.vacancy.requirements.map(
                (
                  requirement,
                  index
                ) => {
                  const Icon =
                    REQUIREMENT_ICONS[
                      index %
                        REQUIREMENT_ICONS.length
                    ];

                  return (
                    <article
                      key={`${requirement}-${index}`}
                      className={
                        styles.requirementCard
                      }
                    >
                      <span>
                        <Icon
                          size={17}
                          strokeWidth={1.75}
                        />
                      </span>

                      <p>
                        {
                          requirement
                        }
                      </p>
                    </article>
                  );
                }
              )}
            </div>
          </section>

        </motion.div>

        {/* =====================================================
            FORMULARIO
            ===================================================== */}
        <motion.aside
          className={
            styles.applicationPanel
          }
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  x: 28,
                }
          }
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.66,
            delay: 0.05,
            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
        >
          {sent ? (
            <div
              className={
                styles.successState
              }
            >
              <span
                className={
                  styles.successIcon
                }
              >
                <ShieldCheck
                  size={32}
                  strokeWidth={1.5}
                />
              </span>

              <small>
                POSTULACIÓN ENVIADA
              </small>

              <h2>
                Recibimos tu hoja de vida.
              </h2>

              <p>
                Nuestro equipo podrá
                revisar tu información y
                contactarte por los datos
                registrados.
              </p>

              <button
                type="button"
                onClick={() =>
                  setSent(
                    false
                  )
                }
              >
                Enviar otra postulación
              </button>
            </div>
          ) : (
            <>
              <header
                className={
                  styles.formHeader
                }
              >
                <span
                  className={
                    styles.formHeaderIcon
                  }
                >
                  <UserRound
                    size={23}
                    strokeWidth={1.6}
                  />
                </span>

                <div>
                  <h2>
                    Cuéntanos sobre ti.
                  </h2>

                  <p>
                    Completa tus datos y
                    adjunta tu hoja de vida.
                  </p>
                </div>
              </header>

              <div
                className={
                  styles.formGrid
                }
              >
                <Field
                  label="Nombre completo"
                  icon={
                    UserRound
                  }
                  value={
                    form.fullName
                  }
                  onChange={(
                    value
                  ) =>
                    updateForm(
                      "fullName",
                      value
                    )
                  }
                  placeholder="Tu nombre y apellido"
                />

                <Field
                  label="Teléfono"
                  icon={
                    Phone
                  }
                  value={
                    form.phone
                  }
                  onChange={(
                    value
                  ) =>
                    updateForm(
                      "phone",
                      value
                    )
                  }
                  placeholder="Número de contacto"
                />

                <Field
                  label="Correo electrónico"
                  icon={
                    Mail
                  }
                  type="email"
                  value={
                    form.email
                  }
                  onChange={(
                    value
                  ) =>
                    updateForm(
                      "email",
                      value
                    )
                  }
                  placeholder="correo@ejemplo.com"
                />

                <Field
                  label="Ciudad"
                  icon={
                    MapPin
                  }
                  value={
                    form.city
                  }
                  onChange={(
                    value
                  ) =>
                    updateForm(
                      "city",
                      value
                    )
                  }
                  placeholder="Ciudad donde resides"
                />

                <label
                  className={
                    styles.profileField
                  }
                >
                  <span>
                    Breve perfil
                  </span>

                  <div>
                    <textarea
                      rows={5}
                      maxLength={500}
                      value={
                        form.message
                      }
                      onChange={(
                        event
                      ) =>
                        updateForm(
                          "message",
                          event.target.value
                        )
                      }
                      placeholder="Experiencia, disponibilidad o información que quieras compartir."
                    />

                    <small>
                      {
                        form.message.length
                      }
                      /500
                    </small>
                  </div>
                </label>
              </div>

              <label
                className={`${styles.cvDropzone} ${
                  cvFile
                    ? styles.cvDropzoneReady
                    : ""
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(
                    event
                  ) => {
                    const file =
                      event.target.files?.[0] ??
                      null;

                    if (
                      !file
                    ) {
                      return;
                    }

                    const validation =
                      validateCv(
                        file
                      );

                    if (
                      validation
                    ) {
                      setError(
                        validation
                      );

                      event.target.value =
                        "";

                      return;
                    }

                    setCvFile(
                      file
                    );

                    setError("");
                  }}
                />

                <span
                  className={
                    styles.cvIcon
                  }
                >
                  {cvFile ? (
                    <FileText
                      size={22}
                      strokeWidth={1.6}
                    />
                  ) : (
                    <UploadCloud
                      size={22}
                      strokeWidth={1.6}
                    />
                  )}
                </span>

                <div
                  className={
                    styles.cvCopy
                  }
                >
                  <strong>
                    {cvFile
                      ? cvFile.name
                      : "Adjunta tu hoja de vida"}
                  </strong>

                  <span>
                    {cvFile
                      ? `${(
                          cvFile.size /
                          1024 /
                          1024
                        ).toFixed(
                          2
                        )} MB`
                      : "PDF, DOC o DOCX · Máx. 10 MB"}
                  </span>
                </div>

                <span
                  className={
                    styles.cvAction
                  }
                >
                  <Paperclip
                    size={15}
                    strokeWidth={1.7}
                  />

                  {cvFile
                    ? "Cambiar archivo"
                    : "Seleccionar archivo"}
                </span>
              </label>

              {error ? (
                <div
                  className={
                    styles.formError
                  }
                >
                  {error}
                </div>
              ) : null}

              <button
                type="button"
                className={
                  styles.submitButton
                }
                onClick={() =>
                  void submitApplication()
                }
                disabled={
                  submitting
                }
              >
                {submitting ? (
                  <>
                    Enviando postulación

                    <span
                      className={
                        styles.spinner
                      }
                    />
                  </>
                ) : (
                  <>
                    <Send
                      size={17}
                      strokeWidth={1.8}
                    />

                    Enviar mi postulación
                  </>
                )}
              </button>

              <p
                className={
                  styles.privacyNote
                }
              >
                <ShieldCheck
                  size={13}
                  strokeWidth={1.7}
                />

                Tus datos serán utilizados
                únicamente para gestionar
                tu postulación.
              </p>
            </>
          )}
        </motion.aside>
      </section>

      {/* =====================================================
          RAZONES
          ===================================================== */}
      <section
        className={
          styles.reasonsSection
        }
      >
        <span
          className={
            styles.reasonsEyebrow
          }
        >
          RAZONES PARA SER PARTE DE REYCARS
        </span>

        <div
          className={
            styles.reasonsGrid
          }
        >
          {TEAM_REASONS.map(
            (
              reason,
              index
            ) => {
              const Icon =
                reason.icon;

              return (
                <motion.article
                  key={
                    reason.title
                  }
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 14,
                        }
                  }
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    duration: 0.42,
                    delay:
                      index *
                      0.05,
                  }}
                >
                  <span>
                    <Icon
                      size={22}
                      strokeWidth={1.65}
                    />
                  </span>

                  <div>
                    <strong>
                      {
                        reason.title
                      }
                    </strong>

                    <p>
                      {
                        reason.description
                      }
                    </p>
                  </div>
                </motion.article>
              );
            }
          )}
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder: string;
  type?: string;
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

      <div>
        <Icon
          size={16}
          strokeWidth={1.65}
        />

        <input
          type={
            type
          }
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
          placeholder={
            placeholder
          }
        />
      </div>
    </label>
  );
}