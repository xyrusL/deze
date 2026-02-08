"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./TapTapShootsGame.module.css";
import TouchGameController from "./game-controls/TouchGameController";
import ArcadeGamePattern from "./game-layout/ArcadeGamePattern";
import ArcadePanelCard from "./game-layout/ArcadePanelCard";
import ArcadeGameStage from "./game-layout/ArcadeGameStage";
import patternStyles from "./game-layout/ArcadeGamePattern.module.css";

const WORLD_WIDTH = 360;
const WORLD_HEIGHT = 640;
const FLOOR_HEIGHT = 72;
const BALL_RADIUS = 16;
const BASE_GRAVITY = 1260;
const SHOT_VERTICAL_VELOCITY = -600;
const SHOT_FORWARD_VELOCITY = 250;
const FLOOR_BOUNCE_DAMPING = 0.46;
const FLOOR_ROLL_FRICTION = 0.86;
const FLOOR_SETTLE_VERTICAL_SPEED = 70;
const FLOOR_SETTLE_HORIZONTAL_SPEED = 12;

const HOOP_WIDTH = 68;
const RIM_INNER_RADIUS = 20;
const RIM_COLLISION_RADIUS = 7;
const BACKBOARD_WIDTH = 10;
const BACKBOARD_HEIGHT = 110;
const MAX_DIFFICULTY_SCORE = 30;

type GameStatus = "ready" | "playing" | "gameover";
type Vector = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function getDifficultySettings(score: number) {
  const normalized = clamp(score / MAX_DIFFICULTY_SCORE, 0, 1);
  const hoopFollowStrength = 3.2 + normalized * 2.2;
  const retargetBaseSeconds = 2.1 - normalized * 0.9;
  const retargetRandomSeconds = 0.85 - normalized * 0.25;
  const xMinRatio = 0.62 - normalized * 0.1;
  const yPadding = 190 - normalized * 32;

  return {
    hoopFollowStrength,
    retargetBaseSeconds,
    retargetRandomSeconds,
    xMinRatio,
    yPadding,
  };
}

function drawBall(ctx: CanvasRenderingContext2D, position: Vector) {
  const gradient = ctx.createRadialGradient(position.x - 5, position.y - 5, 2, position.x, position.y, BALL_RADIUS + 2);
  gradient.addColorStop(0, "#ffd46a");
  gradient.addColorStop(0.4, "#ffae1f");
  gradient.addColorStop(1, "#de6209");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(position.x, position.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#9c3c08";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(position.x, position.y, BALL_RADIUS * 0.98, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(position.x - BALL_RADIUS * 0.9, position.y);
  ctx.quadraticCurveTo(position.x, position.y - 3, position.x + BALL_RADIUS * 0.9, position.y + 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(position.x, position.y - BALL_RADIUS * 0.95);
  ctx.quadraticCurveTo(position.x - 3, position.y, position.x + 1, position.y + BALL_RADIUS * 0.95);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(position.x - 5, position.y - 3, BALL_RADIUS * 0.44, BALL_RADIUS * 0.74, Math.PI / 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(position.x + 6, position.y + 2, BALL_RADIUS * 0.4, BALL_RADIUS * 0.68, Math.PI / -5, 0, Math.PI * 2);
  ctx.stroke();
}

function drawHoop(ctx: CanvasRenderingContext2D, center: Vector) {
  const leftRim = center.x - HOOP_WIDTH / 2;

  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(center.x + HOOP_WIDTH / 2 + 8, center.y - BACKBOARD_HEIGHT / 2, BACKBOARD_WIDTH, BACKBOARD_HEIGHT);

  ctx.fillStyle = "#cb8b29";
  ctx.fillRect(center.x + HOOP_WIDTH / 2 + 17, center.y - 18, 18, 36);
  ctx.fillRect(center.x + HOOP_WIDTH / 2 + 12, center.y + 16, 10, 52);

  ctx.strokeStyle = "#0e93f0";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(center.x, center.y, HOOP_WIDTH / 2, 11, 0, Math.PI * 1.02, Math.PI * -0.02, true);
  ctx.stroke();

  ctx.strokeStyle = "rgba(232, 239, 245, 0.95)";
  ctx.lineWidth = 2;
  for (let index = 0; index < 7; index += 1) {
    const t = index / 6;
    const x = leftRim + HOOP_WIDTH * t;
    ctx.beginPath();
    ctx.moveTo(x, center.y + 6);
    ctx.lineTo(center.x + (t - 0.5) * 34, center.y + 40);
    ctx.stroke();
  }
  for (let index = 0; index < 4; index += 1) {
    const y = center.y + 16 + index * 8;
    ctx.beginPath();
    ctx.moveTo(center.x - 20 + index * 2, y);
    ctx.lineTo(center.x + 20 - index * 2, y);
    ctx.stroke();
  }
}

export default function TapTapShootsGame() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(0);

  const ballRef = useRef<Vector>({ x: 116, y: WORLD_HEIGHT - FLOOR_HEIGHT - BALL_RADIUS });
  const ballVelocityRef = useRef<Vector>({ x: 0, y: 0 });
  const previousBallRef = useRef<Vector>({ x: 116, y: WORLD_HEIGHT - FLOOR_HEIGHT - BALL_RADIUS });
  const hasLaunchedShotRef = useRef(false);
  const hasScoredThisShotRef = useRef(false);
  const scoreRef = useRef(0);

  const hoopRef = useRef<Vector>({ x: WORLD_WIDTH - 56, y: 270 });
  const hoopTargetRef = useRef<Vector>({ x: WORLD_WIDTH - 56, y: 270 });
  const hoopRetargetCooldownRef = useRef(0);

  const [status, setStatus] = useState<GameStatus>("ready");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }
    const stored = Number(window.localStorage.getItem("tap-tap-shoots-best") || "0");
    return Number.isFinite(stored) && stored >= 0 ? stored : 0;
  });

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

    const bgGradient = ctx.createRadialGradient(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 40, WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_HEIGHT * 0.9);
    bgGradient.addColorStop(0, "#4b4b4b");
    bgGradient.addColorStop(1, "#2f3136");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    ctx.fillStyle = "rgba(34, 35, 39, 0.88)";
    ctx.fillRect(0, WORLD_HEIGHT - FLOOR_HEIGHT, WORLD_WIDTH, FLOOR_HEIGHT);
    ctx.fillStyle = "rgba(20, 21, 24, 0.95)";
    ctx.fillRect(0, WORLD_HEIGHT - FLOOR_HEIGHT + 52, WORLD_WIDTH, 10);

    drawHoop(ctx, hoopRef.current);
    drawBall(ctx, ballRef.current);

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

  const resetBall = useCallback(() => {
    ballRef.current = { x: 116, y: WORLD_HEIGHT - FLOOR_HEIGHT - BALL_RADIUS };
    previousBallRef.current = { ...ballRef.current };
    ballVelocityRef.current = { x: 0, y: 0 };
    hasLaunchedShotRef.current = false;
    hasScoredThisShotRef.current = false;
  }, []);

  const resetHoop = useCallback(() => {
    hoopRef.current = { x: WORLD_WIDTH - 56, y: 270 };
    hoopTargetRef.current = { ...hoopRef.current };
    hoopRetargetCooldownRef.current = 0;
  }, []);

  const moveHoopTarget = useCallback((currentScore = 0) => {
    const settings = getDifficultySettings(currentScore);
    const yMin = settings.yPadding;
    const yMax = WORLD_HEIGHT - FLOOR_HEIGHT - settings.yPadding;
    hoopTargetRef.current = {
      x: randomInRange(WORLD_WIDTH * settings.xMinRatio, WORLD_WIDTH - 62),
      y: randomInRange(yMin, yMax),
    };
  }, []);

  const startGame = useCallback(() => {
    lastFrameRef.current = 0;
    scoreRef.current = 0;
    resetBall();
    resetHoop();
    setScore(0);
    setStatus("playing");
    moveHoopTarget(0);
    hoopRetargetCooldownRef.current = 0.8;
  }, [moveHoopTarget, resetBall, resetHoop]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const shootBall = useCallback(() => {
    if (status === "ready") {
      startGame();
    }

    if (status === "gameover") {
      return;
    }

    const ball = ballRef.current;
    const hoop = hoopRef.current;
    const velocity = ballVelocityRef.current;

    const aimDirection = clamp((hoop.x - ball.x) / 180, -1, 1);
    velocity.y = SHOT_VERTICAL_VELOCITY;
    velocity.x = clamp(velocity.x * 0.35 + SHOT_FORWARD_VELOCITY * aimDirection, -300, 300);
    hasLaunchedShotRef.current = true;
    hasScoredThisShotRef.current = false;
  }, [startGame, status]);

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
      if (key === " " || key === "arrowup") {
        event.preventDefault();
        shootBall();
      }
      if (key === "enter" && (status === "ready" || status === "gameover")) {
        event.preventDefault();
        restartGame();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [restartGame, shootBall, status]);

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

      const ball = ballRef.current;
      const previousBall = previousBallRef.current;
      const velocity = ballVelocityRef.current;

      previousBall.x = ball.x;
      previousBall.y = ball.y;

      velocity.y += BASE_GRAVITY * dt;
      velocity.x *= 0.997;
      ball.x += velocity.x * dt;
      ball.y += velocity.y * dt;

      if (ball.x <= BALL_RADIUS) {
        ball.x = BALL_RADIUS;
        velocity.x = Math.abs(velocity.x) * 0.72;
      }
      if (ball.x >= WORLD_WIDTH - BALL_RADIUS) {
        ball.x = WORLD_WIDTH - BALL_RADIUS;
        velocity.x = -Math.abs(velocity.x) * 0.72;
      }
      if (ball.y <= BALL_RADIUS) {
        ball.y = BALL_RADIUS;
        velocity.y = Math.abs(velocity.y) * 0.7;
      }

      const hoop = hoopRef.current;
      const hoopTarget = hoopTargetRef.current;
      const difficulty = getDifficultySettings(scoreRef.current);
      hoopRetargetCooldownRef.current -= dt;
      if (hoopRetargetCooldownRef.current <= 0) {
        moveHoopTarget(scoreRef.current);
        hoopRetargetCooldownRef.current =
          difficulty.retargetBaseSeconds + Math.random() * difficulty.retargetRandomSeconds;
      }

      hoop.x += (hoopTarget.x - hoop.x) * Math.min(1, dt * difficulty.hoopFollowStrength);
      hoop.y += (hoopTarget.y - hoop.y) * Math.min(1, dt * difficulty.hoopFollowStrength);

      const leftRim = { x: hoop.x - HOOP_WIDTH / 2, y: hoop.y + 2 };
      const rightRim = { x: hoop.x + HOOP_WIDTH / 2, y: hoop.y + 2 };
      for (const rimPoint of [leftRim, rightRim]) {
        const dx = ball.x - rimPoint.x;
        const dy = ball.y - rimPoint.y;
        const distance = Math.hypot(dx, dy);
        const minDistance = BALL_RADIUS + RIM_COLLISION_RADIUS;
        if (distance > 0 && distance < minDistance) {
          const nx = dx / distance;
          const ny = dy / distance;
          const overlap = minDistance - distance;
          ball.x += nx * overlap;
          ball.y += ny * overlap;

          const dot = velocity.x * nx + velocity.y * ny;
          velocity.x -= 1.7 * dot * nx;
          velocity.y -= 1.7 * dot * ny;
          velocity.x *= 0.82;
          velocity.y *= 0.82;
        }
      }

      const crossedRimPlane = previousBall.y < hoop.y && ball.y >= hoop.y && velocity.y > 0;
      const withinRim = Math.abs(ball.x - hoop.x) <= RIM_INNER_RADIUS - BALL_RADIUS * 0.2;
      if (crossedRimPlane && withinRim && !hasScoredThisShotRef.current) {
        hasScoredThisShotRef.current = true;
        setScore((current) => {
          const next = current + 1;
          scoreRef.current = next;
          setBestScore((best) => {
            const nextBest = Math.max(best, next);
            if (nextBest !== best && typeof window !== "undefined") {
              window.localStorage.setItem("tap-tap-shoots-best", String(nextBest));
            }
            return nextBest;
          });
          return next;
        });

        moveHoopTarget(scoreRef.current + 1);
        hoopRetargetCooldownRef.current = 0.35;
      }

      if (ball.y + BALL_RADIUS >= WORLD_HEIGHT - FLOOR_HEIGHT) {
        ball.y = WORLD_HEIGHT - FLOOR_HEIGHT - BALL_RADIUS;
        const isFallingOrSettled = velocity.y >= 0;

        if (hasLaunchedShotRef.current && isFallingOrSettled) {
          if (hasScoredThisShotRef.current) {
            if (velocity.y > FLOOR_SETTLE_VERTICAL_SPEED) {
              velocity.y = -velocity.y * FLOOR_BOUNCE_DAMPING;
              velocity.x *= 0.94;
            } else {
              velocity.y = 0;
              velocity.x *= FLOOR_ROLL_FRICTION;

              if (Math.abs(velocity.x) < FLOOR_SETTLE_HORIZONTAL_SPEED) {
                velocity.x = 0;
                hasLaunchedShotRef.current = false;
                hasScoredThisShotRef.current = false;
              }
            }
          } else {
            setStatus("gameover");
          }
        } else if (!hasLaunchedShotRef.current) {
          velocity.x = 0;
          velocity.y = 0;
        }
      }

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
  }, [drawScene, moveHoopTarget, resetBall, status]);

  const overlayTitle = status === "gameover" ? "Brick!" : "Tap Tap Shoots";
  const primaryActionLabel = status === "gameover" ? "Play Again" : status === "ready" ? "Start" : "Shoot";

  return (
    <ArcadeGamePattern
      className={styles.container}
      board={
        <ArcadeGameStage className={styles.stage} shellClassName={styles.stageShell} interactive>
          <div
            ref={stageRef}
            className={styles.inputLayer}
            onPointerDown={(event) => {
              event.preventDefault();
              shootBall();
            }}
            role="button"
            aria-label="Tap game area to shoot"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                shootBall();
              }
            }}
          >
            <canvas ref={canvasRef} className={styles.canvas} />

            <div className={styles.hud}>
              <span className={styles.statPill}>SCORE: {score}</span>
              <span className={styles.statPill}>BEST: {bestScore}</span>
            </div>

            {status !== "playing" && (
              <div className={styles.overlay}>
                <div className={styles.overlayCard}>
                  <h2 className={styles.title}>{overlayTitle}</h2>
                  <p className={styles.subtitle}>{status === "gameover" ? `Final score: ${score}` : "Tap the screen to launch shots through the moving rim."}</p>
                  <button
                    type="button"
                    className={styles.actionButton}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (status === "gameover") {
                        restartGame();
                        return;
                      }
                      shootBall();
                    }}
                  >
                    {primaryActionLabel}
                  </button>
                </div>
              </div>
            )}
          </div>
        </ArcadeGameStage>
      }
      sidebar={
        <>
          <ArcadePanelCard title="Keyboard Hints" ariaLabel="Tap Tap Shoots control hints">
            <ul className={patternStyles.keyHintList}>
              <li className={patternStyles.keyHintItem}>
                <span className={patternStyles.keyHintAction}>Shoot</span>
                <span className={patternStyles.keyHintKeys}>
                  <span className={patternStyles.keyBadge}>Space</span>
                  <span className={patternStyles.keyBadge}>↑</span>
                  <span className={patternStyles.keyBadge}>Tap</span>
                </span>
              </li>
              <li className={patternStyles.keyHintItem}>
                <span className={patternStyles.keyHintAction}>Restart</span>
                <span className={patternStyles.keyHintKeys}>
                  <span className={patternStyles.keyBadge}>Enter</span>
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
                description="Tap the stage or press Space / ↑ to shoot."
                primaryAction={{
                  label: status === "gameover" ? "Play Again" : "Shoot",
                  ariaLabel: "Shoot ball",
                  onAction: status === "gameover" ? restartGame : shootBall,
                  icon: "●",
                  variant: "primary",
                }}
                secondaryAction={{
                  label: "Restart",
                  ariaLabel: "Restart game",
                  onAction: restartGame,
                  icon: "↺",
                  variant: "secondary",
                }}
              />
            </div>
          </ArcadePanelCard>
        </>
      }
    />
  );
}
