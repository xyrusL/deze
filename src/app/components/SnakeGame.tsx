"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./SnakeGame.module.css";

const CANVAS_SIZE = 400;
const CELL_SIZE = 20;
const GRID_SIZE = CANVAS_SIZE / CELL_SIZE;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

export default function SnakeGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Position>({ x: 15, y: 10 });
    const [direction, setDirection] = useState<Direction>("RIGHT");
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const directionRef = useRef<Direction>("RIGHT");

    const generateFood = useCallback((currentSnake: Position[]): Position => {
        let newFood: Position;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
        } while (currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y));
        return newFood;
    }, []);

    const resetGame = useCallback(() => {
        const initialSnake = [{ x: 10, y: 10 }];
        setSnake(initialSnake);
        setFood(generateFood(initialSnake));
        setDirection("RIGHT");
        directionRef.current = "RIGHT";
        setGameOver(false);
        setScore(0);
        setIsPlaying(true);
    }, [generateFood]);

    const changeDirection = useCallback((newDir: Direction) => {
        const currentDir = directionRef.current;
        if (
            (newDir === "UP" && currentDir !== "DOWN") ||
            (newDir === "DOWN" && currentDir !== "UP") ||
            (newDir === "LEFT" && currentDir !== "RIGHT") ||
            (newDir === "RIGHT" && currentDir !== "LEFT")
        ) {
            setDirection(newDir);
            directionRef.current = newDir;
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " "].includes(key)) {
                e.preventDefault();
            }

            if (!isPlaying && (e.key === " " || key === "enter")) {
                resetGame();
                return;
            }

            switch (key) {
                case "arrowup":
                case "w":
                    changeDirection("UP");
                    break;
                case "arrowdown":
                case "s":
                    changeDirection("DOWN");
                    break;
                case "arrowleft":
                case "a":
                    changeDirection("LEFT");
                    break;
                case "arrowright":
                case "d":
                    changeDirection("RIGHT");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPlaying, resetGame, changeDirection]);

    useEffect(() => {
        if (!isPlaying || gameOver) return;

        const moveSnake = () => {
            setSnake((prev) => {
                const head = { ...prev[0] };

                switch (directionRef.current) {
                    case "UP":
                        head.y -= 1;
                        break;
                    case "DOWN":
                        head.y += 1;
                        break;
                    case "LEFT":
                        head.x -= 1;
                        break;
                    case "RIGHT":
                        head.x += 1;
                        break;
                }

                // Check wall collision
                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                    setGameOver(true);
                    setIsPlaying(false);
                    return prev;
                }

                // Check self collision
                if (prev.some((segment) => segment.x === head.x && segment.y === head.y)) {
                    setGameOver(true);
                    setIsPlaying(false);
                    return prev;
                }

                const newSnake = [head, ...prev];

                // Check food collision
                if (head.x === food.x && head.y === food.y) {
                    setScore((s) => s + 10);
                    setFood(generateFood(newSnake));
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        };

        const interval = setInterval(moveSnake, 120);
        return () => clearInterval(interval);
    }, [isPlaying, gameOver, food, generateFood]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Draw grid
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        for (let i = 0; i <= GRID_SIZE; i++) {
            ctx.beginPath();
            ctx.moveTo(i * CELL_SIZE, 0);
            ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * CELL_SIZE);
            ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
            ctx.stroke();
        }

        // Draw snake
        snake.forEach((segment, index) => {
            const gradient = ctx.createRadialGradient(
                segment.x * CELL_SIZE + CELL_SIZE / 2,
                segment.y * CELL_SIZE + CELL_SIZE / 2,
                0,
                segment.x * CELL_SIZE + CELL_SIZE / 2,
                segment.y * CELL_SIZE + CELL_SIZE / 2,
                CELL_SIZE
            );
            gradient.addColorStop(0, index === 0 ? "#00f3ff" : "#00d4ff");
            gradient.addColorStop(1, index === 0 ? "#0099cc" : "#006699");

            ctx.fillStyle = gradient;
            ctx.shadowColor = "#00f3ff";
            ctx.shadowBlur = 10;
            ctx.fillRect(
                segment.x * CELL_SIZE + 1,
                segment.y * CELL_SIZE + 1,
                CELL_SIZE - 2,
                CELL_SIZE - 2
            );
            ctx.shadowBlur = 0;
        });

        // Draw food
        ctx.fillStyle = "#bc13fe";
        ctx.shadowColor = "#bc13fe";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(
            food.x * CELL_SIZE + CELL_SIZE / 2,
            food.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;
    }, [snake, food]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>SNAKE</h2>
                <div className={styles.score}>SCORE: {score}</div>
            </div>

            <div className={styles.gameWrapper}>
                <canvas
                    ref={canvasRef}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    className={styles.canvas}
                />

                {!isPlaying && (
                    <div className={styles.overlay}>
                        {gameOver ? (
                            <>
                                <h3 className={styles.gameOverText}>GAME OVER</h3>
                                <p className={styles.finalScore}>Final Score: {score}</p>
                            </>
                        ) : (
                            <h3 className={styles.startText}>READY?</h3>
                        )}
                        <button onClick={resetGame} className={styles.playButton}>
                            {gameOver ? "PLAY AGAIN" : "START GAME"}
                        </button>
                        <p className={styles.instructions}>Use Arrow Keys or WASD to Move</p>
                    </div>
                )}
            </div>

            {/* Mobile Touch Controls */}
            <div className={styles.mobileControls}>
                <div className={styles.controlRow}>
                    <button
                        className={styles.controlBtn}
                        onClick={() => changeDirection("UP")}
                        aria-label="Move Up"
                    >
                        ▲
                    </button>
                </div>
                <div className={styles.controlRow}>
                    <button
                        className={styles.controlBtn}
                        onClick={() => changeDirection("LEFT")}
                        aria-label="Move Left"
                    >
                        ◀
                    </button>
                    <button
                        className={styles.controlBtn}
                        onClick={() => changeDirection("DOWN")}
                        aria-label="Move Down"
                    >
                        ▼
                    </button>
                    <button
                        className={styles.controlBtn}
                        onClick={() => changeDirection("RIGHT")}
                        aria-label="Move Right"
                    >
                        ▶
                    </button>
                </div>
            </div>
        </div>
    );
}
