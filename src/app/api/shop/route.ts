import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();

        const items = await db.collection("shop").aggregate([
            { $match: { isSale: true } },
            {
                $lookup: {
                    from: "items-info",
                    localField: "itemId",
                    foreignField: "_id",
                    as: "itemInfo"
                }
            },
            { $unwind: "$itemInfo" },
        ]).toArray();

        return NextResponse.json({
            data: items,
        });
    } catch (error) {
        return NextResponse.json(
            { status: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}
