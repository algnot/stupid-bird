/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useHelperContext } from "./providers/helper-provider";

export default function TopBar() {
  const { userData } = useHelperContext()();
  return (
    <div className="flex justify-between p-3">
      <div className="flex items-center gap-3 bg-secondary border-borderWeak text-foreground font-bold border-2 px-4 py-2 rounded-xl">
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
      <div className="flex items-center gap-2 bg-secondary border-borderWeak text-borderWeak border-2 px-4 py-2 rounded-xl">
        {userData.pictureUrl !== "" && (
          <img
            className="w-[40px] h-[40px] rounded-full"
            src={userData.pictureUrl}
            alt="profile"
          />
        )}
        {userData.displayName}
      </div>
    </div>
  );
}
