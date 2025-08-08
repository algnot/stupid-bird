import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try {
        const { userId, shopId } = await req.json();

        const db = await getDatabase();
        const user = await db.collection('users').findOne({ userId: userId });
        const shopInfo = await db.collection('shop').findOne({ _id: shopId });

        if (!shopInfo) {
            return NextResponse.json({ error: "item not found" }, { status: 400 });
        }


        console.log(shopInfo);

        return NextResponse.json({});
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
