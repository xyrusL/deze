import Link from "next/link";
import styles from "./ArcadeGameHeader.module.css";

type ArcadeGameHeaderProps = {
  title: string;
};

export default function ArcadeGameHeader({ title }: ArcadeGameHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <Link className={styles.backLink} href="/arcade">
        ← Back to Arcade
      </Link>
    </header>
  );
}
