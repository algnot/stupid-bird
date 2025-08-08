import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const db = await getDatabase();
        const isDev = searchParams.get('isDev') === "true";
        let filter: Record<string, unknown> = { isSale: true };

        if (isDev) {
            filter = {}
        }

        const items = await db.collection("shop").aggregate([
            { $match: filter },
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
