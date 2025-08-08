import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const db = await getDatabase();
        const installItems = await db.collection('items').aggregate([
            { $match: { userId: userId, isInstall: true } },
            {
                $lookup: {
                    from: 'items-info',
                    localField: 'itemId',
                    foreignField: '_id',
                    as: 'info'
                }
            },
            { $unwind: '$info' }
        ]).toArray();

        const character = installItems.find((item) => item.info.type === "character");

        const statusSummary = installItems.reduce((acc, item) => {
            const levelData = item.info.level?.[item.level || 0] || {};

            for (const [key, value] of Object.entries(levelData)) {
                acc[key] = (acc[key] || 0) + value;
            }

            return acc;
        }, {} as Record<string, number>);

        return NextResponse.json({
            status: statusSummary,
            character
        });

    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
