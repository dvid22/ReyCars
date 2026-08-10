"use client";

import Image from "next/image";
import {
  BookOpen,
  Car,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Flag,
  GraduationCap,
  MapPinned,
  Route,
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

import styles from "./ProcesoPage.module.css";

type StepId =
  | "elige-formacion"
  | "inicia-proceso"
  | "formacion-teorica"
  | "practica-ruta"
  | "completa-recorrido";

type StepIcon =
  | "route"
  | "clipboard"
  | "book"
  | "car"
  | "flag";

type ProcessStep = {
  id: StepId;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: StepIcon;
  highlights: {
    icon: "graduation" | "file" | "shield" | "check" | "route";
    title: string;
    description: string;
  }[];
};

const steps: ProcessStep[] = [
  {
    id: "elige-formacion",
    number: "01",
    title: "Elige tu formación",
    shortTitle: "Elige tu formación",
    description:
      "Explora las categorías y programas disponibles para identificar la opción que mejor se ajusta a tu recorrido.",
    image: "/assets/images/proceso/01-elige-formacion.png",
    imageAlt: "Persona revisando las opciones de formación de ReyCars",
    icon: "route",
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
    number: "02",
    title: "Inicia tu proceso",
    shortTitle: "Inicia tu proceso",
    description:
      "Recibe orientación para comenzar tu formación y organizar los pasos iniciales de manera clara.",
    image: "/assets/images/proceso/02-inicia-proceso.png",
    imageAlt: "Persona iniciando su proceso de formación con ReyCars",
    icon: "clipboard",
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
    number: "03",
    title: "Formación teórica",
    shortTitle: "Formación teórica",
    description:
      "Aprende conceptos fundamentales de tránsito, señales, prevención y conducción responsable antes de pasar a la práctica.",
    image: "/assets/images/proceso/03-formacion-teorica.png",
    imageAlt: "Clase teórica de conducción en ReyCars",
    icon: "book",
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
    number: "04",
    title: "Práctica en ruta",
    shortTitle: "Práctica en ruta",
    description:
      "Lleva la teoría a situaciones reales de conducción y desarrolla seguridad, control y confianza durante la práctica.",
    image: "/assets/images/proceso/04-practica-ruta.png",
    imageAlt: "Práctica de conducción en ruta con vehículo ReyCars",
    icon: "car",
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
    number: "05",
    title: "Completa tu recorrido",
    shortTitle: "Completa tu recorrido",
    description:
      "Finaliza las etapas de tu formación y continúa tu camino con los conocimientos y la práctica adquiridos durante el proceso.",
    image: "/assets/images/proceso/05-completa-recorrido.png",
    imageAlt: "Persona completando su recorrido de formación en ReyCars",
    icon: "flag",
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
];

function ProcessIcon({
  type,
  size = 20,
}: {
  type: StepIcon;
  size?: number;
}) {
  if (type === "clipboard") {
    return <ClipboardCheck size={size} strokeWidth={1.65} />;
  }

  if (type === "book") {
    return <BookOpen size={size} strokeWidth={1.65} />;
  }

  if (type === "car") {
    return <Car size={size} strokeWidth={1.65} />;
  }

  if (type === "flag") {
    return <Flag size={size} strokeWidth={1.65} />;
  }

  return <MapPinned size={size} strokeWidth={1.65} />;
}

function HighlightIcon({
  type,
}: {
  type: ProcessStep["highlights"][number]["icon"];
}) {
  if (type === "graduation") {
    return <GraduationCap size={19} strokeWidth={1.65} />;
  }

  if (type === "file") {
    return <FileText size={19} strokeWidth={1.65} />;
  }

  if (type === "shield") {
    return <ShieldCheck size={19} strokeWidth={1.65} />;
  }

  if (type === "check") {
    return <CheckCircle2 size={19} strokeWidth={1.65} />;
  }

  return <Route size={19} strokeWidth={1.65} />;
}

export function ProcesoPage() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<StepId>("formacion-teorica");

  const activeStep = useMemo(
    () =>
      steps.find((step) => step.id === activeId) ??
      steps[2],
    [activeId]
  );

  return (
    <section className={styles.page}>
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.decorCircleOne} />
        <span className={styles.decorCircleTwo} />
        <span className={styles.decorDots} />
      </div>

      <div className={styles.container}>
        <header className={styles.intro}>
          <div className={styles.introCopy}>
            <span className={styles.eyebrow}>Proceso</span>

            <h1>
              Proceso completo en 
              <br />
              <strong>ReyCars.</strong>
            </h1>

            <p>
              Conoce cada etapa para iniciar y completar tu proceso de
              formación en ReyCars.
            </p>
          </div>

          <div className={styles.mobileProgress}>
            <span>
              {activeStep.number} / 05
            </span>

            <div>
              <i
                style={{
                  width: `${
                    (Number(activeStep.number) / steps.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </header>

        <div className={styles.layout}>
          {/* =================================================
              SELECTOR
              ================================================= */}
          <aside className={styles.selector}>
            <span className={styles.selectorTitle}>
              Tu ruta de formación
            </span>

            <div className={styles.steps}>
              {steps.map((step) => {
                const active = step.id === activeId;

                return (
                  <button
                    type="button"
                    key={step.id}
                    className={`${styles.stepButton} ${
                      active ? styles.stepButtonActive : ""
                    }`}
                    onClick={() => setActiveId(step.id)}
                    aria-pressed={active}
                  >
                    <span className={styles.stepIcon}>
                      <ProcessIcon type={step.icon} />
                    </span>

                    <span className={styles.stepNumber}>
                      {step.number}
                    </span>

                    <strong>
                      {step.shortTitle}
                    </strong>

                    <ChevronRight
                      size={16}
                      strokeWidth={1.7}
                      className={styles.stepArrow}
                    />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* =================================================
              ROAD / MAIN STAGE
              ================================================= */}
          <div className={styles.stage}>

            <AnimatePresence mode="wait">
              <motion.article
                key={activeStep.id}
                className={styles.featureCard}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 18,
                        scale: 0.988,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        y: -12,
                        scale: 0.992,
                      }
                }
                transition={{
                  duration: 0.42,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className={styles.featureCopy}>
                  <span className={styles.featureNumber}>
                    {activeStep.number}
                  </span>

                  <h2>
                    {activeStep.title}
                  </h2>

                  <p>
                    {activeStep.description}
                  </p>
                </div>

                <motion.div
                  className={styles.visual}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 18,
                          scale: 0.94,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <span className={styles.visualHalo} />
                  <span className={styles.visualDots} />

                  <Image
                    src={activeStep.image}
                    alt={activeStep.imageAlt}
                    fill
                    priority={activeStep.id === "formacion-teorica"}
                    sizes="(max-width: 820px) 92vw, 48vw"
                    className={styles.processImage}
                  />
                </motion.div>

                <div className={styles.highlights}>
                  {activeStep.highlights.map((item) => (
                    <div
                      key={item.title}
                      className={styles.highlight}
                    >
                      <span className={styles.highlightIcon}>
                        <HighlightIcon type={item.icon} />
                      </span>

                      <div>
                        <strong>
                          {item.title}
                        </strong>

                        <p>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}