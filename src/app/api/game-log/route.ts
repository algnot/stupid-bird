import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/backend-tools';
import { JWTPayload } from 'jose';

export async function POST(req: Request) {
    try {
        const { point, coin, gameConfig } = await req.json();
        const { claims } = await getUserFromRequest(req) as { claims: JWTPayload };
        const userId = typeof claims.sub === 'string' ? claims.sub : "";
        const db = await getDatabase();

        await db.collection("game-log").insertOne({
            userId,
            point,
            coin,
            gameConfig,
            time: new Date(),
        })

        await db.collection("users").updateOne(
            { userId: userId },
            {
                $inc: { coin: coin },
            },
        );

        return NextResponse.json({
            status: true,
        });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message || "Unknown error" },
            { status: 500 }
        );
    }
}
