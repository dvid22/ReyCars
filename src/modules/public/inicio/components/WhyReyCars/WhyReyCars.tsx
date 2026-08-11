"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "motion/react";
import {
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./WhyReyCars.module.css";

type VideoKind =
  | "youtube"
  | "vimeo"
  | "direct"
  | "local"
  | "unknown";

type VideoSource = {
  kind: VideoKind;
  src: string;
};

const VIDEO_URL =
  "https://youtu.be/OAdRVr73Lu0?si=n1sbMcW5DCb9A_mJ";

/*
 * Puedes reemplazar VIDEO_URL por:
 *
 * YouTube:
 * https://www.youtube.com/watch?v=XXXXXXXXXXX
 * https://youtu.be/XXXXXXXXXXX
 *
 * Vimeo:
 * https://vimeo.com/123456789
 *
 * MP4/WebM directo:
 * https://tudominio.com/videos/reycars.mp4
 *
 * O dejar un archivo local:
 * /assets/videos/home/reycars-experience.mp4
 */

const benefits = [
  {
    icon: ShieldCheck,
    title: "Formación responsable",
    description:
      "Una experiencia enfocada en seguridad, criterio y confianza en la vía.",
  },
  {
    icon: Users,
    title: "Acompañamiento cercano",
    description:
      "Te guiamos durante cada etapa para que avances con claridad.",
  },
  {
    icon: CalendarDays,
    title: "Proceso organizado",
    description:
      "Una formación clara y práctica, pensada para acompañar tu ritmo.",
  },
];

function resolveVideoSource(
  rawUrl: string
): VideoSource {
  const url = rawUrl.trim();

  if (!url) {
    return {
      kind: "unknown",
      src: "",
    };
  }

  if (url.startsWith("/")) {
    return {
      kind: "local",
      src: url,
    };
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname
      .replace(/^www\./, "")
      .toLowerCase();

    if (
      host === "youtube.com" ||
      host === "m.youtube.com"
    ) {
      const videoId =
        parsed.searchParams.get("v");

      if (videoId) {
        return {
          kind: "youtube",
          src: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
        };
      }
    }

    if (host === "youtu.be") {
      const videoId =
        parsed.pathname
          .split("/")
          .filter(Boolean)[0];

      if (videoId) {
        return {
          kind: "youtube",
          src: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
        };
      }
    }

    if (
      host === "vimeo.com" ||
      host === "player.vimeo.com"
    ) {
      const parts =
        parsed.pathname
          .split("/")
          .filter(Boolean);

      const videoId =
        parts.find((part) =>
          /^\d+$/.test(part)
        );

      if (videoId) {
        return {
          kind: "vimeo",
          src: `https://player.vimeo.com/video/${videoId}`,
        };
      }
    }

    if (
      /\.(mp4|webm|ogg)(\?.*)?$/i.test(
        parsed.pathname + parsed.search
      )
    ) {
      return {
        kind: "direct",
        src: url,
      };
    }

    return {
      kind: "unknown",
      src: url,
    };
  } catch {
    return {
      kind: "unknown",
      src: url,
    };
  }
}

export function WhyReyCars() {
  const reduceMotion =
    useReducedMotion();

  const nativeVideoRef =
    useRef<HTMLVideoElement>(null);

  const [started, setStarted] =
    useState(false);

  const videoSource =
    useMemo(
      () =>
        resolveVideoSource(
          VIDEO_URL
        ),
      []
    );

  const isEmbed =
    videoSource.kind === "youtube" ||
    videoSource.kind === "vimeo";

  const isNativeVideo =
    videoSource.kind === "direct" ||
    videoSource.kind === "local";

  const playNativeVideo =
    async () => {
      const video =
        nativeVideoRef.current;

      if (!video) {
        return;
      }

      try {
        await video.play();
        setStarted(true);
      } catch {
        setStarted(false);
      }
    };

  return (
    <section
      className={styles.section}
      aria-labelledby="why-reycars-title"
    >
      <div className={styles.container}>
        {/* =========================================
            VIDEO
            ========================================= */}
        <motion.div
          className={styles.mediaColumn}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  x: -28,
                  y: 14,
                }
          }
          whileInView={{
            opacity: 1,
            x: 0,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.68,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className={styles.videoCard}>
            {isEmbed && (
              <iframe
                className={styles.embed}
                src={videoSource.src}
                title="Experiencia ReyCars"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}

            {isNativeVideo && (
              <video
                ref={nativeVideoRef}
                className={styles.video}
                src={videoSource.src}
                poster="/assets/images/nosotros/galeria-07.jpg"
                preload="metadata"
                playsInline
                controls={started}
                onPlay={() =>
                  setStarted(true)
                }
                onPause={() =>
                  setStarted(false)
                }
              />
            )}

            {!isEmbed &&
              !isNativeVideo && (
                <div
                  className={
                    styles.videoFallback
                  }
                >
                  <span>
                    Video ReyCars
                  </span>

                  <p>
                    Configura una URL de
                    YouTube, Vimeo o un
                    archivo MP4/WebM.
                  </p>
                </div>
              )}

            {isNativeVideo &&
              !started && (
                <motion.button
                  type="button"
                  className={
                    styles.playButton
                  }
                  onClick={
                    playNativeVideo
                  }
                  aria-label="Reproducir video de ReyCars"
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          scale: 1.05,
                        }
                  }
                  whileTap={
                    reduceMotion
                      ? undefined
                      : {
                          scale: 0.96,
                        }
                  }
                >
                  <Play
                    size={22}
                    strokeWidth={1.7}
                    fill="currentColor"
                  />
                </motion.button>
              )}

            {!started &&
              !isEmbed && (
                <div
                  className={
                    styles.videoCaption
                  }
                >
                  <span>
                    Experiencia ReyCars
                  </span>

                  <strong>
                    Formación en movimiento
                  </strong>
                </div>
              )}
          </div>

          <motion.div
            className={
              styles.mediaFloatingCard
            }
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 16,
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
              amount: 0.35,
            }}
            transition={{
              duration: 0.5,
              delay: 0.14,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span
              className={
                styles.mediaFloatingIcon
              }
            >
              <Sparkles
                size={18}
                strokeWidth={1.55}
              />
            </span>

            <div>
              <strong>
                Aprende haciendo
              </strong>

              <p>
                Teoría, práctica y
                acompañamiento en un
                mismo recorrido.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* =========================================
            CONTENT
            ========================================= */}
        <motion.div
          className={styles.content}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  x: 28,
                  y: 14,
                }
          }
          whileInView={{
            opacity: 1,
            x: 0,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.22,
          }}
          transition={{
            duration: 0.68,
            delay: 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className={styles.eyebrow}>
            ¿Por qué elegir ReyCars?
          </span>

          <h2 id="why-reycars-title">
            Formamos conductores
            <br />
            con{" "}
            <strong>
              responsabilidad.
            </strong>
          </h2>

          <p
            className={
              styles.description
            }
          >
            Más que un trámite,
            buscamos que cada
            estudiante avance con
            seguridad, confianza y
            claridad durante todo su
            proceso de formación.
          </p>

          <div
            className={
              styles.benefits
            }
          >
            {benefits.map(
              (
                benefit,
                index
              ) => {
                const Icon =
                  benefit.icon;

                return (
                  <motion.article
                    key={
                      benefit.title
                    }
                    className={
                      styles.benefit
                    }
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 16,
                          }
                    }
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.3,
                    }}
                    transition={{
                      duration: 0.44,
                      delay:
                        0.08 +
                        index *
                          0.07,
                      ease: [
                        0.16,
                        1,
                        0.3,
                        1,
                      ],
                    }}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            y: -3,
                          }
                    }
                  >
                    <span
                      className={
                        styles.benefitIcon
                      }
                    >
                      <Icon
                        size={19}
                        strokeWidth={1.55}
                      />
                    </span>

                    <div>
                      <strong>
                        {
                          benefit.title
                        }
                      </strong>

                      <p>
                        {
                          benefit.description
                        }
                      </p>
                    </div>
                  </motion.article>
                );
              }
            )}
          </div>

          <Link
            href="/nosotros"
            className={styles.cta}
          >
            <span>
              Conoce ReyCars
            </span>

            <ArrowRight
              size={16}
              strokeWidth={1.7}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}