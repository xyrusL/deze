import { type ReactNode } from "react";
import styles from "./ArcadeGamePattern.module.css";

type ArcadeGamePatternProps = {
  className?: string;
  board: ReactNode;
  sidebar: ReactNode;
};

export default function ArcadeGamePattern({ className = "", board, sidebar }: ArcadeGamePatternProps) {
  return (
    <div className={`${styles.root} ${className}`.trim()}>
      <div className={styles.layout}>
        <section className={styles.boardColumn}>{board}</section>
        <aside className={styles.sidebarColumn}>{sidebar}</aside>
      </div>
    </div>
  );
}
