"use client";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import { Hero } from "./components/Hero/Hero";
import { CoursesPreview } from "./components/CoursesPreview/CoursesPreview";
import { ProcessPreview } from "./components/ProcessPreview/ProcessPreview";
import { FAQ } from "./components/FAQ/FAQ";
import { HomeCTA } from "./components/HomeCTA/HomeCTA";

import styles from "./InicioPage.module.css";

const revealTransition = {
  duration: 0.76,
  ease: [0.16, 1, 0.3, 1] as const,
};

export function InicioPage() {
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion
    ? {}
    : {
        initial: {
          opacity: 0,
          y: 36,
          scale: 0.994,
        },
        whileInView: {
          opacity: 1,
          y: 0,
          scale: 1,
        },
        viewport: {
          once: true,
          amount: 0.08,
          margin: "0px 0px -8% 0px",
        },
        transition: revealTransition,
      };

  return (
    <main className={styles.page}>
      <Hero />

      <div
        id="inicio-contenido"
        className={styles.contentAnchor}
        aria-hidden="true"
      />

      <div className={styles.sections}>
        <motion.div
          className={`${styles.sectionReveal} ${styles.coursesReveal}`}
          {...reveal}
        >
          <CoursesPreview />
        </motion.div>

        <motion.div
          className={`${styles.sectionReveal} ${styles.processReveal}`}
          {...reveal}
          transition={
            reduceMotion
              ? undefined
              : {
                  ...revealTransition,
                  delay: 0.03,
                }
          }
        >
          <ProcessPreview />
        </motion.div>

        <motion.div
          className={`${styles.sectionReveal} ${styles.faqReveal}`}
          {...reveal}
        >
          <FAQ />
        </motion.div>

        <motion.div
          className={`${styles.sectionReveal} ${styles.ctaReveal}`}
          {...reveal}
          transition={
            reduceMotion
              ? undefined
              : {
                  ...revealTransition,
                  duration: 0.8,
                }
          }
        >
          <HomeCTA />
        </motion.div>
      </div>
    </main>
  );
}