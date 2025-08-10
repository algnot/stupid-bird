/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/auth.ts
import { createRemoteJWKSet, JWTPayload, compactVerify } from 'jose';

const LINE_JWKS_URL = 'https://api.line.me/oauth2/v2.1/certs';
const JWKS = createRemoteJWKSet(new URL(LINE_JWKS_URL));

export type LineUser = {
    claims: JWTPayload;
};

export const getUserFromRequest = async (req: Request): Promise<LineUser> => {
    if (process.env.NEXT_PUBLIC_FORCE_USER_ID) {
        const userId = process.env.NEXT_PUBLIC_FORCE_USER_ID

        return {
            claims: {
                sub: userId
            }
        }
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }

    const token = authHeader.slice('Bearer '.length).trim();

    const { payload: rawPayload } = await compactVerify(token, JWKS);

    const claims = JSON.parse(new TextDecoder().decode(rawPayload)) as JWTPayload;

    if (claims.iss !== 'https://access.line.me') {
        const err = new Error('Invalid issuer');
        (err as any).status = 401;
        throw err;
    }

    return { claims };
};
