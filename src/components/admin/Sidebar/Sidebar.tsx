"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BookOpen,
  Building2,
  CircleHelp,
  ContactRound,
  FileText,
  GraduationCap,
  Home,
  UsersRound,
  X,
} from "lucide-react";

import styles from "./Sidebar.module.css";

type SidebarProps = {
  expanded: boolean;
  mobileOpen: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onCloseMobile: () => void;
};

const items = [
  {
    label: "Inicio",
    href: "/admin/inicio",
    icon: Home,
  },
  {
    label: "Nosotros",
    href: "/admin/nosotros",
    icon: Building2,
  },
  {
    label: "Servicios",
    href: "/admin/servicios",
    icon: GraduationCap,
  },
  {
    label: "Proceso",
    href: "/admin/proceso",
    icon: BookOpen,
  },
  {
    label: "Equipo",
    href: "/admin/equipo",
    icon: UsersRound,
  },
  {
    label: "FAQ",
    href: "/admin/faq",
    icon: CircleHelp,
  },
  {
    label: "Contacto",
    href: "/admin/contacto",
    icon: ContactRound,
  },
  {
    label: "Trabaja con nosotros",
    href: "/admin/recruitment",
    icon: FileText,
  },
];

export function Sidebar({
  expanded,
  mobileOpen,
  onExpand,
  onCollapse,
  onCloseMobile,
}: SidebarProps) {
  const pathname =
    usePathname();

  function isActive(
    href: string
  ) {
    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`
      )
    );
  }

  return (
    <aside
      className={`${styles.sidebar} ${
        expanded
          ? styles.expanded
          : ""
      } ${
        mobileOpen
          ? styles.mobileOpen
          : ""
      }`}
      onMouseEnter={
        onExpand
      }
      onMouseLeave={
        onCollapse
      }
    >
      <div
        className={
          styles.brandArea
        }
      >
        <Link
          href="/admin/inicio"
          className={
            styles.brand
          }
          onClick={
            onCloseMobile
          }
        >
          <span
            className={
              styles.compactBrand
            }
            aria-hidden="true"
          >
            R
          </span>

          <Image
            src="/assets/branding/logo-reycars.png"
            alt="CEA ReyCars"
            width={230}
            height={95}
            priority
            className={
              styles.logo
            }
          />

          <div
            className={
              styles.brandText
            }
          >
           
            
          </div>
        </Link>

        <button
          type="button"
          className={
            styles.mobileClose
          }
          onClick={
            onCloseMobile
          }
          aria-label="Cerrar menú"
        >
          <X
            size={18}
            strokeWidth={1.8}
          />
        </button>
      </div>

      <div
        className={
          styles.separator
        }
      />

      <div
        className={
          styles.navScroll
        }
      >
        <span
          className={
            styles.sectionLabel
          }
        >
          Navegación
        </span>

        <nav
          className={
            styles.nav
          }
          aria-label="Navegación administrativa"
        >
          {items.map(
            (
              item
            ) => {
              const Icon =
                item.icon;

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
                  title={
                    !expanded
                      ? item.label
                      : undefined
                  }
                  className={`${styles.navItem} ${
                    active
                      ? styles.navItemActive
                      : ""
                  }`}
                  onClick={
                    onCloseMobile
                  }
                >
                  <span
                    className={
                      styles.iconWrap
                    }
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.75}
                    />
                  </span>

                  <span
                    className={
                      styles.navLabel
                    }
                  >
                    {
                      item.label
                    }
                  </span>

                  {active ? (
                    <span
                      className={
                        styles.activeDot
                      }
                      aria-hidden="true"
                    />
                  ) : null}
                </Link>
              );
            }
          )}
        </nav>
      </div>

      <div
        className={
          styles.sidebarFoot
        }
      >
        <div
          className={
            styles.status
          }
          title="Sistema conectado"
        >
          <span />

          <div
            className={
              styles.statusText
            }
          >
            <strong>
              ReyCars CMS
            </strong>

            <p>
              Sistema conectado
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}