import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();

        const items = db.collection("shop").aggregate([
            { $match: { isSale: true } },
            {
                $lookup: {
                    from: "items-info",
                    localField: "_id",
                    foreignField: "itemId",
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
