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
import { useEffect, useMemo, useState } from "react";

import {
  useAboutContent,
} from "@/hooks/useAboutContent";

import type {
  AboutGalleryAlbum,
  AboutIconName,
  AboutStoryId,
} from "@/types/about.types";

import styles from "./NosotrosPage.module.css";

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


function AboutIcon({
  type,
  size = 25,
}: {
  type: AboutIconName;
  size?: number;
}) {
  if (type === "target") {
    return (
      <Target
        size={size}
        strokeWidth={1.6}
      />
    );
  }

  if (type === "shield") {
    return (
      <ShieldCheck
        size={size}
        strokeWidth={1.6}
      />
    );
  }

  if (type === "users") {
    return (
      <Users
        size={size}
        strokeWidth={1.6}
      />
    );
  }

  if (type === "heart") {
    return (
      <Heart
        size={size}
        strokeWidth={1.6}
      />
    );
  }

  if (type === "thumbs-up") {
    return (
      <ThumbsUp
        size={size}
        strokeWidth={1.6}
      />
    );
  }

  return (
    <Sparkles
      size={size}
      strokeWidth={1.6}
    />
  );
}

function renderHighlightedTitle(
  title: string,
  highlighted: string
) {
  if (
    !highlighted ||
    !title.includes(
      highlighted
    )
  ) {
    return title;
  }

  const index =
    title.indexOf(
      highlighted
    );

  return (
    <>
      {title.slice(
        0,
        index
      )}

      <strong>
        {highlighted}
      </strong>

      {title.slice(
        index +
          highlighted.length
      )}
    </>
  );
}

const FIXED_GALLERY_ALBUM_IDS = [
  "en-ruta",
  "formacion",
  "practica",
  "nuestra-sede",
  "vehiculos",
  "en-practica",
  "experiencia-reycars",
] as const;

type GalleryFrame = {
  albumIndex: number;
  imageIndex: number;
  album: AboutGalleryAlbum;
  image: string;
};

export function NosotrosPage() {
  const reduceMotion =
    useReducedMotion();

  const {
    content,
    isLoading,
  } = useAboutContent();

  const storyItems =
    content?.story ?? [];

  const highlights =
    content?.hero.highlights ?? [];

  const values =
    content?.values ?? [];

  const galleryAlbums =
    useMemo(
      () => {
        const albums =
          content?.gallerySection
            .albums ?? [];

        const byId =
          new Map(
            albums.map(
              (album) => [
                album.id,
                album,
              ]
            )
          );

        return FIXED_GALLERY_ALBUM_IDS
          .map(
            (id) =>
              byId.get(id)
          )
          .filter(
            (
              album
            ): album is AboutGalleryAlbum =>
              Boolean(
                album &&
                  album.images.length >
                    0
              )
          );
      },
      [content]
    );

  const galleryFrames =
    useMemo<GalleryFrame[]>(
      () =>
        galleryAlbums.flatMap(
          (
            album,
            albumIndex
          ) =>
            album.images.map(
              (
                image,
                imageIndex
              ) => ({
                albumIndex,
                imageIndex,
                album,
                image,
              })
            )
        ),
      [galleryAlbums]
    );

  const [
    openMobile,
    setOpenMobile,
  ] =
    useState<AboutStoryId>(
      "esencia"
    );

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
    galleryFrames[
      galleryFrameIndex
    ] ??
    galleryFrames[0] ??
    null;

  const activeGalleryAlbum =
    activeGallery === null
      ? null
      : galleryAlbums[
          activeGallery.albumIndex
        ] ?? null;

  const activeGalleryImage =
    activeGalleryAlbum && activeGallery
      ? activeGalleryAlbum.images[activeGallery.imageIndex] ?? null
      : null;

  useEffect(() => {
    if (
      galleryFrames.length === 0
    ) {
      setGalleryFrameIndex(0);
      return;
    }

    if (
      galleryFrameIndex >=
      galleryFrames.length
    ) {
      setGalleryFrameIndex(0);
    }
  }, [
    galleryFrameIndex,
    galleryFrames.length,
  ]);

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
    if (
      galleryFrames.length === 0
    ) {
      return;
    }

    setGalleryFrameIndex(
      (current) =>
        (current -
          1 +
          galleryFrames.length) %
        galleryFrames.length
    );
  };

  const showNextGalleryFrame = () => {
    if (
      galleryFrames.length === 0
    ) {
      return;
    }

    setGalleryFrameIndex(
      (current) =>
        (current + 1) %
        galleryFrames.length
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

  if (
    isLoading ||
    !content
  ) {
    return null;
  }

  if (
    storyItems.length === 0 ||
    highlights.length === 0 ||
    values.length === 0 ||
    !activeFrame
  ) {
    return null;
  }

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
              {content.hero.eyebrow}
            </span>

            <h1>
              {renderHighlightedTitle(
                content.hero.title,
                content.hero.highlightedText
              )}
            </h1>

            <span
              className={styles.accentLine}
              aria-hidden="true"
            />

            <p className={styles.heroDescription}>
              {content.hero.description}
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
                src={content.hero.imageUrl}
                alt={content.hero.imageAlt}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 58vw"
                className={styles.heroImage}
              />
            </div>
          </motion.div>

          <div className={styles.heroHighlights}>
              {highlights.map(
                (item) => (
                  <div
                    key={item.id}
                    className={
                      styles.heroHighlight
                    }
                  >
                    <span>
                      <AboutIcon
                        type={item.icon}
                        size={21}
                      />
                    </span>

                    <strong>
                      {item.title}
                    </strong>
                  </div>
                )
              )}
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
                  <AboutIcon type={item.icon} />
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
                    <AboutIcon
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
                {content.teamSection.eyebrow}
              </span>

              <h2 id="nosotros-team-title">
                {renderHighlightedTitle(
                  content.teamSection.title,
                  content.teamSection.highlightedText
                )}
              </h2>
            </div>

            <p>
              {content.teamSection.description}
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
              {content.teamSection.statement}
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
                {content.gallerySection.eyebrow}
              </span>

              <h2 id="nosotros-gallery-title">
                {renderHighlightedTitle(
                  content.gallerySection.title,
                  content.gallerySection.highlightedText
                )}
              </h2>

              <p>
                {content.gallerySection.description}
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
                {content.gallerySection.footerTitle}
              </strong>
              <p>
                {content.gallerySection.footerDescription}
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
            return (
              <motion.article
                key={item.id}
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
                  <AboutIcon
                    type={item.icon}
                    size={22}
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