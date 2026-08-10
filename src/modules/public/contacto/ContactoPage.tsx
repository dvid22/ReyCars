"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Clock3,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import styles from "./ContactoPage.module.css";

const PHONE_DISPLAY = "+57 310 2062512";
const PHONE_LINK = "tel:+573102062512";
const WHATSAPP_LINK = "https://wa.me/573102062512";
const ADDRESS = "Calle 15 # 5 - 68, Ubaté";
const MAP_QUERY =
  "https://www.google.com/maps/search/?api=1&query=Calle%2015%20%23%205%20-%2068%20Ubat%C3%A9";

const courseOptions = [
  "Curso B1",
  "Curso A2",
  "Curso C1",
  "Refuerzo práctico automóvil",
  "Refuerzo práctico motocicleta",
  "Manejo defensivo",
  "Refrendación de licencia",
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/reycars_ubate?igsh=Y3hxZW1rNWsxcmVt",
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/18ye5QQfPU/?mibextid=wwXIfr",
    icon: "facebook",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@reycars_ubate?_r=1&_t=ZS-98kig2MXwVI",
    icon: "tiktok",
  },
] as const;

type SocialIconName =
  (typeof socialLinks)[number]["icon"];

function SocialIcon({
  name,
}: {
  name: SocialIconName;
}) {
  if (name === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="12"
          r="4.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="17.35"
          cy="6.75"
          r="1.15"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M13.8 21v-8h2.85l.43-3.32H13.8V7.56c0-.96.27-1.61 1.64-1.61h1.75V2.98c-.3-.04-1.34-.13-2.55-.13-2.52 0-4.25 1.54-4.25 4.37v2.46H7.54V13h2.85v8h3.41Z"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M14.72 3.2c.47 1.58 1.4 2.7 2.84 3.43.76.38 1.47.55 2.14.58v3.17a8.15 8.15 0 0 1-4.89-1.7v6.02a6.12 6.12 0 1 1-5.28-6.06v3.2a2.93 2.93 0 1 0 2.09 2.8V3.2h3.1Z"
      />
    </svg>
  );
}

function WhatsAppIcon({
  size = 20,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.51 0 .17 5.34.17 11.91c0 2.1.55 4.16 1.59 5.97L.07 24l6.27-1.64a11.9 11.9 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.91 0-3.18-1.22-6.17-3.45-8.43ZM12.07 21.8h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.83 9.83 0 0 1-1.52-5.28C2.19 6.45 6.62 2.02 12.08 2.02c2.64 0 5.12 1.03 6.99 2.91a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47a8.9 8.9 0 0 1-1.65-2.06c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.21 3.07.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
      />
    </svg>
  );
}

export function ContactoPage() {
  const reduceMotion = useReducedMotion();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [courseOpen, setCourseOpen] = useState(false);
  const [message, setMessage] = useState("");

  const whatsappFormUrl = useMemo(() => {
    const text = [
      "Hola ReyCars, quiero recibir información.",
      name ? `Nombre: ${name}` : "",
      phone ? `Teléfono: ${phone}` : "",
      email ? `Correo: ${email}` : "",
      course ? `Curso de interés: ${course}` : "",
      message ? `Mensaje: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;
  }, [course, email, message, name, phone]);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    window.open(
      whatsappFormUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        {/* =====================================================
            HERO
            ===================================================== */}
        <section className={styles.hero}>
          <motion.div
            className={styles.heroCopy}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 24,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.62,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className={styles.breadcrumb}>
              <Link href="/">
                Inicio
              </Link>

              <span>
                ›
              </span>

              <strong>
                Contacto
              </strong>
            </div>

            <span className={styles.eyebrow}>
              Contacto
            </span>

            <h1>
              Habla con
              <br />
              CEA{" "}
              <strong>
                ReyCars.
              </strong>
            </h1>

            <p>
              Estamos listos para ayudarte. Escríbenos,
              llámanos o visítanos en nuestra sede en Ubaté.
            </p>
          </motion.div>

          <motion.div
            className={styles.heroVisual}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 34,
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.72,
              delay: 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Image
              src="/assets/images/nosotros/galeria-07.jpg"
              alt="Experiencia ReyCars en su sede"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              className={styles.heroImage}
            />

            <span
              className={styles.heroDots}
              aria-hidden="true"
            />

            <span
              className={styles.heroCorner}
              aria-hidden="true"
            />
          </motion.div>
        </section>

        {/* =====================================================
            CONTACTO + HORARIOS + FORMULARIO
            ===================================================== */}
        <motion.section
          className={styles.contactPanel}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 28,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.14,
          }}
          transition={{
            duration: 0.62,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className={styles.infoColumn}>
            <h2>
              Estamos para ti
            </h2>

            <div className={styles.contactList}>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <span className={styles.contactIcon}>
                  <WhatsAppIcon />
                </span>

                <div>
                  <strong>
                    WhatsApp
                  </strong>
                  <small>
                    Escríbenos directamente
                  </small>
                  <b>
                    {PHONE_DISPLAY}
                  </b>
                </div>

                <i>
                  <ArrowRight
                    size={15}
                    strokeWidth={1.7}
                  />
                </i>
              </a>

              <a
                href={PHONE_LINK}
                className={styles.contactItem}
              >
                <span className={styles.contactIcon}>
                  <Phone
                    size={20}
                    strokeWidth={1.6}
                  />
                </span>

                <div>
                  <strong>
                    Teléfono
                  </strong>
                  <small>
                    Llámanos
                  </small>
                  <b>
                    {PHONE_DISPLAY}
                  </b>
                </div>

                <i>
                  <ArrowRight
                    size={15}
                    strokeWidth={1.7}
                  />
                </i>
              </a>

              <a
                href={MAP_QUERY}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <span className={styles.contactIcon}>
                  <MapPin
                    size={20}
                    strokeWidth={1.6}
                  />
                </span>

                <div>
                  <strong>
                    Dirección
                  </strong>
                  <small>
                    Visítanos en nuestra sede
                  </small>
                  <b>
                    {ADDRESS}
                  </b>
                </div>

                <i>
                  <ArrowRight
                    size={15}
                    strokeWidth={1.7}
                  />
                </i>
              </a>
            </div>

            <div className={styles.socialBlock}>
              <strong>
                Síguenos en redes
              </strong>

              <div className={styles.socials}>
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir ${social.label} de ReyCars`}
                    title={social.label}
                  >
                    <SocialIcon
                      name={social.icon}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.scheduleColumn}>
            <div className={styles.scheduleHeading}>
              <Clock3
                size={18}
                strokeWidth={1.6}
              />

              <h2>
                Horario de atención
              </h2>
            </div>

            <div className={styles.scheduleList}>
              <div>
                <strong>
                  Lunes a viernes
                </strong>
                <span>
                  Consultar horario
                </span>
              </div>

              <div>
                <strong>
                  Sábado
                </strong>
                <span>
                  Consultar horario
                </span>
              </div>

              <div>
                <strong>
                  Domingo
                </strong>
                <span>
                  Consultar disponibilidad
                </span>
              </div>
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.scheduleHelp}
            >
              Confirmar horario por WhatsApp
              <ArrowUpRight
                size={14}
                strokeWidth={1.6}
              />
            </a>
          </div>

          <form
            className={styles.formColumn}
            onSubmit={handleSubmit}
          >
            <h2>
              Envíanos un mensaje
            </h2>

            <div className={styles.formGrid}>
              <label className={styles.field}>
                <UserRound
                  size={17}
                  strokeWidth={1.55}
                />

                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />
              </label>

              <label className={styles.field}>
                <Phone
                  size={17}
                  strokeWidth={1.55}
                />

                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  required
                />
              </label>

              <label
                className={`${styles.field} ${styles.fieldWide}`}
              >
                <Mail
                  size={17}
                  strokeWidth={1.55}
                />

                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />
              </label>

              <div
                className={`${styles.courseSelect} ${styles.fieldWide} ${
                  courseOpen ? styles.courseSelectOpen : ""
                }`}
              >
                <button
                  type="button"
                  className={styles.courseSelectTrigger}
                  onClick={() =>
                    setCourseOpen((current) => !current)
                  }
                  aria-haspopup="listbox"
                  aria-expanded={courseOpen}
                >
                  <GraduationCap
                    size={18}
                    strokeWidth={1.55}
                  />

                  <span
                    className={
                      course
                        ? styles.courseSelectValue
                        : styles.courseSelectPlaceholder
                    }
                  >
                    {course || "Curso de interés"}
                  </span>

                  <ChevronDown
                    size={17}
                    strokeWidth={1.6}
                    className={styles.courseSelectChevron}
                  />
                </button>

                <AnimatePresence>
                  {courseOpen && (
                    <motion.div
                      className={styles.courseSelectMenu}
                      role="listbox"
                      aria-label="Curso de interés"
                      initial={
                        reduceMotion
                          ? false
                          : {
                              opacity: 0,
                              y: -8,
                              scale: 0.985,
                            }
                      }
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -6,
                        scale: 0.99,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <div className={styles.courseSelectMenuInner}>
                        {courseOptions.map((item) => {
                          const selected = course === item;

                          return (
                            <button
                              key={item}
                              type="button"
                              role="option"
                              aria-selected={selected}
                              className={`${styles.courseSelectOption} ${
                                selected
                                  ? styles.courseSelectOptionActive
                                  : ""
                              }`}
                              onClick={() => {
                                setCourse(item);
                                setCourseOpen(false);
                              }}
                            >
                              <span>
                                {item}
                              </span>

                              {selected && (
                                <i aria-hidden="true" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <label
                className={`${styles.messageField} ${styles.fieldWide}`}
              >
                <span>
                  <Send
                    size={16}
                    strokeWidth={1.55}
                  />
                </span>

                <textarea
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  rows={4}
                />
              </label>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
            >
              <span>
                Enviar mensaje
              </span>

              <Send
                size={16}
                strokeWidth={1.7}
              />
            </button>

            <div className={styles.formPrivacy}>
              <ShieldCheck
                size={14}
                strokeWidth={1.6}
              />

              <span>
                Tu información será utilizada únicamente
                para responder tu consulta.
              </span>
            </div>
          </form>
        </motion.section>

        {/* =====================================================
            MAPA
            ===================================================== */}
        <motion.section
          className={styles.mapSection}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 26,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.62,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <iframe
            className={styles.mapFrame}
            title="Ubicación de ReyCars en Ubaté"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Calle%2015%20%23%205%20-%2068%20Ubat%C3%A9&output=embed"
          />

          <div className={styles.mapCard}>
            <span className={styles.mapIcon}>
              <MapPin
                size={20}
                strokeWidth={1.6}
              />
            </span>

            <div>
              <strong>
                Nuestra sede
              </strong>

              <p>
                {ADDRESS}
              </p>
            </div>

            <a
              href={MAP_QUERY}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cómo llegar
              <ArrowRight
                size={15}
                strokeWidth={1.7}
              />
            </a>
          </div>
        </motion.section>

        {/* =====================================================
            CTA FINAL
            ===================================================== */}
        <motion.section
          className={styles.bottomCta}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 22,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.35,
          }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className={styles.bottomCtaIcon}>
            <GraduationCap
              size={23}
              strokeWidth={1.55}
            />
          </span>

          <div className={styles.bottomCtaCopy}>
            <strong>
              Tu proceso puede{" "}
              <b>
                comenzar hoy.
              </b>
            </strong>

            <p>
              Estamos aquí para acompañarte en cada paso.
            </p>
          </div>

          <div className={styles.bottomCtaActions}>
            <Link
              href="/cursos"
              className={styles.primaryCta}
            >
              Ver cursos
              <ArrowUpRight
                size={15}
                strokeWidth={1.7}
              />
            </Link>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryCta}
            >
              Escribir por WhatsApp
              <WhatsAppIcon
                size={16}
              />
            </a>
          </div>
        </motion.section>
      </div>
    </section>
  );
}