import { getUserFromRequest } from "@/lib/backend-tools";
import getDatabase from "@/lib/mongodb";
import { JWTPayload } from "jose";
import { NextResponse } from "next/server";

const TZ = "Asia/Bangkok";
const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: TZ });

export async function GET(req: Request) {
    try {
        const { claims } = await getUserFromRequest(req) as { claims: JWTPayload };
        const userId = typeof claims.sub === 'string' ? claims.sub : "";

        const db = await getDatabase();
        const user = await db.collection('users').findOne({ userId: userId });

        if (!user) {
            return NextResponse.json({ error: "user not found" }, { status: 400 });
        }

        let currentReward = { items: [] };
        let loginStack = user.loginStack ?? 0;
        const dailyInfoQuery = await db.collection('config').findOne({ key: 'dailyLogin' });
        const dailyInfo = Array.isArray(dailyInfoQuery?.value) ? dailyInfoQuery.value : [];

        if (dailyInfo.length == 0) {
            currentReward = { items: [] };
        } else if (!user?.lastLogin) {
            loginStack = loginStack % dailyInfo.length;
            currentReward = dailyInfo[loginStack];
        } else {
            const todayStr = dayKey(new Date());
            const lastLoginStr = user?.lastLogin ? dayKey(new Date(user.lastLogin)) : null;

            if (lastLoginStr !== todayStr) {
                loginStack = loginStack % dailyInfo.length;
                currentReward = dailyInfo[loginStack];
            }
        }

        return NextResponse.json({ dailyInfo, currentReward, loginStack: loginStack + 1 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        const { claims } = await getUserFromRequest(req) as { claims: JWTPayload };
        const userId = typeof claims.sub === 'string' ? claims.sub : "";

        const db = await getDatabase();
        const user = await db.collection('users').findOne({ userId: userId });

        if (!user) {
            return NextResponse.json({ error: "user not found" }, { status: 400 });
        }

        let currentReward = { items: [] }
        let loginStack = user.loginStack ?? 0;
        const dailyInfoQuery = await db.collection('config').findOne({ key: 'dailyLogin' });
        const dailyInfo = Array.isArray(dailyInfoQuery?.value) ? dailyInfoQuery.value : []

        if (dailyInfo.length == 0) {
            return NextResponse.json({ error: "error daily info not found" }, { status: 400 });
        }

        if (!user?.lastLogin) {
            loginStack = loginStack % dailyInfo.length;
            currentReward = dailyInfo[loginStack];

            const incFields = currentReward.items.reduce(
                (acc: Record<string, number>, item: { name: string; value: number }) => {
                    acc[item.name] = (acc[item.name] ?? 0) + item.value;
                    return acc;
                },
                {}
            );

            await db.collection("users").updateOne(
                { userId: userId },
                {
                    $inc: incFields,
                    $set: {
                        lastLogin: new Date(),
                        loginStack: 1,
                    }
                }
            );
        } else {
            const todayStr = dayKey(new Date());
            const lastLoginStr = user?.lastLogin ? dayKey(new Date(user.lastLogin)) : null;

            if (lastLoginStr !== todayStr) {
                loginStack = loginStack % dailyInfo.length;
                currentReward = dailyInfo[loginStack];

                const incFields = currentReward.items.reduce(
                    (acc: Record<string, number>, item: { name: string; value: number }) => {
                        acc[item.name] = (acc[item.name] ?? 0) + item.value;
                        return acc;
                    },
                    {}
                );

                await db.collection("users").updateOne(
                    { userId: userId },
                    {
                        $inc: {
                            ...incFields,
                            loginStack: 1,
                        },
                        $set: {
                            lastLogin: new Date(),
                        }
                    }
                );
            }
        }

        return NextResponse.json({ currentReward });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}