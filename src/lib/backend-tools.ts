// utils/auth.ts
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

const LINE_JWKS_URL = 'https://api.line.me/oauth2/v2.1/certs';
const JWKS = createRemoteJWKSet(new URL(LINE_JWKS_URL));

export type LineUser = {
    token: string;
    lineSub: string;
    claims: JWTPayload;
};

export const getUserFromRequest = async (req: Request): Promise<LineUser> => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }

    const token = authHeader.slice('Bearer '.length).trim();

    const { payload } = await jwtVerify(token, JWKS, {
        issuer: 'https://access.line.me',
    });

    const sub = String(payload.sub || '');
    if (!sub) {
        throw new Error('Invalid token: missing sub');
    }

    return {
        token,
        lineSub: sub,
        claims: payload,
    };
};
