/* eslint-disable @next/next/no-img-element */
"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import React, { useEffect } from "react";

export default function Page() {
  const { userData } = useHelperContext()();

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
      {/* <div className="absolute inset-0 bg-[#00000055] bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-[300px] text-center relative">
          <button className="absolute top-2 right-3 text-red-500 text-xl font-bold cursor-pointer">
            ×
          </button>
          <h2 className="text-xl font-bold text-[#345b95] mb-4">
            สถานะตัวละคร
          </h2>
          <p className="text-[#444] mb-2">
            {character?.info.name.th} Lv. {character?.level}
          </p>
          <p className="text-sm text-gray-500">ยังไม่มีรายละเอียดเพิ่มเติม</p>
        </div>
      </div> */}

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
                    className="bg-[#fff9d9] border-[#815230] border-2 p-1 rounded-sm"
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
            <div className="hover:bg-[#ffea80] bg-[#f8da38] border-[#815230] text-[#815230] border-2 rounded-md p-2 font-bold flex justify-center items-center cursor-pointer">
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
