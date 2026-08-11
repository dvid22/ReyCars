"use client";

import Image from "next/image";
import {
  ChevronRight,
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

import { useProcessContent } from "@/hooks/useProcessContent";
import {
  ProcessIconGlyph,
} from "@/components/process/ProcessIcon";

import styles from "./ProcesoPage.module.css";

function renderHighlightedTitle(
  title: string,
  highlighted: string
) {
  if (!highlighted || !title.includes(highlighted)) {
    return title;
  }

  const index = title.indexOf(highlighted);

  return (
    <>
      {title.slice(0, index)}
      <strong>{highlighted}</strong>
      {title.slice(index + highlighted.length)}
    </>
  );
}

export function ProcesoPage() {
  const reduceMotion = useReducedMotion();
  const { content, isLoading } =
    useProcessContent();

  const visibleSteps = useMemo(
    () =>
      content?.steps.filter(
        (step) => step.active
      ) ?? [],
    [content]
  );

  const [activeId, setActiveId] =
    useState("");

  useEffect(() => {
    if (visibleSteps.length === 0) {
      setActiveId("");
      return;
    }

    if (
      !visibleSteps.some(
        (step) => step.id === activeId
      )
    ) {
      setActiveId(visibleSteps[0].id);
    }
  }, [visibleSteps, activeId]);

  const activeStep = useMemo(
    () =>
      visibleSteps.find(
        (step) => step.id === activeId
      ) ?? visibleSteps[0],
    [visibleSteps, activeId]
  );

  if (isLoading || !content || !activeStep) {
    return null;
  }

  const activeIndex =
    visibleSteps.findIndex(
      (step) => step.id === activeStep.id
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
            <span className={styles.eyebrow}>
              {content.eyebrow}
            </span>

            <h1>
              {renderHighlightedTitle(
                content.title,
                content.highlightedText
              )}
            </h1>

            <p>{content.description}</p>
          </div>

          <div className={styles.mobileProgress}>
            <span>
              {activeStep.number} /{" "}
              {String(visibleSteps.length).padStart(2, "0")}
            </span>

            <div>
              <i
                style={{
                  width: `${
                    ((activeIndex + 1) /
                      visibleSteps.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </header>

        <div className={styles.layout}>
          <aside className={styles.selector}>
            <span className={styles.selectorTitle}>
              {content.selectorTitle}
            </span>

            <div className={styles.steps}>
              {visibleSteps.map((step) => {
                const active =
                  step.id === activeId;

                return (
                  <button
                    type="button"
                    key={step.id}
                    className={`${styles.stepButton} ${
                      active
                        ? styles.stepButtonActive
                        : ""
                    }`}
                    onClick={() =>
                      setActiveId(step.id)
                    }
                    aria-pressed={active}
                  >
                    <span className={styles.stepIcon}>
                      <ProcessIconGlyph
                        type={step.icon}
                        size={20}
                        strokeWidth={1.65}
                      />
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

                  <h2>{activeStep.title}</h2>
                  <p>{activeStep.description}</p>
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

                  {activeStep.imageUrl ? (
                    <Image
                      src={activeStep.imageUrl}
                      alt={activeStep.imageAlt}
                      fill
                      priority={activeIndex === 0}
                      sizes="(max-width: 820px) 92vw, 48vw"
                      className={styles.processImage}
                    />
                  ) : null}
                </motion.div>

                <div className={styles.highlights}>
                  {activeStep.highlights.map(
                    (item, index) => (
                      <div
                        key={`${item.title}-${index}`}
                        className={styles.highlight}
                      >
                        <span
                          className={
                            styles.highlightIcon
                          }
                        >
                          <ProcessIconGlyph
                            type={item.icon}
                            size={19}
                            strokeWidth={1.65}
                          />
                        </span>

                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}