import styles from "./AdminHeader.module.css";

export function AdminHeader() {
  return (
    <header className={styles.header}>
      <div><span>CMS</span><strong>ReyCars</strong></div>
      <span className={styles.user}>Administrador</span>
    </header>
  );
}
