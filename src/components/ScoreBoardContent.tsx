/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { ScoreBoard } from "@/type/users";
import { useEffect, useState } from "react";
import { useHelperContext } from "./providers/helper-provider";
import { isErrorResponse } from "@/type/payload";

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
          className="flex items-center justify-between bg-[#fff9d9] p-2 rounded border-[#815230] border-2"
        >
          <div className="flex items-center gap-2">
            <img
              src={user.pictureUrl}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-[#815230]">{user.displayName}</span>
          </div>
          <div className="text-right font-bold text-[#345b95]">
            {user.bestPoint.toLocaleString()} คะแนน
          </div>
        </div>
      ))}
    </div>
  );
}
