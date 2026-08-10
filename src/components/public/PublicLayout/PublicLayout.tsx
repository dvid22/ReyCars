import type { ReactNode } from "react";

import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { WhatsAppButton } from "../WhatsAppButton/WhatsAppButton";

import styles from "./PublicLayout.module.css";

type PublicLayoutProps = {
  children: ReactNode;
};

export function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>
        {children}
      </main>

      <Footer />

      <WhatsAppButton />
    </div>
  );
}