"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./NeonDodgerGame.module.css";
import TouchGameController from "./game-controls/TouchGameController";
import ArcadeGamePattern from "./game-layout/ArcadeGamePattern";
import ArcadePanelCard from "./game-layout/ArcadePanelCard";
import ArcadeGameStage from "./game-layout/ArcadeGameStage";
import patternStyles from "./game-layout/ArcadeGamePattern.module.css";

const WORLD_WIDTH = 360;
const WORLD_HEIGHT = 640;
const LANE_COUNT = 3;
const LANE_WIDTH = WORLD_WIDTH / LANE_COUNT;
const PLAYER_Y = WORLD_HEIGHT - 92;
const PLAYER_WIDTH = 58;
const PLAYER_HEIGHT = 46;
const OBSTACLE_WIDTH = 62;
const OBSTACLE_HEIGHT = 44;

type GameStatus = "ready" | "playing" | "gameover";
type Obstacle = {
  id: number;
  lane: number;
  y: number;
  counted: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function NeonDodgerGame() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const spawnCooldownRef = useRef(0);
  const nextObstacleIdRef = useRef(1);

  const playerLaneRef = useRef(1);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const speedRef = useRef(220);
  const scoreRef = useRef(0);

  const [status, setStatus] = useState<GameStatus>("ready");
  const [lane, setLane] = useState(1);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }
    const stored = Number(window.localStorage.getItem("neon-dodger-best") || "0");
    return Number.isFinite(stored) && stored >= 0 ? stored : 0;
  });

  const persistBest = useCallback((candidate: number) => {
    setBestScore((current) => {
      const next = Math.max(current, candidate);
      if (next !== current && typeof window !== "undefined") {
        window.localStorage.setItem("neon-dodger-best", String(next));
      }
      return next;
    });
  }, []);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const scaleX = canvas.width / WORLD_WIDTH;
    const scaleY = canvas.height / WORLD_HEIGHT;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

    const bg = ctx.createLinearGradient(0, 0, 0, WORLD_HEIGHT);
    bg.addColorStop(0, "#110b27");
    bg.addColorStop(1, "#070910");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    for (let laneIndex = 0; laneIndex < LANE_COUNT; laneIndex += 1) {
      const x = laneIndex * LANE_WIDTH;
      ctx.strokeStyle = "rgba(143, 255, 247, 0.17)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, WORLD_HEIGHT);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(143, 255, 247, 0.17)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(WORLD_WIDTH, 0);
    ctx.lineTo(WORLD_WIDTH, WORLD_HEIGHT);
    ctx.stroke();

    for (const obstacle of obstaclesRef.current) {
      const x = obstacle.lane * LANE_WIDTH + (LANE_WIDTH - OBSTACLE_WIDTH) / 2;
      const y = obstacle.y;
      const obstacleGradient = ctx.createLinearGradient(x, y, x + OBSTACLE_WIDTH, y + OBSTACLE_HEIGHT);
      obstacleGradient.addColorStop(0, "#ff5f89");
      obstacleGradient.addColorStop(1, "#ff2f64");
      ctx.fillStyle = obstacleGradient;
      ctx.fillRect(x, y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
      ctx.strokeStyle = "rgba(255, 231, 240, 0.46)";
      ctx.strokeRect(x + 1, y + 1, OBSTACLE_WIDTH - 2, OBSTACLE_HEIGHT - 2);
    }

    const playerX = playerLaneRef.current * LANE_WIDTH + (LANE_WIDTH - PLAYER_WIDTH) / 2;
    const playerGradient = ctx.createLinearGradient(playerX, PLAYER_Y, playerX + PLAYER_WIDTH, PLAYER_Y + PLAYER_HEIGHT);
    playerGradient.addColorStop(0, "#2effdd");
    playerGradient.addColorStop(1, "#00a8ff");
    ctx.fillStyle = playerGradient;
    ctx.fillRect(playerX, PLAYER_Y, PLAYER_WIDTH, PLAYER_HEIGHT);

    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(playerX + 10, PLAYER_Y + 10, PLAYER_WIDTH - 20, PLAYER_HEIGHT - 20);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, []);

  const syncCanvasSize = useCallback(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) {
      return;
    }

    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextWidth = Math.max(1, Math.round(rect.width * dpr));
    const nextHeight = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      drawScene();
    }
  }, [drawScene]);

  const startGame = useCallback(() => {
    playerLaneRef.current = 1;
    obstaclesRef.current = [];
    speedRef.current = 220;
    scoreRef.current = 0;
    nextObstacleIdRef.current = 1;
    spawnCooldownRef.current = 0.25;
    lastFrameRef.current = 0;

    setLane(1);
    setScore(0);
    setStatus("playing");
  }, []);

  const moveLane = useCallback(
    (delta: number) => {
      if (status !== "playing") {
        return;
      }
      const next = clamp(playerLaneRef.current + delta, 0, LANE_COUNT - 1);
      playerLaneRef.current = next;
      setLane(next);
    },
    [status]
  );

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    syncCanvasSize();

    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        syncCanvasSize();
      });
      observer.observe(stage);
    }

    window.addEventListener("resize", syncCanvasSize);
    window.addEventListener("orientationchange", syncCanvasSize);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", syncCanvasSize);
      window.removeEventListener("orientationchange", syncCanvasSize);
    };
  }, [syncCanvasSize]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["arrowleft", "arrowright", "a", "d", "enter", "r", " "].includes(key)) {
        event.preventDefault();
      }

      if (key === "enter" || key === "r") {
        if (status === "ready" || status === "gameover") {
          startGame();
        }
        return;
      }

      if (status !== "playing") {
        return;
      }

      if (key === "arrowleft" || key === "a") {
        moveLane(-1);
      } else if (key === "arrowright" || key === "d") {
        moveLane(1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [moveLane, startGame, status]);

  useEffect(() => {
    if (status !== "playing") {
      drawScene();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const loop = (timestamp: number) => {
      if (!lastFrameRef.current) {
        lastFrameRef.current = timestamp;
      }
      const dt = Math.min((timestamp - lastFrameRef.current) / 1000, 0.032);
      lastFrameRef.current = timestamp;

      speedRef.current += dt * 6;

      spawnCooldownRef.current -= dt;
      if (spawnCooldownRef.current <= 0) {
        const laneIndex = Math.floor(Math.random() * LANE_COUNT);
        obstaclesRef.current = [
          ...obstaclesRef.current,
          {
            id: nextObstacleIdRef.current++,
            lane: laneIndex,
            y: -OBSTACLE_HEIGHT - 10,
            counted: false,
          },
        ];
        spawnCooldownRef.current = Math.max(0.42, 1.08 - scoreRef.current * 0.02);
      }

      obstaclesRef.current = obstaclesRef.current.map((obstacle) => ({ ...obstacle, y: obstacle.y + speedRef.current * dt }));

      for (const obstacle of obstaclesRef.current) {
        if (!obstacle.counted && obstacle.y > PLAYER_Y + PLAYER_HEIGHT + 4) {
          obstacle.counted = true;
          setScore((current) => {
            const next = current + 1;
            scoreRef.current = next;
            persistBest(next);
            return next;
          });
        }

        const sameLane = obstacle.lane === playerLaneRef.current;
        const overlapY = obstacle.y + OBSTACLE_HEIGHT > PLAYER_Y && obstacle.y < PLAYER_Y + PLAYER_HEIGHT;
        if (sameLane && overlapY) {
          persistBest(scoreRef.current);
          setStatus("gameover");
          drawScene();
          return;
        }
      }

      obstaclesRef.current = obstaclesRef.current.filter((obstacle) => obstacle.y < WORLD_HEIGHT + 20);
      drawScene();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [drawScene, persistBest, status]);

  const overlayTitle = status === "gameover" ? "Crashed" : "Neon Dodger";
  const actionLabel = status === "gameover" ? "Play Again" : "Start";

  return (
    <ArcadeGamePattern
      className={styles.container}
      board={
        <ArcadeGameStage className={styles.stage} shellClassName={styles.stageShell} interactive>
          <div
            ref={stageRef}
            className={styles.inputLayer}
            onPointerDown={(event) => {
              if (status !== "playing") {
                startGame();
                return;
              }

              const bounds = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
              const x = event.clientX - bounds.left;
              if (x < bounds.width / 2) {
                moveLane(-1);
              } else {
                moveLane(1);
              }
            }}
            role="button"
            aria-label="Tap left or right half to move"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (status === "ready" || status === "gameover")) {
                event.preventDefault();
                startGame();
              }
            }}
          >
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.hud}>
              <span className={styles.statPill}>SCORE: {score}</span>
              <span className={styles.statPill}>LANE: {lane + 1}</span>
              <span className={styles.statPill}>BEST: {bestScore}</span>
            </div>

            {status !== "playing" && (
              <div className={styles.overlay}>
                <div className={styles.overlayCard}>
                  <h2 className={styles.title}>{overlayTitle}</h2>
                  <p className={styles.subtitle}>{status === "gameover" ? `You dodged ${score} blocks.` : "Switch lanes and avoid every incoming block."}</p>
                  <button type="button" className={styles.actionButton} onClick={status === "gameover" ? restartGame : startGame}>
                    {actionLabel}
                  </button>
                </div>
              </div>
            )}
          </div>
        </ArcadeGameStage>
      }
      sidebar={
        <>
          <ArcadePanelCard title="Keyboard Hints" ariaLabel="Neon Dodger keyboard hints">
            <ul className={patternStyles.keyHintList}>
              <li className={patternStyles.keyHintItem}>
                <span className={patternStyles.keyHintAction}>Move</span>
                <span className={patternStyles.keyHintKeys}>
                  <span className={patternStyles.keyBadge}>←</span>
                  <span className={patternStyles.keyBadge}>→</span>
                  <span className={patternStyles.keyBadge}>A</span>
                  <span className={patternStyles.keyBadge}>D</span>
                </span>
              </li>
              <li className={patternStyles.keyHintItem}>
                <span className={patternStyles.keyHintAction}>Start / Restart</span>
                <span className={patternStyles.keyHintKeys}>
                  <span className={patternStyles.keyBadge}>Enter</span>
                  <span className={patternStyles.keyBadge}>R</span>
                </span>
              </li>
            </ul>
          </ArcadePanelCard>

          <ArcadePanelCard>
            <div className={patternStyles.controllerDock}>
              <TouchGameController
                className={styles.controller}
                layout="inlineBar"
                title="Quick Actions"
                description="Tap screen halves to move or use these controls."
                primaryAction={{
                  label: status === "playing" ? "Move Left" : "Start",
                  onAction: status === "playing" ? () => moveLane(-1) : startGame,
                  icon: status === "playing" ? "←" : "▶",
                  variant: "primary",
                }}
                secondaryAction={{
                  label: status === "playing" ? "Move Right" : "Restart",
                  onAction: status === "playing" ? () => moveLane(1) : restartGame,
                  icon: status === "playing" ? "→" : "↻",
                  variant: "accent",
                }}
              />
            </div>
          </ArcadePanelCard>
        </>
      }
    />
  );
}
