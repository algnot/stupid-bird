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
  immortal: boolean;
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
  SKILL_EVASION_FLIGHT,
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
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);

  // state
  const [immortal, setImmortal] = useState<boolean>(false);

  // handler difficulty
  useEffect(() => {
    if (gameStarted && !isGameOver) {
      const difficultyInterval = setInterval(() => {
        setPipeGap((gap) =>
          Math.max(MIN_PIPE_GAP, gap - DECRESE_PIPE_GAP_INTERVAL),
        );
        setSpeed((speed) => Math.min(MAX_SPEED, speed + INCRESE_SPEED));
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
          immortal: false,
        },
      ]);
    }, pipeInterval);

    return () => clearInterval(intervalId);
  }, [gameStarted, isGameOver, gameHeight, pipeGap, pipeInterval]);

  // handler collistion
  useEffect(() => {
    pipes.forEach((pipe) => {
      if (immortal || pipe.immortal) return;

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
      if (!immortal) {
        endGame();
      }
    }
  }, [pipes, birdPosition, gameHeight]);

  // handler game state
  useEffect(() => {
    if (gameStarted && !isGameOver) {
      const interval = setInterval(() => {
        let multiplyScore = 1;
        if (
          SKILL_EVASION_FLIGHT &&
          SKILL_EVASION_FLIGHT?.COOL_DOWN > 0 &&
          immortal
        ) {
          multiplyScore = SKILL_EVASION_FLIGHT?.SCORE_MULTIPLE ?? 1;
        }
        setScore((score) => score + INCRESE_SCORE_PER_SECONDE * multiplyScore);
      }, SECONDE_PER_SCORE);
      return () => clearInterval(interval);
    }
  }, [gameStarted, isGameOver, immortal]);

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
        // speed
        setPipes((oldPipes) =>
          oldPipes
            .map((pipe) => ({ ...pipe, left: pipe.left - speed }))
            .filter((pipe) => pipe.left + PIPE_WIDTH > 0),
        );
      }, 30);
    }
    return () => clearInterval(moveInterval);
  }, [gameStarted, isGameOver, speed]);

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

  // start skill: Evasion Flight
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [immortalLeft, setImmortalLeft] = useState(0);
  useEffect(() => {
    if (!gameStarted) return;

    const COOL_DOWN = SKILL_EVASION_FLIGHT?.COOL_DOWN ?? 0;
    const IMMORTAL_TIME = SKILL_EVASION_FLIGHT?.IMMORTAL_TIME ?? 0;

    if (COOL_DOWN <= 0 || IMMORTAL_TIME <= 0) return;

    let alive = true;
    let cooldownTimer: ReturnType<typeof setTimeout> | null = null;
    let immortalTimer: ReturnType<typeof setTimeout> | null = null;
    let tickInterval: ReturnType<typeof setInterval> | null = null;

    const startCooldown = () => {
      setImmortal(false);
      setCooldownLeft(COOL_DOWN);
      cooldownTimer = setTimeout(() => {
        if (!alive) return;
        startImmortal();
      }, COOL_DOWN + 100);
    };

    const startImmortal = () => {
      setImmortal(true);
      setImmortalLeft(IMMORTAL_TIME);
      immortalTimer = setTimeout(() => {
        if (!alive) return;
        startCooldown();
      }, IMMORTAL_TIME);
    };

    tickInterval = setInterval(() => {
      if (!alive) return;

      setCooldownLeft((prev) => (prev > 0 ? prev - 100 : 0));
      setImmortalLeft((prev) => (prev > 0 ? prev - 100 : 0));
    }, 100);

    startCooldown();

    return () => {
      alive = false;
      if (cooldownTimer) clearTimeout(cooldownTimer);
      if (immortalTimer) clearTimeout(immortalTimer);
      if (tickInterval) clearInterval(tickInterval);
    };
  }, [
    SKILL_EVASION_FLIGHT?.COOL_DOWN,
    SKILL_EVASION_FLIGHT?.IMMORTAL_TIME,
    gameStarted,
  ]);
  // end skill: Evasion Flight

  return (
    <div
      onClick={handleJump}
      style={{ height: gameHeight, backgroundImage: "url('/bg.png')" }}
    >
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
                opacity:
                  (immortal || pipe.immortal) && !isGameOver ? "50%" : "100%",
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
                opacity:
                  (immortal || pipe.immortal) && !isGameOver ? "50%" : "100%",
              }}
            />
          </div>

          <div
            style={{
              left: pipe.left,
              top: pipe.height + pipe.gap,
              width: PIPE_WIDTH,
              height: gameHeight - pipe.height - pipe.gap,
              opacity:
                (immortal || pipe.immortal) && !isGameOver ? "50%" : "100%",
              position: "absolute",
              overflow: "hidden",
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
                opacity:
                  (immortal || pipe.immortal) && !isGameOver ? "50%" : "100%",
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
                opacity:
                  (immortal || pipe.immortal) && !isGameOver ? "50%" : "100%",
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

      {!isGameOver &&
        SKILL_EVASION_FLIGHT &&
        SKILL_EVASION_FLIGHT.COOL_DOWN > 0 && (
          <>
            <div
              className={`absolute top-4 right-4 drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)] border-2 p-0.5 border-white bg-[#00000050] rounded-sm ${
                immortal ? "" : "opacity-50"
              }`}
            >
              <img
                src="https://pub-6e552ae286d54e4d9efc4d84fab7f96f.r2.dev/skill-evasion-flight.png"
                alt="skill-1"
                className="w-[34px] h-[34px]"
              />
            </div>
            <div className="absolute top-5.5 right-7.5 text-white font-bold text-xl drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
              {immortal
                ? Math.floor(immortalLeft / 1000)
                : Math.floor(cooldownLeft / 1000)}
            </div>
          </>
        )}

      {!gameStarted && !isGameOver && (
        <div className="absolute left-1/2 bottom-10 -translate-x-1/2 opacity-70 text-black p-5 text-xl">
          Tab เพื่อเล่น
        </div>
      )}

      {isGameOver && (
        <div className="absolute min-w-[250px] top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black p-5 rounded-lg">
          <div className="text-2xl text-foreground text-center">Game Over</div>
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
            className="px-4 mt-4 bg-secondary w-full cursor-pointer border-borderWeak text-borderWeak border-2 p-1 rounded-sm"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
