"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { GameConfig } from "@/type/users";
import React, { useState, useEffect } from "react";
import { useHelperContext } from "./providers/helper-provider";
import { isErrorResponse } from "@/type/payload";

interface Pipe {
  left: number;
  height: number;
  gap: number;
}

const PIPE_WIDTH = 60;
const GAME_WIDTH = 600;
const COLLISION_MARGIN = 7;

export default function FlappyBird({
  INTERVAL_CHANGE_DIFFICULTY,
  INITIAL_PIPE_GAP,
  MIN_PIPE_GAP,
  DECRESE_PIPE_GAP_INTERVAL,
  INITIAL_PIPE_INTERVAL,
  DECRESE_PIPE_INTERVAL,
  MIN_PIPE_INTERVAL,
  INITIAL_SPEED,
  INCRESE_SPEED,
  MAX_SPEED,
  BIRD_SIZE,
  GRAVITY,
  GRAVITY_TIME,
  MULTIPLY_JUMP_HEIGHT,
  SECONDE_PER_SCORE,
  INCRESE_SCORE_PER_SECONDE,
  CHARACTER_IMAGE,
  COIN_PER_CLICK,
}: GameConfig) {
  const { setFullLoading, backendClient, userData } = useHelperContext()();
  const [gameHeight, setGameHeight] = useState<number>(600);
  const [birdPosition, setBirdPosition] = useState<number>(300);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [birdAngle, setBirdAngle] = useState<number>(0);
  const [coin, setCoin] = useState<number>(0);

  const [pipeGap, setPipeGap] = useState<number>(INITIAL_PIPE_GAP);
  const [pipeInterval, setPipeInterval] = useState<number>(
    INITIAL_PIPE_INTERVAL,
  );
  const [pipeSpeed, setPipeSpeed] = useState<number>(INITIAL_SPEED);

  // handler difficulty
  useEffect(() => {
    if (gameStarted && !isGameOver) {
      const difficultyInterval = setInterval(() => {
        setPipeGap((gap) =>
          Math.max(MIN_PIPE_GAP, gap - DECRESE_PIPE_GAP_INTERVAL),
        );
        setPipeSpeed((speed) => Math.min(MAX_SPEED, speed + INCRESE_SPEED));
        setPipeInterval((interval) =>
          Math.max(MIN_PIPE_INTERVAL, interval - DECRESE_PIPE_INTERVAL),
        );
      }, INTERVAL_CHANGE_DIFFICULTY);
      return () => clearInterval(difficultyInterval);
    }
  }, [gameStarted, isGameOver]);

  useEffect(() => {
    setGameHeight(window.innerHeight);
    setBirdPosition(window.innerHeight / 2);
  }, []);

  // handler gravity
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !isGameOver) {
      interval = setInterval(() => {
        setBirdPosition((pos) => pos + GRAVITY);
      }, GRAVITY_TIME);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isGameOver]);

  // handler generate pipe
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const intervalId = setInterval(() => {
      const minTop = 100;
      const maxTop = gameHeight - pipeGap - 180;
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

  // handler collistion
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

  // handler game state
  useEffect(() => {
    if (gameStarted && !isGameOver) {
      const interval = setInterval(() => {
        setScore((score) => score + INCRESE_SCORE_PER_SECONDE);
      }, SECONDE_PER_SCORE);
      return () => clearInterval(interval);
    }
  }, [gameStarted, isGameOver]);

  // handler click
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.code === "Space" && !isGameOver) {
        handleJump();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isGameOver]);

  // handler move
  useEffect(() => {
    let moveInterval: NodeJS.Timeout;
    if (gameStarted && !isGameOver) {
      moveInterval = setInterval(() => {
        setPipes((oldPipes) =>
          oldPipes
            .map((pipe) => ({ ...pipe, left: pipe.left - 5 }))
            .filter((pipe) => pipe.left + PIPE_WIDTH > 0),
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

  const handleJump = (): void => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (!isGameOver) {
      const jumpHeight = window.innerHeight * MULTIPLY_JUMP_HEIGHT;
      setCoin((coin) => coin + COIN_PER_CLICK);
      setBirdPosition((pos) => Math.max(0, pos - jumpHeight));
      setBirdAngle(-30);
    }
  };

  const endGame = async () => {
    setIsGameOver(true);
    setGameStarted(false);

    setFullLoading(true);
    const response = await backendClient.insertGameLog({
      userId: userData.userId,
      coin,
      point: score,
      gameConfig: {
        INTERVAL_CHANGE_DIFFICULTY,
        INITIAL_PIPE_GAP,
        MIN_PIPE_GAP,
        DECRESE_PIPE_GAP_INTERVAL,
        INITIAL_PIPE_INTERVAL,
        DECRESE_PIPE_INTERVAL,
        MIN_PIPE_INTERVAL,
        INITIAL_SPEED,
        INCRESE_SPEED,
        MAX_SPEED,
        BIRD_SIZE,
        GRAVITY,
        GRAVITY_TIME,
        MULTIPLY_JUMP_HEIGHT,
        SECONDE_PER_SCORE,
        INCRESE_SCORE_PER_SECONDE,
        CHARACTER_IMAGE,
        COIN_PER_CLICK,
      },
    });

    if (isErrorResponse(response)) {
      window.location.href = "/";
    }
    setFullLoading(false);
  };

  return (
    <div onClick={handleJump} style={{ height: gameHeight }}>
      {CHARACTER_IMAGE && (
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
            src={CHARACTER_IMAGE}
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
      )}

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

      <div className="absolute top-4 left-4 text-white font-bold text-2xl drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
        <div className="flex gap-1 items-center">
          <img className="w-[34px] h-[34px]" src="/feather.png" alt="father" />
          {score.toLocaleString()}
        </div>
        <div className="flex gap-2 items-center mt-1">
          <img className="w-[30px] h-[30px]" src="/coin.png" alt="father" />
          {coin.toLocaleString()}
        </div>
      </div>

      {isGameOver && (
        <div className="absolute min-w-[250px] top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black p-5 rounded-lg">
          <div className="text-2xl text-[#345b95] text-center">Game Over</div>
          <div className="mt-4 flex gap-1">
            <img
              className="w-[34px] h-[34px]"
              src="/feather.png"
              alt="father"
            />
            <b>{score.toLocaleString()}</b>
          </div>
          <div className="mt-2 flex gap-2">
            <img className="w-[30px] h-[30px]" src="/coin.png" alt="coin" />
            <b>{coin.toLocaleString()}</b>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 mt-4 bg-[#fff9d9] w-full hover:bg-[#fff7c7] cursor-pointer border-[#815230] text-[#815230] border-2 p-1 rounded-sm"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
