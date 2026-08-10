"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  useEffect,
  useState,
} from "react";

import styles from "./Header.module.css";

const navigation = [
  {
    label: "Inicio",
    href: "/",
  },
  {
    label: "Nosotros",
    href: "/nosotros",
  },
  {
    label: "Cursos",
    href: "/cursos",
  },
  {
    label: "Proceso",
    href: "/proceso",
  },
];

export function Header() {
  const pathname =
    usePathname();

  const reduceMotion =
    useReducedMotion();

  const {
    scrollY,
  } = useScroll();

  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const progressScale =
    useTransform(
      scrollY,
      [0, 1600],
      [0, 1]
    );

  useEffect(() => {
    const unsubscribe =
      scrollY.on(
        "change",
        (latest) => {
          setScrolled(
            latest > 35
          );
        }
      );

    return () =>
      unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    setMobileMenuOpen(
      false
    );
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow =
      mobileMenuOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [mobileMenuOpen]);

  const isActive = (
    href: string
  ) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(
      href
    );
  };

  return (
    <>
      <header
        className={`${styles.header} ${
          scrolled
            ? styles.headerScrolled
            : ""
        }`}
      >
        <div
          className={
            styles.inner
          }
        >
          {/* ============================
              LOGO
              ============================ */}
          <Link
            href="/"
            className={
              styles.brand
            }
            aria-label="Ir al inicio de ReyCars"
          >
            <Image
              src="/assets/branding/logo-reycars.png"
              alt="C.E.A. ReyCars"
              width={520}
              height={170}
              priority
              className={
                styles.logo
              }
            />
          </Link>

          {/* ============================
              NAV DESKTOP
              ============================ */}
          <nav
            className={
              styles.desktopNav
            }
            aria-label="Navegación principal"
          >
            {navigation.map(
              (item) => {
                const active =
                  isActive(
                    item.href
                  );

                return (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className={`${styles.navLink} ${
                      active
                        ? styles.navLinkActive
                        : ""
                    }`}
                  >
                    <span>
                      {
                        item.label
                      }
                    </span>

                    {active && (
                      <motion.i
                        layoutId="reycars-nav-active"
                        className={
                          styles.navIndicator
                        }
                        transition={{
                          type:
                            "spring",
                          stiffness:
                            380,
                          damping:
                            32,
                        }}
                      />
                    )}
                  </Link>
                );
              }
            )}
          </nav>

          {/* ============================
              ACCIONES
              ============================ */}
          <div
            className={
              styles.actions
            }
          >
            <Link
              href="/contacto"
              className={
                styles.contactLink
              }
            >
              Contacto
            </Link>

            <Link
              href="/cursos"
              className={
                styles.courseLink
              }
            >
              <span>
                Ver cursos
              </span>

              <ArrowUpRight
                size={16}
                strokeWidth={1.7}
              />
            </Link>

            <button
              type="button"
              className={
                styles.menuButton
              }
              onClick={() =>
                setMobileMenuOpen(
                  true
                )
              }
              aria-label="Abrir menú"
              aria-expanded={
                mobileMenuOpen
              }
            >
              <Menu
                size={22}
                strokeWidth={1.65}
              />
            </button>
          </div>
        </div>

        <div
          className={
            styles.progress
          }
          aria-hidden="true"
        >
          <motion.span
            style={{
              scaleX:
                progressScale,
            }}
          />
        </div>
      </header>

      {/* ============================
          MOBILE MENU
          ============================ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={
              styles.mobileOverlay
            }
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
              duration: 0.2,
            }}
          >
            <motion.div
              className={
                styles.mobilePanel
              }
              initial={
                reduceMotion
                  ? false
                  : {
                      y:
                        "-100%",
                    }
              }
              animate={{
                y: 0,
              }}
              exit={{
                y:
                  "-100%",
              }}
              transition={{
                duration: 0.48,
                ease: [
                  0.16,
                  1,
                  0.3,
                  1,
                ],
              }}
            >
              {/* TOP */}
              <div
                className={
                  styles.mobileTop
                }
              >
                <Link
                  href="/"
                  className={
                    styles.mobileBrand
                  }
                >
                  <Image
                    src="/assets/branding/logo-reycars.png"
                    alt="C.E.A. ReyCars"
                    width={420}
                    height={140}
                    className={
                      styles.mobileLogo
                    }
                  />
                </Link>

                <button
                  type="button"
                  className={
                    styles.closeButton
                  }
                  onClick={() =>
                    setMobileMenuOpen(
                      false
                    )
                  }
                  aria-label="Cerrar menú"
                >
                  <X
                    size={22}
                    strokeWidth={1.6}
                  />
                </button>
              </div>

              {/* CONTENT */}
              <div
                className={
                  styles.mobileContent
                }
              >
                <div
                  className={
                    styles.mobileHeading
                  }
                >
                  <span>
                    C.E.A.
                    REYCARS
                  </span>

                  <h2>
                    Tu camino
                    <br />
                    comienza
                    aquí.
                  </h2>
                </div>

                <nav
                  className={
                    styles.mobileNav
                  }
                >
                  {navigation.map(
                    (
                      item,
                      index
                    ) => {
                      const active =
                        isActive(
                          item.href
                        );

                      return (
                        <motion.div
                          key={
                            item.href
                          }
                          initial={
                            reduceMotion
                              ? false
                              : {
                                  opacity:
                                    0,
                                  y: 20,
                                }
                          }
                          animate={{
                            opacity:
                              1,
                            y: 0,
                          }}
                          transition={{
                            delay:
                              index *
                              0.045,
                            duration:
                              0.4,
                          }}
                        >
                          <Link
                            href={
                              item.href
                            }
                            className={`${styles.mobileNavLink} ${
                              active
                                ? styles.mobileNavLinkActive
                                : ""
                            }`}
                          >
                            <span
                              className={
                                styles.mobileNumber
                              }
                            >
                              {String(
                                index +
                                  1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <strong>
                              {
                                item.label
                              }
                            </strong>

                            <ArrowUpRight
                              size={
                                18
                              }
                              strokeWidth={
                                1.5
                              }
                            />
                          </Link>
                        </motion.div>
                      );
                    }
                  )}
                </nav>
              </div>

              {/* BOTTOM */}
              <div
                className={
                  styles.mobileBottom
                }
              >
                <span>
                  Atrévete a
                  rodar con
                  nosotros.
                </span>

                <Link
                  href="/contacto"
                >
                  Contacto

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.6}
                  />
                </Link>
              </div>

              <div
                className={
                  styles.mobileDecoration
                }
                aria-hidden="true"
              >
                <span />
                <span />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}