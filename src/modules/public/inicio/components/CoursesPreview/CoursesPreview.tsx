"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Car,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "motion/react";

import { useHomeContent } from "@/hooks/useHomeContent";

import styles from "./CoursesPreview.module.css";

type PathCard = {
  id: string;
  number: string;
  label: string;
  title: string;
  accent: string;
  description: string;
  image: string;
  imageAlt: string;
  cta: string;
  href: string;
  type: "car" | "motorcycle" | "other";
};

const paths: PathCard[] = [
  {
    id: "automovil",
    number: "01",
    label: "AUTOMÓVIL",
    title: "Quiero conducir",
    accent: "un automóvil",
    description:
      "Formación para categorías B1, C1 y servicio particular o público.",
    image: "/assets/images/cursos/c1.png",
    imageAlt: "Automóvil de formación ReyCars",
    cta: "Explorar cursos",
    href: "/cursos",
    type: "car",
  },
  {
    id: "motocicleta",
    number: "02",
    label: "MOTOCICLETA",
    title: "Quiero conducir",
    accent: "una motocicleta",
    description:
      "Formación para categoría A2 y todo lo que necesitas para comenzar.",
    image: "/assets/images/cursos/a2.png",
    imageAlt: "Motocicleta de formación ReyCars",
    cta: "Explorar cursos",
    href: "/cursos",
    type: "motorcycle",
  },
  {
    id: "otras-opciones",
    number: "03",
    label: "OTRAS OPCIONES",
    title: "Quiero fortalecer",
    accent: "mi conducción",
    description:
      "Refuerzos, manejo defensivo, refrendación y más opciones de formación.",
    image: "/assets/images/cursos/manejo-defensivo.png",
    imageAlt: "Formación complementaria ReyCars",
    cta: "Ver opciones",
    href: "/cursos",
    type: "other",
  },
];

function MotorcycleIcon({
  size = 29,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="6"
        cy="16"
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle
        cx="18"
        cy="16"
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8.4 16h3.2l2.6-5h2.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m10.4 10 2.3 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9.2 10h3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="m15.4 9.5 1.4 1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PathIcon({
  type,
}: {
  type: PathCard["type"];
}) {
  if (type === "motorcycle") {
    return <MotorcycleIcon />;
  }

  if (type === "other") {
    return (
      <ArrowRight
        size={31}
        strokeWidth={1.7}
      />
    );
  }

  return (
    <Car
      size={30}
      strokeWidth={1.65}
    />
  );
}

export function CoursesPreview() {
  const reduceMotion = useReducedMotion();
  const { content, isLoading } = useHomeContent();

  if (isLoading || !content) {
    return null;
  }

  const sectionContent = content.coursesSection;

  return (
    <section
      className={styles.section}
      aria-labelledby="courses-preview-title"
    >
      <div
        className={styles.decorativeDots}
        aria-hidden="true"
      />

      <div className={styles.container}>
        <motion.header
          className={styles.header}
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
            amount: 0.3,
          }}
          transition={{
            duration: 0.62,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className={styles.eyebrow}>
            {sectionContent.eyebrow}
          </span>

          <h2 id="courses-preview-title">
            {sectionContent.title.replace(
              sectionContent.highlightedText,
              ""
            )}
            <strong>
              {sectionContent.highlightedText}
            </strong>
          </h2>

          <p>
            {sectionContent.description}
          </p>

          <span
            className={styles.headerLine}
            aria-hidden="true"
          />
        </motion.header>

        <div className={styles.labels}>
          {paths.map((path) => (
            <div
              key={path.id}
              className={styles.labelItem}
            >
              <span>
                {path.number}
              </span>

              <i aria-hidden="true" />

              <strong>
                {path.label}
              </strong>
            </div>
          ))}
        </div>

        <div className={styles.cards}>
          {paths.map((path, index) => (
            <motion.article
              key={path.id}
              className={styles.card}
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 30,
                      scale: 0.985,
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.22,
              }}
              transition={{
                duration: 0.52,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -7,
                    }
              }
            >
              <div
                className={styles.cardGlow}
                aria-hidden="true"
              />

              <div className={styles.cardTop}>
                <span className={styles.iconBubble}>
                  <PathIcon type={path.type} />
                </span>

                <div className={styles.cardHeading}>
                  <span className={styles.mobileNumber}>
                    {path.number}
                  </span>

                  <h3>
                    {path.title}
                    <br />
                    <strong>
                      {path.accent}
                    </strong>
                  </h3>

                  <p>
                    {path.description}
                  </p>
                </div>
              </div>

              <div className={styles.visual}>
                <div
                  className={styles.visualArc}
                  aria-hidden="true"
                />

                <Image
                  src={path.image}
                  alt={path.imageAlt}
                  fill
                  sizes="(max-width: 720px) 92vw, (max-width: 1100px) 45vw, 30vw"
                  className={styles.image}
                />
              </div>

              <Link
                href={path.href}
                className={styles.cardAction}
              >
                <span>
                  {sectionContent.ctaLabel || path.cta}
                </span>

                <ArrowRight
                  size={17}
                  strokeWidth={1.75}
                />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}