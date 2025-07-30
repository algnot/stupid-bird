import { GameConfig, gameConfigLabelToLabel } from "@/type/users";
import React from "react";

interface StatusProps {
  characterStatus?: GameConfig;
  hatStatus?: GameConfig;
  onClose?: () => void;
}

function renderDiff(key: keyof GameConfig, base?: number, add?: number) {
  const total = (base ?? 0) + (add ?? 0);
  add = add ?? 0;

  return (
    <p key={key} className="text-[#444] mb-1">
      {gameConfigLabelToLabel(key)} <b>{total.toLocaleString()}</b>{" "}
      {add !== 0 && (
        <span className={add > 0 ? "text-green-600" : "text-red-600"}>
          ({(base ?? 0).toLocaleString()}
          {add > 0 ? `+${add.toLocaleString()}` : `${add.toLocaleString()}`})
        </span>
      )}
    </p>
  );
}

const GROUPED_KEYS: Record<string, (keyof GameConfig)[]> = {
  สถานะตัวละคร: ["BIRD_SIZE", "SECONDE_PER_SCORE", "INCRESE_SCORE_PER_SECONDE", "COIN_PER_CLICK", "MULTIPLY_JUMP_HEIGHT"],
  ค่าเริ่มต้น : [
    "INITIAL_SPEED",
    "INITIAL_PIPE_GAP",
    "INITIAL_PIPE_INTERVAL"
  ],
  ดีบัพ: ["INTERVAL_CHANGE_DIFFICULTY", "INCRESE_SPEED", "DECRESE_PIPE_GAP_INTERVAL", "DECRESE_PIPE_INTERVAL"],
  ค่าต่ำสุด: ["MAX_SPEED", "MIN_PIPE_GAP", "MIN_PIPE_INTERVAL"],
  แรงโน้มถ่วง: ["GRAVITY", "GRAVITY_TIME"],
};

export default function CharacterStatus({
  characterStatus,
  hatStatus,
  onClose,
}: StatusProps) {
  return (
    <div className="absolute inset-0 bg-[#00000055] bg-opacity-50 flex items-center justify-center z-50 px-2">
      <div className="bg-[#fff9d9] p-6 rounded-xl shadow-lg relative border-[#815230] border-2 max-w-[400px] max-h-[80vh] overflow-auto">
        <button
          className="absolute top-2 right-3 text-red-500 text-md font-bold cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>

        {Object.entries(GROUPED_KEYS).map(([section, keys]) => (
          <div key={section} className="mb-3">
            <b className="text-[#444]">{section}</b>
            {keys.map((key) =>
              renderDiff(
                key,
                characterStatus?.[key] as number,
                hatStatus?.[key] as number,
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
