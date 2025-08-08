import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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

export async function POST(req: Request) {
    try {
        const { userId, itemId = "" } = await req.json();

        if (!ObjectId.isValid(itemId)) {
            return NextResponse.json({ error: "Invalid itemId" }, { status: 400 });
        }

        const db = await getDatabase();

        const item = await db.collection("items").aggregate([
            { $match: { _id: new ObjectId(itemId as string), userId } },
            {
                $lookup: {
                    from: "items-info",
                    localField: "itemId",
                    foreignField: "_id",
                    as: "info",
                },
            },
            { $unwind: "$info" },
            {
                $project: {
                    _id: 1,
                    itemId: 1,
                    userId: 1,
                    "info.type": 1,
                },
            },
        ]).toArray();

        if (item.length === 0) {
            return NextResponse.json({ error: "Item not found for this user" }, { status: 404 });
        }

        const target = item[0];
        const itemType = target.info.type;

        const itemsToUninstall = await db.collection("items").aggregate([
            { $match: { userId, isInstall: true } },
            {
              $lookup: {
                from: "items-info",
                localField: "itemId",
                foreignField: "_id",
                as: "info",
              },
            },
            { $unwind: "$info" },
            { $match: { "info.type": itemType, _id: { $ne: target._id } } },
            { $project: { _id: 1 } },
          ]).toArray();
          
          const idsToUninstall = itemsToUninstall.map((i) => i._id);
          
          if (idsToUninstall.length > 0) {
            await db.collection("items").updateMany(
              { _id: { $in: idsToUninstall } },
              { $set: { isInstall: false } }
            );
          }

        await db.collection("items").updateOne(
            { _id: target._id },
            { $set: { isInstall: true } }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}