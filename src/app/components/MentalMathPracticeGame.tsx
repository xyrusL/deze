"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./MentalMathPracticeGame.module.css";
import ArcadeGamePattern from "./game-layout/ArcadeGamePattern";
import ArcadeGameStage from "./game-layout/ArcadeGameStage";
import ArcadePanelCard from "./game-layout/ArcadePanelCard";
import patternStyles from "./game-layout/ArcadeGamePattern.module.css";

type Operator = "+" | "-" | "×" | "÷";
type GamePhase = "setup" | "quiz" | "summary";

type Settings = {
  digits: number;
  questionCount: number;
  operators: Operator[];
};

type Question = {
  id: number;
  left: number;
  right: number;
  operator: Operator;
  answer: number;
};

type QuestionResult = {
  question: Question;
  userAnswer: number | null;
  isCorrect: boolean;
  elapsedMs: number;
  wrongAttempts: number;
};

const ALL_OPERATORS: readonly Operator[] = ["+", "-", "×", "÷"] as const;

const DEFAULT_SETTINGS: Settings = {
  digits: 2,
  questionCount: 10,
  operators: ["+", "-", "×"],
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomOperand(digits: number): number {
  const min = digits === 1 ? 0 : 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return randomInt(min, max);
}

function createQuestion(operator: Operator, digits: number, id: number): Question {
  if (operator === "+") {
    const left = randomOperand(digits);
    const right = randomOperand(digits);
    return { id, left, right, operator, answer: left + right };
  }

  if (operator === "-") {
    const a = randomOperand(digits);
    const b = randomOperand(digits);
    const left = Math.max(a, b);
    const right = Math.min(a, b);
    return { id, left, right, operator, answer: left - right };
  }

  if (operator === "×") {
    const left = randomOperand(digits);
    const right = randomOperand(digits);
    return { id, left, right, operator, answer: left * right };
  }

  const right = Math.max(1, randomOperand(digits));
  const quotient = randomOperand(digits);
  const left = right * quotient;
  return { id, left, right, operator, answer: quotient };
}

function generateQuestions(settings: Settings): Question[] {
  return Array.from({ length: settings.questionCount }, (_, index) => {
    const operator = settings.operators[randomInt(0, settings.operators.length - 1)];
    return createQuestion(operator, settings.digits, index + 1);
  });
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function MentalMathPracticeGame() {
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState("");
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeElapsedMs, setActiveElapsedMs] = useState(0);
  const [wrongAttemptsByQuestion, setWrongAttemptsByQuestion] = useState<Record<number, number>>({});
  const [showStuckPrompt, setShowStuckPrompt] = useState(false);

  const questionStartRef = useRef(0);
  const submitLockRef = useRef(false);
  const stuckPromptQuestionIdRef = useRef<number | null>(null);

  const currentQuestion = questions[questionIndex] ?? null;

  const correctCount = useMemo(() => results.filter((item) => item.isCorrect).length, [results]);
  const averageMs = results.length > 0 ? results.reduce((sum, item) => sum + item.elapsedMs, 0) / results.length : 0;
  const totalWrongAttempts = useMemo(
    () => results.reduce((sum, item) => sum + item.wrongAttempts, 0),
    [results]
  );
  const totalAttempts = results.length + totalWrongAttempts;
  const submissionAccuracy = totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0;
  const firstTryCorrectCount = useMemo(
    () => results.filter((item) => item.wrongAttempts === 0).length,
    [results]
  );

  const difficultyScore = useMemo(() => {
    const digitsScore = Math.max(0, settings.digits - 1);
    const operatorsScore = Math.max(0, settings.operators.length - 1);
    const questionCountScore = settings.questionCount >= 30 ? 2 : settings.questionCount >= 15 ? 1 : 0;
    return digitsScore + operatorsScore + questionCountScore;
  }, [settings]);

  const performanceRating = useMemo(() => {
    const avgSeconds = averageMs / 1000;
    const fastThreshold = difficultyScore >= 5 ? 20 : 14;
    const okayThreshold = difficultyScore >= 5 ? 35 : 24;

    if (submissionAccuracy >= 90 && avgSeconds <= fastThreshold) {
      return "Great";
    }

    if (submissionAccuracy >= 70 && avgSeconds <= okayThreshold) {
      return "Okay";
    }

    return "Needs Practice";
  }, [averageMs, difficultyScore, submissionAccuracy]);

  const coachingTip = useMemo(() => {
    if (performanceRating === "Great") {
      return "Strong run. Try increasing digits or operators, or aim to beat your current pace.";
    }

    if (performanceRating === "Okay") {
      if (submissionAccuracy < 85) {
        return "Solid progress. Slow down slightly and prioritize clean first-try answers.";
      }
      return "Accuracy is steady. Keep this setup and push for a slightly faster average time.";
    }

    return "Keep it simple: reduce setup difficulty, practice one operator at a time, then build back up.";
  }, [performanceRating, submissionAccuracy]);

  const startQuiz = useCallback((nextSettings: Settings) => {
    const nextQuestions = generateQuestions(nextSettings);

    setQuestions(nextQuestions);
    setResults([]);
    setQuestionIndex(0);
    setAnswerInput("");
    setActiveElapsedMs(0);
    setWrongAttemptsByQuestion({});
    setShowStuckPrompt(false);
    setFormError(null);
    submitLockRef.current = false;
    stuckPromptQuestionIdRef.current = null;
    questionStartRef.current = Date.now();
    setPhase("quiz");
  }, []);

  const completeCurrentQuestion = useCallback(
    (rawAnswer: string | null) => {
      if (phase !== "quiz" || !currentQuestion || submitLockRef.current) {
        return;
      }

      submitLockRef.current = true;

      const elapsedRaw = Date.now() - questionStartRef.current;
      const elapsedMs = Math.max(elapsedRaw, 0);

      const normalized = rawAnswer?.trim() ?? "";
      const parsedAnswer = normalized.length > 0 && Number.isFinite(Number(normalized)) ? Number(normalized) : null;
      const isCorrect = parsedAnswer !== null && parsedAnswer === currentQuestion.answer;

      if (!isCorrect) {
        setWrongAttemptsByQuestion((current) => ({
          ...current,
          [currentQuestion.id]: (current[currentQuestion.id] ?? 0) + 1,
        }));
        setFormError("Not quite. Keep going — you can solve this one.");
        submitLockRef.current = false;
        return;
      }

      const result: QuestionResult = {
        question: currentQuestion,
        userAnswer: parsedAnswer,
        isCorrect,
        elapsedMs,
        wrongAttempts: wrongAttemptsByQuestion[currentQuestion.id] ?? 0,
      };

      const isLastQuestion = questionIndex >= questions.length - 1;
      const nextResults = [...results, result];
      setResults(nextResults);

      if (isLastQuestion) {
        setPhase("summary");
        setActiveElapsedMs(0);
        setShowStuckPrompt(false);
        return;
      }

      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setAnswerInput("");
      setActiveElapsedMs(0);
      setShowStuckPrompt(false);
      setFormError(null);
      questionStartRef.current = Date.now();
      submitLockRef.current = false;
    },
    [currentQuestion, phase, questionIndex, questions.length, results, wrongAttemptsByQuestion]
  );

  useEffect(() => {
    if (phase !== "quiz" || !currentQuestion) {
      return;
    }

    const timerId = window.setInterval(() => {
      const elapsed = Math.max(0, Date.now() - questionStartRef.current);
      setActiveElapsedMs(elapsed);

      if (elapsed >= 5 * 60 * 1000 && stuckPromptQuestionIdRef.current !== currentQuestion.id) {
        stuckPromptQuestionIdRef.current = currentQuestion.id;
        setShowStuckPrompt(true);
      }
    }, 100);

    return () => {
      window.clearInterval(timerId);
    };
  }, [currentQuestion, phase]);

  const handleSetupSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (settings.operators.length === 0) {
      setFormError("Pick at least one operator.");
      return;
    }
    startQuiz(settings);
  };

  const handleQuizSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    completeCurrentQuestion(answerInput);
  };

  const toggleOperator = (operator: Operator) => {
    setSettings((current) => {
      const exists = current.operators.includes(operator);
      const operators = exists ? current.operators.filter((item) => item !== operator) : [...current.operators, operator];
      return { ...current, operators };
    });
  };

  const progressLabel = `${Math.min(questionIndex + 1, questions.length)} / ${questions.length}`;

  return (
    <ArcadeGamePattern
      className={styles.container}
      board={
        <ArcadeGameStage className={styles.stage} shellClassName={styles.stageShell}>
          <div className={styles.boardContent}>
            {phase === "setup" && (
              <form className={styles.form} onSubmit={handleSetupSubmit}>
                <h2 className={styles.title}>Mental Math Practice</h2>
                <p className={styles.subtitle}>Configure your quiz, then start practicing.</p>

                <label className={styles.fieldLabel} htmlFor="digits">
                  Number of digits
                </label>
                <input
                  id="digits"
                  className={styles.input}
                  type="number"
                  min={1}
                  max={4}
                  value={settings.digits}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setSettings((current) => ({ ...current, digits: Number.isFinite(value) ? Math.min(4, Math.max(1, value)) : current.digits }));
                  }}
                />

                <label className={styles.fieldLabel} htmlFor="questionCount">
                  Number of questions
                </label>
                <input
                  id="questionCount"
                  className={styles.input}
                  type="number"
                  min={3}
                  max={50}
                  value={settings.questionCount}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setSettings((current) => ({
                      ...current,
                      questionCount: Number.isFinite(value) ? Math.min(50, Math.max(3, value)) : current.questionCount,
                    }));
                  }}
                />

                <fieldset className={styles.operatorFieldset}>
                  <legend className={styles.fieldLabel}>Operators</legend>
                  <div className={styles.operatorGrid}>
                    {ALL_OPERATORS.map((operator) => {
                      const selected = settings.operators.includes(operator);
                      return (
                        <label key={operator} className={`${styles.operatorChip} ${selected ? styles.operatorChipActive : ""}`}>
                          <input
                            className={styles.operatorCheckbox}
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleOperator(operator)}
                          />
                          <span>{operator}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {formError ? <p className={styles.errorText}>{formError}</p> : null}

                <button type="submit" className={styles.primaryButton}>
                  Start Practice
                </button>
              </form>
            )}

            {phase === "quiz" && currentQuestion && (
              <form className={styles.quiz} onSubmit={handleQuizSubmit}>
                <div className={styles.quizHeader}>
                  <span className={styles.badge}>Question {progressLabel}</span>
                  <span className={styles.badge}>Time: {formatDuration(activeElapsedMs)}</span>
                </div>

                <p className={styles.prompt}>
                  {currentQuestion.left} {currentQuestion.operator} {currentQuestion.right} = ?
                </p>

                <label className={styles.fieldLabel} htmlFor="answerInput">
                  Your answer
                </label>
                <input
                  id="answerInput"
                  className={styles.input}
                  value={answerInput}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setAnswerInput(nextValue);
                    setFormError(null);

                    if (!currentQuestion) {
                      return;
                    }

                    const normalized = nextValue.trim();
                    if (normalized.length === 0) {
                      return;
                    }

                    const parsed = Number(normalized);
                    if (Number.isFinite(parsed) && parsed === currentQuestion.answer) {
                      completeCurrentQuestion(nextValue);
                    }
                  }}
                  inputMode="numeric"
                  autoComplete="off"
                />

                {formError ? <p className={styles.errorText}>{formError}</p> : null}

                <button type="submit" className={styles.primaryButton}>
                  Submit Answer
                </button>

                {showStuckPrompt ? (
                  <div className={styles.stuckPrompt} role="alertdialog" aria-live="polite" aria-label="Need help decision">
                    <p className={styles.stuckPromptTitle}>This one is taking a while.</p>
                    <p className={styles.stuckPromptText}>
                      You have been on this question for around 5 minutes. Continue, or reset and change your setup.
                    </p>
                    <div className={styles.stuckPromptActions}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => {
                          setShowStuckPrompt(false);
                          setFormError(null);
                        }}
                      >
                        Continue Question
                      </button>
                      <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={() => {
                          setPhase("setup");
                          setQuestions([]);
                          setResults([]);
                          setQuestionIndex(0);
                          setAnswerInput("");
                          setActiveElapsedMs(0);
                          setWrongAttemptsByQuestion({});
                          setShowStuckPrompt(false);
                          setFormError(null);
                          submitLockRef.current = false;
                          stuckPromptQuestionIdRef.current = null;
                        }}
                      >
                        Reset / Change Setup
                      </button>
                    </div>
                  </div>
                ) : null}
              </form>
            )}

            {phase === "summary" && (
              <section className={styles.summary}>
                <h2 className={styles.title}>Session Complete</h2>
                <div className={styles.summaryStats}>
                  <p className={styles.statLine}>Total questions: {results.length}</p>
                  <p className={styles.statLine}>Correct: {correctCount}</p>
                  <p className={styles.statLine}>Wrong attempts: {totalWrongAttempts}</p>
                  <p className={styles.statLine}>Submission accuracy: {submissionAccuracy.toFixed(0)}%</p>
                  <p className={styles.statLine}>First-try correct: {firstTryCorrectCount}</p>
                  <p className={styles.statLine}>Average time: {formatDuration(averageMs)}</p>
                  <p className={styles.statLine}>Rating: {performanceRating}</p>
                  <p className={styles.statLine}>{coachingTip}</p>
                </div>

                <div className={styles.summaryButtons}>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => {
                      startQuiz(settings);
                    }}
                  >
                    Play Again
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      setPhase("setup");
                      setShowStuckPrompt(false);
                      setFormError(null);
                    }}
                  >
                    Change Setup
                  </button>
                </div>
              </section>
            )}
          </div>
        </ArcadeGameStage>
      }
      sidebar={
        <>
          <ArcadePanelCard title="Quick Rules" ariaLabel="Mental Math rules">
            <ul className={patternStyles.tipList}>
              <li className={patternStyles.tipItem}>Each question tracks how long you take to answer.</li>
              <li className={patternStyles.tipItem}>Division questions always have whole-number answers.</li>
              <li className={patternStyles.tipItem}>Use Play Again to instantly retry with the same setup.</li>
            </ul>
          </ArcadePanelCard>

          <ArcadePanelCard title="Per-question Times" ariaLabel="Question timing details">
            {results.length === 0 ? (
              <p className={styles.emptyText}>Timing details appear after your run.</p>
            ) : (
              <ol className={styles.resultsList}>
                {results.map((item, index) => (
                  <li key={item.question.id} className={styles.resultItem}>
                    <div className={styles.resultTopRow}>
                      <span>
                        Q{index + 1}: {item.question.left} {item.question.operator} {item.question.right}
                      </span>
                      <span>{formatDuration(item.elapsedMs)}</span>
                    </div>
                    <div className={styles.resultBottomRow}>
                      <span>Answer: {item.userAnswer ?? "—"}</span>
                      <span className={item.isCorrect ? styles.correct : styles.incorrect}>{item.isCorrect ? "Correct" : "Incorrect"}</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </ArcadePanelCard>
        </>
      }
    />
  );
}
