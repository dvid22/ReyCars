"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Car,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  IdCard,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "motion/react";

import styles from "./ProcessPreview.module.css";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Inicia tu proceso",
    description:
      "Elige tu curso y comienza tu recorrido con ReyCars.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Formación teórica",
    description:
      "Aprende los conceptos necesarios para comprender la vía.",
  },
  {
    number: "03",
    icon: Car,
    title: "Prácticas de conducción",
    description:
      "Desarrolla experiencia y confianza con acompañamiento.",
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "Evaluación",
    description:
      "Completa las etapas requeridas dentro de tu proceso.",
  },
  {
    number: "05",
    icon: IdCard,
    title: "Completa tu recorrido",
    description:
      "Finaliza tu formación y continúa con el trámite correspondiente.",
  },
];

export function ProcessPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={styles.section}
      aria-labelledby="process-preview-title"
    >
      <div className={styles.backgroundGlow} aria-hidden="true" />

      <div className={styles.container}>
        <motion.div
          className={styles.heading}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  x: -28,
                  y: 12,
                }
          }
          whileInView={{
            opacity: 1,
            x: 0,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.28,
          }}
          transition={{
            duration: 0.62,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className={styles.eyebrow}>
            Así es tu proceso
          </span>

          <h2 id="process-preview-title">
            De tu inscripción
            <br />
            a tu licencia,
            <strong> paso a paso.</strong>
          </h2>

          <p>
            Un recorrido claro, organizado y acompañado para que
            sepas qué sigue en cada etapa.
          </p>

          <Link
            href="/proceso"
            className={styles.cta}
          >
            <span>
              Conocer el proceso
            </span>

            <ArrowRight
              size={16}
              strokeWidth={1.7}
            />
          </Link>
        </motion.div>

        <div className={styles.timelineWrap}>
          <div
            className={styles.timelineLine}
            aria-hidden="true"
          />

          <div className={styles.steps}>
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.number}
                  className={styles.step}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 28,
                          scale: 0.97,
                        }
                  }
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.28,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          y: -7,
                        }
                  }
                >
                  <motion.span
                    className={styles.stepNumber}
                    initial={false}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            scale: 1.08,
                          }
                    }
                  >
                    {step.number}
                  </motion.span>

                  <span className={styles.stepIcon}>
                    <Icon
                      size={23}
                      strokeWidth={1.55}
                    />
                  </span>

                  <div className={styles.stepContent}>
                    <h3>
                      {step.title}
                    </h3>

                    <p>
                      {step.description}
                    </p>
                  </div>

                  {index === steps.length - 1 && (
                    <span
                      className={styles.finishMark}
                      aria-hidden="true"
                    >
                      <CheckCircle2
                        size={17}
                        strokeWidth={1.7}
                      />
                    </span>
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}