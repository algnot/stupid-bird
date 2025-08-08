/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useHelperContext } from "./providers/helper-provider";

export default function NavBar() {
  const { setIsShowScoreBoard, setRouter } = useHelperContext()();

  return (
    <>
      <div
        className="absolute bottom-[30px] left-1/2 transform -translate-x-1/2 w-[70px] h-[70px] flex flex-col justify-center items-center cursor-pointer rounded-full bg-primary border-borderWeak border-2 z-10 shadow-md"
        onClick={() => (window.location.href = "/play")}
      >
        <img src="/play.png" className="w-[32px]" alt="play" />
        <span className="text-[12px]">เล่น</span>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-primary border-borderWeak border-2 flex justify-around rounded-t-3xl text-[12px] shadow-md py-3">
        <div
          className="flex justify-center flex-col items-center cursor-pointer"
          onClick={() => setRouter("character")}
        >
          <img src="/character.png" className="w-[28px]" alt="character" />
          ตัวละคร
        </div>
        <div
          className="flex justify-center flex-col items-center cursor-pointer"
          onClick={() => setIsShowScoreBoard(true)}
        >
          <img src="/rank.png" className="w-[28px]" alt="rank" />
          อันดับ
        </div>
        <div className="w-[80px]" />
        <div
          className="flex justify-center flex-col items-center cursor-pointer"
          onClick={() => setRouter("shop")}
        >
          <img src="/shop.png" className="w-[28px]" alt="shop" />
          ร้านค้า
        </div>
        <div
          className="flex justify-center flex-col items-center cursor-pointer"
          onClick={() => setRouter("inventory")}
        >
          <img src="/inventory.png" className="w-[28px]" alt="inventory" />
          คลัง
        </div>
      </div>
    </>
  );
}
