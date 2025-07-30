import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();

        const topUsers = await db.collection("game-log").aggregate([
            { $sort: { point: -1 } },
            {
                $group: {
                    _id: "$userId",
                    bestPoint: { $first: "$point" },
                    bestCoin: { $first: "$coin" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "userId",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },
            { $sort: { bestPoint: -1 } },
            { $limit: 20 },
            {
                $project: {
                    userId: "$_id",
                    bestPoint: 1,
                    bestCoin: 1,
                    bestTime: 1,
                    displayName: "$userInfo.displayName",
                    pictureUrl: "$userInfo.pictureUrl",
                    _id: 0
                }
            }
        ]).toArray();

        return NextResponse.json({
            data: topUsers,
        });
    } catch (error) {
        return NextResponse.json(
            { status: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}
