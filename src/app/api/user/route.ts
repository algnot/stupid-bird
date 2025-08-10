/* eslint-disable prefer-const */
import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        let { userId, displayName, pictureUrl } = await req.json();

        if (process.env.NEXT_PUBLIC_FORCE_USER_ID) {
            userId = process.env.NEXT_PUBLIC_FORCE_USER_ID
        }

        const db = await getDatabase();
        let user = await db.collection('users').findOne({ userId: userId });

        if (process.env.NEXT_PUBLIC_FORCE_USER_ID) {
            displayName = user?.displayName ?? "";
            pictureUrl = user?.pictureUrl ?? "";
        }

        if (!user) {
            const insertResult = await db.collection('users').insertOne({
                userId,
                displayName,
                pictureUrl,
                createdAt: new Date(),
                coin: 200,
                daimond: 0,
                isDev: false,
                lastLogin: new Date().toDateString(),
            });

            user = await db.collection('users').findOne({ _id: insertResult.insertedId });
        } else {
            await db.collection('users').updateOne({
                userId: userId
            }, {
                $set: {
                    displayName,
                    pictureUrl,
                    lastLogin: new Date().toDateString(),
                }
            })
            user = await db.collection('users').findOne({ userId: userId });
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
