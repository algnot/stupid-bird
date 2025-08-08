/* eslint-disable @next/next/no-img-element */
"use client";
import Character from "@/components/main/Character";
import Inventory from "@/components/main/Inventory";
import Shop from "@/components/main/Shop";
import { useHelperContext } from "@/components/providers/helper-provider";
import TopBar from "@/components/TopBar";
import React, { useEffect } from "react";

export default function Page() {
  const { userData, router, setIsShowScoreBoard, setRouter } =
    useHelperContext()();

  useEffect(() => {}, [userData, router]);

  return (
    <div
      className="flex flex-col justify-between h-[100dvh] p-3 bg-cover bg-no-repeat relative"
      style={{
        backgroundImage: "url('/bg.png')",
      }}
    >
      <TopBar />

      <div className="flex justify-center">
        {router === "character" && <Character />}
        {router === "shop" && <Shop />}
        {router === "inventory" && <Inventory />}
      </div>

      <div
        className="absolute bottom-[30px] left-1/2 transform -translate-x-1/2 w-[80px] h-[80px] flex flex-col justify-center items-center cursor-pointer rounded-full bg-[#ffd400] border-[#815230] border-2 z-10 shadow-md"
        onClick={() => (window.location.href = "/play")}
      >
        <img src="/play.png" className="w-[36px]" alt="play" />
        <span className="text-[12px]">เล่น</span>
      </div>

      <div className="bg-[#ffd400] border-[#815230] border-2 flex justify-around rounded-4xl text-[12px] py-3 shadow-md">
        <div
          className="flex justify-center flex-col items-center cursor-pointer"
          onClick={() => setRouter("character")}
        >
          <img src="/character.png" className="w-[30px]" alt="character" />
          ตัวละคร
        </div>
        <div
          className="flex justify-center flex-col items-center cursor-pointer"
          onClick={() => setIsShowScoreBoard(true)}
        >
          <img src="/rank.png" className="w-[30px]" alt="rank" />
          อันดับ
        </div>
        <div className="w-[80px]" />
        <div
          className="flex justify-center flex-col items-center cursor-pointer"
          onClick={() => setRouter("shop")}
        >
          <img src="/shop.png" className="w-[30px]" alt="shop" />
          ร้านค้า
        </div>
        <div
          className="flex justify-center flex-col items-center cursor-pointer"
          onClick={() => setRouter("inventory")}
        >
          <img src="/inventory.png" className="w-[30px]" alt="inventory" />
          คลัง
        </div>
      </div>
    </div>
  );
}
