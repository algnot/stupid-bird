/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { useHelperContext } from "./providers/helper-provider";
import { isErrorResponse } from "@/type/payload";
import { GetDailyLoginResponse } from "@/type/users";

export default function DailyLogin() {
  const {
    backendClient,
    valueStore,
    setValueStore,
    setFullLoading,
    fetchUser,
    userData,
  } = useHelperContext()();
  const [dailyInfo, setDailyInfo] = useState<GetDailyLoginResponse>();

  useEffect(() => {
    fetchData();
  }, [userData]);

  const fetchData = async () => {
    if (userData.userId === "") {
      return;
    }

    const response = await backendClient.getDailyLogin();
    if (isErrorResponse(response)) {
      return;
    }

    setDailyInfo(response);
    if (response.currentReward.items.length > 0) {
      setValueStore("dailyLogin", "show");
    }
  };

  const claimDaily = async () => {
    setFullLoading(true);
    const response = await backendClient.requestDailyLogin();
    setFullLoading(false);
    fetchUser();
    fetchData();
    if (isErrorResponse(response)) {
      return;
    }
    setValueStore("dailyLogin", "");
  };

  if (
    typeof valueStore?.dailyLogin === "undefined" ||
    valueStore?.dailyLogin === ""
  ) {
    return;
  }

  return (
    <>
      <div
        className="absolute inset-0 z-3 backdrop-blur-sm flex items-center justify-center"
        onClick={() => setValueStore("dailyLogin", "")}
      />

      <div className="absolute z-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[550px] max-h-[80vh] overflow-auto">
        <div className="bg-bgDefault border-4 border-borderStrong rounded-2xl p-6 shadow-lg text-white">
          <h2 className="text-lg font-bold text-center mb-4">Daily Login</h2>

          <div className="flex flex-wrap gap-2 justify-center items-center mt-3">
            {dailyInfo?.dailyInfo.map(({ items }, index) => {
              const isCurrentDaily =
                index + 1 == dailyInfo.loginStack &&
                dailyInfo.currentReward.items.length > 0;
              const isDailyClaimed = dailyInfo.currentReward.items.length == 0;
              const isClaimed =
                index + 1 < dailyInfo.loginStack ||
                (isCurrentDaily && isDailyClaimed);

              return (
                <div
                  key={Math.random()}
                  onClick={isCurrentDaily ? () => claimDaily() : () => {}}
                  className={`${
                    isClaimed ? "bg-borderStrong" : "bg-primary"
                  } w-fit text-black border-borderStrong border-2 rounded-xl p-2 ${
                    isCurrentDaily ? "opacity-100 cursor-pointer" : "opacity-40"
                  }`}
                >
                  <div className="text-sm font-bold text-center mb-2">
                    Day {index + 1}
                  </div>
                  <div className="text-sm p-2 gap-2 flex">
                    {items.map((item) => {
                      return (
                        <div
                          key={item.name}
                          className="flex flex-col justify-center items-center"
                        >
                          <img
                            className="w-[30px] h-[30px]"
                            src={
                              item.name === "coin"
                                ? "/coin.png"
                                : "/daimond.png"
                            }
                            alt={item.name}
                          />
                          {item.value.toLocaleString()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {dailyInfo && dailyInfo?.currentReward.items.length > 0 && (
            <>
              <div className="mt-3 text-center text-gray-400">
                click to claim your daily reward
              </div>
              <div className="flex flex-wrap gap-2 justify-center items-center mt-3">
                <div
                  onClick={claimDaily}
                  className="bg-primary w-fit text-black border-borderStrong border-2 rounded-xl p-2 cursor-pointer"
                >
                  <div className="text-sm p-2 gap-2 flex">
                    {dailyInfo?.currentReward.items.map((item) => {
                      return (
                        <div
                          key={item.name}
                          className="flex flex-col justify-center items-center"
                        >
                          <img
                            className="w-[30px] h-[30px]"
                            src={
                              item.name === "coin"
                                ? "/coin.png"
                                : "/daimond.png"
                            }
                            alt={item.name}
                          />
                          {item.value.toLocaleString()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
