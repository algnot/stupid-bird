/* eslint-disable @next/next/no-img-element */
"use client";
import CharacterStatus from "@/components/CharacterStatus";
import ItemStatus from "@/components/ItemStatus";
import { useHelperContext } from "@/components/providers/helper-provider";
import ScoreBoardContent from "@/components/ScoreBoardContent";
import { Item } from "@/type/users";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { userData } = useHelperContext()();
  const [isShowCharacterStatus, setIsShowCharacterStatus] =
    useState<boolean>(false);
  const [showItemInfo, setShowItemInfo] = useState<Item | null>(null);
  const [isShowScoreBoard, setIsShowScoreBoard] = useState(false);

  useEffect(() => {}, [userData]);

  const character = userData.installItems.find(
    (item) => item.info.type === "character",
  );
  const hat = userData.installItems.find((item) => item.info.type === "hat");

  return (
    <div
      className="flex flex-col justify-between h-[100dvh] p-3 bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/bg.png')",
      }}
    >
      {isShowCharacterStatus && (
        <CharacterStatus
          onClose={() => setIsShowCharacterStatus(false)}
          characterStatus={character?.info.level[character.level ?? 0]}
          hatStatus={hat?.info.level[hat.level ?? 0]}
        />
      )}

      {showItemInfo !== null && !isShowCharacterStatus && (
        <ItemStatus
          onClose={() => setShowItemInfo(null)}
          itemInfo={showItemInfo}
        />
      )}

      {isShowScoreBoard && (
        <div className="fixed inset-0 z-50 bg-[#00000055] flex justify-center items-center">
          <div className="bg-white rounded-xl p-4 w-[90%] max-w-[500px] max-h-[80vh] overflow-auto">
            <div className="text-xl font-bold text-center mb-4 text-[#345b95]">
              อันดับผู้เล่น
            </div>

            <ScoreBoardContent />

            <button
              onClick={() => setIsShowScoreBoard(false)}
              className="mt-4 bg-[#f8da38] border-[#815230] border-2 px-4 py-2 rounded font-bold text-[#815230] w-full"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-between">
        <div className="flex items-center gap-3 bg-[#fff9d9] border-[#815230] text-[#345b95] font-bold border-2 px-4 py-2 rounded-xl">
          <div className="flex">
            <img
              className="w-[30px] h-[30px] rounded-full"
              src="/daimond.png"
              alt="daimond"
            />
            <span className="w-[55px] text-right">
              {(userData.daimond ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="flex">
            <img
              className="w-[30px] h-[30px] rounded-full"
              src="/coin.png"
              alt="coin"
            />
            <span className="w-[55px] text-right">
              {(userData.coin ?? 0).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#fff9d9] border-[#815230] text-[#815230] border-2 px-4 py-2 rounded-xl">
          <img
            className="w-[40px] h-[40px] rounded-full"
            src={userData.pictureUrl}
            alt="profile"
          />
          {userData.displayName}
        </div>
      </div>

      <div className="flex justify-center">
        {character && (
          <div className="relative flex flex-col justify-center items-center gap-6">
            {hat && (
              <img
                src={hat.info.image}
                alt={hat.info.name.en}
                className="absolute top-[-40px] z-10 w-[100px] h-[100px]"
              />
            )}

            <img
              className="w-[300px] h-[220px] z-0"
              src={character.info.image}
              alt={character.info.name.en}
            />
            <div className="text-2xl text-[#345b95] font-bold">
              {character.info.name.th} Lv. {character.level}
            </div>
            <div className="flex gap-2">
              {userData.installItems.map((item) => {
                return (
                  <div
                    key={item._id}
                    className="bg-[#fff9d9] hover:bg-[#fff7c7] cursor-pointer border-[#815230] border-2 p-1 rounded-sm"
                    onClick={() => setShowItemInfo(item)}
                  >
                    <img
                      className="w-[30px] h-[30px]"
                      src={item.info.image}
                      alt={item.info.name.en}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <div
                onClick={() => setIsShowCharacterStatus(true)}
                className="hover:bg-[#ffea80] bg-[#f8da38] border-[#815230] text-[#815230] border-2 rounded-md p-2 font-bold flex justify-center items-center cursor-pointer"
              >
                แสดงสถานะตัวละคร
              </div>

              <div
                onClick={() => setIsShowScoreBoard(true)}
                className="hover:bg-[#ffea80] bg-[#f8da38] border-[#815230] text-[#815230] border-2 rounded-md p-2 font-bold flex justify-center items-center cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#FFD700"
                  viewBox="0 0 24 24"
                  stroke="#815230"
                  strokeWidth={1.5}
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5h7.5M3 6.75a2.25 2.25 0 002.25 2.25h.75A2.25 2.25 0 008.25 6.75V4.5H3v2.25zm18 0a2.25 2.25 0 01-2.25 2.25h-.75A2.25 2.25 0 0115.75 6.75V4.5H21v2.25zM12 13.5a6 6 0 006-6V4.5H6v3a6 6 0 006 6zM12 13.5v4.5M9 21h6"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {userData.userId !== "" && (
        <a
          href="/play"
          className="bg-[#00be00] border-[#815230] text-[#815230] border-2 rounded-md p-2 font-bold flex justify-center items-center cursor-pointer"
        >
          เล่นเกม
        </a>
      )}
    </div>
  );
}
