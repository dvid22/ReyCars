"use client";

import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
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
  useMemo,
  useState,
} from "react";

import styles from "./CursosPage.module.css";

type CourseId =
  | "c1"
  | "a2"
  | "b1"
  | "refuerzo-auto"
  | "refuerzo-moto"
  | "manejo-defensivo"
  | "refrendacion";

type CourseGroup =
  | "Licencias de conducción"
  | "Formación complementaria";

type CourseIconType =
  | "car"
  | "motorcycle"
  | "steering"
  | "shield"
  | "id";

type Course = {
  id: CourseId;
  number: string;
  group: CourseGroup;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  theory?: string;
  practice?: string;
  vehicle?: string;
  modality?: string;
  price: string;
  priceLabel: string;
  details: string[];
  icon: CourseIconType;
  whatsappLabel: string;
};

const WHATSAPP_NUMBER = "573102062512";

const courses: Course[] = [
  {
    id: "c1",
    number: "01",
    group: "Licencias de conducción",
    badge: "Categoría C1",
    title: "Automóvil",
    subtitle: "Servicio público y particular",
    description:
      "Formación completa para conducir automóvil de servicio público y particular, integrando preparación teórica y práctica.",
    image: "/assets/images/cursos/c1.png",
    imageAlt: "Vehículo de formación categoría C1 de ReyCars",
    theory: "36 h",
    practice: "30 h",
    vehicle: "Automóvil",
    modality: "Presencial",
    price: "$1.450.000",
    priceLabel: "Inversión",
    details: [
      "36 horas teóricas",
      "30 horas prácticas",
      "Servicio público y particular",
    ],
    icon: "car",
    whatsappLabel: "Categoría C1 - Automóvil, servicio público y particular",
  },
  {
    id: "a2",
    number: "02",
    group: "Licencias de conducción",
    badge: "Categoría A2",
    title: "Motocicleta",
    subtitle: "Formación para motocicleta",
    description:
      "Preparación teórica y práctica enfocada en desarrollar control, confianza y hábitos seguros para la conducción de motocicleta.",
    image: "/assets/images/cursos/a2.png",
    imageAlt: "Motocicleta de formación categoría A2 de ReyCars",
    theory: "30 h",
    practice: "15 h",
    vehicle: "Motocicleta",
    modality: "Presencial",
    price: "$1.030.000",
    priceLabel: "Inversión",
    details: [
      "30 horas teóricas",
      "15 horas prácticas",
      "Formación en motocicleta",
    ],
    icon: "motorcycle",
    whatsappLabel: "Categoría A2 - Motocicleta",
  },
  {
    id: "b1",
    number: "03",
    group: "Licencias de conducción",
    badge: "Categoría B1",
    title: "Automóvil particular",
    subtitle: "Servicio particular",
    description:
      "Proceso de formación para conducción de automóvil particular con acompañamiento teórico y práctica progresiva.",
    image: "/assets/images/cursos/b1.png",
    imageAlt: "Vehículo de formación categoría B1 de ReyCars",
    theory: "32 h",
    practice: "20 h",
    vehicle: "Automóvil",
    modality: "Presencial",
    price: "$1.300.000",
    priceLabel: "Inversión",
    details: [
      "32 horas teóricas",
      "20 horas prácticas",
      "Servicio particular",
    ],
    icon: "car",
    whatsappLabel: "Categoría B1 - Automóvil particular",
  },
  {
    id: "refuerzo-auto",
    number: "04",
    group: "Formación complementaria",
    badge: "Refuerzo",
    title: "Refuerzo práctico",
    subtitle: "Automóvil",
    description:
      "Sesiones prácticas para recuperar confianza, fortalecer maniobras y trabajar necesidades específicas al volante.",
    image: "/assets/images/cursos/refuerzo-auto.png",
    imageAlt: "Refuerzo práctico en automóvil ReyCars",
    practice: "Por hora",
    vehicle: "Automóvil",
    modality: "Personalizada",
    price: "Consultar",
    priceLabel: "Valor",
    details: [
      "Clases por hora",
      "Paquete de 14 horas",
      "Clases personalizadas",
    ],
    icon: "steering",
    whatsappLabel: "Refuerzo práctico en automóvil",
  },
  {
    id: "refuerzo-moto",
    number: "05",
    group: "Formación complementaria",
    badge: "Refuerzo",
    title: "Refuerzo práctico",
    subtitle: "Motocicleta",
    description:
      "Prácticas personalizadas para mejorar dominio, maniobrabilidad y seguridad sobre la motocicleta.",
    image: "/assets/images/cursos/refuerzo-moto.png",
    imageAlt: "Refuerzo práctico en motocicleta ReyCars",
    practice: "Por hora",
    vehicle: "Motocicleta",
    modality: "Personalizada",
    price: "Consultar",
    priceLabel: "Valor",
    details: [
      "Clases por hora",
      "Clases personalizadas",
      "Refuerzo de habilidades",
    ],
    icon: "motorcycle",
    whatsappLabel: "Refuerzo práctico en motocicleta",
  },
  {
    id: "manejo-defensivo",
    number: "06",
    group: "Formación complementaria",
    badge: "Certificado",
    title: "Manejo defensivo",
    subtitle: "Formación complementaria",
    description:
      "Formación enfocada en prevención, anticipación de riesgos y toma de decisiones responsables durante la conducción.",
    image: "/assets/images/cursos/manejo-defensivo.png",
    imageAlt: "Curso de manejo defensivo ReyCars",
    theory: "2 módulos",
    vehicle: "Automóvil",
    modality: "Certificado",
    price: "Consultar",
    priceLabel: "Valor",
    details: [
      "2 módulos",
      "Formación básica aplicada",
      "Formación teórica",
    ],
    icon: "shield",
    whatsappLabel: "Curso de manejo defensivo",
  },
  {
    id: "refrendacion",
    number: "07",
    group: "Formación complementaria",
    badge: "Refrendación",
    title: "Refrendación de licencia",
    subtitle: "Categoría individual o combo",
    description:
      "Alternativas para refrendar una categoría o gestionar un combo de categorías de manera clara y acompañada.",
    image: "/assets/images/cursos/refrendacion.png",
    imageAlt: "Refrendación de licencia ReyCars",
    modality: "Trámite",
    price: "Desde $345.000",
    priceLabel: "Valor",
    details: [
      "1 categoría: $345.000",
      "Combo: $525.000",
      "Examen médico y derechos de impresión",
    ],
    icon: "id",
    whatsappLabel: "Refrendación de licencia",
  },
];

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
      <circle cx="6" cy="17" r="3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="17" r="3" stroke="currentColor" strokeWidth="1.7" />
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
    return <Gauge size={size} strokeWidth={1.7} />;
  }

  if (type === "shield") {
    return <ShieldCheck size={size} strokeWidth={1.7} />;
  }

  if (type === "id") {
    return <IdCard size={size} strokeWidth={1.7} />;
  }

  return <Car size={size} strokeWidth={1.7} />;
}

export function CursosPage() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<CourseId>("c1");

  const activeIndex = useMemo(
    () => courses.findIndex((course) => course.id === activeId),
    [activeId]
  );

  const activeCourse = courses[activeIndex] ?? courses[0];

  const licenses = courses.filter(
    (course) => course.group === "Licencias de conducción"
  );

  const complementary = courses.filter(
    (course) => course.group === "Formación complementaria"
  );

  const selectRelative = (direction: -1 | 1) => {
    const next =
      (activeIndex + direction + courses.length) %
      courses.length;

    setActiveId(courses[next].id);
  };

  const isPracticalReinforcement =
    activeCourse.id === "refuerzo-auto" ||
    activeCourse.id === "refuerzo-moto";

  const whatsappMessage = encodeURIComponent(
    `Hola ReyCars, quiero recibir información sobre ${activeCourse.whatsappLabel}.`
  );

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <section className={styles.page}>
      <div className={styles.ambient} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className={styles.container}>
        <header className={styles.intro}>
          <div className={styles.introCopy}>
            <div className={styles.eyebrowRow}>
              <span className={styles.eyebrowLine} />
              <span className={styles.eyebrow}>Formación ReyCars</span>
            </div>

            <h1>
              Explora las categorias
              <br />
              para tu <strong> licencia de conducción.</strong>
            </h1>

            <p>ReyCars Ubaté.</p>
          </div>

          <div className={styles.introMeta}>
            <span>7 programas</span>
            <strong>Licencias + formación complementaria</strong>
          </div>
        </header>

        <div className={styles.mobileRail}>
          {courses.map((course) => {
            const active = course.id === activeId;

            return (
              <button
                key={course.id}
                type="button"
                className={`${styles.mobileChip} ${
                  active ? styles.mobileChipActive : ""
                }`}
                onClick={() => setActiveId(course.id)}
                aria-pressed={active}
              >
                <span className={styles.mobileChipIcon}>
                  <CourseIcon type={course.icon} size={18} />
                </span>

                <span>
                  <strong>{course.badge}</strong>
                  <small>{course.title}</small>
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.experience}>
          <aside className={styles.selector}>
            <div className={styles.selectorHeader}>
              <span>Selecciona tu ruta</span>

              <div className={styles.selectorCount}>
                <strong>{activeCourse.number}</strong>
                <small>/ 07</small>
              </div>
            </div>

            <CourseGroup
              title="Licencias de conducción"
              courses={licenses}
              activeId={activeId}
              onSelect={setActiveId}
            />

            <CourseGroup
              title="Formación complementaria"
              courses={complementary}
              activeId={activeId}
              onSelect={setActiveId}
            />
          </aside>

          <div className={styles.stage}>
            <div className={styles.stageTop}>
              <span className={styles.stageLabel}>Curso seleccionado</span>

              <div className={styles.stageControls}>
                <button
                  type="button"
                  onClick={() => selectRelative(-1)}
                  aria-label="Curso anterior"
                >
                  <ChevronLeft size={17} strokeWidth={1.7} />
                </button>

                <div className={styles.progress}>
                  <span
                    style={{
                      width: `${((activeIndex + 1) / courses.length) * 100}%`,
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => selectRelative(1)}
                  aria-label="Siguiente curso"
                >
                  <ChevronRight size={17} strokeWidth={1.7} />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.article
                key={activeCourse.id}
                className={styles.courseCard}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: 24,
                        scale: 0.992,
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
                        scale: 0.995,
                      }
                }
                transition={{
                  duration: 0.42,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className={styles.visualArea}>
                  <div className={styles.visualCopy}>
                    <span className={styles.counter}>
                      {activeCourse.number} / 07
                    </span>

                    <span className={styles.badge}>
                      {activeCourse.badge}
                    </span>

                    <h2>{activeCourse.title}</h2>

                    <strong>{activeCourse.subtitle}</strong>

                    <p>{activeCourse.description}</p>
                  </div>

                  <motion.div
                    className={styles.visual}
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 20,
                            scale: 0.94,
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
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <span className={styles.visualHalo} />
                    <span className={styles.visualDiamondOuter} />
                    <span className={styles.visualDiamondInner} />
                    <span className={styles.visualDots} />

                    <Image
                      src={activeCourse.image}
                      alt={activeCourse.imageAlt}
                      fill
                      priority={activeCourse.id === "c1"}
                      sizes="(max-width: 900px) 92vw, 52vw"
                      className={`${styles.courseImage} ${
                        isPracticalReinforcement
                          ? styles.courseImageReinforcement
                          : ""
                      } ${
                        activeCourse.id === "refuerzo-moto"
                          ? styles.courseImageReinforcementMoto
                          : ""
                      }`}
                    />
                  </motion.div>
                </div>

                <div className={styles.dataBand}>
                  <div className={styles.stats}>
                    {activeCourse.theory && (
                      <Stat
                        icon={<BookOpen size={20} strokeWidth={1.65} />}
                        value={activeCourse.theory}
                        label={
                          activeCourse.id === "manejo-defensivo"
                            ? "Módulos"
                            : "Teoría"
                        }
                      />
                    )}

                    {activeCourse.practice && (
                      <Stat
                        icon={<Gauge size={20} strokeWidth={1.65} />}
                        value={activeCourse.practice}
                        label="Práctica"
                      />
                    )}

                    {activeCourse.vehicle && (
                      <Stat
                        icon={
                          activeCourse.icon === "motorcycle" ? (
                            <MotorcycleIcon size={20} />
                          ) : (
                            <Car size={20} strokeWidth={1.65} />
                          )
                        }
                        value={activeCourse.vehicle}
                        label="Vehículo"
                      />
                    )}

                    {activeCourse.modality && (
                      <Stat
                        icon={
                          <GraduationCap
                            size={20}
                            strokeWidth={1.65}
                          />
                        }
                        value={activeCourse.modality}
                        label="Modalidad"
                      />
                    )}
                  </div>

                  <div className={styles.offer}>
                    <div className={styles.price}>
                      <span>{activeCourse.priceLabel}</span>
                      <strong>{activeCourse.price}</strong>
                    </div>

                    <div className={styles.includes}>
                      {activeCourse.details.map((detail) => (
                        <span key={detail}>
                          <CheckCircle2
                            size={13}
                            strokeWidth={1.8}
                          />
                          {detail}
                        </span>
                      ))}
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.detailButton}
                      aria-label={`Solicitar información sobre ${activeCourse.whatsappLabel} por WhatsApp`}
                    >
                      <span>Solicitar información</span>

                      <i>
                        <MessageCircle size={17} strokeWidth={1.8} />
                      </i>
                    </a>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.trustStrip}>
          <TrustItem
            icon={<ShieldCheck size={19} strokeWidth={1.6} />}
            title="Formación responsable"
            text="Preparación enfocada en seguridad y confianza."
          />

          <TrustItem
            icon={<Clock3 size={19} strokeWidth={1.6} />}
            title="Información clara"
            text="Conoce horas, modalidad y características de cada opción."
          />

          <TrustItem
            icon={<GraduationCap size={19} strokeWidth={1.6} />}
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
  activeId,
  onSelect,
}: {
  title: string;
  courses: Course[];
  activeId: CourseId;
  onSelect: (id: CourseId) => void;
}) {
  return (
    <div className={styles.selectorGroup}>
      <span className={styles.groupTitle}>{title}</span>

      <div className={styles.courseList}>
        {courses.map((course) => {
          const active = activeId === course.id;

          return (
            <button
              key={course.id}
              type="button"
              className={`${styles.courseItem} ${
                active ? styles.courseItemActive : ""
              }`}
              onClick={() => onSelect(course.id)}
              aria-pressed={active}
            >
              <span className={styles.courseNumber}>
                {course.number}
              </span>

              <span className={styles.courseItemIcon}>
                <CourseIcon type={course.icon} />
              </span>

              <span className={styles.courseItemText}>
                <small>{course.badge}</small>
                <strong>{course.title}</strong>
                <em>{course.subtitle}</em>
              </span>

              <ArrowRight
                size={15}
                strokeWidth={1.7}
                className={styles.courseArrow}
              />
            </button>
          );
        })}
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
    <div className={styles.stat}>
      <span className={styles.statIcon}>{icon}</span>

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
    <div className={styles.trustItem}>
      <span>{icon}</span>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}