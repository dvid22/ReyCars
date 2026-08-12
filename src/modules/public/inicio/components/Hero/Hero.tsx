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

import {
  useHomeContent,
} from "@/hooks/useHomeContent";

import styles from "./Hero.module.css";

const benefitIcons = [
  ShieldCheck,
  UsersRound,
  CalendarCheck2,
];

function renderHighlightedTitle(
  title: string,
  highlightedText: string
) {
  if (
    !highlightedText ||
    !title.includes(
      highlightedText
    )
  ) {
    return title;
  }

  const index =
    title.indexOf(
      highlightedText
    );

  return (
    <>
      <span>
        {title.slice(
          0,
          index
        )}
      </span>

      <strong>
        {highlightedText}
      </strong>

      <span>
        {title.slice(
          index +
            highlightedText.length
        )}
      </span>
    </>
  );
}

export function Hero() {
  const reduceMotion =
    useReducedMotion();

  const {
    content,
    isLoading,
  } =
    useHomeContent();

  const scrollToContent = () => {
    document
      .getElementById(
        "inicio-contenido"
      )
      ?.scrollIntoView({
        behavior:
          reduceMotion
            ? "auto"
            : "smooth",
        block: "start",
      });
  };

  if (
    isLoading ||
    !content
  ) {
    return null;
  }

  const hero =
    content.hero;

  return (
    <section
      className={
        styles.hero
      }
      aria-labelledby="home-hero-title"
    >
      <div
        className={
          styles.shell
        }
      >
        {/* ======================================
            CORPORATE COPY
            ====================================== */}
        <motion.div
          className={
            styles.content
          }
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
              styles.corporateShape
            }
            aria-hidden="true"
          />

          <div
            className={
              styles.eyebrow
            }
          >
            <span
              className={
                styles.eyebrowIcon
              }
            >
              <Route
                size={15}
                strokeWidth={1.7}
              />
            </span>

            <span>
              {hero.eyebrow}
            </span>
          </div>

          <span
            className={
              styles.topAccent
            }
            aria-hidden="true"
          />

          <h1
            id="home-hero-title"
            className={
              styles.title
            }
          >
            {renderHighlightedTitle(
              hero.title,
              hero.highlightedText
            )}
          </h1>

          <p
            className={
              styles.description
            }
          >
            {hero.description}
          </p>

          <div
            className={
              styles.corporatePoints
            }
          >
            {hero.benefits.map(
              (
                point,
                index
              ) => {
                const Icon =
                  benefitIcons[
                    index %
                      benefitIcons.length
                  ];

                return (
                  <motion.div
                    key={`${index}-${point.title}`}
                    className={
                      styles.corporatePoint
                    }
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
                      delay:
                        0.14 +
                        index *
                          0.07,
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
                        styles.pointIcon
                      }
                    >
                      <Icon
                        size={16}
                        strokeWidth={
                          1.65
                        }
                      />
                    </span>

                    <div>
                      <strong>
                        {
                          point.title
                        }
                      </strong>

                      <p>
                        {
                          point.description
                        }
                      </p>
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>

          <div
            className={
              styles.actions
            }
          >
            <Link
              href="/servicios"
              className={
                styles.primaryAction
              }
            >
              <span>
                {
                  hero.primaryCtaLabel
                }
              </span>

              <ArrowUpRight
                size={16}
                strokeWidth={1.7}
              />
            </Link>

            <Link
              href="/proceso"
              className={
                styles.secondaryAction
              }
            >
              <span>
                {
                  hero.secondaryCtaLabel
                }
              </span>

              <ArrowUpRight
                size={15}
                strokeWidth={1.6}
              />
            </Link>
          </div>

          <div
            className={
              styles.location
            }
          >
            <span
              className={
                styles.locationIcon
              }
            >
              <MapPin
                size={17}
                strokeWidth={1.6}
              />
            </span>

            <div>
              <strong>
                UBATÉ · COLOMBIA
              </strong>

              <span>
                Centro de Enseñanza
                Automovilística ReyCars
              </span>
            </div>
          </div>

          <button
            type="button"
            className={
              styles.scrollCue
            }
            onClick={
              scrollToContent
            }
            aria-label="Ver siguiente sección"
          >
            <span>
              Explorar
            </span>

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
          className={
            styles.media
          }
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
              styles.mediaEdge
            }
            aria-hidden="true"
          />

          <div
            className={
              styles.mediaInner
            }
          >
            <Image
              src={
                hero.heroImageUrl
              }
              alt="Sede del Centro de Enseñanza Automovilística ReyCars en Ubaté"
              fill
              priority
              sizes="(max-width: 860px) 100vw, 60vw"
              className={
                styles.mediaImage
              }
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}