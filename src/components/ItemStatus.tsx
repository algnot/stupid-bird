/* eslint-disable @next/next/no-img-element */
import { GameConfig, gameConfigLabelToLabel, Item } from "@/type/users";
import React from "react";

interface ItemStatusProps {
  itemInfo?: Item;
  onClose?: () => void;
}

const GROUPED_KEYS: Record<string, (keyof GameConfig)[]> = {
  สถานะตัวละคร: [
    "BIRD_SIZE",
    "SECONDE_PER_SCORE",
    "INCRESE_SCORE_PER_SECONDE",
    "COIN_PER_CLICK",
    "MULTIPLY_JUMP_HEIGHT",
  ],
  ค่าเริ่มต้น: ["INITIAL_SPEED", "INITIAL_PIPE_GAP", "INITIAL_PIPE_INTERVAL"],
  ดีบัพ: [
    "INTERVAL_CHANGE_DIFFICULTY",
    "INCRESE_SPEED",
    "DECRESE_PIPE_GAP_INTERVAL",
    "DECRESE_PIPE_INTERVAL",
  ],
  ค่าต่ำสุด: ["MAX_SPEED", "MIN_PIPE_GAP", "MIN_PIPE_INTERVAL"],
  แรงโน้มถ่วง: ["GRAVITY", "GRAVITY_TIME"],
};

function renderValue(key: keyof GameConfig, value: number) {
  return (
    <p key={key} className="text-[#444] mb-1">
      {gameConfigLabelToLabel(key)} <b>{value.toLocaleString()}</b>
    </p>
  );
}

export default function ItemStatus({ itemInfo, onClose }: ItemStatusProps) {
  const level = itemInfo?.level ?? 0;
  const gameConfig = itemInfo?.info.level[level];

  return (
    <div className="absolute inset-0 bg-[#00000055] bg-opacity-50 flex items-center justify-center z-50 px-2">
      <div className="bg-[#fff9d9] p-6 rounded-xl shadow-lg relative border-[#815230] border-2 max-w-[500px] max-h-[80vh] overflow-auto">
        <button
          className="absolute top-2 right-3 text-red-500 text-2xl font-bold cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>
        <div className="text-md font-bold text-[#345b95] mb-4">
          {itemInfo?.info.name.th ?? ""}
        </div>
        <div className="flex justify-center mb-4">
          <img
            className="w-[190px] h-[160px]"
            src={itemInfo?.info.image}
            alt={itemInfo?.info.name.en}
          />
        </div>

        {gameConfig && (
          <>
            {Object.entries(GROUPED_KEYS).map(([section, keys]) => {
              const hasAny = keys.some(
                (key) => gameConfig[key] && gameConfig[key] !== 0,
              );
              if (!hasAny) return null;

              return (
                <div key={section} className="mb-3">
                  <b className="text-[#444]">{section}</b>
                  {keys.map((key) =>
                    gameConfig[key] && gameConfig[key] !== 0
                      ? renderValue(key, gameConfig[key] as number)
                      : null,
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
