import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Phone,
} from "lucide-react";

import {
  RecruitmentNavLink,
} from "@/components/public/RecruitmentNavLink";

import styles from "./Footer.module.css";

const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Proceso", href: "/proceso" },
  { label: "Contacto", href: "/contacto" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/reycars_ubate?igsh=Y3hxZW1rNWsxcmVt",
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/18ye5QQfPU/?mibextid=wwXIfr",
    icon: "facebook",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@reycars_ubate?_r=1&_t=ZS-98kig2MXwVI",
    icon: "tiktok",
  },
] as const;

type SocialIconName =
  (typeof socialLinks)[number]["icon"];

function SocialIcon({
  name,
}: {
  name: SocialIconName;
}) {
  if (name === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          ry="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <circle
          cx="12"
          cy="12"
          r="4.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <circle
          cx="17.35"
          cy="6.75"
          r="1.15"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M13.8 21v-8h2.85l.43-3.32H13.8V7.56c0-.96.27-1.61 1.64-1.61h1.75V2.98c-.3-.04-1.34-.13-2.55-.13-2.52 0-4.25 1.54-4.25 4.37v2.46H7.54V13h2.85v8h3.41Z"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M14.72 3.2c.47 1.58 1.4 2.7 2.84 3.43.76.38 1.47.55 2.14.58v3.17a8.15 8.15 0 0 1-4.89-1.7v6.02a6.12 6.12 0 1 1-5.28-6.06v3.2a2.93 2.93 0 1 0 2.09 2.8V3.2h3.1Z"
      />
    </svg>
  );
}

export function Footer() {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer
      className={styles.footer}
      aria-label="Pie de página"
    >
      {/* =====================================================
          CTA SUPERIOR
          ===================================================== */}
      <div className={styles.topCta}>
        <div className={styles.container}>
          <div className={styles.topCtaInner}>
            <div className={styles.topCtaContent}>
              <span className={styles.topCtaEyebrow}>
                TU PRÓXIMO RECORRIDO
              </span>

              <h2>
                ¿Listo para comenzar?
                <span>
                  {" "}
                  Conoce nuestros servicios.
                </span>
              </h2>
            </div>

            <Link
              href="/servicios"
              className={styles.topCtaButton}
            >
              <span>
                Explorar servicios
              </span>

              <i>
                <ArrowUpRight
                  size={17}
                  strokeWidth={1.7}
                />
              </i>
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          FOOTER PRINCIPAL
          ===================================================== */}
      <div className={styles.mainFooter}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            {/* ===============================================
                BRAND + SOCIAL
                =============================================== */}
            <section className={styles.brandColumn}>
              <div className={styles.brandTop}>
                <Link
                  href="/"
                  className={styles.logoLink}
                  aria-label="Ir al inicio de ReyCars"
                >
                  <Image
                    src="/assets/branding/logo-reycars.png"
                    alt="C.E.A. ReyCars"
                    width={260}
                    height={90}
                    className={styles.logo}
                  />
                </Link>

                <div
                  className={styles.socials}
                  aria-label="Redes sociales de ReyCars"
                >
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label={`Abrir ${social.label} de ReyCars`}
                      title={social.label}
                    >
                      <SocialIcon
                        name={social.icon}
                      />
                    </a>
                  ))}
                </div>
              </div>

              <p className={styles.brandDescription}>
                Centro de Enseñanza Automovilística enfocado
                en formar conductores responsables, seguros y
                preparados para la vía.
              </p>

              <div className={styles.slogan}>
                <span />

                <strong>
                  Atrévete a rodar con nosotros.
                </strong>
              </div>
            </section>

            {/* ===============================================
                NAVEGACIÓN
                =============================================== */}
            <section className={styles.linksColumn}>
              <span className={styles.columnTitle}>
                EXPLORA
              </span>

              <nav aria-label="Navegación del footer">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                  >
                    <span>
                      {item.label}
                    </span>

                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.6}
                    />
                  </Link>
                ))}

                <RecruitmentNavLink>
                  <span>
                    Trabaja con nosotros
                  </span>

                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.6}
                  />
                </RecruitmentNavLink>
              </nav>
            </section>

            {/* ===============================================
                RUTA
                =============================================== */}
            <section className={styles.experienceColumn}>
              <span className={styles.columnTitle}>
                TU RUTA
              </span>

              <div className={styles.routeList}>
                <div className={styles.routeItem}>
                  <span className={styles.routeNumber}>
                    01
                  </span>

                  <div>
                    <strong>
                      Aprende
                    </strong>

                    <p>
                      Conocimiento para comprender la vía.
                    </p>
                  </div>
                </div>

                <div className={styles.routeItem}>
                  <span className={styles.routeNumber}>
                    02
                  </span>

                  <div>
                    <strong>
                      Practica
                    </strong>

                    <p>
                      Experiencia para desarrollar confianza.
                    </p>
                  </div>
                </div>

                <div className={styles.routeItem}>
                  <span className={styles.routeNumber}>
                    03
                  </span>

                  <div>
                    <strong>
                      Conduce
                    </strong>

                    <p>
                      Seguridad y responsabilidad en cada recorrido.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ===============================================
                CONTACTO
                =============================================== */}
            <section className={styles.contactColumn}>
              <span className={styles.columnTitle}>
                HABLEMOS
              </span>

              <h3>
                Tu proceso puede
                <br />
                comenzar hoy.
              </h3>

              <Link
                href="/contacto"
                className={styles.contactLink}
              >
                <span>
                  Contáctanos
                </span>

                <ArrowRight
                  size={15}
                  strokeWidth={1.7}
                />
              </Link>

              <div className={styles.contactDetails}>
                <a
                  href="tel:+573102062512"
                  className={styles.detailLink}
                >
                  <Phone
                    size={15}
                    strokeWidth={1.65}
                  />

                  <span>
                    +57 310 2062512
                  </span>
                </a>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Calle%2015%20%23%205%20-%2068%20Ubat%C3%A9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.detailLink}
                >
                  <MapPin
                    size={15}
                    strokeWidth={1.6}
                  />

                  <span>
                    Calle 15 # 5 - 68, Ubaté
                  </span>
                </a>
              </div>
            </section>
          </div>

          {/* =================================================
              BOTTOM
              ================================================= */}
          <div className={styles.bottom}>
            <div className={styles.bottomBrand}>
              <span>
                © {currentYear}
              </span>

              <strong>
                REYCARS
              </strong>

              <span>
                C.E.A.
              </span>
            </div>

            <span className={styles.bottomCenter}>
              Centro de Enseñanza Automovilística
            </span>

            <div className={styles.bottomRight}>
              <a href="tel:+573102062512">
                +57 310 2062512
              </a>

              <i />

              <span>
                Todos los derechos reservados
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}