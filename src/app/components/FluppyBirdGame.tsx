"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./FluppyBirdGame.module.css";
import TouchGameController from "./game-controls/TouchGameController";
import ArcadeGamePattern from "./game-layout/ArcadeGamePattern";
import ArcadePanelCard from "./game-layout/ArcadePanelCard";
import ArcadeGameStage from "./game-layout/ArcadeGameStage";
import patternStyles from "./game-layout/ArcadeGamePattern.module.css";

const WORLD_WIDTH = 360;
const WORLD_HEIGHT = 640;
const GROUND_HEIGHT = 84;
const BIRD_X = 92;
const BIRD_WIDTH = 52;
const BIRD_HEIGHT = 40;

const GRAVITY = 1700;
const FLAP_VELOCITY = -520;
const PIPE_SPEED = 170;
const PIPE_WIDTH = 68;
const PIPE_GAP = 180;
const PIPE_SPAWN_MS = 1300;

type GameStatus = "ready" | "playing" | "gameover";

type Pipe = {
  id: number;
  x: number;
  gapY: number;
  scored: boolean;
};

type GameHudProps = {
  score: number;
  bestScore: number;
};

type StatusOverlayProps = {
  status: GameStatus;
  score: number;
  onAction: () => void;
};

const BIRD_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 48'>
  <defs>
    <linearGradient id='body' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#ffe25e'/>
      <stop offset='100%' stop-color='#ffb300'/>
    </linearGradient>
  </defs>
  <ellipse cx='30' cy='25' rx='22' ry='16' fill='url(#body)'/>
  <path d='M10 24c8-10 18-12 30-6-6 2-12 7-15 14z' fill='#fff2ae' opacity='0.85'/>
  <circle cx='36' cy='20' r='5.2' fill='#fff'/>
  <circle cx='37' cy='20' r='2.1' fill='#111'/>
  <path d='M45 24l15 4-15 5z' fill='#ff8f00'/>
  <path d='M25 37l6-2 2 6z' fill='#f57f17'/>
  <ellipse cx='24' cy='17' rx='10' ry='6' fill='#ffd54f' opacity='0.85'/>
</svg>`;

const PIPE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 160'>
  <defs>
    <linearGradient id='pipe-grad' x1='0' y1='0' x2='1' y2='0'>
      <stop offset='0%' stop-color='#2fe28c'/>
      <stop offset='50%' stop-color='#1acb75'/>
      <stop offset='100%' stop-color='#0fa05a'/>
    </linearGradient>
  </defs>
  <rect x='12' y='0' width='56' height='160' rx='7' fill='url(#pipe-grad)'/>
  <rect x='4' y='8' width='72' height='20' rx='5' fill='#64f0b4' opacity='0.55'/>
  <rect x='0' y='128' width='80' height='24' rx='5' fill='#0b8f4e'/>
</svg>`;

function svgToImage(svgMarkup: string): HTMLImageElement {
  const image = new Image();
  image.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`;
  return image;
}

function GameHud({ score, bestScore }: GameHudProps) {
  return (
    <div className={styles.hud}>
      <span className={styles.statPill}>SCORE: {score}</span>
      <span className={styles.statPill}>BEST: {bestScore}</span>
    </div>
  );
}

function ActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={styles.actionButton}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      {label}
    </button>
  );
}

function StatusOverlay({ status, score, onAction }: StatusOverlayProps) {
  return (
    <div
      className={styles.overlay}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
    >
      <div className={styles.overlayCard}>
        <h2 className={styles.title}>{status === "gameover" ? "Crashed" : "Fluppy Bird"}</h2>
        <p className={styles.subtitle}>{status === "gameover" ? `Final score: ${score}` : "Dodge pipes and keep flying."}</p>
        <ActionButton label={status === "gameover" ? "Restart" : "Start"} onClick={onAction} />
      </div>
    </div>
  );
}


export default function FluppyBirdGame() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const spawnAtRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const nextPipeIdRef = useRef(1);

  const birdImageRef = useRef<HTMLImageElement | null>(null);
  const pipeImageRef = useRef<HTMLImageElement | null>(null);

  const birdYRef = useRef(WORLD_HEIGHT / 2 - 40);
  const birdVelocityRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);

  const [status, setStatus] = useState<GameStatus>("ready");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const keyboardHints = [
    { action: "Flap", keys: ["Space", "↑", "Tap"] },
    { action: "Restart", keys: ["Enter"] },
  ] as const;

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

    const skyGradient = ctx.createLinearGradient(0, 0, 0, WORLD_HEIGHT);
    skyGradient.addColorStop(0, "#173866");
    skyGradient.addColorStop(1, "#0b1428");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    ctx.fillStyle = "rgba(255, 237, 153, 0.4)";
    ctx.beginPath();
    ctx.arc(290, 96, 30, 0, Math.PI * 2);
    ctx.fill();

    const pipeImage = pipeImageRef.current;
    for (const pipe of pipesRef.current) {
      const topHeight = pipe.gapY - PIPE_GAP / 2;
      const bottomY = pipe.gapY + PIPE_GAP / 2;
      const bottomHeight = WORLD_HEIGHT - GROUND_HEIGHT - bottomY;

      if (pipeImage) {
        ctx.save();
        ctx.translate(pipe.x + PIPE_WIDTH / 2, topHeight / 2);
        ctx.scale(1, -1);
        ctx.drawImage(pipeImage, -PIPE_WIDTH / 2, -topHeight / 2, PIPE_WIDTH, topHeight);
        ctx.restore();

        ctx.drawImage(pipeImage, pipe.x, bottomY, PIPE_WIDTH, bottomHeight);
      } else {
        ctx.fillStyle = "#18b869";
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, topHeight);
        ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, bottomHeight);
      }
    }

    const groundGradient = ctx.createLinearGradient(0, WORLD_HEIGHT - GROUND_HEIGHT, 0, WORLD_HEIGHT);
    groundGradient.addColorStop(0, "#2f8f55");
    groundGradient.addColorStop(1, "#1d6139");
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, WORLD_HEIGHT - GROUND_HEIGHT, WORLD_WIDTH, GROUND_HEIGHT);

    const birdImage = birdImageRef.current;
    const birdY = birdYRef.current;
    const birdRotation = Math.max(-30, Math.min(50, (birdVelocityRef.current / 520) * 55));
    if (birdImage) {
      ctx.save();
      ctx.translate(BIRD_X + BIRD_WIDTH / 2, birdY + BIRD_HEIGHT / 2);
      ctx.rotate((birdRotation * Math.PI) / 180);
      ctx.drawImage(birdImage, -BIRD_WIDTH / 2, -BIRD_HEIGHT / 2, BIRD_WIDTH, BIRD_HEIGHT);
      ctx.restore();
    } else {
      ctx.fillStyle = "#ffd54f";
      ctx.beginPath();
      ctx.ellipse(BIRD_X + 24, birdY + 20, 20, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }

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

  const resetRunState = useCallback(() => {
    birdYRef.current = WORLD_HEIGHT / 2 - 40;
    birdVelocityRef.current = 0;
    pipesRef.current = [];
    spawnAtRef.current = 0;
    lastFrameRef.current = 0;
    nextPipeIdRef.current = 1;
    setScore(0);
  }, []);

  const spawnPipe = useCallback(() => {
    const minGapCenter = 130;
    const maxGapCenter = WORLD_HEIGHT - GROUND_HEIGHT - 130;
    const gapY = Math.floor(minGapCenter + Math.random() * (maxGapCenter - minGapCenter));
    pipesRef.current = [
      ...pipesRef.current,
      {
        id: nextPipeIdRef.current++,
        x: WORLD_WIDTH + 20,
        gapY,
        scored: false,
      },
    ];
  }, []);

  const startGame = useCallback(() => {
    resetRunState();
    setStatus("playing");
  }, [resetRunState]);

  const gameOver = useCallback(() => {
    setStatus("gameover");
  }, []);

  const flap = useCallback(() => {
    if (status === "ready") {
      startGame();
    }
    if (status === "gameover") {
      return;
    }
    birdVelocityRef.current = FLAP_VELOCITY;
  }, [startGame, status]);

  const restart = useCallback(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    birdImageRef.current = svgToImage(BIRD_SVG);
    pipeImageRef.current = svgToImage(PIPE_SVG);

    const onReady = () => drawScene();
    birdImageRef.current.onload = onReady;
    pipeImageRef.current.onload = onReady;

    drawScene();
  }, [drawScene]);

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
        flap();
      }
      if (key === "enter" && status === "gameover") {
        event.preventDefault();
        restart();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [flap, restart, status]);

  useEffect(() => {
    if (status !== "playing") {
      drawScene();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const loop = (ts: number) => {
      if (!lastFrameRef.current) {
        lastFrameRef.current = ts;
      }
      const dt = Math.min((ts - lastFrameRef.current) / 1000, 0.032);
      lastFrameRef.current = ts;

      if (spawnAtRef.current === 0 || ts >= spawnAtRef.current) {
        spawnPipe();
        spawnAtRef.current = ts + PIPE_SPAWN_MS;
      }

      birdVelocityRef.current += GRAVITY * dt;
      birdYRef.current += birdVelocityRef.current * dt;

      pipesRef.current = pipesRef.current
        .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED * dt }))
        .filter((pipe) => pipe.x + PIPE_WIDTH > -10);

      const birdLeft = BIRD_X + 4;
      const birdRight = birdLeft + BIRD_WIDTH - 10;
      const birdTop = birdYRef.current + 4;
      const birdBottom = birdTop + BIRD_HEIGHT - 8;

      if (birdTop <= 0 || birdBottom >= WORLD_HEIGHT - GROUND_HEIGHT) {
        gameOver();
      }

      for (const pipe of pipesRef.current) {
        const topPipeBottom = pipe.gapY - PIPE_GAP / 2;
        const bottomPipeTop = pipe.gapY + PIPE_GAP / 2;
        const overlapX = birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH;

        if (overlapX && (birdTop < topPipeBottom || birdBottom > bottomPipeTop)) {
          gameOver();
          break;
        }

        if (!pipe.scored && pipe.x + PIPE_WIDTH < birdLeft) {
          pipe.scored = true;
          setScore((current) => {
            const next = current + 1;
            setBestScore((best) => Math.max(best, next));
            return next;
          });
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
  }, [drawScene, gameOver, spawnPipe, status]);

  return (
    <ArcadeGamePattern
      className={styles.container}
      board={
        <ArcadeGameStage
          className={styles.stage}
          shellClassName={styles.stageShell}
          interactive
        >
          <div
            ref={stageRef}
            className={styles.inputLayer}
            onPointerDown={(event) => {
              event.preventDefault();
              flap();
            }}
            role="button"
            aria-label="Tap game area to flap"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                flap();
              }
            }}
          >
            <canvas ref={canvasRef} className={styles.canvas} />
            <GameHud score={score} bestScore={bestScore} />

            {status !== "playing" && <StatusOverlay status={status} score={score} onAction={status === "gameover" ? restart : startGame} />}
          </div>
        </ArcadeGameStage>
      }
      sidebar={
        <>
          <ArcadePanelCard title="Keyboard Hints" ariaLabel="Fluppy Bird control hints">
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
          </ArcadePanelCard>

          <ArcadePanelCard>
            <div className={patternStyles.controllerDock}>
              <TouchGameController
                className={styles.controller}
                layout="inlineBar"
                title="Quick Actions"
                description="Tap stage or press Space / ↑ to flap."
                primaryAction={{
                  label: "Flap",
                  ariaLabel: "Flap",
                  onAction: flap,
                  icon: "▲",
                  variant: "primary",
                }}
              />
            </div>
          </ArcadePanelCard>
        </>
      }
    />
  );
}
