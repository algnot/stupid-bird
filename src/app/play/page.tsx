/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import FlappyBird from "@/components/FlappyBird";
import { useHelperContext } from "@/components/providers/helper-provider";
import { isErrorResponse } from "@/type/payload";
import { GameConfig } from "@/type/users";
import { useEffect, useState } from "react";

export default function Home() {
  const { backendClient, userData, setFullLoading } = useHelperContext()();
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [characterImage, setCharacterImage] = useState<string>("");

  useEffect(() => {
    if (userData?.userId !== "") {
      getUserStstus();
    }
  }, [userData]);

  const getUserStstus = async () => {
    setFullLoading(true);
    const response = await backendClient.getUserStatus(userData.userId);
    if (isErrorResponse(response)) {
      window.location.href = "/";
      return;
    }
    setGameConfig(response.status);
    setCharacterImage(response?.character?.info?.image ?? "");
    setFullLoading(false);
  };

  if (gameConfig) {
    return (
      <FlappyBird
        INTERVAL_CHANGE_DIFFICULTY={
          gameConfig?.INTERVAL_CHANGE_DIFFICULTY ?? 20000
        }
        INITIAL_PIPE_GAP={gameConfig?.INITIAL_PIPE_GAP ?? 210}
        MIN_PIPE_GAP={gameConfig?.MIN_PIPE_GAP ?? 130}
        DECRESE_PIPE_GAP_INTERVAL={gameConfig?.DECRESE_PIPE_GAP_INTERVAL ?? 10}
        INITIAL_PIPE_INTERVAL={gameConfig?.INITIAL_PIPE_INTERVAL ?? 2100}
        DECRESE_PIPE_INTERVAL={gameConfig?.DECRESE_PIPE_INTERVAL ?? 50}
        MIN_PIPE_INTERVAL={gameConfig?.MIN_PIPE_INTERVAL ?? 1600}
        INITIAL_SPEED={gameConfig?.INITIAL_SPEED ?? 10}
        INCRESE_SPEED={gameConfig?.INCRESE_SPEED ?? 0.5}
        MAX_SPEED={gameConfig?.MAX_SPEED ?? 20}
        BIRD_SIZE={gameConfig?.BIRD_SIZE ?? 35}
        GRAVITY={gameConfig?.GRAVITY ?? 8.5}
        GRAVITY_TIME={gameConfig?.GRAVITY_TIME ?? 50}
        MULTIPLY_JUMP_HEIGHT={gameConfig?.MULTIPLY_JUMP_HEIGHT ?? 0.09}
        SECONDE_PER_SCORE={gameConfig?.SECONDE_PER_SCORE ?? 1000}
        INCRESE_SCORE_PER_SECONDE={gameConfig?.INCRESE_SCORE_PER_SECONDE ?? 1}
        CHARACTER_IMAGE={characterImage}
        COIN_PER_CLICK={gameConfig?.COIN_PER_CLICK ?? 1}
        SKILL_EVASION_FLIGHT={gameConfig?.SKILL_EVASION_FLIGHT}
      />
    );
  }

  return <></>;
}
