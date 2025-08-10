"use client";
import DailyLogin from "@/components/DailyLogin";
import Character from "@/components/main/Character";
import Inventory from "@/components/main/Inventory";
import Shop from "@/components/main/Shop";
import NavBar from "@/components/NavBar";
import { useHelperContext } from "@/components/providers/helper-provider";
import TopBar from "@/components/TopBar";
import React, { useEffect } from "react";

export default function Page() {
  const { router } = useHelperContext()();

  useEffect(() => {}, [router]);

  return (
    <div
      className="flex flex-col h-[100dvh] bg-cover bg-no-repeat relative"
      style={{
        backgroundImage: "url('/bg.png')",
      }}
    >
      <DailyLogin />
      <TopBar />

      {router === "character" && <Character />}
      {router === "shop" && <Shop />}
      {router === "inventory" && <Inventory />}

      <NavBar />
    </div>
  );
}
