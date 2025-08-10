import { getUserFromRequest } from "@/lib/backend-tools";
import getDatabase from "@/lib/mongodb";
import { JWTPayload } from "jose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { claims } = await getUserFromRequest(req) as { claims: JWTPayload };
        const userId = typeof claims.sub === 'string' ? claims.sub : "";

        const db = await getDatabase();
        const user = await db.collection('users').findOne({ userId: userId });

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}