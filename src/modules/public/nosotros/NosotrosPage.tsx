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
import { useEffect, useState } from "react";

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


const teamMembers = [
  {
    id: "instructor-01",
    name: "Carlos Ramírez",
    role: "Instructor de conducción",
    description:
      "Acompañamiento práctico con claridad, paciencia y enfoque responsable.",
    image: "/assets/images/equipo/instructor-01.png",
  },
  {
    id: "instructor-02",
    name: "Mariana López",
    role: "Coordinación académica",
    description:
      "Organización y acompañamiento durante cada etapa del proceso de formación.",
    image: "/assets/images/equipo/instructor-02.png",
  },
  {
    id: "instructor-03",
    name: "Valentina Torres",
    role: "Atención al estudiante",
    description:
      "Orientación cercana para resolver dudas y acompañar el recorrido del estudiante.",
    image: "/assets/images/equipo/instructor-03.png",
  },
  {
    id: "instructor-04",
    name: "Andrés Mejía",
    role: "Acompañamiento práctico",
    description:
      "Guía en la experiencia de conducción con atención y responsabilidad.",
    image: "/assets/images/equipo/instructor-04.png",
  },
];


type GalleryAlbum = {
  id: string;
  title: string;
  description: string;
  images: string[];
};

const galleryAlbums: GalleryAlbum[] = [
  {
    id: "en-ruta",
    title: "En ruta",
    description:
      "Práctica real para ganar confianza y seguridad detrás del volante.",
    images: [
      "/assets/images/nosotros/galeria-01.jpg",
      "/assets/images/nosotros/galeria-06.jpg",
    ],
  },
  {
    id: "formacion",
    title: "Formación",
    description:
      "Aprendizaje teórico claro para comprender la vía y tomar mejores decisiones.",
    images: [
      "/assets/images/nosotros/galeria-02.jpg",
    ],
  },
  {
    id: "practica",
    title: "Práctica",
    description:
      "Acompañamiento cercano para convertir la teoría en experiencia.",
    images: [
      "/assets/images/nosotros/galeria-03.jpg",
    ],
  },
  {
    id: "nuestra-sede",
    title: "Nuestra sede",
    description:
      "Un espacio preparado para recibir, orientar y acompañar cada proceso.",
    images: [
      "/assets/images/nosotros/galeria-04.jpg",
    ],
  },
  {
    id: "vehiculos",
    title: "Vehículos",
    description:
      "Herramientas de formación que hacen parte del aprendizaje práctico.",
    images: [
      "/assets/images/nosotros/galeria-05.jpg",
    ],
  },
  {
    id: "en-practica",
    title: "En práctica",
    description:
      "Cada clase suma experiencia, control y confianza para avanzar.",
    images: [
      "/assets/images/nosotros/galeria-06.jpg",
    ],
  },
  {
    id: "experiencia-reycars",
    title: "Experiencia ReyCars",
    description:
      "Momentos que reflejan cercanía, aprendizaje y acompañamiento.",
    images: [
      "/assets/images/nosotros/galeria-07.jpg",
    ],
  },
];

type GalleryFrame = {
  albumIndex: number;
  imageIndex: number;
  album: GalleryAlbum;
  image: string;
};

const galleryFrames: GalleryFrame[] = galleryAlbums.flatMap(
  (album, albumIndex) =>
    album.images.map((image, imageIndex) => ({
      albumIndex,
      imageIndex,
      album,
      image,
    }))
);

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

  const [galleryFrameIndex, setGalleryFrameIndex] =
    useState(0);

  const [galleryPaused, setGalleryPaused] =
    useState(false);

  const [activeGallery, setActiveGallery] =
    useState<{
      albumIndex: number;
      imageIndex: number;
    } | null>(null);

  const activeFrame =
    galleryFrames[galleryFrameIndex] ?? galleryFrames[0];

  const activeGalleryAlbum =
    activeGallery === null
      ? null
      : galleryAlbums[activeGallery.albumIndex] ?? null;

  const activeGalleryImage =
    activeGalleryAlbum && activeGallery
      ? activeGalleryAlbum.images[activeGallery.imageIndex] ?? null
      : null;

  useEffect(() => {
    if (
      reduceMotion ||
      galleryPaused ||
      activeGallery ||
      galleryFrames.length <= 1
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setGalleryFrameIndex(
        (current) => (current + 1) % galleryFrames.length
      );
    }, 4800);

    return () => window.clearInterval(interval);
  }, [activeGallery, galleryPaused, reduceMotion]);

  const selectGalleryAlbum = (albumIndex: number) => {
    const targetIndex = galleryFrames.findIndex(
      (frame) => frame.albumIndex === albumIndex
    );

    if (targetIndex >= 0) {
      setGalleryFrameIndex(targetIndex);
    }
  };

  const showPreviousGalleryFrame = () => {
    setGalleryFrameIndex(
      (current) =>
        (current - 1 + galleryFrames.length) %
        galleryFrames.length
    );
  };

  const showNextGalleryFrame = () => {
    setGalleryFrameIndex(
      (current) => (current + 1) % galleryFrames.length
    );
  };

  const openGalleryItem = (
    albumIndex: number,
    imageIndex = 0
  ) => {
    setActiveGallery({
      albumIndex,
      imageIndex,
    });
  };

  const closeGallery = () => {
    setActiveGallery(null);
  };

  const showPreviousGalleryItem = () => {
    setActiveGallery((current) => {
      if (current === null) {
        return current;
      }

      const currentFrameIndex = galleryFrames.findIndex(
        (frame) =>
          frame.albumIndex === current.albumIndex &&
          frame.imageIndex === current.imageIndex
      );

      const previousFrame =
        galleryFrames[
          (currentFrameIndex - 1 + galleryFrames.length) %
            galleryFrames.length
        ];

      return {
        albumIndex: previousFrame.albumIndex,
        imageIndex: previousFrame.imageIndex,
      };
    });
  };

  const showNextGalleryItem = () => {
    setActiveGallery((current) => {
      if (current === null) {
        return current;
      }

      const currentFrameIndex = galleryFrames.findIndex(
        (frame) =>
          frame.albumIndex === current.albumIndex &&
          frame.imageIndex === current.imageIndex
      );

      const nextFrame =
        galleryFrames[
          (currentFrameIndex + 1) % galleryFrames.length
        ];

      return {
        albumIndex: nextFrame.albumIndex,
        imageIndex: nextFrame.imageIndex,
      };
    });
  };

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
          {storyItems.map((item, index) => (
            <motion.article
              key={item.id}
              className={styles.storyCard}
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 28,
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 0.56,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
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
            </motion.article>
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
            NUESTRO EQUIPO
            ===================================================== */}
        <section
          className={styles.teamSection}
          aria-labelledby="nosotros-team-title"
        >
          <motion.div
            className={styles.teamHeading}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 26,
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
              duration: 0.58,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div>
              <span className={styles.teamEyebrow}>
                Nuestro equipo
              </span>

              <h2 id="nosotros-team-title">
                Personas que acompañan
                <strong> tu recorrido.</strong>
              </h2>
            </div>

            <p>
              Un equipo cercano que orienta y acompaña cada etapa de tu
              proceso de formación en ReyCars.
            </p>
          </motion.div>

          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <motion.article
                key={member.id}
                className={styles.teamProfile}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 20,
                      }
                }
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.25,
                }}
                transition={{
                  duration: 0.48,
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className={styles.teamPhotoRing}>
                  <div className={styles.teamPhoto}>
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 900px) 42vw, 16vw"
                      className={styles.teamPhotoMedia}
                    />
                  </div>
                </div>

                <div className={styles.teamProfileCopy}>
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                  <p>{member.description}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            className={styles.teamStatement}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    scale: 0.97,
                    y: 18,
                  }
            }
            whileInView={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.52,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span aria-hidden="true">“</span>
            <p>
              Acompañamos cada proceso con cercanía, claridad y
              responsabilidad.
            </p>
            <i aria-hidden="true" />
          </motion.div>
        </section>

        {/* =====================================================
            GALERÍA REYCARS · ÁLBUM DINÁMICO
            ===================================================== */}
        <section
          className={styles.gallerySection}
          aria-labelledby="nosotros-gallery-title"
        >
          <motion.div
            className={styles.galleryHeading}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 28,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.62,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div>
              <span className={styles.galleryEyebrow}>
                Conoce ReyCars
              </span>

              <h2 id="nosotros-gallery-title">
                Un vistazo a
                <strong> nuestro día a día.</strong>
              </h2>

              <p>
                Espacios, vehículos y momentos que hacen parte del
                proceso de formación de nuestros estudiantes.
              </p>
            </div>

            <button
              type="button"
              className={styles.galleryOpenButton}
              onClick={() =>
                openGalleryItem(
                  activeFrame.albumIndex,
                  activeFrame.imageIndex
                )
              }
            >
              <span>Ver galería</span>
              <i aria-hidden="true">↗</i>
            </button>
          </motion.div>

          <div
            className={styles.galleryExperience}
            onMouseEnter={() => setGalleryPaused(true)}
            onMouseLeave={() => setGalleryPaused(false)}
          >
            {/* Álbum / mosaico */}
            <motion.div
              className={styles.galleryAlbum}
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x: -24,
                    }
              }
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.18,
              }}
              transition={{
                duration: 0.62,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className={styles.galleryAlbumBoard}>
                {galleryAlbums.map((album, albumIndex) => {
                  const selected =
                    activeFrame.albumIndex === albumIndex;

                  return (
                    <motion.button
                      key={album.id}
                      type="button"
                      className={`${styles.galleryAlbumTile} ${
                        selected
                          ? styles.galleryAlbumTileActive
                          : ""
                      }`}
                      onClick={() =>
                        selectGalleryAlbum(albumIndex)
                      }
                      animate={
                        reduceMotion
                          ? undefined
                          : {
                              rotate:
                                albumIndex % 3 === 0
                                  ? -1.6
                                  : albumIndex % 3 === 1
                                    ? 1.25
                                    : -0.45,
                              scale: selected ? 1.035 : 1,
                              y: selected ? -3 : 0,
                            }
                      }
                      whileHover={
                        reduceMotion
                          ? undefined
                          : {
                              y: -5,
                              scale: selected ? 1.045 : 1.025,
                            }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 26,
                      }}
                      aria-label={`Mostrar ${album.title}`}
                    >
                      <Image
                        src={album.images[0]}
                        alt={album.title}
                        fill
                        sizes="(max-width: 900px) 28vw, 12vw"
                        className={styles.galleryAlbumImage}
                      />

                      <span
                        className={styles.galleryAlbumShade}
                        aria-hidden="true"
                      />

                      <span className={styles.galleryAlbumLabel}>
                        {album.title}
                      </span>

                      {selected && (
                        <motion.span
                          className={styles.galleryAlbumFocus}
                          layoutId="gallery-active-ring"
                          transition={{
                            type: "spring",
                            stiffness: 360,
                            damping: 32,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className={styles.galleryAlbumControls}>
                <button
                  type="button"
                  onClick={showPreviousGalleryFrame}
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>

                <div className={styles.galleryAlbumDots}>
                  {galleryFrames.map((frame, index) => (
                    <button
                      key={`${frame.album.id}-${frame.imageIndex}`}
                      type="button"
                      className={
                        index === galleryFrameIndex
                          ? styles.galleryAlbumDotActive
                          : ""
                      }
                      onClick={() => setGalleryFrameIndex(index)}
                      aria-label={`Ir a imagen ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={showNextGalleryFrame}
                  aria-label="Imagen siguiente"
                >
                  ›
                </button>
              </div>

              <span className={styles.galleryAutoNote}>
                <i aria-hidden="true">↻</i>
                La galería se actualiza automáticamente
              </span>
            </motion.div>

            {/* Imagen protagonista */}
            <motion.div
              className={styles.galleryStage}
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x: 28,
                    }
              }
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.18,
              }}
              transition={{
                duration: 0.68,
                delay: 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className={styles.galleryFeatureCard}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${activeFrame.album.id}-${activeFrame.imageIndex}`}
                    className={styles.galleryFeatureMedia}
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            x: 70,
                            y: 18,
                            scale: 0.93,
                            rotate: 1.1,
                            filter: "blur(5px)",
                          }
                    }
                    animate={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      scale: 1,
                      rotate: 0,
                      filter: "blur(0px)",
                    }}
                    exit={
                      reduceMotion
                        ? undefined
                        : {
                            opacity: 0,
                            x: -62,
                            y: -10,
                            scale: 0.955,
                            rotate: -0.9,
                            filter: "blur(3px)",
                          }
                    }
                    transition={{
                      duration: 0.66,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <div
                      className={styles.galleryFeatureBlur}
                      aria-hidden="true"
                    >
                      <Image
                        src={activeFrame.image}
                        alt=""
                        fill
                        sizes="65vw"
                      />
                    </div>

                    <Image
                      src={activeFrame.image}
                      alt={`${activeFrame.album.title} - imagen ${activeFrame.imageIndex + 1}`}
                      fill
                      sizes="(max-width: 900px) 92vw, 62vw"
                      className={styles.galleryFeatureImage}
                    />
                  </motion.div>
                </AnimatePresence>

                <span
                  className={styles.galleryFeatureShade}
                  aria-hidden="true"
                />

                <div className={styles.galleryFeatureCounter}>
                  <strong>
                    {String(galleryFrameIndex + 1).padStart(
                      2,
                      "0"
                    )}
                  </strong>
                  <i />
                  <span>
                    {String(galleryFrames.length).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </div>

                <div className={styles.galleryFeatureCopy}>
                  <span className={styles.galleryFeatureIcon}>
                    <Users size={19} strokeWidth={1.55} />
                  </span>

                  <div>
                    <strong>
                      {activeFrame.album.title}
                    </strong>
                    <p>
                      {activeFrame.album.description}
                    </p>
                  </div>
                </div>

                <div className={styles.galleryFeatureActions}>
                  <button
                    type="button"
                    onClick={showPreviousGalleryFrame}
                    aria-label="Imagen anterior"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    className={styles.galleryPauseButton}
                    onClick={() =>
                      setGalleryPaused((current) => !current)
                    }
                    aria-label={
                      galleryPaused
                        ? "Reanudar galería"
                        : "Pausar galería"
                    }
                  >
                    {galleryPaused ? "▶" : "Ⅱ"}
                  </button>

                  <button
                    type="button"
                    onClick={showNextGalleryFrame}
                    aria-label="Imagen siguiente"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className={styles.galleryStageProgress}>
                {galleryFrames.map((frame, index) => (
                  <button
                    key={`${frame.album.id}-progress-${frame.imageIndex}`}
                    type="button"
                    className={
                      index === galleryFrameIndex
                        ? styles.galleryStageProgressActive
                        : ""
                    }
                    onClick={() => setGalleryFrameIndex(index)}
                    aria-label={`Mostrar imagen ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            className={styles.galleryFooter}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.54,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className={styles.galleryFooterIcon}>
              <Users size={22} strokeWidth={1.55} />
            </span>

            <div>
              <strong>
                Más que un lugar, una experiencia de formación.
              </strong>
              <p>
                Cada espacio acompaña una parte distinta del recorrido.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Lightbox compacto */}
        <AnimatePresence>
          {activeGalleryAlbum &&
            activeGalleryImage &&
            activeGallery && (
              <motion.div
                className={styles.galleryLightbox}
                role="dialog"
                aria-modal="true"
                aria-label={activeGalleryAlbum.title}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                      }
                }
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.22,
                }}
                onClick={closeGallery}
              >
                <motion.div
                  className={styles.galleryLightboxPanel}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 20,
                          scale: 0.975,
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
                          y: 12,
                          scale: 0.985,
                        }
                  }
                  transition={{
                    duration: 0.34,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className={styles.galleryLightboxTopbar}>
                    <div>
                      <span>
                        {activeGalleryAlbum.title}
                      </span>

                      <strong>
                        {String(
                          activeGallery.imageIndex + 1
                        ).padStart(2, "0")}
                        <i />
                        {String(
                          activeGalleryAlbum.images.length
                        ).padStart(2, "0")}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className={styles.galleryLightboxClose}
                      onClick={closeGallery}
                      aria-label="Cerrar galería"
                    >
                      ×
                    </button>
                  </div>

                  <div className={styles.galleryLightboxStage}>
                    <button
                      type="button"
                      className={`${styles.galleryLightboxArrow} ${styles.galleryLightboxArrowLeft}`}
                      onClick={showPreviousGalleryItem}
                      aria-label="Imagen anterior"
                    >
                      ‹
                    </button>

                    <div className={styles.galleryLightboxImage}>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={activeGalleryImage}
                          className={styles.galleryLightboxMediaWrap}
                          initial={
                            reduceMotion
                              ? false
                              : {
                                  opacity: 0,
                                  scale: 0.985,
                                }
                          }
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          exit={
                            reduceMotion
                              ? undefined
                              : {
                                  opacity: 0,
                                  scale: 0.99,
                                }
                          }
                          transition={{
                            duration: 0.28,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <Image
                            src={activeGalleryImage}
                            alt={`${activeGalleryAlbum.title} - imagen ${activeGallery.imageIndex + 1}`}
                            fill
                            sizes="(max-width: 900px) 88vw, 72vw"
                            className={styles.galleryLightboxMedia}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <button
                      type="button"
                      className={`${styles.galleryLightboxArrow} ${styles.galleryLightboxArrowRight}`}
                      onClick={showNextGalleryItem}
                      aria-label="Imagen siguiente"
                    >
                      ›
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* =====================================================
            VALUES
            ===================================================== */}
        <div className={styles.values}>
          {values.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                className={styles.valueItem}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 22,
                      }
                }
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.25,
                }}
                transition={{
                  duration: 0.48,
                  delay: index * 0.055,
                  ease: [0.16, 1, 0.3, 1],
                }}
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
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}