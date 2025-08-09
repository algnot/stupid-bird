/* eslint-disable @typescript-eslint/no-explicit-any */
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
    <p key={key} className="text-foreground mb-1">
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

const SKILL_PREFIX = "SKILL_";

const isPlainObject = (v: unknown): v is Record<string, any> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function formatSkillKeyLabel(key: string): string {
  const map: Record<string, string> = {
    COOL_DOWN: "Cool Down (ms)",
    IMMORTAL_TIME: "Immortal Time (ms)",
    DURATION: "Duration (ms)",
    POWER: "Power",
    CHANCE: "Chance",
    SCORE_MULTIPLE: "Score Multiple (×)",
  };
  if (map[key]) return map[key];
  return key
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatSkillGroupLabel(skillKey: string): string {
  const name = skillKey.replace(SKILL_PREFIX, "");
  return name
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function unionKeys(a?: Record<string, any>, b?: Record<string, any>) {
  return Array.from(
    new Set([...(a ? Object.keys(a) : []), ...(b ? Object.keys(b) : [])]),
  );
}

function RenderSkillParamsDiff({
  base,
  add,
  level = 0,
}: {
  base?: Record<string, any>;
  add?: Record<string, any>;
  level?: number;
}) {
  const keys = unionKeys(base, add);
  if (keys.length === 0) return null;

  return (
    <div className={level === 0 ? "mt-1" : "pl-4 mt-1"}>
      {keys.map((k) => {
        const bv = base?.[k];
        const av = add?.[k];

        if (typeof bv === "number" || typeof av === "number") {
          const bnum = typeof bv === "number" ? bv : 0;
          const anum = typeof av === "number" ? av : 0;
          const total = bnum + anum;
          return (
            <p key={k} className="text-foreground/90 text-sm mb-1">
              {formatSkillKeyLabel(k)}: <b>{total.toLocaleString()}</b>{" "}
              {anum !== 0 && (
                <span className={anum > 0 ? "text-green-600" : "text-red-600"}>
                  ({bnum.toLocaleString()}
                  {anum > 0
                    ? `+${anum.toLocaleString()}`
                    : `${anum.toLocaleString()}`}
                  )
                </span>
              )}
            </p>
          );
        }
        if (
          typeof bv === "string" ||
          typeof bv === "boolean" ||
          typeof av === "string" ||
          typeof av === "boolean"
        ) {
          return (
            <p key={k} className="text-foreground/90 text-sm mb-1">
              {formatSkillKeyLabel(k)}:{" "}
              <b>
                {bv !== undefined ? String(bv) : "-"}
                {av !== undefined ? ` → ${String(av)}` : ""}
              </b>
            </p>
          );
        }
        if (Array.isArray(bv) || Array.isArray(av)) {
          const arr = [
            ...(Array.isArray(bv) ? bv : []),
            ...(Array.isArray(av) ? av : []),
          ];
          return (
            <p key={k} className="text-foreground/90 text-sm mb-1">
              {formatSkillKeyLabel(k)}: <b>{arr.join(", ") || "-"}</b>
            </p>
          );
        }

        if (isPlainObject(bv) || isPlainObject(av)) {
          return (
            <div key={k} className="mb-1">
              <p className="text-foreground text-sm font-medium">
                {formatSkillKeyLabel(k)}
              </p>
              <RenderSkillParamsDiff
                base={
                  isPlainObject(bv) ? (bv as Record<string, any>) : undefined
                }
                add={
                  isPlainObject(av) ? (av as Record<string, any>) : undefined
                }
                level={level + 1}
              />
            </div>
          );
        }

        // fallback
        return (
          <p key={k} className="text-foreground/90 text-sm mb-1">
            {formatSkillKeyLabel(k)}: <b>-</b>
          </p>
        );
      })}
    </div>
  );
}

export default function CharacterStatus({
  characterStatus,
  hatStatus,
  onClose,
}: StatusProps) {
  const skillKeys = Array.from(
    new Set(
      [
        ...(characterStatus ? Object.keys(characterStatus) : []),
        ...(hatStatus ? Object.keys(hatStatus) : []),
      ].filter((k) => k.startsWith(SKILL_PREFIX)),
    ),
  );

  return (
    <>
      <div
        className="absolute z-3 inset-0 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute z-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[550px] max-h-[80vh] overflow-auto">
        <div className="w-full h-full bg-secondary p-6 rounded-xl shadow-lg relative border-borderWeak border-2">
          <button
            className="absolute top-2 right-3 text-red-500 text-2xl text-md font-bold cursor-pointer"
            onClick={onClose}
          >
            ×
          </button>

          {skillKeys.length > 0 && (
            <div className="mt-4">
              <b className="text-foreground">ค่าพารามิเตอร์ความสามารถ</b>
              <div className="my-2 grid gap-3">
                {skillKeys.map((skillKey) => {
                  const baseObj =
                    characterStatus?.[skillKey as keyof GameConfig];
                  const addObj = hatStatus?.[skillKey as keyof GameConfig];

                  const hasSomething =
                    (baseObj && typeof baseObj === "object") ||
                    (addObj && typeof addObj === "object");

                  if (!hasSomething) return null;

                  return (
                    <div
                      key={skillKey}
                      className="border-2 border-borderWeak rounded-lg p-3 bg-background/40"
                    >
                      <div className="text-foreground font-semibold">
                        {formatSkillGroupLabel(skillKey)}
                      </div>
                      <RenderSkillParamsDiff
                        base={
                          isPlainObject(baseObj)
                            ? (baseObj as Record<string, any>)
                            : undefined
                        }
                        add={
                          isPlainObject(addObj)
                            ? (addObj as Record<string, any>)
                            : undefined
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {Object.entries(GROUPED_KEYS).map(([section, keys]) => (
            <div key={section} className="mb-3">
              <b className="text-foreground">{section}</b>
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
    </>
  );
}
