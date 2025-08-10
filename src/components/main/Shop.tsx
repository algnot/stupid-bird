/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHelperContext } from "../providers/helper-provider";
import { isErrorResponse } from "@/type/payload";
import { convertItemInfoToItem, ItemShop } from "@/type/shop";
import { Item } from "@/type/users";

export default function Shop() {
  const [selectedTab, setSelectedTab] = useState<"character" | "hat">(
    "character",
  );
  const [items, setItems] = useState<ItemShop[]>([]);
  const [userItems, setUserItems] = useState<Item[]>([]);

  const {
    backendClient,
    userData,
    setShowItemStatus,
    setAlert,
    setFullLoading,
    fetchUser,
  } = useHelperContext()();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await backendClient.getSaleItems();
    if (isErrorResponse(response)) {
      return;
    }

    const userItemResponse = await backendClient.getUserItems(
      userData.userId,
      "all",
    );
    if (isErrorResponse(userItemResponse)) {
      return;
    }

    setItems(response.data);
    setUserItems(userItemResponse.items);
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

  const onBuyItem = (item: ItemShop) => {
    setAlert(
      "ยืนยันการซื้อ",
      `คุณต้องการซื้อ ${item.itemInfo.name.th} ราคา ${item.price} ${item.unit}s ใช่หรือไม่?`,
      async () => {
        setFullLoading(true);
        const response = await backendClient.buyItem(item._id);
        setFullLoading(false);
        await fetchUser();
        if (isErrorResponse(response)) {
          return;
        }
        setAlert(
          "สำเร็จ",
          "การซื้อของคุณสำเร็จแล้ว",
          async () => {
            setFullLoading(true);
            const userItemResponse = await backendClient.getUserItems(
              userData.userId,
              "all",
            );
            setFullLoading(false);
            if (isErrorResponse(userItemResponse)) {
              return;
            }
            setUserItems(userItemResponse.items);
          },
          false,
        );
      },
      true,
    );
  };

  return (
    <div className="h-full flex flex-col">
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-24">
          {items
            .filter((item) => item.itemInfo.type === selectedTab)
            .map((item) => {
              const userItemIds = userItems.map((item) => item.itemId);
              const hasItem = userItemIds.includes(item.itemInfo._id);

              return (
                <div
                  className="bg-bgCard rounded-md p-4 w-full h-full flex flex-col items-center"
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
                    className="my-2 cursor-pointer object-contain w-[100px] h-[100px]"
                    alt={item.itemId}
                    onClick={() =>
                      setShowItemStatus(
                        convertItemInfoToItem(userData, item.itemInfo),
                      )
                    }
                  />

                  {hasItem && (
                    <div className="h-[40px] flex justify-center items-center text-white mt-2">
                      มีแล้ว
                    </div>
                  )}

                  {(userData[item.unit] ?? 0) < item.price && !hasItem && (
                    <div className="h-[40px] flex gap-1 justify-center items-center bg-bgButton rounded-xl shadow-md mt-2 border-2 border-black py-2 px-3 text-sm opacity-25">
                      {item.price.toLocaleString()}
                      <img
                        src={
                          item.unit === "coin" ? "/coin.png" : "/daimond.png"
                        }
                        width={20}
                        alt={item.itemId}
                      />
                    </div>
                  )}

                  {(userData[item.unit] ?? 0) >= item.price && !hasItem && (
                    <div
                      onClick={() => onBuyItem(item)}
                      className="flex gap-1 justify-center items-center bg-bgButton rounded-xl shadow-md cursor-pointer mt-2 border-2 border-black py-2 px-3 text-sm"
                    >
                      {item.price.toLocaleString()}
                      <img
                        src={
                          item.unit === "coin" ? "/coin.png" : "/daimond.png"
                        }
                        width={20}
                        alt={item.itemId}
                      />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
