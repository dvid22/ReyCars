import styles from "./CursoDetallePage.module.css";
export function CursoDetallePage({ slug }: { slug: string }) {
  return <section className={styles.page}><span>CURSO</span><h1>{slug}</h1><p>Detalle dinámico pendiente.</p></section>;
}
