/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";

interface Pipe {
  left: number;
  height: number;
  gap: number;
}

// debuf interval
const INTERVAL_CHANGE_DIFFICULTY = 20000;

// pipe gap
const INITIAL_PIPE_GAP = 210;
const MIN_PIPE_GAP = 130;
const DECRESE_PIPE_GAP_INTERVAL = 10;

// pipe interval
const INITIAL_PIPE_INTERVAL = 2100;
const DECRESE_PIPE_INTERVAL = 50;
const MIN_PIPE_INTERVAL = 1600;

// speed
const INITIAL_SPEED = 10;
const INCRESE_SPEED = 0.5;
const MAX_SPEED = 20;

// gravity
const BIRD_SIZE = 35;
const GRAVITY = 8.5;
const GRAVITY_TIME = 50;
const MULTIPLY_JUMP_HEIGHT = 0.09

// score
const SECONDE_PER_SCORE = 1000;
const INCRESE_SECONDE = 1;

const PIPE_WIDTH = 60;
const GAME_WIDTH = 600;
const COLLISION_MARGIN = 7;

export default function FlappyBird() {
  const [gameHeight, setGameHeight] = useState<number>(600);
  const [birdPosition, setBirdPosition] = useState<number>(300);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [birdAngle, setBirdAngle] = useState<number>(0);

  const [pipeGap, setPipeGap] = useState<number>(INITIAL_PIPE_GAP);
  const [pipeInterval, setPipeInterval] = useState<number>(INITIAL_PIPE_INTERVAL);
  const [pipeSpeed, setPipeSpeed] = useState<number>(INITIAL_SPEED);

  const restartGame = (): void => {
    setBirdPosition(gameHeight / 2);
    setPipes([]);
    setScore(0);
    setIsGameOver(false);
    setGameStarted(false);
    setPipeGap(INITIAL_PIPE_GAP);
    setPipeInterval(INITIAL_PIPE_INTERVAL);
    setPipeSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    if (gameStarted && !isGameOver) {
      const difficultyInterval = setInterval(() => {
        setPipeGap((gap) => Math.max(MIN_PIPE_GAP, gap - DECRESE_PIPE_GAP_INTERVAL));
        setPipeSpeed((speed) => Math.min(MAX_SPEED, speed + INCRESE_SPEED));
        setPipeInterval((interval) => Math.max(MIN_PIPE_INTERVAL, interval - DECRESE_PIPE_INTERVAL));
      }, INTERVAL_CHANGE_DIFFICULTY);
      return () => clearInterval(difficultyInterval);
    }
  }, [gameStarted, isGameOver]);

  useEffect(() => {
    setGameHeight(window.innerHeight);
    setBirdPosition(window.innerHeight / 2);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !isGameOver) {
      interval = setInterval(() => {
        setBirdPosition((pos) => pos + GRAVITY);
      }, GRAVITY_TIME);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isGameOver]);

  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const intervalId = setInterval(() => {
      const minTop = 80;
      const maxTop = gameHeight - pipeGap - 160;
      const topHeight = Math.floor(Math.random() * (maxTop - minTop) + minTop);

      setPipes((pipes) => [
        ...pipes,
        {
          left: GAME_WIDTH,
          height: topHeight,
          gap: pipeGap,
        },
      ]);
    }, pipeInterval);

    return () => clearInterval(intervalId);
  }, [gameStarted, isGameOver, gameHeight, pipeGap, pipeInterval]);

  useEffect(() => {
    let moveInterval: NodeJS.Timeout;
    if (gameStarted && !isGameOver) {
      moveInterval = setInterval(() => {
        setPipes((oldPipes) =>
          oldPipes
            .map((pipe) => ({ ...pipe, left: pipe.left - 5 }))
            .filter((pipe) => pipe.left + PIPE_WIDTH > 0)
        );
      }, 30);
    }
    return () => clearInterval(moveInterval);
  }, [gameStarted, isGameOver, pipeSpeed]);

  useEffect(() => {
    if (!isGameOver && gameStarted) {
      const angleInterval = setInterval(() => {
        setBirdAngle((angle) => Math.min(angle + 15, 35));
      }, 100);
      return () => clearInterval(angleInterval);
    }
  }, [gameStarted, isGameOver]);

  useEffect(() => {
    pipes.forEach((pipe) => {
      const pipeBottomY = pipe.height + pipe.gap;
      const birdTop = birdPosition;
      const birdBottom = birdPosition + BIRD_SIZE;

      const inPipeXRange =
        pipe.left < 50 + BIRD_SIZE - COLLISION_MARGIN &&
        pipe.left + PIPE_WIDTH > 50 + COLLISION_MARGIN;

      const hitTopPipe = birdTop < pipe.height - COLLISION_MARGIN;
      const hitBottomPipe = birdBottom > pipeBottomY + COLLISION_MARGIN;

      if (inPipeXRange && (hitTopPipe || hitBottomPipe)) {
        endGame();
      }
    });

    if (birdPosition >= gameHeight - BIRD_SIZE - COLLISION_MARGIN) {
      endGame();
    }
  }, [pipes, birdPosition, gameHeight]);

  const handleJump = (): void => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (!isGameOver) {
      const jumpHeight = window.innerHeight * MULTIPLY_JUMP_HEIGHT;
      setBirdPosition((pos) => Math.max(0, pos - jumpHeight));
      setBirdAngle(-30);
    }
  };

  const endGame = (): void => {
    setIsGameOver(true);
    setGameStarted(false);
  };

  useEffect(() => {
    if (gameStarted && !isGameOver) {
      const interval = setInterval(() => {
        setScore((score) => score + INCRESE_SECONDE);
      }, SECONDE_PER_SCORE);
      return () => clearInterval(interval);
    }
  }, [gameStarted, isGameOver]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.code === "Space" && !isGameOver) {
        handleJump();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isGameOver]);

  return (
    <div
      onClick={handleJump}
      style={{ height: gameHeight }}
    >
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          left: 50,
          top: birdPosition,
          width: BIRD_SIZE,
          height: BIRD_SIZE,
        }}
      >
        <img
          src="/bird.png"
          alt="bird"
          className="absolute"
          style={{
            width: BIRD_SIZE * 1.25,
            height: BIRD_SIZE * 1.25,
            left: -BIRD_SIZE * 0.25,
            top: -BIRD_SIZE * 0.25,
            transform: `rotate(${birdAngle}deg)`,
            transition: "transform 0.2s ease-out",
          }}
        />
      </div>

      {pipes.map((pipe, index) => (
        <React.Fragment key={index}>
          <div
            className="absolute overflow-hidden"
            style={{
              left: pipe.left,
              top: 0,
              width: PIPE_WIDTH,
              height: pipe.height,
            }}
          >
            <img
              src="/pipe_body.png"
              alt="pipe body"
              style={{
                width: PIPE_WIDTH * 0.9,
                height: pipe.height - 40,
                objectFit: "fill",
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
            <img
              src="/pipe_head.png"
              alt="pipe head"
              style={{
                width: PIPE_WIDTH,
                height: 40,
                position: "absolute",
                left: 0,
                top: pipe.height - 40,
              }}
            />
          </div>

          <div
            className="absolute overflow-hidden"
            style={{
              left: pipe.left,
              top: pipe.height + pipe.gap,
              width: PIPE_WIDTH,
              height: gameHeight - pipe.height - pipe.gap,
            }}
          >
            <img
              src="/pipe_head_2.png"
              alt="pipe head"
              style={{
                width: PIPE_WIDTH,
                height: 40,
                position: "absolute",
                left: 0,
                top: 0,
                transform: "rotate(180deg)",
              }}
            />
            <img
              src="/pipe_body.png"
              alt="pipe body"
              style={{
                width: PIPE_WIDTH * 0.9,
                height: gameHeight - pipe.height - pipe.gap - 40,
                objectFit: "fill",
                position: "absolute",
                top: 40,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </React.Fragment>
      ))}

      <div className="absolute top-2 left-2 text-white font-bold text-2xl drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
        Score: {score}
      </div>

      {isGameOver && (
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black p-5 rounded-lg text-center font-bold text-2xl">
          จบเกม
          <br />
          <button
            onClick={restartGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
