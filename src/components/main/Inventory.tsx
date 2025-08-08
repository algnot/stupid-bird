/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { Item } from "@/type/users";
import React, { useEffect, useState } from "react";
import { useHelperContext } from "../providers/helper-provider";
import { isErrorResponse } from "@/type/payload";
import { convertItemInfoToItem } from "@/type/shop";

export default function Inventory() {
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [selectedTab, setSelectedTab] = useState<"character" | "hat">(
    "character"
  );

  const {
    backendClient,
    userData,
    setShowSummaryCharacterStatus,
    setShowItemStatus,
    setFullLoading,
    setAlert,
    fetchUser,
  } = useHelperContext()();

  useEffect(() => {
    fetchData();
  }, []);

  const character = userData.installItems.find(
    (item) => item.info.type === "character"
  );
  const hat = userData.installItems.find((item) => item.info.type === "hat");

  const fetchData = async () => {
    const response = await backendClient.GetUserItems(userData.userId, "all");
    if (isErrorResponse(response)) {
      return;
    }

    setUserItems(response.items);
  };

  const onInstallItem = (item: Item) => {
    setAlert(
      "ยืนยันการติดตั้ง",
      `คุณต้องการซื้อ ${item.info.name.th} ใช่หรือไม่?`,
      async () => {
        setFullLoading(true);
        const response = await backendClient.installItem(
          userData.userId,
          item._id
        );
        await fetchUser();
        setFullLoading(false);
        if (isErrorResponse(response)) {
          return;
        }
        setAlert(
          "สำเร็จ",
          "ติดตั้งไอเท็มสำเร็จแล้ว",
          async () => {
            setFullLoading(true);
            const userItemResponse = await backendClient.GetUserItems(
              userData.userId,
              "all"
            );
            setFullLoading(false);
            if (isErrorResponse(userItemResponse)) {
              return;
            }
            setUserItems(userItemResponse.items);
          },
          false
        );
      },
      true
    );
  };

  const tabClass = (tab: string) =>
    `relative flex items-center gap-2 px-5 py-2 text-white text-sm
     rounded-xl border border-borderStrong border-2
     ${selectedTab === tab ? "bg-borderStrong" : "bg-bgDefault"}`;

  const Dot = ({ active }: { active: boolean }) => (
    <div
      className={`w-[4px] h-[4px] rounded-full ${
        active ? "bg-white" : "bg-transparent"
      }`}
    />
  );

  return (
    <div className="h-full">
      {character && (
        <div className="relative flex flex-col justify-center items-center gap-6 mt-10">
          {hat && (
            <img
              src={hat.info.image}
              alt={hat.info.name.en}
              className="absolute top-[-40px] z-2 w-[80px] h-[80px]"
              onClick={() => setShowSummaryCharacterStatus(character, hat)}
            />
          )}

          <img
            className="w-[200px] h-[150px] z-0"
            src={character.info.image}
            alt={character.info.name.en}
            onClick={() => setShowSummaryCharacterStatus(character, hat)}
          />
        </div>
      )}

      <div className="mt-8 h-full flex flex-col">
        <div className="flex justify-center gap-2 bg-bgDefault border-y-2 border-borderStrong py-3">
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

        <div className="flex-1 bg-bgDefault pt-4 px-4 overflow-auto pb-24">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-[325px]">
            {userItems
              .filter((item) => item.info.type === selectedTab)
              .map((item) => {
                return (
                  <div
                    className="bg-bgCard rounded-md p-4 w-full h-full flex flex-col items-center"
                    key={item._id}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <img
                        src={
                          item.info.type === "character"
                            ? "/bird-icon.png"
                            : "/hat-icon.png"
                        }
                        width={24}
                        alt={item.itemId}
                      />
                      <div className="text-white text-xs text-right flex-1 ml-2">
                        {item.info.name.th ?? ""}
                      </div>
                    </div>

                    <img
                      src={item.info.image ?? ""}
                      className="my-2 cursor-pointer object-contain w-[100px] h-[100px]"
                      alt={item.itemId}
                      onClick={() =>
                        setShowItemStatus(
                          convertItemInfoToItem(userData, item.info)
                        )
                      }
                    />

                    {item.isInstall && (
                      <div className="h-[40px] flex justify-center items-center text-white mt-2">
                        ติดตั้งอยู่
                      </div>
                    )}

                    {!item.isInstall && (
                      <div
                        onClick={() => onInstallItem(item)}
                        className="h-[40px] flex gap-1 justify-center items-center bg-bgButton rounded-xl shadow-md cursor-pointer mt-2 border-2 border-black py-2 px-3 text-sm"
                      >
                        ติดตั้ง
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
