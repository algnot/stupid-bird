import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const isInstall = searchParams.get('isInstall');
        const filter: Record<string, unknown> = { userId };

        if (isInstall && isInstall !== "all") {
            filter.isInstall = isInstall === "true";
        }

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const db = await getDatabase();

        const items = await db.collection('items').aggregate([
            { $match: filter },
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

        return NextResponse.json({ items: items });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}