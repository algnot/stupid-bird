/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useHelperContext } from "./providers/helper-provider";

export default function TopBar() {
  const { userData } = useHelperContext()();
  return (
    <div className="flex justify-between p-3 items-center">
      <div className="flex gap-3">
        <div className="relative h-fit flex items-center gap-3 bg-secondary border-borderWeak text-foreground font-bold border-2 py-1 pr-4 rounded-xl">
          <img
            className="absolute w-15 h-15 rounded-full left-[-12px]"
            src="/daimond.png"
            alt="daimond"
          />
          <span className="min-w-8 w-fit text-right ml-12">
            {(userData.daimond ?? 0).toLocaleString()}
          </span>
        </div>
        <div className="relative h-fit flex items-center gap-3 bg-secondary border-borderWeak text-foreground font-bold border-2 py-1 pr-4 rounded-xl">
          <img
            className="absolute w-15 h-15 rounded-full left-[-12px]"
            src="/coin.png"
            alt="coin"
          />
          <span className="min-w-8 w-fit text-right ml-12">
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
        <p className="hidden md:block">{userData.displayName}</p>
      </div>
    </div>
  );
}
