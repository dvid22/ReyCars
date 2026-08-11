"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "motion/react";

import { useHomeContent } from "@/hooks/useHomeContent";
import { useProcessContent } from "@/hooks/useProcessContent";
import {
  ProcessIconGlyph,
} from "@/components/process/ProcessIcon";

import styles from "./ProcessPreview.module.css";

function renderHighlightedTitle(
  title: string,
  highlighted: string
) {
  if (
    !highlighted ||
    !title.includes(highlighted)
  ) {
    return title;
  }

  const index =
    title.indexOf(highlighted);

  return (
    <>
      {title.slice(0, index)}
      <strong>{highlighted}</strong>
      {title.slice(
        index + highlighted.length
      )}
    </>
  );
}

export function ProcessPreview() {
  const reduceMotion =
    useReducedMotion();

  const {
    content: homeContent,
    isLoading: homeLoading,
  } = useHomeContent();

  const {
    content: processContent,
    isLoading: processLoading,
  } = useProcessContent();

  if (
    homeLoading ||
    processLoading ||
    !homeContent ||
    !processContent
  ) {
    return null;
  }

  const sectionContent =
    homeContent.processSection;

  const steps =
    processContent.steps
      .filter((step) => step.active);

  if (steps.length === 0) {
    return null;
  }

  return (
    <section
      className={styles.section}
      aria-labelledby="process-preview-title"
    >
      <div
        className={styles.backgroundGlow}
        aria-hidden="true"
      />

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
            {sectionContent.eyebrow}
          </span>

          <h2 id="process-preview-title">
            {renderHighlightedTitle(
              sectionContent.title,
              sectionContent.highlightedText
            )}
          </h2>

          <p>
            {sectionContent.description}
          </p>

          <Link
            href="/proceso"
            className={styles.cta}
          >
            <span>
              {sectionContent.ctaLabel ||
                "Conocer el proceso"}
            </span>

            <ArrowRight
              size={16}
              strokeWidth={1.7}
            />
          </Link>
        </motion.div>

        <div
          className={`${styles.timelineWrap} ${
            steps.length > 5
              ? styles.timelineDense
              : ""
          }`}
        >
          <div
            className={styles.timelineLine}
            aria-hidden="true"
          />

          <div className={styles.steps}>
            {steps.map((step, index) => (
              <motion.article
                key={step.id}
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
                    : { y: -7 }
                }
              >
                <motion.span
                  className={styles.stepNumber}
                  initial={false}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { scale: 1.08 }
                  }
                >
                  {step.number}
                </motion.span>

                <span className={styles.stepIcon}>
                  <ProcessIconGlyph
                    type={step.icon}
                    size={23}
                    strokeWidth={1.55}
                  />
                </span>

                <div className={styles.stepContent}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>

                {index ===
                steps.length - 1 ? (
                  <span
                    className={styles.finishMark}
                    aria-hidden="true"
                  >
                    <CheckCircle2
                      size={17}
                      strokeWidth={1.7}
                    />
                  </span>
                ) : null}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}