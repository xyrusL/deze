import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>DEZE</h1>
        <p className={styles.subtitle}>Gateway to the Future</p>
      </div>

      <div className={styles.grid}>
        <a
          href="https://rioanime.deze.me"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card}
        >
          <h2>
            RioAnime <span>-&gt;</span>
          </h2>
          <p>
            The ultimate destination for anime enthusiasts. Stream, discover, and enjoy.
          </p>
        </a>

        <a href="/games" className={styles.card}>
          <h2>
            Arcade <span>🎮</span>
          </h2>
          <p>
            Play classic games. Test your skills with Snake and more.
          </p>
        </a>

        <div className={`${styles.card} ${styles.comingSoon}`}>
          <h2>
            System 32
          </h2>
          <p>
            Loading modules. Please wait...
          </p>
        </div>
      </div>
    </div>
  );
}
