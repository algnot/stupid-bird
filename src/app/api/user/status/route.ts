/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import getDatabase from '@/lib/mongodb';

type AnyRecord = Record<string, any>;

const isPlainObject = (v: unknown): v is AnyRecord =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

const asRecord = (v: unknown): AnyRecord => (isPlainObject(v) ? (v as AnyRecord) : {});

function sumDeep(target?: AnyRecord, source?: AnyRecord): AnyRecord {
    const out: AnyRecord = { ...(target ?? {}) };

    for (const [key, val] of Object.entries(source ?? {})) {
        const cur = out[key];

        if (typeof val === 'number') {
            out[key] = (typeof cur === 'number' ? cur : 0) + val;
        } else if (isPlainObject(val)) {
            out[key] = sumDeep(asRecord(cur), val);
        } else {
            out[key] = val;
        }
    }

    return out;
}

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

        const character = installItems.find((item) => item.info.type === 'character');

        const statusSummary = installItems.reduce((acc: AnyRecord, item) => {
            const levelIndex = item.level ?? 0;
            const levelData = item.info?.level?.[levelIndex] ?? {};
            return sumDeep(acc, levelData);
        }, {} as AnyRecord);

        return NextResponse.json({
            status: statusSummary,
            character
        });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
