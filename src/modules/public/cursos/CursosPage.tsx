"use client";

import {
  ArrowRight,
  BookOpen,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Gauge,
  GraduationCap,
  IdCard,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useCourses } from "@/hooks/useCourses";
import type {
  Course,
  CourseIconType,
} from "@/types/course.types";

import styles from "./CursosPage.module.css";

const WHATSAPP_NUMBER = "573102062512";

function formatMoney(value?: number | null) {
  if (typeof value !== "number") {
    return "Consultar";
  }

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function displayTheory(course: Course) {
  if (course.theoryLabel) {
    return course.theoryLabel;
  }

  if (course.theoryHours != null) {
    return `${course.theoryHours} h`;
  }

  return "";
}

function displayPractice(course: Course) {
  if (course.practiceLabel) {
    return course.practiceLabel;
  }

  if (course.practiceHours != null) {
    return `${course.practiceHours} h`;
  }

  return "";
}

function displayPrice(course: Course) {
  return (
    course.priceText ||
    formatMoney(course.price)
  );
}

function MotorcycleIcon({
  size = 21,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="6"
        cy="17"
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="18"
        cy="17"
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8.4 17h5.2l2.4-5h-4.5l-2.2 3.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M13.6 12 12 9.5h-2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M16 12h2.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M5.8 14.1 8.4 11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CourseIcon({
  type,
  size = 21,
}: {
  type: CourseIconType;
  size?: number;
}) {
  if (type === "motorcycle") {
    return <MotorcycleIcon size={size} />;
  }

  if (type === "steering") {
    return (
      <Gauge
        size={size}
        strokeWidth={1.7}
      />
    );
  }

  if (type === "shield") {
    return (
      <ShieldCheck
        size={size}
        strokeWidth={1.7}
      />
    );
  }

  if (type === "id") {
    return (
      <IdCard
        size={size}
        strokeWidth={1.7}
      />
    );
  }

  return (
    <Car
      size={size}
      strokeWidth={1.7}
    />
  );
}

export function CursosPage() {
  const reduceMotion =
    useReducedMotion();

  const {
    courses,
  } = useCourses();

  const [
    activeSlug,
    setActiveSlug,
  ] =
    useState("");

  useEffect(() => {
    if (courses.length === 0) {
      return;
    }

    const stillExists =
      courses.some(
        (course) =>
          course.slug ===
          activeSlug
      );

    if (!activeSlug || !stillExists) {
      setActiveSlug(
        courses[0].slug
      );
    }
  }, [courses, activeSlug]);

  const activeIndex =
    useMemo(
      () => {
        const index =
          courses.findIndex(
            (course) =>
              course.slug ===
              activeSlug
          );

        return index >= 0
          ? index
          : 0;
      },
      [courses, activeSlug]
    );

  const activeCourse =
    courses[activeIndex];

  const licenses =
    courses.filter(
      (course) =>
        course.group ===
        "Licencias de conducción"
    );

  const complementary =
    courses.filter(
      (course) =>
        course.group ===
        "Formación complementaria"
    );

  if (!activeCourse) {
    return null;
  }

  const selectRelative = (
    direction: -1 | 1
  ) => {
    const next =
      (
        activeIndex +
        direction +
        courses.length
      ) %
      courses.length;

    setActiveSlug(
      courses[next].slug
    );
  };

  const theory =
    displayTheory(activeCourse);

  const practice =
    displayPractice(activeCourse);

  const price =
    displayPrice(activeCourse);

  const details =
    activeCourse.includes ?? [];

  const isPracticalReinforcement =
    activeCourse.slug ===
      "refuerzo-auto" ||
    activeCourse.slug ===
      "refuerzo-moto";

  const whatsappLabel =
    activeCourse.whatsappLabel ||
    `${activeCourse.badge} - ${activeCourse.name}`;

  const whatsappMessage =
    encodeURIComponent(
      `Hola ReyCars, quiero recibir información sobre ${whatsappLabel}.`
    );

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <section
      className={styles.page}
    >
      <div
        className={styles.ambient}
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>

      <div
        className={
          styles.container
        }
      >
        <header
          className={styles.intro}
        >
          <div
            className={
              styles.introCopy
            }
          >
            <div
              className={
                styles.eyebrowRow
              }
            >
              <span
                className={
                  styles.eyebrowLine
                }
              />

              <span
                className={
                  styles.eyebrow
                }
              >
                Formación ReyCars
              </span>
            </div>

            <h1>
              Explora las categorias
              <br />
              para tu{" "}
              <strong>
                licencia de conducción.
              </strong>
            </h1>

            <p>ReyCars Ubaté.</p>
          </div>

          <div
            className={
              styles.introMeta
            }
          >
            <span>
              {courses.length}{" "}
              {courses.length === 1
                ? "programa"
                : "programas"}
            </span>

            <strong>
              Licencias + formación
              complementaria
            </strong>
          </div>
        </header>

        <div
          className={
            styles.mobileRail
          }
        >
          {courses.map(
            (course) => {
              const active =
                course.slug ===
                activeSlug;

              return (
                <button
                  key={course.id}
                  type="button"
                  className={`${styles.mobileChip} ${
                    active
                      ? styles.mobileChipActive
                      : ""
                  }`}
                  onClick={() =>
                    setActiveSlug(
                      course.slug
                    )
                  }
                  aria-pressed={
                    active
                  }
                >
                  <span
                    className={
                      styles.mobileChipIcon
                    }
                  >
                    <CourseIcon
                      type={
                        course.icon
                      }
                      size={18}
                    />
                  </span>

                  <span>
                    <strong>
                      {course.badge}
                    </strong>

                    <small>
                      {course.name}
                    </small>
                  </span>
                </button>
              );
            }
          )}
        </div>

        <div
          className={
            styles.experience
          }
        >
          <aside
            className={
              styles.selector
            }
          >
            <div
              className={
                styles.selectorHeader
              }
            >
              <span>
                Selecciona tu ruta
              </span>

              <div
                className={
                  styles.selectorCount
                }
              >
                <strong>
                  {String(
                    activeIndex + 1
                  ).padStart(
                    2,
                    "0"
                  )}
                </strong>

                <small>
                  /{" "}
                  {String(
                    courses.length
                  ).padStart(
                    2,
                    "0"
                  )}
                </small>
              </div>
            </div>

            {licenses.length >
            0 ? (
              <CourseGroup
                title="Licencias de conducción"
                courses={licenses}
                activeSlug={
                  activeSlug
                }
                onSelect={
                  setActiveSlug
                }
              />
            ) : null}

            {complementary.length >
            0 ? (
              <CourseGroup
                title="Formación complementaria"
                courses={
                  complementary
                }
                activeSlug={
                  activeSlug
                }
                onSelect={
                  setActiveSlug
                }
              />
            ) : null}
          </aside>

          <div
            className={styles.stage}
          >
            <div
              className={
                styles.stageTop
              }
            >
              <span
                className={
                  styles.stageLabel
                }
              >
                Curso seleccionado
              </span>

              <div
                className={
                  styles.stageControls
                }
              >
                <button
                  type="button"
                  onClick={() =>
                    selectRelative(-1)
                  }
                  aria-label="Curso anterior"
                >
                  <ChevronLeft
                    size={17}
                    strokeWidth={1.7}
                  />
                </button>

                <div
                  className={
                    styles.progress
                  }
                >
                  <span
                    style={{
                      width:
                        `${(
                          (
                            activeIndex +
                            1
                          ) /
                          courses.length
                        ) *
                        100}%`,
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    selectRelative(1)
                  }
                  aria-label="Siguiente curso"
                >
                  <ChevronRight
                    size={17}
                    strokeWidth={1.7}
                  />
                </button>
              </div>
            </div>

            <AnimatePresence
              mode="wait"
            >
              <motion.article
                key={
                  activeCourse.id
                }
                className={
                  styles.courseCard
                }
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: 24,
                        scale:
                          0.992,
                      }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                exit={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        x: -18,
                        scale:
                          0.995,
                      }
                }
                transition={{
                  duration: 0.42,
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
                    styles.visualArea
                  }
                >
                  <div
                    className={
                      styles.visualCopy
                    }
                  >
                    <span
                      className={
                        styles.counter
                      }
                    >
                      {String(
                        activeIndex +
                          1
                      ).padStart(
                        2,
                        "0"
                      )}{" "}
                      /{" "}
                      {String(
                        courses.length
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <span
                      className={
                        styles.badge
                      }
                    >
                      {
                        activeCourse.badge
                      }
                    </span>

                    <h2>
                      {
                        activeCourse.name
                      }
                    </h2>

                    <strong>
                      {
                        activeCourse.subtitle
                      }
                    </strong>

                    <p>
                      {
                        activeCourse.description
                      }
                    </p>
                  </div>

                  <motion.div
                    className={
                      styles.visual
                    }
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity:
                              0,
                            y: 20,
                            scale:
                              0.94,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.52,
                      delay: 0.04,
                      ease: [
                        0.16,
                        1,
                        0.3,
                        1,
                      ],
                    }}
                  >
                    <span
                      className={
                        styles.visualHalo
                      }
                    />

                    <span
                      className={
                        styles.visualDiamondOuter
                      }
                    />

                    <span
                      className={
                        styles.visualDiamondInner
                      }
                    />

                    <span
                      className={
                        styles.visualDots
                      }
                    />

                    {/* Se usa img para admitir tanto assets locales
                        como URLs de Firebase Storage sin tocar next.config. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        activeCourse.imageUrl
                      }
                      alt={
                        activeCourse.imageAlt ||
                        activeCourse.name
                      }
                      className={`${styles.courseImage} ${
                        isPracticalReinforcement
                          ? styles.courseImageReinforcement
                          : ""
                      } ${
                        activeCourse.slug ===
                        "refuerzo-moto"
                          ? styles.courseImageReinforcementMoto
                          : ""
                      }`}
                      style={{
                        position:
                          "absolute",
                        inset: 0,
                        width: "100%",
                        height:
                          "100%",
                      }}
                    />
                  </motion.div>
                </div>

                <div
                  className={
                    styles.dataBand
                  }
                >
                  <div
                    className={
                      styles.stats
                    }
                  >
                    {theory ? (
                      <Stat
                        icon={
                          <BookOpen
                            size={20}
                            strokeWidth={
                              1.65
                            }
                          />
                        }
                        value={
                          theory
                        }
                        label={
                          activeCourse.slug ===
                          "manejo-defensivo"
                            ? "Módulos"
                            : "Teoría"
                        }
                      />
                    ) : null}

                    {practice ? (
                      <Stat
                        icon={
                          <Gauge
                            size={20}
                            strokeWidth={
                              1.65
                            }
                          />
                        }
                        value={
                          practice
                        }
                        label="Práctica"
                      />
                    ) : null}

                    {activeCourse.vehicle ? (
                      <Stat
                        icon={
                          activeCourse.icon ===
                          "motorcycle" ? (
                            <MotorcycleIcon
                              size={20}
                            />
                          ) : (
                            <Car
                              size={20}
                              strokeWidth={
                                1.65
                              }
                            />
                          )
                        }
                        value={
                          activeCourse.vehicle
                        }
                        label="Vehículo"
                      />
                    ) : null}

                    {activeCourse.modality ? (
                      <Stat
                        icon={
                          <GraduationCap
                            size={20}
                            strokeWidth={
                              1.65
                            }
                          />
                        }
                        value={
                          activeCourse.modality
                        }
                        label="Modalidad"
                      />
                    ) : null}
                  </div>

                  <div
                    className={
                      styles.offer
                    }
                  >
                    <div
                      className={
                        styles.price
                      }
                    >
                      <span>
                        {activeCourse.priceLabel ||
                          "Valor"}
                      </span>

                      <strong>
                        {price}
                      </strong>
                    </div>

                    <div
                      className={
                        styles.includes
                      }
                    >
                      {details.map(
                        (detail) => (
                          <span
                            key={
                              detail
                            }
                          >
                            <CheckCircle2
                              size={
                                13
                              }
                              strokeWidth={
                                1.8
                              }
                            />

                            {detail}
                          </span>
                        )
                      )}
                    </div>

                    <a
                      href={
                        whatsappUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        styles.detailButton
                      }
                      aria-label={`Solicitar información sobre ${whatsappLabel} por WhatsApp`}
                    >
                      <span>
                        Solicitar
                        información
                      </span>

                      <i>
                        <MessageCircle
                          size={17}
                          strokeWidth={
                            1.8
                          }
                        />
                      </i>
                    </a>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div
          className={
            styles.trustStrip
          }
        >
          <TrustItem
            icon={
              <ShieldCheck
                size={19}
                strokeWidth={1.6}
              />
            }
            title="Formación responsable"
            text="Preparación enfocada en seguridad y confianza."
          />

          <TrustItem
            icon={
              <Clock3
                size={19}
                strokeWidth={1.6}
              />
            }
            title="Información clara"
            text="Conoce horas, modalidad y características de cada opción."
          />

          <TrustItem
            icon={
              <GraduationCap
                size={19}
                strokeWidth={1.6}
              />
            }
            title="Más opciones"
            text="Licencias, refuerzos, manejo defensivo y refrendación."
          />
        </div>
      </div>
    </section>
  );
}

function CourseGroup({
  title,
  courses,
  activeSlug,
  onSelect,
}: {
  title: string;
  courses: Course[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div
      className={
        styles.selectorGroup
      }
    >
      <span
        className={
          styles.groupTitle
        }
      >
        {title}
      </span>

      <div
        className={
          styles.courseList
        }
      >
        {courses.map(
          (course) => {
            const active =
              activeSlug ===
              course.slug;

            return (
              <button
                key={course.id}
                type="button"
                className={`${styles.courseItem} ${
                  active
                    ? styles.courseItemActive
                    : ""
                }`}
                onClick={() =>
                  onSelect(
                    course.slug
                  )
                }
                aria-pressed={
                  active
                }
              >
                <span
                  className={
                    styles.courseNumber
                  }
                >
                  {String(
                    course.order
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>

                <span
                  className={
                    styles.courseItemIcon
                  }
                >
                  <CourseIcon
                    type={
                      course.icon
                    }
                  />
                </span>

                <span
                  className={
                    styles.courseItemText
                  }
                >
                  <small>
                    {course.badge}
                  </small>

                  <strong>
                    {course.name}
                  </strong>

                  <em>
                    {
                      course.subtitle
                    }
                  </em>
                </span>

                <ArrowRight
                  size={15}
                  strokeWidth={1.7}
                  className={
                    styles.courseArrow
                  }
                />
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div
      className={styles.stat}
    >
      <span
        className={
          styles.statIcon
        }
      >
        {icon}
      </span>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function TrustItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      className={
        styles.trustItem
      }
    >
      <span>{icon}</span>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}