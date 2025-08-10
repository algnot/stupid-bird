import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/backend-tools';
import { JWTPayload } from 'jose';

export async function GET(req: Request) {
    try {
        const { claims } = await getUserFromRequest(req) as { claims: JWTPayload };
        const userId = typeof claims.sub === 'string' ? claims.sub : "";

        const db = await getDatabase();
        const user = await db.collection('users').findOne({ userId: userId });
        let filter: Record<string, unknown> = { isSale: true };

        if (user?.isDev) {
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
