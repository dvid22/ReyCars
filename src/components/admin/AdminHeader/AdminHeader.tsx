"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import type {
  User,
} from "firebase/auth";

import {
  LogOut,
  Menu,
} from "lucide-react";

import {
  authService,
} from "@/firebase/auth/auth.service";

import styles from "./AdminHeader.module.css";

type AdminHeaderProps = {
  user: User;
  onOpenMenu: () => void;
};

const routeLabels = [
  [
    "/admin/inicio",
    "Inicio",
  ],
  [
    "/admin/nosotros",
    "Nosotros",
  ],
  [
    "/admin/servicios",
    "Servicios",
  ],
  [
    "/admin/proceso",
    "Proceso",
  ],
  [
    "/admin/equipo",
    "Equipo",
  ],
  [
    "/admin/faq",
    "Preguntas frecuentes",
  ],
  [
    "/admin/contacto",
    "Contacto",
  ],
  [
    "/admin/recruitment",
    "Trabaja con nosotros",
  ],
] as const;

export function AdminHeader({
  user,
  onOpenMenu,
}: AdminHeaderProps) {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const [
    isSigningOut,
    setIsSigningOut,
  ] =
    useState(false);

  const sectionTitle =
    useMemo(() => {
      return (
        routeLabels.find(
          (
            [route]
          ) =>
            pathname.startsWith(
              route
            )
        )?.[1] ??
        "Administrador"
      );
    }, [
      pathname,
    ]);

  async function handleLogout() {
    if (
      isSigningOut
    ) {
      return;
    }

    try {
      setIsSigningOut(
        true
      );

      await authService.logout();

      router.replace(
        "/admin/login"
      );

      router.refresh();
    } finally {
      setIsSigningOut(
        false
      );
    }
  }

  return (
    <header
      className={
        styles.header
      }
    >
      <div
        className={
          styles.left
        }
      >
        <button
          type="button"
          className={
            styles.menuButton
          }
          onClick={
            onOpenMenu
          }
          aria-label="Abrir menú"
        >
          <Menu
            size={19}
            strokeWidth={1.8}
          />
        </button>

        <div
          className={
            styles.section
          }
        >
          <span>
            REY CAR'S ADMIN
          </span>

          <strong>
            {
              sectionTitle
            }
          </strong>
        </div>

        <span
          className={
            styles.sectionStatus
          }
          aria-hidden="true"
        >
          <i />
          En línea
        </span>
      </div>

      <div
        className={
          styles.account
        }
      >
        <div
          className={
            styles.accountText
          }
        >
          <strong>
            Administrador
          </strong>

          <span>
            {user.email ??
              "Cuenta administrativa"}
          </span>
        </div>

        <div
          className={
            styles.avatar
          }
          aria-hidden="true"
        >
          {(user.email?.charAt(
            0
          ) ?? "A")
            .toUpperCase()}
        </div>

        <button
          type="button"
          className={
            styles.logout
          }
          onClick={
            handleLogout
          }
          disabled={
            isSigningOut
          }
        >
          <LogOut
            size={16}
            strokeWidth={1.8}
          />

          <span>
            {isSigningOut
              ? "Saliendo..."
              : "Cerrar sesión"}
          </span>
        </button>
      </div>
    </header>
  );
}