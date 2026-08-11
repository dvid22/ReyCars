"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarCheck2,
  MapPin,
  Route,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "motion/react";

import styles from "./Hero.module.css";

const corporatePoints = [
  {
    icon: ShieldCheck,
    title: "Formación responsable",
    description: "Aprende con una metodología clara y enfocada en la seguridad.",
  },
  {
    icon: UsersRound,
    title: "Acompañamiento cercano",
    description: "Te guiamos durante cada etapa de tu proceso.",
  },
  {
    icon: CalendarCheck2,
    title: "Proceso claro y organizado",
    description: "Una ruta de formación pensada para avanzar con confianza.",
  },
];

export function Hero() {
  const reduceMotion = useReducedMotion();

  const scrollToContent = () => {
    document
      .getElementById("inicio-contenido")
      ?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
  };

  return (
    <section
      className={styles.hero}
      aria-labelledby="home-hero-title"
    >
      <div className={styles.shell}>
        {/* ======================================
            CORPORATE COPY
            ====================================== */}
        <motion.div
          className={styles.content}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 20,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div
            className={styles.corporateShape}
            aria-hidden="true"
          />

          <div className={styles.eyebrow}>
            <span className={styles.eyebrowIcon}>
              <Route
                size={15}
                strokeWidth={1.7}
              />
            </span>

            <span>
              CENTRO DE ENSEÑANZA AUTOMOVILÍSTICA
            </span>
          </div>

          <span
            className={styles.topAccent}
            aria-hidden="true"
          />

          <h1
            id="home-hero-title"
            className={styles.title}
          >
            <span>Tramita tu </span>
            <strong>Licencia</strong>
            <span> con nosotros.</span>
          </h1>

          <p className={styles.description}>
            Formación completa para conductores responsables.
            Teoría, práctica y acompañamiento en cada etapa de
            tu proceso.
          </p>

          <div className={styles.corporatePoints}>
            {corporatePoints.map((point, index) => {
              const Icon = point.icon;

              return (
                <motion.div
                  key={point.title}
                  className={styles.corporatePoint}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          x: -12,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.42,
                    delay: 0.14 + index * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <span className={styles.pointIcon}>
                    <Icon
                      size={16}
                      strokeWidth={1.65}
                    />
                  </span>

                  <div>
                    <strong>{point.title}</strong>
                    <p>{point.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className={styles.actions}>
            <Link
              href="/cursos"
              className={styles.primaryAction}
            >
              <span>Conocer cursos</span>

              <ArrowUpRight
                size={16}
                strokeWidth={1.7}
              />
            </Link>

            <Link
              href="/proceso"
              className={styles.secondaryAction}
            >
              <span>Cómo funciona</span>

              <ArrowUpRight
                size={15}
                strokeWidth={1.6}
              />
            </Link>
          </div>

          <div className={styles.location}>
            <span className={styles.locationIcon}>
              <MapPin
                size={17}
                strokeWidth={1.6}
              />
            </span>

            <div>
              <strong>UBATÉ · COLOMBIA</strong>
              <span>
                Centro de Enseñanza Automovilística ReyCars
              </span>
            </div>
          </div>

          <button
            type="button"
            className={styles.scrollCue}
            onClick={scrollToContent}
            aria-label="Ver siguiente sección"
          >
            <span>Explorar</span>

            <ArrowDown
              size={14}
              strokeWidth={1.6}
            />
          </button>
        </motion.div>

        {/* ======================================
            MEDIA
            ====================================== */}
        <motion.div
          className={styles.media}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  x: 28,
                }
          }
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div
            className={styles.mediaEdge}
            aria-hidden="true"
          />

          <div className={styles.mediaInner}>
            <Image
              src="/assets/images/home/hero-driving-lesson.jpg"
              alt="Sede del Centro de Enseñanza Automovilística ReyCars en Ubaté"
              fill
              priority
              sizes="(max-width: 860px) 100vw, 60vw"
              className={styles.mediaImage}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}