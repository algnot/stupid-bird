/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Item, ScoreBoard } from "@/type/users";
import { useEffect, useState } from "react";
import { useHelperContext } from "./providers/helper-provider";
import { isErrorResponse } from "@/type/payload";

const UserItem = ({ userId }: { userId: string }) => {
  const { backendClient, setShowItemStatus } = useHelperContext()();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    getUserItems();
  }, []);

  const getUserItems = async () => {
    const response = await backendClient.GetUserItems(userId, "true");
    if (isErrorResponse(response)) {
      return;
    }
    setItems(response.items);
  };

  return (
    <div className="flex gap-2 justify-center">
      {items.map((item) => {
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
  );
};

export default function ScoreBoardContent() {
  const { backendClient } = useHelperContext()();
  const [scores, setScores] = useState<ScoreBoard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScoreBoard();
  }, []);

  const fetchScoreBoard = async () => {
    setLoading(true);
    const resposne = await backendClient.GetScoreBoard();
    if (isErrorResponse(resposne)) {
      return;
    }
    setScores(resposne.data);
    setLoading(false);
  };

  if (loading) return <div className="text-center">กำลังโหลด...</div>;

  return (
    <div className="space-y-2">
      {scores.map((user, index) => (
        <div
          key={user.userId + index}
          className="grid grid-cols-3 items-center bg-secondary p-2 rounded border-borderWeak border-2"
        >
          <div className="flex items-center gap-2 drop-shadow-[1px_1px_1px_rgba(0,0,0,0.3)]">
            <img
              src={user.pictureUrl}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-borderWeak truncate">{user.displayName}</span>
          </div>
          <UserItem userId={user.userId} />
          <div className="flex items-center justify-end font-bold text-foreground drop-shadow-[1px_1px_1px_rgba(0,0,0,0.3)]">
            {user.bestPoint.toLocaleString()}
            <img
              className="w-[20px] h-[20px]"
              src="/feather.png"
              alt="father"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
