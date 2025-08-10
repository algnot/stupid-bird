import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getUserFromRequest } from '@/lib/backend-tools';
import { JWTPayload } from 'jose';

export async function POST(req: Request) {
    try {
        const { claims } = await getUserFromRequest(req) as { claims: JWTPayload };
        const userId = typeof claims.sub === 'string' ? claims.sub : "";
        const { shopId = "" } = await req.json();

        if (!ObjectId.isValid(shopId)) {
            return NextResponse.json({ error: "Invalid shopId" }, { status: 400 });
        }

        const db = await getDatabase();
        const user = await db.collection('users').findOne({ userId: userId });
        const shopInfo = await db.collection('shop').aggregate([
            { $match: { _id: new ObjectId(shopId as string) } },
            {
                $lookup: {
                    from: "items-info",
                    localField: "itemId",
                    foreignField: "_id",
                    as: "itemInfo"
                }
            },
            { $unwind: "$itemInfo" },
            {
                $project: {
                    _id: 1,
                    price: 1,
                    unit: 1,
                    itemId: 1,
                    "itemInfo._id": 1,
                    "itemInfo.type": 1
                }
            }
        ]).toArray();

        if (shopInfo.length === 0) {
            return NextResponse.json({ error: "item not found" }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ error: "user not found" }, { status: 400 });
        }

        if (user[shopInfo[0].unit] < shopInfo[0].price) {
            return NextResponse.json({ error: `not enough ${shopInfo[0].unit} (want ${shopInfo[0].price.toLocaleString()} ${shopInfo[0].unit} you have ${user[shopInfo[0].unit].toLocaleString()} ${shopInfo[0].unit})` }, { status: 400 });
        }

        await db.collection("users").updateOne(
            { userId: userId },
            {
                $inc: {
                    [shopInfo[0].unit]: -1 * shopInfo[0].price,
                },
            },
        );

        const insertResult = await db.collection("items").insertOne({
            userId,
            itemId: shopInfo[0].itemInfo._id,
            isInstall: true,
            level: 0,
            qty: 1,
        });

        const itemType = shopInfo[0].itemInfo.type;

        const installedItems = await db.collection("items").aggregate([
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
            {
                $match: {
                    "info.type": itemType,
                },
            },
        ]).toArray();

        const installedIdsToDisable = installedItems
            .map((i) => i._id)
            .filter((id) => id.toString() !== insertResult.insertedId.toString());

        if (installedIdsToDisable.length > 0) {
            await db.collection("items").updateMany(
                { _id: { $in: installedIdsToDisable } },
                { $set: { isInstall: false } }
            );
        }

        return NextResponse.json({});
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
