/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHelperContext } from "../providers/helper-provider";
import { isErrorResponse } from "@/type/payload";
import { ItemShop } from "@/type/shop";

export default function Shop() {
  const [selectedTab, setSelectedTab] = useState<"character" | "hat">(
    "character",
  );
  const [items, setItems] = useState<ItemShop[]>([]);

  const { backendClient, userData } = useHelperContext()();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await backendClient.GetSaleItems();
    if (isErrorResponse(response)) {
      return;
    }
    setItems(response.data);
  };

  const tabClass = (tab: string) =>
    `relative flex items-center gap-2 px-5 py-2 text-white text-sm
     rounded-xl border border-[#3c2821] border-2
     ${selectedTab === tab ? "bg-[#3c2821]" : "bg-[#6c5147]"}`;

  const Dot = ({ active }: { active: boolean }) => (
    <div
      className={`w-[4px] h-[4px] rounded-full ${
        active ? "bg-white" : "bg-transparent"
      }`}
    />
  );

  return (
    <div className="h-[calc(100dvh-170px)]">
      <div className="flex justify-center gap-2 bg-[#6c5147] border-y-2 border-[#3c2821] py-3">
        <button
          className={tabClass("character")}
          onClick={() => setSelectedTab("character")}
        >
          <Dot active={selectedTab === "character"} />
          Characters
          <Dot active={selectedTab === "character"} />
        </button>
        <button
          className={tabClass("hat")}
          onClick={() => setSelectedTab("hat")}
        >
          <Dot active={selectedTab === "hat"} />
          Items
          <Dot active={selectedTab === "hat"} />
        </button>
      </div>

      <div className="bg-[#6c5147] border-b-2 border-[#3c2821] p-4 flex flex-wrap justify-center gap-4 h-[calc(100dvh-170px)] overflow-auto pb-24">
        {items
          .filter((item) => item.itemInfo.type === selectedTab)
          .map((item) => (
            <div
              className="bg-[#4a342d] rounded-md p-4 w-[140px] sm:w-[160px] md:w-[180px] flex flex-col items-center h-fit"
              key={item._id}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <img
                  src={
                    item.itemInfo.type === "character"
                      ? "/bird-icon.png"
                      : "/hat-icon.png"
                  }
                  width={24}
                  alt={item.itemId}
                />
                <div className="text-white text-xs text-right flex-1 ml-2">
                  {item.itemInfo.name.th ?? ""}
                </div>
              </div>

              <img
                src={item.itemInfo.image ?? ""}
                className="my-2"
                height={50}
                width={120}
                alt={item.itemId}
              />

              {(userData.coin ?? 0) < item.price ? (
                <div className="flex gap-1 justify-center items-center bg-[#f3bb3f] rounded-sm shadow-md mt-2 border-2 border-black py-2 px-3 text-sm opacity-25">
                  {item.price.toLocaleString()}
                  <img
                    src={item.unit === "coin" ? "/coin.png" : "/daimond.png"}
                    width={20}
                    alt={item.itemId}
                  />
                </div>
              ) : (
                <div className="flex gap-1 justify-center items-center bg-[#f3bb3f] rounded-sm shadow-md cursor-pointer mt-2 border-2 border-black py-2 px-3 text-sm">
                  {item.price.toLocaleString()}
                  <img
                    src={item.unit === "coin" ? "/coin.png" : "/daimond.png"}
                    width={20}
                    alt={item.itemId}
                  />
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
