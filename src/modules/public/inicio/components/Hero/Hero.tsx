"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Car,
  Route,
  ShieldCheck,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "motion/react";

import styles from "./Hero.module.css";

const features = [
  {
    icon: BookOpen,
    title: "Formación integral",
    description:
      "Teoría y práctica dentro de un mismo proceso de formación.",
  },
  {
    icon: Car,
    title: "Acompañamiento experto",
    description:
      "Orientación profesional durante cada etapa de tu aprendizaje.",
  },
  {
    icon: Route,
    title: "Proceso a tu ritmo",
    description:
      "Una experiencia clara y organizada para avanzar con confianza.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad ante todo",
    description:
      "Hábitos responsables para desenvolverte mejor en la vía.",
  },
];

export function Hero() {
  const reduceMotion = useReducedMotion();

  const scrollToContent = () => {
    document
      .getElementById("inicio-contenido")
      ?.scrollIntoView({
        behavior: reduceMotion
          ? "auto"
          : "smooth",
        block: "start",
      });
  };

  return (
    <section
      className={styles.hero}
      aria-labelledby="home-hero-title"
    >
      {/* ======================================
          MEDIA
          ====================================== */}
      <div
        className={styles.media}
        aria-hidden="true"
      >
        <Image
          src="/assets/images/home/hero-driving-lesson.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 860px) 100vw, 62vw"
          className={styles.mediaImage}
        />

        <div className={styles.mediaBlend} />
        <div className={styles.mediaShade} />
        <div className={styles.mediaGlow} />
      </div>

      {/* ======================================
          CONTENT
          ====================================== */}
      <div className={styles.shell}>
        <motion.div
          className={styles.content}
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
            duration: 0.72,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowIcon}>
              <Route
                size={16}
                strokeWidth={1.7}
              />
            </span>

            <span>
              CENTRO DE ENSEÑANZA AUTOMOVILÍSTICA
            </span>
          </div>

          <h1
            id="home-hero-title"
            className={styles.title}
          >
            <span>Tramita tu </span>

            <strong>
              Licencia con nosotros.
            </strong>
          </h1>

          <div
            className={styles.accentLine}
            aria-hidden="true"
          />

          <p className={styles.description}>
            Formación completa para conductores responsables.
            Teoría, práctica y acompañamiento en cada etapa de
            tu proceso.
          </p>

          <div className={styles.actions}>
            <Link
              href="/cursos"
              className={styles.primaryAction}
            >
              <span>
                Conocer cursos
              </span>

              <ArrowUpRight
                size={17}
                strokeWidth={1.7}
              />
            </Link>

            <Link
              href="/proceso"
              className={styles.secondaryAction}
            >
              <span>
                Cómo funciona
              </span>

              <ArrowUpRight
                size={16}
                strokeWidth={1.6}
              />
            </Link>
          </div>
        </motion.div>

        <button
          type="button"
          className={styles.scrollCue}
          onClick={scrollToContent}
          aria-label="Ver siguiente sección"
        >
          <span>
            Explorar
          </span>

          <ArrowDown
            size={15}
            strokeWidth={1.6}
          />
        </button>
      </div>

      {/* ======================================
          FEATURES
          ====================================== */}
      <motion.div
        className={styles.featuresWrap}
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                y: 26,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.72,
          delay: 0.18,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className={styles.features}>
          {features.map(
            (feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  key={feature.title}
                  className={styles.feature}
                  initial={false}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          y: -4,
                        }
                  }
                  transition={{
                    duration: 0.26,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className={styles.featureIcon}>
                    <Icon
                      size={25}
                      strokeWidth={1.6}
                    />
                  </div>

                  <div className={styles.featureText}>
                    <strong>
                      {feature.title}
                    </strong>

                    <p>
                      {feature.description}
                    </p>
                  </div>

                  {index <
                    features.length - 1 && (
                    <span
                      className={styles.divider}
                      aria-hidden="true"
                    />
                  )}
                </motion.article>
              );
            }
          )}
        </div>
      </motion.div>
    </section>
  );
}