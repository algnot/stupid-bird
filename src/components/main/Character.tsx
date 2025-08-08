/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { useHelperContext } from "../providers/helper-provider";

export default function Character() {
  const {
    userData,
    setShowSummaryCharacterStatus,
    setShowItemStatus,
  } = useHelperContext()();
  useEffect(() => {}, [userData]);

  const character = userData.installItems.find(
    (item) => item.info.type === "character",
  );
  const hat = userData.installItems.find((item) => item.info.type === "hat");

  return (
    <div>
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
                  onClick={() => setShowItemStatus(item)}
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
              onClick={() => setShowSummaryCharacterStatus(character, hat)}
              className="hover:bg-[#ffea80] bg-[#f8da38] border-[#815230] text-[#815230] border-2 rounded-md p-2 font-bold flex justify-center items-center cursor-pointer h-14"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#815230"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20c0-3 2.5-5 6-5s6 2 6 5" />
              </svg>
              แสดงสถานะตัวละคร
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
