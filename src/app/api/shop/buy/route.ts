import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        const db = await getDatabase();
        const user = await db.collection('users').findOne({ userId: userId });

        console.log(user);

        return NextResponse.json({});
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
