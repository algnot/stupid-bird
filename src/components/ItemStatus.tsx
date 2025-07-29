/* eslint-disable @next/next/no-img-element */
import { GameConfig, gameConfigLabelToLabel, Item } from "@/type/users";
import React from "react";

interface ItemStatusProps {
  itemInfo?: Item;
  onClose?: () => void;
}

export default function ItemStatus({ itemInfo, onClose }: ItemStatusProps) {
  const gameConfig = itemInfo?.info.level[0];
  const filteredKeys = Object.keys(gameConfig ?? {}).filter(
    (key) => (gameConfig?.[key as keyof GameConfig] ?? 0) !== 0,
  );

  return (
    <div className="absolute inset-0 bg-[#00000055] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#fff9d9] p-6 rounded-xl shadow-lg w-[400px] relative border-[#815230] border-2">
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
            className="w-[160px] h-[160px]"
            src={itemInfo?.info.image}
            alt={itemInfo?.info.name.en}
          />
        </div>

        {filteredKeys.length > 0 && (
          <div className="text-[#444] text-sm space-y-1">
            {filteredKeys.map((key) => (
              <p key={key}>
                <span className="font-medium">
                  {gameConfigLabelToLabel(key as keyof GameConfig)}:
                </span>{" "}
                <b>
                  {(
                    itemInfo?.info.level[0]?.[key as keyof GameConfig] ?? 0
                  ).toLocaleString()}
                </b>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
