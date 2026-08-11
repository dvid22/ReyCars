"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";

import { authService } from "@/firebase/auth/auth.service";

import { AdminHeader } from "../AdminHeader/AdminHeader";
import { Sidebar } from "../Sidebar/Sidebar";

import styles from "./AdminLayout.module.css";

export function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.observeAuth((currentUser) => {
      if (!currentUser) {
        setUser(null);
        setIsCheckingSession(false);
        router.replace("/admin/login");
        return;
      }

      setUser(currentUser);
      setIsCheckingSession(false);
    });

    return unsubscribe;
  }, [router]);

  useEffect(() => {
    if (!isMobileSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileSidebarOpen]);

  if (isCheckingSession || !user) {
    return (
      <div className={styles.authScreen} role="status">
        <div className={styles.authLoader}>
          <span />
        </div>
        <p>Comprobando sesión...</p>
      </div>
    );
  }

  return (
    <div
      className={`${styles.layout} ${
        isSidebarExpanded ? styles.layoutExpanded : ""
      }`}
    >
      <Sidebar
        expanded={isSidebarExpanded}
        mobileOpen={isMobileSidebarOpen}
        onExpand={() => setIsSidebarExpanded(true)}
        onCollapse={() => setIsSidebarExpanded(false)}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {isMobileSidebarOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Cerrar menú"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      ) : null}

      <div className={styles.content}>
        <AdminHeader
          user={user}
          onOpenMenu={() => setIsMobileSidebarOpen(true)}
        />

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}