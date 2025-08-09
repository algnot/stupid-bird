/* eslint-disable @typescript-eslint/no-explicit-any */
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
    <p key={key} className="text-foreground mb-1">
      {gameConfigLabelToLabel(key)} <b>{value.toLocaleString()}</b>
    </p>
  );
}

function getByPath(obj: any, path: any): any {
  return path
    .split(".")
    .reduce(
      (acc: { [x: string]: any } | null, k: string | number) =>
        acc != null ? acc[k] : undefined,
      obj,
    );
}

function formatNum(v: any) {
  if (typeof v !== "number") return String(v ?? "-");
  const hasDecimal = Math.abs(v % 1) > 1e-9;
  return v.toLocaleString(undefined, {
    minimumFractionDigits: hasDecimal ? 0 : 0,
    maximumFractionDigits: 3,
  });
}

function renderSkillText(text: string, cfg: any) {
  return text.replace(/\{([A-Z0-9_.]+)\}/g, (_, p1) => {
    const val = getByPath(cfg, p1);
    return formatNum(val);
  });
}

export default function ItemStatus({ itemInfo, onClose }: ItemStatusProps) {
  const level = itemInfo?.level ?? 0;
  const gameConfig = itemInfo?.info.level[level];
  const skills = itemInfo?.info.skill ?? [];

  return (
    <>
      <div
        className="absolute z-5 inset-0 backdrop-blur-sm flex items-center justify-center px-2"
        onClick={onClose}
      />

      <div className="absolute z-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[550px] max-h-[80vh] overflow-auto">
        <div className="w-full h-full bg-secondary p-6 rounded-xl shadow-lg relative border-borderWeak border-2">
          <button
            className="absolute top-2 right-3 text-red-500 text-2xl font-bold cursor-pointer"
            onClick={onClose}
          >
            ×
          </button>

          <div className="text-md font-bold text-foreground mb-4">
            {itemInfo?.info.name.th ?? ""}
          </div>

          <div className="flex justify-center mb-4">
            <img
              className="w-[190px] h-[160px]"
              src={itemInfo?.info.image}
              alt={itemInfo?.info.name.en}
            />
          </div>

          {skills.length > 0 && (
            <div className="mb-4">
              <b className="text-foreground">ความสามารถ</b>
              <div className="mt-2 grid gap-3">
                {skills.map((s, idx) => (
                  <div
                    key={`${s.title}-${idx}`}
                    className="flex gap-3 items-start border-2 border-borderWeak rounded-lg p-3 bg-background/40"
                  >
                    {s.image && (
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-12 h-12 object-contain rounded-md bg-black p-1"
                      />
                    )}
                    <div>
                      <div className="text-foreground font-semibold leading-tight">
                        {s.title}
                      </div>
                      {s.descript && (
                        <div className="text-foreground/80 text-sm mt-1">
                          {renderSkillText(s.descript, gameConfig || {})}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gameConfig && (
            <>
              {Object.entries(GROUPED_KEYS).map(([section, keys]) => {
                const hasAny = keys.some(
                  (key) => gameConfig[key] && gameConfig[key] !== 0,
                );
                if (!hasAny) return null;

                return (
                  <div key={section} className="mb-3">
                    <b className="text-foreground">{section}</b>
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
    </>
  );
}
