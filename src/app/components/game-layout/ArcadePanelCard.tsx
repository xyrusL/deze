import { type ReactNode } from "react";
import styles from "./ArcadeGamePattern.module.css";

type ArcadePanelCardProps = {
  title?: string;
  ariaLabel?: string;
  children: ReactNode;
};

export default function ArcadePanelCard({ title, ariaLabel, children }: ArcadePanelCardProps) {
  return (
    <section className={styles.panelCard} aria-label={ariaLabel}>
      {title ? <h3 className={styles.panelTitle}>{title}</h3> : null}
      {children}
    </section>
  );
}
