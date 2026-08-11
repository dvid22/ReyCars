"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  HelpCircle,
  MessageCircleMore,
} from "lucide-react";

import { useHomeContent } from "@/hooks/useHomeContent";
import { useFaq } from "@/hooks/useFaq";

import styles from "./FAQ.module.css";

export function FAQ() {
  const reduceMotion = useReducedMotion();

  const [openId, setOpenId] =
    useState<string>("");

  const {
    content,
    isLoading: homeLoading,
  } = useHomeContent();

  const {
    items,
    isLoading: faqLoading,
  } = useFaq();

  const faqItems = useMemo(
    () =>
      items.filter(
        (item) => item.active
      ),
    [items]
  );

  useEffect(() => {
    if (faqItems.length === 0) {
      setOpenId("");
      return;
    }

    const stillExists =
      faqItems.some(
        (item) =>
          item.id === openId
      );

    if (!stillExists) {
      setOpenId(
        faqItems[0].id
      );
    }
  }, [faqItems, openId]);

  if (
    homeLoading ||
    faqLoading ||
    !content
  ) {
    return null;
  }

  if (faqItems.length === 0) {
    return null;
  }

  const sectionContent =
    content.faqSection;

  return (
    <section
      className={styles.section}
      aria-labelledby="faq-title"
    >
      <div className={styles.container}>
        {/* =========================================
            INTRO
            ========================================= */}
        <motion.aside
          className={styles.intro}
          initial={
            reduceMotion
              ? false
              : { opacity: 0, x: -18, y: 12 }
          }
          whileInView={{
            opacity: 1,
            x: 0,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.24,
          }}
          transition={{
            duration: 0.58,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>
              <HelpCircle
                size={14}
                strokeWidth={1.8}
              />
            </span>

            <span>
              {sectionContent.eyebrow}
            </span>
          </div>

          <h2
            id="faq-title"
            className={styles.title}
          >
            {sectionContent.title.replace(
              sectionContent.highlightedText,
              ""
            )}
            <strong>
              {sectionContent.highlightedText}
            </strong>
          </h2>

          <span
            className={styles.titleLine}
            aria-hidden="true"
          />

          <p className={styles.description}>
            {sectionContent.description}
          </p>

          <Link
            href="/contacto"
            className={styles.contactLink}
          >
            <MessageCircleMore
              size={17}
              strokeWidth={1.7}
            />

            <span>
              {sectionContent.ctaLabel || "Hablemos por WhatsApp"}
            </span>

            <ArrowRight
              size={15}
              strokeWidth={1.8}
            />
          </Link>

          <div className={styles.helpNote}>
            <span className={styles.helpIcon}>
              <HelpCircle
                size={15}
                strokeWidth={1.7}
              />
            </span>

            <div>
              <strong>
                ¿No encuentras tu pregunta?
              </strong>

              <p>
                Escríbenos, nuestro equipo te orienta personalmente.
              </p>
            </div>
          </div>
        </motion.aside>

        {/* =========================================
            FAQ
            ========================================= */}
        <motion.div
          className={styles.content}
          initial={
            reduceMotion
              ? false
              : { opacity: 0, x: 18, y: 12 }
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
            duration: 0.6,
            delay: 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className={styles.contentHeader}>
            <div>
              <span className={styles.contentEyebrow}>
                Respuestas rápidas y claras
              </span>

              <span
                className={styles.contentLine}
                aria-hidden="true"
              />
            </div>

            <span className={styles.counter}>
              <strong>{faqItems.length}</strong>
              <span>preguntas</span>
            </span>
          </div>

          <div className={styles.accordion}>
            {faqItems.map((item, index) => {
              const isOpen =
                openId === item.id;

              return (
                <motion.article
                  key={item.id}
                  className={`${styles.item} ${
                    isOpen
                      ? styles.itemOpen
                      : ""
                  }`}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 14,
                        }
                  }
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.16,
                  }}
                  transition={{
                    duration: 0.42,
                    delay: index * 0.045,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <button
                    type="button"
                    className={styles.trigger}
                    onClick={() =>
                      setOpenId((current) =>
                        current === item.id
                          ? ""
                          : item.id
                      )
                    }
                    aria-expanded={isOpen}
                    aria-controls={`faq-${item.id}`}
                  >
                    <span className={styles.number}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className={styles.question}>
                      {item.question}
                    </span>

                    <span
                      className={`${styles.chevron} ${
                        isOpen
                          ? styles.chevronOpen
                          : ""
                      }`}
                    >
                      <ChevronDown
                        size={17}
                        strokeWidth={1.8}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${item.id}`}
                        className={styles.answerWrap}
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
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.28,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <div className={styles.answer}>
                          <p>{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>

          <div className={styles.bottomMessage}>
            <span aria-hidden="true" />
            <p>
              Estamos para <strong>ayudarte</strong> en cada paso
            </p>
            <span aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}