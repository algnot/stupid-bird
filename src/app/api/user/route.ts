import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const { userId, displayName, pictureUrl } = await req.json();

        const db = await getDatabase();
        let user = await db.collection('users').findOne({ userId: userId });

        if (!user) {
            const insertResult = await db.collection('users').insertOne({
                userId,
                displayName,
                pictureUrl,
                createdAt: new Date(),
                coin: 200,
                daimond: 0
            });

            user = await db.collection('users').findOne({ _id: insertResult.insertedId });
        } 

        let items = await db.collection('items').aggregate([
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
        
        if (items.length == 0) {
            const starterItems = await db.collection('items-info').find({ starter: true }).toArray();
            const itemsList = []
            for (const starterItem of starterItems) {
                itemsList.push({
                    userId,
                    itemId: starterItem._id,
                    level: starterItem.startLevel,
                    isInstall: true,
                    qty: 1,
                })
            }
            await db.collection('items').insertMany(itemsList);

            items = await db.collection('items').aggregate([
                { $match: { userId: userId } },
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
        }

        return NextResponse.json({ ...user, installItems: items });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
