import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        const db = await getDatabase();

        const items = await db.collection('items').aggregate([
            { $match: { userId: userId, isInstall: true } },
            {
                $lookup: {
                    from: 'items-info',
                    localField: 'itemId',
                    foreignField: '_id',
                    as: 'info'
                }
            },
            {
                $unwind: '$info'
            }
        ]).toArray();

        return NextResponse.json({ installItems: items });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}