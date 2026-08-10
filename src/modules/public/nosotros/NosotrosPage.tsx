"use client";

import Image from "next/image";
import {
  ChevronDown,
  Heart,
  ShieldCheck,
  Sparkles,
  Target,
  ThumbsUp,
  Users,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useState } from "react";

import styles from "./NosotrosPage.module.css";

type StoryId = "esencia" | "mision" | "vision";

type StoryItem = {
  id: StoryId;
  number: string;
  title: string;
  description: string;
  icon: "sparkles" | "target" | "vision";
};

const storyItems: StoryItem[] = [
  {
    id: "esencia",
    number: "01",
    title: "Nuestra esencia",
    description:
      "Impulsamos una formación vial cercana, responsable y enfocada en acompañar a cada estudiante durante su proceso de aprendizaje.",
    icon: "sparkles",
  },
  {
    id: "mision",
    number: "02",
    title: "Nuestra misión",
    description:
      "Formar conductores conscientes, seguros y preparados para desenvolverse con responsabilidad en la vía.",
    icon: "target",
  },
  {
    id: "vision",
    number: "03",
    title: "Nuestra visión",
    description:
      "Continuar fortaleciendo una experiencia de formación confiable, moderna y cercana para quienes eligen ReyCars.",
    icon: "vision",
  },
];

const highlights = [
  { icon: ShieldCheck, title: "Formación responsable" },
  { icon: Users, title: "Acompañamiento cercano" },
  { icon: Sparkles, title: "Metodología clara" },
  { icon: Heart, title: "Confianza en cada paso" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Seguridad",
    description:
      "Promovemos hábitos responsables para una mejor experiencia en la vía.",
  },
  {
    icon: Users,
    title: "Acompañamiento",
    description:
      "Guiamos cada etapa del proceso de formación con cercanía y claridad.",
  },
  {
    icon: ThumbsUp,
    title: "Confianza",
    description:
      "Buscamos que cada estudiante avance con mayor seguridad y tranquilidad.",
  },
  {
    icon: Heart,
    title: "Responsabilidad",
    description:
      "Formamos conductores conscientes del entorno y de sus decisiones.",
  },
];

function StoryIcon({
  type,
  size = 25,
}: {
  type: StoryItem["icon"];
  size?: number;
}) {
  if (type === "target") {
    return <Target size={size} strokeWidth={1.6} />;
  }

  if (type === "vision") {
    return <Sparkles size={size} strokeWidth={1.6} />;
  }

  return <Sparkles size={size} strokeWidth={1.6} />;
}

export function NosotrosPage() {
  const reduceMotion = useReducedMotion();
  const [openMobile, setOpenMobile] =
    useState<StoryId>("esencia");

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        {/* =====================================================
            HERO
            ===================================================== */}
        <div className={styles.hero}>
          <motion.div
            className={styles.heroCopy}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 22,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.62,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className={styles.eyebrow}>
              Nosotros
            </span>

            <h1>
              Formamos
              <br />
              conductores,
              <br />
              creamos{" "}
              <strong>
                caminos
                <br className={styles.titleBreak} />
                más seguros.
              </strong>
            </h1>

            <span
              className={styles.accentLine}
              aria-hidden="true"
            />

            <p className={styles.heroDescription}>
              En ReyCars creemos que conducir es mucho más
              que desplazarse de un lugar a otro. Por eso,
              acompañamos cada etapa del proceso con una
              formación clara, responsable y cercana.
            </p>
          </motion.div>

          <motion.div
            className={styles.heroVisual}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 34,
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.72,
              delay: 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div
              className={styles.diagonalAccent}
              aria-hidden="true"
            />

            <span
              className={styles.visualDots}
              aria-hidden="true"
            />

            <div className={styles.imageFrame}>
              <Image
                src="/assets/images/nosotros/nosotros-principal.png"
                alt="Instructor acompañando a estudiantes de ReyCars"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 58vw"
                className={styles.heroImage}
              />
            </div>
          </motion.div>

          <div className={styles.heroHighlights}>
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={styles.heroHighlight}
                  >
                    <span>
                      <Icon
                        size={21}
                        strokeWidth={1.65}
                      />
                    </span>

                    <strong>
                      {item.title}
                    </strong>
                  </div>
                );
              })}
            </div>
        </div>

        {/* =====================================================
            HISTORIA / MISIÓN / VISIÓN
            ===================================================== */}
        <div className={styles.storyDesktop}>
          {storyItems.map((item) => (
            <article
              key={item.id}
              className={styles.storyCard}
            >
              <span className={styles.storyNumber}>
                {item.number}
              </span>

              <div className={styles.storyBody}>
                <span className={styles.storyIcon}>
                  <StoryIcon type={item.icon} />
                </span>

                <div>
                  <h2>{item.title}</h2>

                  <span
                    className={styles.storyLine}
                    aria-hidden="true"
                  />

                  <p>{item.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* =====================================================
            MOBILE STORY
            ===================================================== */}
        <div className={styles.storyMobile}>
          {storyItems.map((item) => {
            const open = openMobile === item.id;

            return (
              <article
                key={item.id}
                className={`${styles.mobileStoryItem} ${
                  open ? styles.mobileStoryItemOpen : ""
                }`}
              >
                <button
                  type="button"
                  className={styles.mobileStoryButton}
                  onClick={() => setOpenMobile(item.id)}
                  aria-expanded={open}
                >
                  <span className={styles.mobileStoryIcon}>
                    <StoryIcon
                      type={item.icon}
                      size={20}
                    />
                  </span>

                  <span className={styles.mobileStoryNumber}>
                    {item.number}
                  </span>

                  <strong>{item.title}</strong>

                  <ChevronDown
                    size={17}
                    strokeWidth={1.7}
                    className={styles.mobileStoryChevron}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      className={styles.mobileStoryContent}
                      initial={
                        reduceMotion
                          ? false
                          : {
                              height: 0,
                              opacity: 0,
                            }
                      }
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={
                        reduceMotion
                          ? undefined
                          : {
                              height: 0,
                              opacity: 0,
                            }
                      }
                      transition={{
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <p>{item.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>

        {/* =====================================================
            VALUES
            ===================================================== */}
        <div className={styles.values}>
          {values.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className={styles.valueItem}
              >
                <span className={styles.valueIcon}>
                  <Icon
                    size={22}
                    strokeWidth={1.6}
                  />
                </span>

                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}