"use client";

import {
  useEffect,
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

import {
  storage,
} from "@/firebase/config/firebase";

import {
  siteService,
} from "@/firebase/firestore/site.service";

import type {
  SiteConfig,
  SiteScheduleItem,
} from "@/types/site.types";

import styles from "./AdminContactoPage.module.css";

const CURRENT_CONFIG: SiteConfig = {
  name: "ReyCars",
  legalName:
    "Centro de Enseñanza Automovilística ReyCars",
  slogan:
    "Atrévete a rodar con nosotros.",

  phone:
    "+57 310 2062512",
  whatsapp:
    "+57 310 2062512",
  email: "",
  address:
    "Calle 15 # 5 - 68, Ubaté",

  instagramUrl:
    "https://www.instagram.com/reycars_ubate?igsh=Y3hxZW1rNWsxcmVt",
  facebookUrl:
    "https://www.facebook.com/share/18ye5QQfPU/?mibextid=wwXIfr",
  tiktokUrl:
    "https://www.tiktok.com/@reycars_ubate?_r=1&_t=ZS-98kig2MXwVI",

  contactPage: {
    eyebrow: "Contacto",
    title:
      "Habla con CEA ReyCars.",
    highlightedText:
      "ReyCars.",
    description:
      "Estamos listos para ayudarte. Escríbenos, llámanos o visítanos en nuestra sede en Ubaté.",
    heroImageUrl:
      "/assets/images/nosotros/galeria-07.jpg",
  },

  schedule: [
    {
      id: "weekdays",
      short: "LUN – VIE",
      label:
        "Lunes a viernes",
      open: "07:45",
      close: "20:00",
      days: [
        1, 2, 3, 4, 5,
      ],
      active: true,
    },
    {
      id: "saturday",
      short: "SÁBADO",
      label: "Sábado",
      open: "08:00",
      close: "16:00",
      days: [6],
      active: true,
    },
    {
      id: "sunday",
      short: "DOMINGO",
      label: "Domingo",
      open: "08:00",
      close: "14:00",
      days: [0],
      active: true,
    },
  ],
};

function cloneConfig(
  value: SiteConfig
) {
  return JSON.parse(
    JSON.stringify(value)
  ) as SiteConfig;
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

async function uploadContactImage(
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
      file.name || "contacto"
    )}`;

  const storageRef =
    ref(
      storage,
      `site/contact/${fileName}`
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

function validateConfig(
  config: SiteConfig
) {
  if (
    !config.name.trim()
  ) {
    return "Escribe el nombre del negocio.";
  }

  if (
    !config.phone.trim()
  ) {
    return "Escribe el teléfono.";
  }

  if (
    !config.whatsapp.trim()
  ) {
    return "Escribe el número de WhatsApp.";
  }

  if (
    !config.address.trim()
  ) {
    return "Escribe la dirección.";
  }

  if (
    !config.contactPage.title.trim()
  ) {
    return "Escribe el título de Contacto.";
  }

  for (
    const item of config.schedule
  ) {
    if (
      item.active &&
      (
        !item.open ||
        !item.close
      )
    ) {
      return `Completa el horario de ${item.label}.`;
    }
  }

  return "";
}

export function AdminContactoPage() {
  const [
    config,
    setConfig,
  ] =
    useState<SiteConfig>(
      cloneConfig(
        CURRENT_CONFIG
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
    isUploading,
    setIsUploading,
  ] = useState(false);

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

  useEffect(() => {
    void (async () => {
      try {
        setIsLoading(true);

        const saved =
          await siteService.getSiteConfig();

        if (saved) {
          setConfig(saved);
          setHasDocument(true);
        } else {
          setConfig(
            cloneConfig(
              CURRENT_CONFIG
            )
          );
          setHasDocument(false);
        }
      } catch (error) {
        console.error(error);

        setError(
          "No fue posible cargar la configuración."
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  function updateRoot(
    key:
      | "name"
      | "legalName"
      | "slogan"
      | "phone"
      | "whatsapp"
      | "email"
      | "address"
      | "instagramUrl"
      | "facebookUrl"
      | "tiktokUrl",
    value: string
  ) {
    setConfig(
      (current) => ({
        ...current,
        [key]: value,
      })
    );
  }

  function updateContactPage(
    key:
      | "eyebrow"
      | "title"
      | "highlightedText"
      | "description"
      | "heroImageUrl",
    value: string
  ) {
    setConfig(
      (current) => ({
        ...current,
        contactPage: {
          ...current.contactPage,
          [key]: value,
        },
      })
    );
  }

  function updateSchedule(
    id:
      SiteScheduleItem["id"],
    patch:
      Partial<SiteScheduleItem>
  ) {
    setConfig(
      (current) => ({
        ...current,
        schedule:
          current.schedule.map(
            (item) =>
              item.id === id
                ? {
                    ...item,
                    ...patch,
                  }
                : item
          ),
      })
    );
  }

  async function handleImage(
    file?: File
  ) {
    if (!file) return;

    try {
      setIsUploading(true);
      setError("");
      setSuccess("");

      const url =
        await uploadContactImage(
          file
        );

      updateContactPage(
        "heroImageUrl",
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
      setIsUploading(false);
    }
  }

  async function handleSave() {
    if (
      isSaving ||
      isUploading
    ) {
      return;
    }

    const validation =
      validateConfig(
        config
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

      await siteService.saveSiteConfig(
        config,
        {
          uid: user?.uid,
          email: user?.email,
        }
      );

      setHasDocument(true);

      setSuccess(
        "Configuración guardada correctamente."
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
          Cargando configuración...
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
            CONFIGURACIÓN · CONTACTO
          </span>

          <h1>
            Información del sitio
          </h1>

          <p>
            Estos datos se utilizan en
            Contacto, Footer, WhatsApp y
            los horarios de Inicio.
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
            isUploading
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
          <Check
            size={15}
            strokeWidth={2}
          />

          <p>
            Primera configuración. Los
            datos actuales están
            precargados para crear la
            configuración central del
            sitio. Pulsa
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
          styles.grid
        }
      >
        <section
          className={
            styles.card
          }
        >
          <CardHeading
            eyebrow="NEGOCIO"
            title="Información general"
          />

          <div
            className={
              styles.formGrid
            }
          >
            <Field
              label="Nombre"
              value={
                config.name
              }
              onChange={(value) =>
                updateRoot(
                  "name",
                  value
                )
              }
            />

            <Field
              label="Nombre completo"
              value={
                config.legalName
              }
              onChange={(value) =>
                updateRoot(
                  "legalName",
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
                label="Eslogan"
                value={
                  config.slogan
                }
                onChange={(value) =>
                  updateRoot(
                    "slogan",
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
          <CardHeading
            eyebrow="CONTACTO"
            title="Canales principales"
          />

          <div
            className={
              styles.formGrid
            }
          >
            <Field
              label="Teléfono"
              value={
                config.phone
              }
              onChange={(value) =>
                updateRoot(
                  "phone",
                  value
                )
              }
            />

            <Field
              label="WhatsApp"
              value={
                config.whatsapp
              }
              onChange={(value) =>
                updateRoot(
                  "whatsapp",
                  value
                )
              }
            />

            <Field
              label="Correo"
              value={
                config.email
              }
              onChange={(value) =>
                updateRoot(
                  "email",
                  value
                )
              }
              placeholder="Opcional"
            />

            <Field
              label="Dirección"
              value={
                config.address
              }
              onChange={(value) =>
                updateRoot(
                  "address",
                  value
                )
              }
            />
          </div>
        </section>

        <section
          className={
            styles.card
          }
        >
          <CardHeading
            eyebrow="REDES"
            title="Redes sociales"
          />

          <div
            className={
              styles.stack
            }
          >
            <Field
              label="Instagram"
              value={
                config.instagramUrl
              }
              onChange={(value) =>
                updateRoot(
                  "instagramUrl",
                  value
                )
              }
            />

            <Field
              label="Facebook"
              value={
                config.facebookUrl
              }
              onChange={(value) =>
                updateRoot(
                  "facebookUrl",
                  value
                )
              }
            />

            <Field
              label="TikTok"
              value={
                config.tiktokUrl
              }
              onChange={(value) =>
                updateRoot(
                  "tiktokUrl",
                  value
                )
              }
            />
          </div>
        </section>

        <section
          className={`${styles.card} ${styles.wideCard}`}
        >
          <CardHeading
            eyebrow="HORARIOS"
            title="Horario de atención"
          />

          <div
            className={
              styles.scheduleGrid
            }
          >
            {config.schedule.map(
              (item) => (
                <div
                  key={item.id}
                  className={
                    styles.scheduleCard
                  }
                >
                  <div
                    className={
                      styles.scheduleHeader
                    }
                  >
                    <strong>
                      {item.label}
                    </strong>

                    <label
                      className={
                        styles.switch
                      }
                    >
                      <input
                        type="checkbox"
                        checked={
                          item.active
                        }
                        onChange={(
                          event
                        ) =>
                          updateSchedule(
                            item.id,
                            {
                              active:
                                event
                                  .target
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
                      styles.timeGrid
                    }
                  >
                    <label
                      className={
                        styles.timeField
                      }
                    >
                      <span>
                        Apertura
                      </span>
                      <input
                        type="time"
                        value={
                          item.open
                        }
                        onChange={(
                          event
                        ) =>
                          updateSchedule(
                            item.id,
                            {
                              open:
                                event
                                  .target
                                  .value,
                            }
                          )
                        }
                      />
                    </label>

                    <label
                      className={
                        styles.timeField
                      }
                    >
                      <span>
                        Cierre
                      </span>
                      <input
                        type="time"
                        value={
                          item.close
                        }
                        onChange={(
                          event
                        ) =>
                          updateSchedule(
                            item.id,
                            {
                              close:
                                event
                                  .target
                                  .value,
                            }
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        <section
          className={`${styles.card} ${styles.wideCard}`}
        >
          <CardHeading
            eyebrow="PÁGINA CONTACTO"
            title="Presentación"
          />

          <div
            className={
              styles.formGrid
            }
          >
            <Field
              label="Etiqueta superior"
              value={
                config.contactPage
                  .eyebrow
              }
              onChange={(value) =>
                updateContactPage(
                  "eyebrow",
                  value
                )
              }
            />

            <Field
              label="Título"
              value={
                config.contactPage
                  .title
              }
              onChange={(value) =>
                updateContactPage(
                  "title",
                  value
                )
              }
            />

            <Field
              label="Texto resaltado"
              value={
                config.contactPage
                  .highlightedText
              }
              onChange={(value) =>
                updateContactPage(
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
                label="Descripción"
                value={
                  config.contactPage
                    .description
                }
                onChange={(value) =>
                  updateContactPage(
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
              styles.imageBlock
            }
          >
            <div>
              <strong>
                Imagen principal
              </strong>
              <p>
                Se muestra en el Hero
                de la página Contacto.
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
                      event.target
                        .files?.[0]
                    )
                  }
                />

                <ImagePlus
                  size={15}
                  strokeWidth={1.8}
                />

                {isUploading
                  ? "Subiendo..."
                  : "Cambiar imagen"}
              </label>
            </div>

            {config.contactPage
              .heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={
                  config.contactPage
                    .heroImageUrl
                }
                alt=""
              />
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
}

function CardHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div
      className={
        styles.cardHeading
      }
    >
      <span>
        {eyebrow}
      </span>
      <strong>
        {title}
      </strong>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  textarea?: boolean;
  placeholder?: string;
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
          placeholder={
            placeholder ||
            `Escribe ${label.toLowerCase()}`
          }
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
          placeholder={
            placeholder ||
            `Escribe ${label.toLowerCase()}`
          }
        />
      )}
    </label>
  );
}