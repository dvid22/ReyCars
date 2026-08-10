import Link from "next/link";
import styles from "./Sidebar.module.css";

const items = [
  ["Dashboard", "/admin"],
  ["Inicio", "/admin/inicio"],
  ["Nosotros", "/admin/nosotros"],
  ["Cursos", "/admin/cursos"],
  ["Proceso", "/admin/proceso"],
  ["Equipo", "/admin/equipo"],
  ["Instalaciones", "/admin/instalaciones"],
  ["Testimonios", "/admin/testimonios"],
  ["FAQ", "/admin/faq"],
  ["Contacto", "/admin/contacto"],
  ["Trabaja con nosotros", "/admin/recruitment"],
  ["Configuración", "/admin/configuracion"],
];

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <strong className={styles.brand}>ReyCars Admin</strong>
      <nav className={styles.nav}>
        {items.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
    </aside>
  );
}
