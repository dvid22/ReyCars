import { AdminHeader } from "../AdminHeader/AdminHeader";
import { Sidebar } from "../Sidebar/Sidebar";
import styles from "./AdminLayout.module.css";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        <AdminHeader />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
