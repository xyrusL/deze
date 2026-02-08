"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./TetrisGame.module.css";
import TouchGameController from "./game-controls/TouchGameController";
import ArcadeGamePattern from "./game-layout/ArcadeGamePattern";
import ArcadePanelCard from "./game-layout/ArcadePanelCard";
import ArcadeGameStage from "./game-layout/ArcadeGameStage";
import patternStyles from "./game-layout/ArcadeGamePattern.module.css";

const WORLD_WIDTH = 360;
const WORLD_HEIGHT = 640;
const BOARD_COLS = 10;
const BOARD_ROWS = 20;
const CELL_SIZE = 24;
const BOARD_WIDTH = BOARD_COLS * CELL_SIZE;
const BOARD_HEIGHT = BOARD_ROWS * CELL_SIZE;
const BOARD_OFFSET_X = (WORLD_WIDTH - BOARD_WIDTH) / 2;
const BOARD_OFFSET_Y = 90;

const LINES_PER_LEVEL = 10;
const BASE_DROP_MS = 820;
const LEVEL_DROP_STEP_MS = 55;
const MIN_DROP_MS = 110;

type GameStatus = "ready" | "playing" | "paused" | "gameover";
type PieceType = "I" | "J" | "L" | "O" | "S" | "T" | "Z";
type Cell = PieceType | null;
type Board = Cell[][];

type Piece = {
  type: PieceType;
  row: number;
  col: number;
  rotation: number;
};

const PIECE_TYPES: PieceType[] = ["I", "J", "L", "O", "S", "T", "Z"];

const PIECE_COLORS: Record<PieceType, string> = {
  I: "#3ad9ff",
  J: "#5d86ff",
  L: "#ff9d4d",
  O: "#ffde59",
  S: "#58f08d",
  T: "#be6bff",
  Z: "#ff6a7e",
};

const PIECE_MATRICES: Record<PieceType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  L: [
    [0, 0, 1, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  S: [
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  T: [
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  Z: [
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
};

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () => Array.from({ length: BOARD_COLS }, () => null));
}

function shuffleBag(): PieceType[] {
  const bag = [...PIECE_TYPES];
  for (let i = bag.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

function getRotatedCells(type: PieceType, rotation: number): Array<{ r: number; c: number }> {
  const normalized = ((rotation % 4) + 4) % 4;
  const cells: Array<{ r: number; c: number }> = [];
  const matrix = PIECE_MATRICES[type];

  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      if (!matrix[r][c]) {
        continue;
      }

      if (normalized === 0) {
        cells.push({ r, c });
      } else if (normalized === 1) {
        cells.push({ r: c, c: 3 - r });
      } else if (normalized === 2) {
        cells.push({ r: 3 - r, c: 3 - c });
      } else {
        cells.push({ r: 3 - c, c: r });
      }
    }
  }

  return cells;
}

function collides(board: Board, piece: Piece): boolean {
  const cells = getRotatedCells(piece.type, piece.rotation);

  for (const cell of cells) {
    const boardRow = piece.row + cell.r;
    const boardCol = piece.col + cell.c;

    if (boardCol < 0 || boardCol >= BOARD_COLS || boardRow >= BOARD_ROWS) {
      return true;
    }

    if (boardRow >= 0 && board[boardRow][boardCol]) {
      return true;
    }
  }

  return false;
}

function mergePiece(board: Board, piece: Piece): { board: Board; overflow: boolean } {
  const nextBoard = board.map((row) => [...row]);
  const cells = getRotatedCells(piece.type, piece.rotation);
  let overflow = false;

  for (const cell of cells) {
    const boardRow = piece.row + cell.r;
    const boardCol = piece.col + cell.c;
    if (boardRow < 0) {
      overflow = true;
      continue;
    }
    nextBoard[boardRow][boardCol] = piece.type;
  }

  return { board: nextBoard, overflow };
}

function clearLines(board: Board): { board: Board; cleared: number } {
  const keptRows = board.filter((row) => row.some((cell) => cell === null));
  const cleared = BOARD_ROWS - keptRows.length;
  if (cleared <= 0) {
    return { board, cleared: 0 };
  }

  const newRows = Array.from({ length: cleared }, () => Array.from({ length: BOARD_COLS }, () => null));
  return { board: [...newRows, ...keptRows], cleared };
}

function pointsForLines(lines: number, level: number): number {
  if (lines <= 0) {
    return 0;
  }
  const baseByLines = [0, 100, 300, 500, 800];
  return (baseByLines[lines] ?? 0) * level;
}

function getDropMs(level: number): number {
  return Math.max(MIN_DROP_MS, BASE_DROP_MS - (level - 1) * LEVEL_DROP_STEP_MS);
}

function getSpawnPiece(type: PieceType): Piece {
  return {
    type,
    row: -1,
    col: 3,
    rotation: 0,
  };
}

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bagRef = useRef<PieceType[]>([]);
  const boardRef = useRef<Board>(createEmptyBoard());
  const activePieceRef = useRef<Piece | null>(null);
  const scoreRef = useRef(0);
  const linesRef = useRef(0);

  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [activePiece, setActivePiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<PieceType>("T");
  const [status, setStatus] = useState<GameStatus>("ready");
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }
    const stored = Number(window.localStorage.getItem("tetris-best") || "0");
    return Number.isFinite(stored) && stored >= 0 ? stored : 0;
  });

  const isPlaying = status === "playing";
  const dropMs = useMemo(() => getDropMs(level), [level]);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    ctx.fillStyle = "#070d14";
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    ctx.fillStyle = "rgba(4, 12, 22, 0.86)";
    ctx.fillRect(BOARD_OFFSET_X, BOARD_OFFSET_Y, BOARD_WIDTH, BOARD_HEIGHT);

    for (let r = 0; r < BOARD_ROWS; r += 1) {
      for (let c = 0; c < BOARD_COLS; c += 1) {
        const cell = boardRef.current[r][c];
        if (cell) {
          ctx.fillStyle = PIECE_COLORS[cell];
          ctx.fillRect(BOARD_OFFSET_X + c * CELL_SIZE + 1, BOARD_OFFSET_Y + r * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
      }
    }

    const current = activePieceRef.current;
    if (current) {
      const cells = getRotatedCells(current.type, current.rotation);
      ctx.fillStyle = PIECE_COLORS[current.type];
      for (const cell of cells) {
        const boardRow = current.row + cell.r;
        const boardCol = current.col + cell.c;
        if (boardRow < 0) {
          continue;
        }
        ctx.fillRect(BOARD_OFFSET_X + boardCol * CELL_SIZE + 1, BOARD_OFFSET_Y + boardRow * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      }
    }

    ctx.strokeStyle = "rgba(127, 255, 243, 0.11)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_COLS; x += 1) {
      ctx.beginPath();
      ctx.moveTo(BOARD_OFFSET_X + x * CELL_SIZE, BOARD_OFFSET_Y);
      ctx.lineTo(BOARD_OFFSET_X + x * CELL_SIZE, BOARD_OFFSET_Y + BOARD_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_ROWS; y += 1) {
      ctx.beginPath();
      ctx.moveTo(BOARD_OFFSET_X, BOARD_OFFSET_Y + y * CELL_SIZE);
      ctx.lineTo(BOARD_OFFSET_X + BOARD_WIDTH, BOARD_OFFSET_Y + y * CELL_SIZE);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(97, 216, 255, 0.34)";
    ctx.lineWidth = 2;
    ctx.strokeRect(BOARD_OFFSET_X + 0.5, BOARD_OFFSET_Y + 0.5, BOARD_WIDTH - 1, BOARD_HEIGHT - 1);
  }, []);

  const takeFromBag = useCallback((): PieceType => {
    if (bagRef.current.length === 0) {
      bagRef.current = shuffleBag();
    }
    const next = bagRef.current.shift();
    return next ?? "T";
  }, []);

  const persistBest = useCallback((candidate: number) => {
    setBestScore((current) => {
      const next = Math.max(current, candidate);
      if (next !== current && typeof window !== "undefined") {
        window.localStorage.setItem("tetris-best", String(next));
      }
      return next;
    });
  }, []);

  const spawnNextPiece = useCallback(
    (currentBoard: Board, previewType: PieceType) => {
      const nextActive = getSpawnPiece(previewType);
      const nextPreview = takeFromBag();

      if (collides(currentBoard, nextActive)) {
        persistBest(scoreRef.current);
        setStatus("gameover");
        setActivePiece(null);
        activePieceRef.current = null;
        return;
      }

      setActivePiece(nextActive);
      activePieceRef.current = nextActive;
      setNextPiece(nextPreview);
    },
    [persistBest, takeFromBag]
  );

  const hardDrop = useCallback(() => {
    if (status !== "playing") {
      return;
    }

    const current = activePieceRef.current;
    if (!current) {
      return;
    }

    const dropped = { ...current };
    while (!collides(boardRef.current, { ...dropped, row: dropped.row + 1 })) {
      dropped.row += 1;
    }

    const merged = mergePiece(boardRef.current, dropped);
    if (merged.overflow) {
      persistBest(scoreRef.current);
      setStatus("gameover");
      return;
    }

    const cleared = clearLines(merged.board);
    const nextLines = linesRef.current + cleared.cleared;
    const nextLevel = Math.floor(nextLines / LINES_PER_LEVEL) + 1;
    const linePoints = pointsForLines(cleared.cleared, level);
    const nextScore = scoreRef.current + linePoints;

    boardRef.current = cleared.board;
    setBoard(cleared.board);
    setLines(nextLines);
    setLevel(nextLevel);
    setScore(nextScore);
    linesRef.current = nextLines;
    scoreRef.current = nextScore;
    persistBest(nextScore);

    spawnNextPiece(cleared.board, nextPiece);
  }, [level, nextPiece, persistBest, spawnNextPiece, status]);

  const movePiece = useCallback(
    (dx: number, dy: number): boolean => {
      if (status !== "playing") {
        return false;
      }
      const current = activePieceRef.current;
      if (!current) {
        return false;
      }

      const candidate = { ...current, col: current.col + dx, row: current.row + dy };
      if (collides(boardRef.current, candidate)) {
        return false;
      }

      setActivePiece(candidate);
      activePieceRef.current = candidate;
      return true;
    },
    [status]
  );

  const rotatePiece = useCallback(() => {
    if (status !== "playing") {
      return;
    }

    const current = activePieceRef.current;
    if (!current) {
      return;
    }

    const candidate = { ...current, rotation: current.rotation + 1 };
    const wallKickOffsets = [0, -1, 1, -2, 2];
    for (const offset of wallKickOffsets) {
      const kicked = { ...candidate, col: candidate.col + offset };
      if (!collides(boardRef.current, kicked)) {
        setActivePiece(kicked);
        activePieceRef.current = kicked;
        return;
      }
    }
  }, [status]);

  const lockOrFall = useCallback(() => {
    if (movePiece(0, 1)) {
      return;
    }

    const current = activePieceRef.current;
    if (!current) {
      return;
    }

    const merged = mergePiece(boardRef.current, current);
    if (merged.overflow) {
      persistBest(scoreRef.current);
      setStatus("gameover");
      return;
    }

    const cleared = clearLines(merged.board);
    const nextLines = linesRef.current + cleared.cleared;
    const nextLevel = Math.floor(nextLines / LINES_PER_LEVEL) + 1;
    const linePoints = pointsForLines(cleared.cleared, level);
    const nextScore = scoreRef.current + linePoints;

    boardRef.current = cleared.board;
    setBoard(cleared.board);
    setLines(nextLines);
    setLevel(nextLevel);
    setScore(nextScore);
    linesRef.current = nextLines;
    scoreRef.current = nextScore;
    persistBest(nextScore);

    spawnNextPiece(cleared.board, nextPiece);
  }, [level, movePiece, nextPiece, persistBest, spawnNextPiece]);

  const startGame = useCallback(() => {
    const freshBoard = createEmptyBoard();
    bagRef.current = shuffleBag();
    const firstType = takeFromBag();
    const previewType = takeFromBag();
    const firstPiece = getSpawnPiece(firstType);

    boardRef.current = freshBoard;
    setBoard(freshBoard);
    setScore(0);
    setLines(0);
    setLevel(1);
    scoreRef.current = 0;
    linesRef.current = 0;
    setNextPiece(previewType);

    if (collides(freshBoard, firstPiece)) {
      setStatus("gameover");
      setActivePiece(null);
      activePieceRef.current = null;
      return;
    }

    setActivePiece(firstPiece);
    activePieceRef.current = firstPiece;
    setStatus("playing");
  }, [takeFromBag]);

  const togglePause = useCallback(() => {
    setStatus((current) => {
      if (current === "playing") {
        return "paused";
      }
      if (current === "paused") {
        return "playing";
      }
      return current;
    });
  }, []);

  useEffect(() => {
    drawScene();
  }, [board, activePiece, drawScene]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      lockOrFall();
    }, dropMs);

    return () => clearInterval(interval);
  }, [dropMs, isPlaying, lockOrFall]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["arrowleft", "arrowright", "arrowdown", "arrowup", "a", "d", "s", "w", " ", "enter", "p", "r"].includes(key)) {
        event.preventDefault();
      }

      if (key === "enter") {
        if (status === "ready" || status === "gameover") {
          startGame();
        }
        return;
      }

      if (key === "p") {
        togglePause();
        return;
      }

      if (key === "r") {
        startGame();
        return;
      }

      if (status !== "playing") {
        return;
      }

      if (key === "arrowleft" || key === "a") {
        movePiece(-1, 0);
      } else if (key === "arrowright" || key === "d") {
        movePiece(1, 0);
      } else if (key === "arrowdown" || key === "s") {
        movePiece(0, 1);
      } else if (key === "arrowup" || key === "w") {
        rotatePiece();
      } else if (key === " ") {
        hardDrop();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hardDrop, movePiece, rotatePiece, startGame, status, togglePause]);

  const overlayTitle = status === "gameover" ? "Stack Over" : status === "paused" ? "Paused" : "Tetris";
  const primaryActionLabel = status === "gameover" ? "Play Again" : status === "ready" ? "Start" : status === "paused" ? "Resume" : "Rotate";

  return (
    <ArcadeGamePattern
      className={styles.container}
      board={
        <ArcadeGameStage className={styles.stage} shellClassName={styles.stageShell}>
            <div className={styles.hud}>
              <span className={styles.statPill}>SCORE: {score}</span>
              <span className={styles.statPill}>LINES: {lines}</span>
              <span className={styles.statPill}>LEVEL: {level}</span>
              <span className={styles.statPill}>BEST: {bestScore}</span>
            </div>

            <canvas ref={canvasRef} width={WORLD_WIDTH} height={WORLD_HEIGHT} className={styles.canvas} aria-label="Tetris game board" />

            {status !== "playing" && (
              <div className={styles.overlay}>
                <div className={styles.overlayCard}>
                  <h2 className={styles.title}>{overlayTitle}</h2>
                  <p className={styles.subtitle}>{status === "gameover" ? `Final score: ${score}` : "Stack lines and avoid overflow."}</p>
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => {
                      if (status === "paused") {
                        togglePause();
                        return;
                      }
                      startGame();
                    }}
                  >
                    {primaryActionLabel}
                  </button>
                </div>
              </div>
            )}
        </ArcadeGameStage>
      }
      sidebar={
        <>
          <ArcadePanelCard title="Keyboard Hints" ariaLabel="Tetris keyboard hints">
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
                <span className={patternStyles.keyHintAction}>Rotate / Drop</span>
                <span className={patternStyles.keyHintKeys}>
                  <span className={patternStyles.keyBadge}>↑</span>
                  <span className={patternStyles.keyBadge}>W</span>
                  <span className={patternStyles.keyBadge}>Space</span>
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

          <ArcadePanelCard title="Next Piece" ariaLabel="Tetris next piece preview">
            <div className={styles.nextWrap}>
              <span className={styles.nextPiece} style={{ color: PIECE_COLORS[nextPiece] }}>
                {nextPiece}
              </span>
            </div>
          </ArcadePanelCard>

          <ArcadePanelCard>
            <div className={patternStyles.controllerDock}>
              <TouchGameController
                className={styles.controller}
                layout="inlineBar"
                title="Quick Actions"
                description="Touch controls for mobile play."
                primaryAction={{
                  label: status === "ready" || status === "gameover" ? "Start" : "Rotate",
                  ariaLabel: "Rotate block",
                  onAction: status === "ready" || status === "gameover" ? startGame : rotatePiece,
                  icon: "⟳",
                  variant: "primary",
                }}
                secondaryAction={{
                  label: status === "paused" ? "Resume" : "Restart",
                  ariaLabel: "Restart game",
                  onAction: status === "paused" ? togglePause : startGame,
                  icon: status === "paused" ? "▶" : "↺",
                  variant: "secondary",
                }}
                directionalPad={{
                  layout: "row",
                  left: {
                    label: "←",
                    ariaLabel: "Move left",
                    onAction: () => movePiece(-1, 0),
                    variant: "secondary",
                  },
                  down: {
                    label: "↓",
                    ariaLabel: "Soft drop",
                    onAction: () => movePiece(0, 1),
                    variant: "accent",
                  },
                  right: {
                    label: "→",
                    ariaLabel: "Move right",
                    onAction: () => movePiece(1, 0),
                    variant: "secondary",
                  },
                  up: {
                    label: "⤓",
                    ariaLabel: "Hard drop",
                    onAction: hardDrop,
                    variant: "accent",
                  },
                }}
              />
            </div>
          </ArcadePanelCard>
        </>
      }
    />
  );
}
