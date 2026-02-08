"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./WordGuessGame.module.css";
import ArcadeGamePattern from "./game-layout/ArcadeGamePattern";
import ArcadeGameStage from "./game-layout/ArcadeGameStage";
import ArcadePanelCard from "./game-layout/ArcadePanelCard";
import patternStyles from "./game-layout/ArcadeGamePattern.module.css";

type RoundStatus = "idle" | "loading" | "playing" | "success" | "error";

const MIN_WORD_LENGTH = 4;
const MAX_WORD_LENGTH = 8;

type DifficultyLevel = "easy" | "medium" | "hard";

function getDifficultyByScore(score: number): DifficultyLevel {
  if (score >= 8) {
    return "hard";
  }

  if (score >= 4) {
    return "medium";
  }

  return "easy";
}

function getLengthRangeByDifficulty(difficulty: DifficultyLevel): { min: number; max: number } {
  if (difficulty === "hard") {
    return { min: 7, max: MAX_WORD_LENGTH };
  }

  if (difficulty === "medium") {
    return { min: 5, max: 6 };
  }

  return { min: MIN_WORD_LENGTH, max: 4 };
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleWord(word: string): string {
  if (word.length < 2) {
    return word;
  }

  const chars = word.split("");
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

function scrambleWord(word: string): string {
  let scrambled = word;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    scrambled = shuffleWord(word);
    if (scrambled !== word) {
      return scrambled;
    }
  }
  return word.split("").reverse().join("");
}

export default function WordGuessGame() {
  const [status, setStatus] = useState<RoundStatus>("idle");
  const [word, setWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("Press Start to fetch your first puzzle word.");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");

  const fetchWord = useCallback(async (nextDifficulty: DifficultyLevel, shouldAdvanceRound = true) => {
    setStatus("loading");
    setMessage(`Loading ${nextDifficulty} word from Datamuse...`);
    setGuess("");

    try {
      const { min, max } = getLengthRangeByDifficulty(nextDifficulty);
      const targetLength = randomInt(min, max);
      const pattern = "?".repeat(targetLength);
      const endpoint = `https://api.datamuse.com/words?sp=${pattern}&max=120`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Word API request failed with status ${response.status}`);
      }

      const rawData: unknown = await response.json();
      const candidates = Array.isArray(rawData)
        ? rawData
            .map((item) => (typeof item === "object" && item && "word" in item ? (item as { word?: unknown }).word : null))
            .filter((value): value is string => typeof value === "string")
            .map((value) => value.trim().toLowerCase())
            .filter((value) => /^[a-z]+$/.test(value))
            .filter((value) => value.length >= MIN_WORD_LENGTH && value.length <= MAX_WORD_LENGTH)
        : [];

      if (candidates.length === 0) {
        throw new Error("No valid words returned from the API for this round.");
      }

      const pickedWord = candidates[randomInt(0, candidates.length - 1)];
      const pickedScramble = scrambleWord(pickedWord);

      setWord(pickedWord);
      setScrambledWord(pickedScramble);
      if (shouldAdvanceRound) {
        setRound((current) => current + 1);
      }
      setDifficulty(nextDifficulty);
      setStatus("playing");
      setMessage(`Unscramble the letters and submit your guess. Difficulty: ${nextDifficulty}.`);
    } catch (error) {
      console.error("[WordGuessGame] Failed to fetch puzzle word:", error);
      setStatus("error");
      setMessage("Could not load a word from the API. Check your connection and retry.");
    }
  }, []);

  const normalizedGuess = guess.trim().toLowerCase();
  const canSubmit = status === "playing" && normalizedGuess.length > 0;

  const scoreLabel = useMemo(() => `${score} point${score === 1 ? "" : "s"}`, [score]);

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    const timer = window.setTimeout(() => {
      void fetchWord(getDifficultyByScore(score));
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [fetchWord, score, status]);

  function onResetGame() {
    setStatus("idle");
    setWord("");
    setScrambledWord("");
    setGuess("");
    setMessage("Press Start to fetch your first puzzle word.");
    setScore(0);
    setRound(0);
    setDifficulty("easy");
  }

  function onSubmitGuess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    if (normalizedGuess === word) {
      const nextScore = score + 1;
      setScore(nextScore);
      setStatus("success");
      setMessage(
        `Correct! Nice solve. Next round difficulty: ${getDifficultyByScore(nextScore)}. Auto next word in 2 seconds.`
      );
      return;
    }

    setMessage("Incorrect guess. Try again or move to the next word.");
  }

  return (
    <ArcadeGamePattern
      className={styles.container}
      board={
        <ArcadeGameStage className={styles.stage} shellClassName={styles.stageShell}>
          <div className={styles.boardContent}>
            <section className={styles.card} aria-live="polite">
              <div className={styles.statsRow}>
                <p className={styles.metaPill}>Round: {round}</p>
                <p className={styles.metaPill}>Score: {scoreLabel}</p>
                <p className={styles.metaPill}>Difficulty: {difficulty}</p>
              </div>

              <div className={styles.controlBar}>
                <button
                  type="button"
                  className={styles.controlPrimaryButton}
                  onClick={() => void fetchWord(getDifficultyByScore(score))}
                >
                  {status === "idle" ? "Start" : "Next Word"}
                </button>
                <button type="button" className={styles.controlSecondaryButton} onClick={onResetGame}>
                  Reset
                </button>
              </div>

              <div className={styles.scrambleSection}>
                <p className={styles.scrambleLabel}>Scrambled word</p>
                <p className={styles.scrambledWord}>{status === "loading" ? "..." : scrambledWord || "Press Start"}</p>
              </div>

              <form className={styles.form} onSubmit={onSubmitGuess}>
                <label htmlFor="wordGuessInput" className={styles.fieldLabel}>
                  Your guess
                </label>
                <input
                  id="wordGuessInput"
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  value={guess}
                  onChange={(event) => setGuess(event.target.value)}
                  disabled={status === "loading" || status === "error"}
                />

                <div className={styles.actions}>
                  <button type="submit" className={styles.primaryButton} disabled={!canSubmit}>
                    Submit Guess
                  </button>
                </div>
              </form>

              <p
                className={`${styles.feedback} ${
                  status === "error"
                    ? styles.feedbackError
                    : status === "success"
                      ? styles.feedbackSuccess
                      : styles.feedbackNeutral
                }`}
                role="status"
              >
                {message}
              </p>

              {status === "error" ? (
                <button
                  type="button"
                  className={styles.retryButton}
                  onClick={() => void fetchWord(getDifficultyByScore(score), round === 0)}
                >
                  Retry API Fetch
                </button>
              ) : null}
            </section>
          </div>
        </ArcadeGameStage>
      }
      sidebar={
        <>
          <ArcadePanelCard title="Controls" ariaLabel="Word Guess controls">
            <ul className={`${patternStyles.tipList} ${styles.sidebarList}`}>
              <li className={`${patternStyles.tipItem} ${styles.sidebarListItem}`}>Start / Next Word: load a new puzzle.</li>
              <li className={`${patternStyles.tipItem} ${styles.sidebarListItem}`}>Submit Guess: check your current answer.</li>
              <li className={`${patternStyles.tipItem} ${styles.sidebarListItem}`}>Reset: clear progress and return to start.</li>
            </ul>
          </ArcadePanelCard>

          <ArcadePanelCard title="Game Info" ariaLabel="Word Guess game information">
            <ul className={`${patternStyles.tipList} ${styles.sidebarList}`}>
              <li className={`${patternStyles.tipItem} ${styles.sidebarListItem}`}>Unscramble the letters to find the hidden word.</li>
              <li className={`${patternStyles.tipItem} ${styles.sidebarListItem}`}>You can press Enter or click Submit Guess.</li>
              <li className={`${patternStyles.tipItem} ${styles.sidebarListItem}`}>
                After a correct answer, next round starts automatically in 2 seconds.
              </li>
              <li className={`${patternStyles.tipItem} ${styles.sidebarListItem}`}>
                Difficulty increases with score: easy, then medium, then hard.
              </li>
            </ul>
          </ArcadePanelCard>
        </>
      }
    />
  );
}
