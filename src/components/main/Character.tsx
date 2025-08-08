/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { useHelperContext } from "../providers/helper-provider";

export default function Character() {
  const { userData, setShowSummaryCharacterStatus, setShowItemStatus } =
    useHelperContext()();
  useEffect(() => {}, [userData]);

  const character = userData.installItems.find(
    (item) => item.info.type === "character"
  );
  const hat = userData.installItems.find((item) => item.info.type === "hat");

  return (
    <div className="flex justify-center w-full mt-20">
      {character && (
        <div className="relative flex flex-col justify-center items-center gap-6">
          {hat && (
            <img
              src={hat.info.image}
              alt={hat.info.name.en}
              className="absolute top-[-40px] z-10 w-[100px] h-[100px]"
              onClick={() => setShowSummaryCharacterStatus(character, hat)}
            />
          )}

          <img
            className="w-[300px] h-[220px] z-0"
            src={character.info.image}
            alt={character.info.name.en}
            onClick={() => setShowSummaryCharacterStatus(character, hat)}
          />
          <div className="text-2xl text-foreground font-bold">
            {character.info.name.th}
          </div>
          <div className="flex gap-2">
            {userData.installItems.map((item) => {
              return (
                <div
                  key={item._id}
                  className="bg-secondary cursor-pointer border-borderWeak border-2 p-1 rounded-sm"
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
        </div>
      )}
    </div>
  );
}
