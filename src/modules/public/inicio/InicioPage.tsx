import { Hero } from "./components/Hero/Hero";

import styles from "./InicioPage.module.css";

export function InicioPage() {
  return (
    <main className={styles.page}>
      <Hero />

      <div
        id="inicio-contenido"
        className={styles.contentAnchor}
        aria-hidden="true"
      />
    </main>
  );
}