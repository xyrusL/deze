"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MeteorCatchGame.module.css";
import TouchGameController from "./game-controls/TouchGameController";
import ArcadeGamePattern from "./game-layout/ArcadeGamePattern";
import ArcadePanelCard from "./game-layout/ArcadePanelCard";
import ArcadeGameStage from "./game-layout/ArcadeGameStage";
import patternStyles from "./game-layout/ArcadeGamePattern.module.css";

const WORLD_WIDTH = 360;
const WORLD_HEIGHT = 640;
const PADDLE_WIDTH = 92;
const PADDLE_HEIGHT = 18;
const PADDLE_Y = WORLD_HEIGHT - 52;
const PLAYER_SPEED = 310;

type GameStatus = "ready" | "playing" | "gameover";
type Meteor = {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function MeteorCatchGame() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const spawnCooldownRef = useRef(0.8);
  const nextMeteorIdRef = useRef(1);

  const paddleXRef = useRef(WORLD_WIDTH / 2 - PADDLE_WIDTH / 2);
  const velocityRef = useRef(0);
  const meteorsRef = useRef<Meteor[]>([]);
  const scoreRef = useRef(0);
  const missesRef = useRef(0);

  const [status, setStatus] = useState<GameStatus>("ready");
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }
    const stored = Number(window.localStorage.getItem("meteor-catch-best") || "0");
    return Number.isFinite(stored) && stored >= 0 ? stored : 0;
  });

  const persistBest = useCallback((candidate: number) => {
    setBestScore((current) => {
      const next = Math.max(current, candidate);
      if (next !== current && typeof window !== "undefined") {
        window.localStorage.setItem("meteor-catch-best", String(next));
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
    bg.addColorStop(0, "#0f1f39");
    bg.addColorStop(1, "#070b16");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    ctx.fillStyle = "rgba(133, 205, 255, 0.2)";
    for (let i = 0; i < 32; i += 1) {
      const x = (i * 57) % WORLD_WIDTH;
      const y = (i * 83) % WORLD_HEIGHT;
      ctx.fillRect(x, y, 2, 2);
    }

    for (const meteor of meteorsRef.current) {
      const gradient = ctx.createRadialGradient(meteor.x - 3, meteor.y - 3, 2, meteor.x, meteor.y, meteor.radius + 2);
      gradient.addColorStop(0, "#ffe7ad");
      gradient.addColorStop(0.4, "#ffb43b");
      gradient.addColorStop(1, "#db5d11");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(meteor.x, meteor.y, meteor.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const paddleX = paddleXRef.current;
    const paddleGradient = ctx.createLinearGradient(paddleX, PADDLE_Y, paddleX + PADDLE_WIDTH, PADDLE_Y + PADDLE_HEIGHT);
    paddleGradient.addColorStop(0, "#55f0ff");
    paddleGradient.addColorStop(1, "#2b9dff");
    ctx.fillStyle = paddleGradient;
    ctx.fillRect(paddleX, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT);

    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.fillRect(paddleX + 8, PADDLE_Y + 4, PADDLE_WIDTH - 16, PADDLE_HEIGHT - 8);

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
    lastFrameRef.current = 0;
    spawnCooldownRef.current = 0.78;
    nextMeteorIdRef.current = 1;
    meteorsRef.current = [];
    paddleXRef.current = WORLD_WIDTH / 2 - PADDLE_WIDTH / 2;
    velocityRef.current = 0;
    scoreRef.current = 0;
    missesRef.current = 0;

    setScore(0);
    setMisses(0);
    setStatus("playing");
  }, []);

  const movePaddle = useCallback((direction: -1 | 1) => {
    velocityRef.current = direction * PLAYER_SPEED;
  }, []);

  const stopPaddle = useCallback(() => {
    velocityRef.current = 0;
  }, []);

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
      if (["arrowleft", "arrowright", "a", "d", "enter", "r"].includes(key)) {
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
        movePaddle(-1);
      }
      if (key === "arrowright" || key === "d") {
        movePaddle(1);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["arrowleft", "arrowright", "a", "d"].includes(key)) {
        stopPaddle();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [movePaddle, startGame, status, stopPaddle]);

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

      paddleXRef.current = clamp(paddleXRef.current + velocityRef.current * dt, 0, WORLD_WIDTH - PADDLE_WIDTH);

      spawnCooldownRef.current -= dt;
      if (spawnCooldownRef.current <= 0) {
        const radius = 11 + Math.random() * 7;
        const x = radius + Math.random() * (WORLD_WIDTH - radius * 2);
        const speed = 150 + Math.random() * 80 + scoreRef.current * 2;
        meteorsRef.current = [
          ...meteorsRef.current,
          {
            id: nextMeteorIdRef.current++,
            x,
            y: -radius - 4,
            radius,
            speed,
          },
        ];
        spawnCooldownRef.current = Math.max(0.34, 0.92 - scoreRef.current * 0.01);
      }

      const paddleCenter = paddleXRef.current + PADDLE_WIDTH / 2;
      const paddleTop = PADDLE_Y;
      const survived: Meteor[] = [];

      for (const meteor of meteorsRef.current) {
        const nextMeteor = { ...meteor, y: meteor.y + meteor.speed * dt };

        const withinPaddleX = Math.abs(nextMeteor.x - paddleCenter) <= PADDLE_WIDTH / 2 + nextMeteor.radius - 6;
        const hitPaddle = withinPaddleX && nextMeteor.y + nextMeteor.radius >= paddleTop && nextMeteor.y - nextMeteor.radius <= paddleTop + PADDLE_HEIGHT;
        if (hitPaddle) {
          setScore((current) => {
            const next = current + 1;
            scoreRef.current = next;
            persistBest(next);
            return next;
          });
          continue;
        }

        if (nextMeteor.y - nextMeteor.radius > WORLD_HEIGHT) {
          setMisses((current) => {
            const next = current + 1;
            missesRef.current = next;
            if (next >= 3) {
              persistBest(scoreRef.current);
              setStatus("gameover");
            }
            return next;
          });
          continue;
        }

        survived.push(nextMeteor);
      }

      meteorsRef.current = survived;
      drawScene();

      if (status === "playing") {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [drawScene, persistBest, status]);

  const overlayTitle = status === "gameover" ? "Too Many Misses" : "Meteor Catch";
  const actionLabel = status === "gameover" ? "Play Again" : "Start";

  return (
    <ArcadeGamePattern
      className={styles.container}
      board={
        <ArcadeGameStage className={styles.stage} shellClassName={styles.stageShell} interactive>
          <div
            ref={stageRef}
            className={styles.inputLayer}
            onPointerMove={(event) => {
              if (status !== "playing") {
                return;
              }
              const bounds = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
              const x = event.clientX - bounds.left;
              const laneX = (x / bounds.width) * WORLD_WIDTH;
              paddleXRef.current = clamp(laneX - PADDLE_WIDTH / 2, 0, WORLD_WIDTH - PADDLE_WIDTH);
            }}
            onPointerDown={() => {
              if (status === "ready" || status === "gameover") {
                startGame();
              }
            }}
            role="button"
            aria-label="Move pointer to steer paddle"
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
              <span className={styles.statPill}>MISSES: {misses}/3</span>
              <span className={styles.statPill}>BEST: {bestScore}</span>
            </div>

            {status !== "playing" && (
              <div className={styles.overlay}>
                <div className={styles.overlayCard}>
                  <h2 className={styles.title}>{overlayTitle}</h2>
                  <p className={styles.subtitle}>{status === "gameover" ? `Final score: ${score}` : "Catch meteors with your paddle. Three misses ends the run."}</p>
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
          <ArcadePanelCard title="Keyboard Hints" ariaLabel="Meteor Catch keyboard hints">
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
                description="Drag on game area to steer the paddle."
                primaryAction={{
                  label: status === "playing" ? "Left" : "Start",
                  onAction: status === "playing" ? () => movePaddle(-1) : startGame,
                  icon: status === "playing" ? "←" : "▶",
                  variant: "primary",
                }}
                secondaryAction={{
                  label: status === "playing" ? "Right" : "Restart",
                  onAction: status === "playing" ? () => movePaddle(1) : restartGame,
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
