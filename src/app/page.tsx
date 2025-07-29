/* eslint-disable @next/next/no-img-element */
"use client";
import CharacterStatus from "@/components/CharacterStatus";
import ItemStatus from "@/components/ItemStatus";
import { useHelperContext } from "@/components/providers/helper-provider";
import { Item } from "@/type/users";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { userData } = useHelperContext()();
  const [isShowCharacterStatus, setIsShowCharacterStatus] =
    useState<boolean>(false);
  const [showItemInfo, setShowItemInfo] = useState<Item | null>(null);

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
            <div
              onClick={() => setIsShowCharacterStatus(true)}
              className="hover:bg-[#ffea80] bg-[#f8da38] border-[#815230] text-[#815230] border-2 rounded-md p-2 font-bold flex justify-center items-center cursor-pointer"
            >
              แสดงสถานะตัวละคร
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
