"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./SnakeGame.module.css";
import TouchGameController from "./game-controls/TouchGameController";
import ArcadeGamePattern from "./game-layout/ArcadeGamePattern";
import ArcadePanelCard from "./game-layout/ArcadePanelCard";
import patternStyles from "./game-layout/ArcadeGamePattern.module.css";

const CANVAS_SIZE = 400;
const CELL_SIZE = 20;
const GRID_SIZE = CANVAS_SIZE / CELL_SIZE;
const BASE_TICK_MS = 140;
const MIN_TICK_MS = 78;
const SPEED_STEP_MS = 4;
const MAX_INPUT_QUEUE = 2;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };
type GameStatus = "ready" | "playing" | "paused" | "gameover";
type DevicePlatform = "desktop" | "ios" | "android";

const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

const DIRECTION_VECTORS: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

function manhattanDistance(a: Position, b: Position): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function directionToAngle(direction: Direction): number {
  switch (direction) {
    case "UP":
      return -Math.PI / 2;
    case "DOWN":
      return Math.PI / 2;
    case "LEFT":
      return Math.PI;
    case "RIGHT":
    default:
      return 0;
  }
}

function createInitialSnake(direction: Direction): Position[] {
  const head = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) };
  const tailVector = DIRECTION_VECTORS[OPPOSITE_DIRECTION[direction]];

  return [
    head,
    { x: head.x + tailVector.x, y: head.y + tailVector.y },
    { x: head.x + tailVector.x * 2, y: head.y + tailVector.y * 2 },
  ];
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const directionRef = useRef<Direction>("RIGHT");
  const inputQueueRef = useRef<Direction[]>([]);
  const scoreRef = useRef(0);

  const [snake, setSnake] = useState<Position[]>(() => createInitialSnake("RIGHT"));
  const [food, setFood] = useState<Position | null>(() => {
    const initialSnake = createInitialSnake("RIGHT");
    const occupied = new Set(initialSnake.map((segment) => `${segment.x},${segment.y}`));
    const freeCells: Position[] = [];

    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        if (!occupied.has(`${x},${y}`)) {
          freeCells.push({ x, y });
        }
      }
    }

    const safeCells = freeCells.filter((cell) => manhattanDistance(cell, initialSnake[0]) > 2);
    const spawnPool = safeCells.length > 0 ? safeCells : freeCells;
    return spawnPool.length > 0 ? spawnPool[Math.floor(Math.random() * spawnPool.length)] : null;
  });
  const [status, setStatus] = useState<GameStatus>("ready");
  const [didWin, setDidWin] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }

    const storedBest = Number(window.localStorage.getItem("snake-best-score") || "0");
    return Number.isNaN(storedBest) || storedBest < 0 ? 0 : storedBest;
  });
  const [tickMs, setTickMs] = useState(BASE_TICK_MS);
  const [platform, setPlatform] = useState<DevicePlatform>("desktop");
  const [hasCoarsePointer, setHasCoarsePointer] = useState(false);

  const isPlaying = status === "playing";
  const isPaused = status === "paused";
  const isIOS = platform === "ios";
  const isAndroid = platform === "android";
  const isDesktopPlatform = platform === "desktop" && !hasCoarsePointer;

  useEffect(() => {
    const detectEnvironment = () => {
      const userAgent = window.navigator.userAgent || "";
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches;
      const isiOS = /iPad|iPhone|iPod/i.test(userAgent) || (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
      const isAndroidDevice = /Android/i.test(userAgent);

      const nextPlatform: DevicePlatform = isiOS ? "ios" : isAndroidDevice ? "android" : "desktop";
      setPlatform(nextPlatform);
      setHasCoarsePointer(coarsePointer || nextPlatform !== "desktop");
    };

    detectEnvironment();

    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const onViewportChange = () => detectEnvironment();

    coarseQuery.addEventListener("change", onViewportChange);
    window.addEventListener("resize", onViewportChange);

    return () => {
      coarseQuery.removeEventListener("change", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
    };
  }, []);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const generateFood = useCallback((currentSnake: Position[]): Position | null => {
    const occupied = new Set(currentSnake.map((segment) => `${segment.x},${segment.y}`));
    const freeCells: Position[] = [];

    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        if (!occupied.has(`${x},${y}`)) {
          freeCells.push({ x, y });
        }
      }
    }

    if (freeCells.length === 0) {
      return null;
    }

    const head = currentSnake[0];
    const safeCells = freeCells.filter((cell) => manhattanDistance(cell, head) > 2);
    const spawnPool = safeCells.length > 0 ? safeCells : freeCells;

    return spawnPool[Math.floor(Math.random() * spawnPool.length)];
  }, []);

  const persistBestScore = useCallback((nextScore: number) => {
    setBestScore((currentBest) => {
      const nextBest = Math.max(currentBest, nextScore);
      if (nextBest !== currentBest && typeof window !== "undefined") {
        window.localStorage.setItem("snake-best-score", String(nextBest));
      }
      return nextBest;
    });
  }, []);

  const endGame = useCallback(
    (won: boolean) => {
      setDidWin(won);
      setStatus("gameover");
      inputQueueRef.current = [];
      persistBestScore(scoreRef.current);
    },
    [persistBestScore]
  );

  const startGame = useCallback(
    (startingDirection: Direction = "RIGHT") => {
      const initialSnake = createInitialSnake(startingDirection);
      const nextFood = generateFood(initialSnake);

      directionRef.current = startingDirection;
      inputQueueRef.current = [];

      setSnake(initialSnake);
      setFood(nextFood);
      setStatus("playing");
      setDidWin(false);
      setScore(0);
      scoreRef.current = 0;
      setTickMs(BASE_TICK_MS);
    },
    [generateFood]
  );

  const queueDirection = useCallback((nextDirection: Direction) => {
    const queue = inputQueueRef.current;
    const referenceDirection = queue.length > 0 ? queue[queue.length - 1] : directionRef.current;

    if (nextDirection === referenceDirection || OPPOSITE_DIRECTION[nextDirection] === referenceDirection) {
      return;
    }

    if (queue.length < MAX_INPUT_QUEUE) {
      queue.push(nextDirection);
    }
  }, []);

  const pauseGame = useCallback(() => {
    setStatus((currentStatus) => {
      if (currentStatus !== "playing") {
        return currentStatus;
      }
      inputQueueRef.current = [];
      return "paused";
    });
  }, []);

  const resumeGame = useCallback(() => {
    setStatus((currentStatus) => (currentStatus === "paused" ? "playing" : currentStatus));
  }, []);

  const handleDirectionalInput = useCallback(
    (nextDirection: Direction) => {
      if (status === "ready" || status === "gameover") {
        startGame(nextDirection);
        return;
      }

      if (status === "paused") {
        queueDirection(nextDirection);
        resumeGame();
        return;
      }

      queueDirection(nextDirection);
    },
    [queueDirection, resumeGame, startGame, status]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const directionByKey: Record<string, Direction> = {
        arrowup: "UP",
        w: "UP",
        arrowdown: "DOWN",
        s: "DOWN",
        arrowleft: "LEFT",
        a: "LEFT",
        arrowright: "RIGHT",
        d: "RIGHT",
      };

      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " ", "enter", "p", "r"].includes(key)) {
        event.preventDefault();
      }

      if (key === " " || key === "enter") {
        if (status === "playing") {
          pauseGame();
          return;
        }

        if (status === "paused") {
          resumeGame();
          return;
        }

        if (status === "ready" || status === "gameover") {
          startGame("RIGHT");
        }
        return;
      }

      if (key === "p") {
        if (status === "playing") {
          pauseGame();
          return;
        }

        if (status === "paused") {
          resumeGame();
        }
        return;
      }

      if (key === "r") {
        startGame("RIGHT");
        return;
      }

      const mappedDirection = directionByKey[key];
      if (mappedDirection) {
        handleDirectionalInput(mappedDirection);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDirectionalInput, pauseGame, resumeGame, startGame, status]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setSnake((previousSnake) => {
        let nextDirection = directionRef.current;
        while (inputQueueRef.current.length > 0) {
          const candidate = inputQueueRef.current.shift();
          if (!candidate) {
            break;
          }
          if (candidate !== nextDirection && OPPOSITE_DIRECTION[candidate] !== nextDirection) {
            nextDirection = candidate;
            break;
          }
        }

        directionRef.current = nextDirection;
        const move = DIRECTION_VECTORS[nextDirection];
        const nextHead = {
          x: previousSnake[0].x + move.x,
          y: previousSnake[0].y + move.y,
        };

        if (nextHead.x < 0 || nextHead.x >= GRID_SIZE || nextHead.y < 0 || nextHead.y >= GRID_SIZE) {
          endGame(false);
          return previousSnake;
        }

        const isEating = Boolean(food && positionsEqual(nextHead, food));
        const collisionBody = isEating ? previousSnake : previousSnake.slice(0, -1);
        if (collisionBody.some((segment) => positionsEqual(segment, nextHead))) {
          endGame(false);
          return previousSnake;
        }

        const nextSnake = [nextHead, ...previousSnake];

        if (isEating) {
          setScore((currentScore) => {
            const nextScore = currentScore + 10;
            persistBestScore(nextScore);
            return nextScore;
          });
          setTickMs((currentTickMs) => Math.max(MIN_TICK_MS, currentTickMs - SPEED_STEP_MS));

          const nextFood = generateFood(nextSnake);
          if (!nextFood) {
            setFood(null);
            endGame(true);
            return nextSnake;
          }

          setFood(nextFood);
          return nextSnake;
        }

        nextSnake.pop();
        return nextSnake;
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [endGame, food, generateFood, isPlaying, persistBestScore, tickMs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const toCenter = (segment: Position) => ({
      x: segment.x * CELL_SIZE + CELL_SIZE / 2,
      y: segment.y * CELL_SIZE + CELL_SIZE / 2,
    });

    const drawSmoothPath = (points: Array<{ x: number; y: number }>, yOffset = 0) => {
      context.beginPath();
      context.moveTo(points[0].x, points[0].y + yOffset);

      for (let index = 1; index < points.length - 1; index += 1) {
        const midpointX = (points[index].x + points[index + 1].x) / 2;
        const midpointY = (points[index].y + points[index + 1].y) / 2;
        context.quadraticCurveTo(points[index].x, points[index].y + yOffset, midpointX, midpointY + yOffset);
      }

      const tail = points[points.length - 1];
      context.lineTo(tail.x, tail.y + yOffset);
    };

    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const boardGradient = context.createLinearGradient(0, 0, 0, CANVAS_SIZE);
    boardGradient.addColorStop(0, "#060f16");
    boardGradient.addColorStop(1, "#05090e");
    context.fillStyle = boardGradient;
    context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    for (let index = 0; index <= GRID_SIZE; index += 1) {
      context.strokeStyle = "rgba(140, 223, 206, 0.07)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(index * CELL_SIZE, 0);
      context.lineTo(index * CELL_SIZE, CANVAS_SIZE);
      context.stroke();

      context.beginPath();
      context.moveTo(0, index * CELL_SIZE);
      context.lineTo(CANVAS_SIZE, index * CELL_SIZE);
      context.stroke();
    }

    if (food) {
      const foodCenter = toCenter(food);
      const foodGradient = context.createRadialGradient(foodCenter.x - 3, foodCenter.y - 3, 2, foodCenter.x, foodCenter.y, CELL_SIZE / 2 + 3);
      foodGradient.addColorStop(0, "#ffd9f4");
      foodGradient.addColorStop(0.55, "#ff5fd2");
      foodGradient.addColorStop(1, "#8b1fb4");

      context.shadowColor = "rgba(255, 95, 210, 0.75)";
      context.shadowBlur = 14;
      context.fillStyle = foodGradient;
      context.beginPath();
      context.arc(foodCenter.x, foodCenter.y, CELL_SIZE * 0.33, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;

      context.fillStyle = "#7fffd2";
      context.beginPath();
      context.ellipse(foodCenter.x + 1, foodCenter.y - CELL_SIZE * 0.34, 3, 2, Math.PI / 6, 0, Math.PI * 2);
      context.fill();
    }

    const centers = snake.map(toCenter);
    if (centers.length > 1) {
      const headCenter = centers[0];
      const tailCenter = centers[centers.length - 1];

      context.lineCap = "round";
      context.lineJoin = "round";

      context.shadowColor = "rgba(82, 255, 195, 0.35)";
      context.shadowBlur = 10;
      context.strokeStyle = "#103f34";
      context.lineWidth = CELL_SIZE * 0.78;
      drawSmoothPath(centers);
      context.stroke();

      const bodyGradient = context.createLinearGradient(headCenter.x, headCenter.y, tailCenter.x, tailCenter.y);
      bodyGradient.addColorStop(0, "#4dffc1");
      bodyGradient.addColorStop(0.45, "#2ac789");
      bodyGradient.addColorStop(1, "#0d6a4b");

      context.strokeStyle = bodyGradient;
      context.lineWidth = CELL_SIZE * 0.62;
      drawSmoothPath(centers);
      context.stroke();

      context.strokeStyle = "rgba(212, 255, 236, 0.26)";
      context.lineWidth = CELL_SIZE * 0.24;
      drawSmoothPath(centers, -CELL_SIZE * 0.06);
      context.stroke();
      context.shadowBlur = 0;
    }

    for (let index = snake.length - 1; index >= 1; index -= 1) {
      const center = centers[index];
      const progress = 1 - index / Math.max(1, snake.length - 1);
      const radius = CELL_SIZE * (0.24 + progress * 0.14);
      const segmentGradient = context.createRadialGradient(center.x - 2, center.y - 2, 1, center.x, center.y, radius);
      segmentGradient.addColorStop(0, "#a9ffe0");
      segmentGradient.addColorStop(0.65, "#3ac996");
      segmentGradient.addColorStop(1, "#11664a");
      context.fillStyle = segmentGradient;
      context.beginPath();
      context.arc(center.x, center.y, radius, 0, Math.PI * 2);
      context.fill();
    }

    const head = centers[0];
    const headAngle = directionToAngle(directionRef.current);
    context.save();
    context.translate(head.x, head.y);
    context.rotate(headAngle);

    const headGradient = context.createRadialGradient(-2, -2, 2, 0, 0, CELL_SIZE * 0.7);
    headGradient.addColorStop(0, "#dcffef");
    headGradient.addColorStop(0.42, "#59eeb2");
    headGradient.addColorStop(1, "#168b60");
    context.fillStyle = headGradient;
    context.beginPath();
    context.ellipse(0, 0, CELL_SIZE * 0.6, CELL_SIZE * 0.5, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "rgba(255, 255, 255, 0.42)";
    context.beginPath();
    context.ellipse(-CELL_SIZE * 0.12, -CELL_SIZE * 0.14, CELL_SIZE * 0.22, CELL_SIZE * 0.13, -0.5, 0, Math.PI * 2);
    context.fill();

    for (const eyeY of [-CELL_SIZE * 0.15, CELL_SIZE * 0.15]) {
      context.fillStyle = "#eefdf6";
      context.beginPath();
      context.arc(CELL_SIZE * 0.2, eyeY, CELL_SIZE * 0.09, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#0d2a20";
      context.beginPath();
      context.arc(CELL_SIZE * 0.24, eyeY, CELL_SIZE * 0.045, 0, Math.PI * 2);
      context.fill();
    }

    if (isPlaying) {
      context.strokeStyle = "#ff88cd";
      context.lineWidth = 2;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(CELL_SIZE * 0.52, 0);
      context.lineTo(CELL_SIZE * 0.83, -3);
      context.moveTo(CELL_SIZE * 0.52, 0);
      context.lineTo(CELL_SIZE * 0.83, 3);
      context.stroke();
    }
    context.restore();
  }, [food, isPlaying, snake]);

  const statusMessage = isPaused ? "Paused" : didWin ? "Board Cleared" : "Game Over";
  const primaryActionLabel = isPaused ? "Resume" : isPlaying ? "Restart" : status === "gameover" ? "Play Again" : "Start";
  const speedLevel = Math.round((BASE_TICK_MS / tickMs) * 100);
  const controllerTitle = isDesktopPlatform ? "Quick Actions" : isIOS ? "iOS Touch Controls" : "Android Touch Controls";
  const controllerDescription = isDesktopPlatform
    ? "Keyboard is primary on desktop. Buttons remain available for quick resets and pause."
    : isIOS
      ? "Precision cross-pad with safe-area spacing for comfortable iPhone/iPad thumb reach."
      : "Fast Android-oriented row layout for two-thumb taps in portrait and landscape.";
  const overlayInstructions = isDesktopPlatform
    ? "Use Arrow Keys / WASD. Space or P pauses, R restarts."
    : isIOS
      ? "Use the iOS touch controls below."
      : "Use the Android touch controls below.";
  const keyboardHints = [
    { action: "Move", keys: ["↑", "↓", "←", "→", "W", "A", "S", "D"] },
    { action: "Start", keys: ["Space", "Enter"] },
    { action: "Pause / Resume", keys: ["P", "Space"] },
    { action: "Restart", keys: ["R"] },
  ] as const;
  const touchHints = isIOS
    ? [
        "Cross D-pad supports precise turns and quick direction changes.",
        "Bottom spacing respects iOS safe areas and gesture navigation zones.",
        "Action buttons stay in thumb range for start, pause, and restart.",
      ]
    : [
        "Horizontal D-pad row is tuned for Android two-thumb tapping.",
        "Action buttons remain reachable in portrait and landscape.",
        "Bottom spacing avoids interference with gesture and nav bars.",
      ];
  const canPauseOrResume = isPlaying || isPaused;
  const containerClassName = [
    styles.container,
    isDesktopPlatform ? styles.platformDesktop : styles.platformTouch,
    styles.orientationPortrait,
  ]
    .filter(Boolean)
    .join(" ");
  const controllerClassName = [styles.controller, isIOS ? styles.controllerIOS : "", isAndroid ? styles.controllerAndroid : ""]
    .filter(Boolean)
    .join(" ");
  const handlePrimaryAction = () => {
    if (isPaused) {
      resumeGame();
      return;
    }

    startGame("RIGHT");
  };
  const handlePauseResumeAction = () => {
    if (isPlaying) {
      pauseGame();
      return;
    }

    if (isPaused) {
      resumeGame();
    }
  };

  return (
    <ArcadeGamePattern
      className={containerClassName}
      board={
        <div className={styles.gameWrapper}>
            <div className={styles.hud}>
              <div className={styles.hudPrimary}>
                <span className={styles.statPill}>Score: {score}</span>
                <span className={styles.statPill}>Best: {bestScore}</span>
              </div>
              <span className={`${styles.statPill} ${styles.speedPill}`}>Speed: {speedLevel}%</span>
            </div>

            <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className={styles.canvas} tabIndex={0} aria-label="Snake game board" />

            {!isPlaying && (
              <div className={styles.overlay}>
                <h3 className={styles.overlayTitle}>{status === "ready" ? "Ready?" : statusMessage}</h3>
                {status === "gameover" && <p className={styles.overlayScore}>Final score: {score}</p>}
                <button type="button" onClick={handlePrimaryAction} className={styles.playButton}>
                  {primaryActionLabel}
                </button>
                <p className={styles.instructions}>{overlayInstructions}</p>
              </div>
            )}
          </div>
      }
      sidebar={
        <>
          <ArcadePanelCard title={isDesktopPlatform ? "Keyboard Hints" : "Touch Tips"} ariaLabel={isDesktopPlatform ? "Keyboard control hints" : "Touch control tips"}>
            {isDesktopPlatform ? (
              <ul className={patternStyles.keyHintList}>
                {keyboardHints.map((hint) => (
                  <li key={hint.action} className={patternStyles.keyHintItem}>
                    <span className={patternStyles.keyHintAction}>{hint.action}</span>
                    <span className={patternStyles.keyHintKeys}>
                      {hint.keys.map((key) => (
                        <span key={`${hint.action}-${key}`} className={patternStyles.keyBadge}>
                          {key}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={patternStyles.tipList}>
                {touchHints.map((hint) => (
                  <li key={hint} className={patternStyles.tipItem}>
                    {hint}
                  </li>
                ))}
              </ul>
            )}
          </ArcadePanelCard>

          <ArcadePanelCard>
            <div className={patternStyles.controllerDock}>
            <TouchGameController
              className={controllerClassName}
              title={controllerTitle}
              description={controllerDescription}
              primaryAction={{
                label: primaryActionLabel,
                ariaLabel: isPaused ? "Resume game" : "Start or restart game",
                onAction: handlePrimaryAction,
                icon: isPaused ? "▶" : isPlaying ? "↺" : "▶",
                variant: isPlaying ? "accent" : "primary",
              }}
              secondaryAction={
                canPauseOrResume
                  ? {
                      label: isPaused ? "Resume" : "Pause",
                      ariaLabel: isPaused ? "Resume game" : "Pause game",
                      onAction: handlePauseResumeAction,
                      icon: isPaused ? "▶" : "Ⅱ",
                      variant: "secondary",
                    }
                  : undefined
              }
              directionalPad={
                isDesktopPlatform
                  ? undefined
                  : {
                      layout: isIOS ? "cross" : "row",
                      up: {
                        label: "↑",
                        ariaLabel: "Move up",
                        onAction: () => handleDirectionalInput("UP"),
                        variant: "secondary",
                      },
                      left: {
                        label: "←",
                        ariaLabel: "Move left",
                        onAction: () => handleDirectionalInput("LEFT"),
                        variant: "secondary",
                      },
                      right: {
                        label: "→",
                        ariaLabel: "Move right",
                        onAction: () => handleDirectionalInput("RIGHT"),
                        variant: "secondary",
                      },
                      down: {
                        label: "↓",
                        ariaLabel: "Move down",
                        onAction: () => handleDirectionalInput("DOWN"),
                        variant: "secondary",
                      },
                    }
              }
            />
            </div>
          </ArcadePanelCard>
        </>
      }
    />
  );
}
