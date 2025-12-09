import SnakeGame from "../components/SnakeGame";
import styles from "./page.module.css";
import Link from "next/link";

export default function GamesPage() {
    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    ← BACK
                </Link>
                <h1 className={styles.title}>ARCADE</h1>
            </div>

            <div className={styles.gameContainer}>
                <SnakeGame />
            </div>

            <p className={styles.hint}>More games coming soon...</p>
        </div>
    );
}
