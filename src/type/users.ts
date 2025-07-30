export interface ItemInfoName {
    th: string;
    en: string;
}

export interface GameConfig {
    // debuf interval
    INTERVAL_CHANGE_DIFFICULTY: number;

    // pipe gap
    INITIAL_PIPE_GAP: number;
    MIN_PIPE_GAP: number;
    DECRESE_PIPE_GAP_INTERVAL: number;

    // pipe interval
    INITIAL_PIPE_INTERVAL: number;
    DECRESE_PIPE_INTERVAL: number;
    MIN_PIPE_INTERVAL: number;

    // speed
    INITIAL_SPEED: number;
    INCRESE_SPEED: number;
    MAX_SPEED: number;

    // gravity
    BIRD_SIZE: number;
    GRAVITY: number;
    GRAVITY_TIME: number;
    MULTIPLY_JUMP_HEIGHT: number;

    // score
    SECONDE_PER_SCORE: number;
    INCRESE_SCORE_PER_SECONDE: number;
    COIN_PER_CLICK: number;

    CHARACTER_IMAGE?: string;
}

const gameConfigLabelMap: Partial<Record<keyof GameConfig, string>> = {
    BIRD_SIZE: "ขนาดลำตัว",
    INITIAL_PIPE_GAP: "ความกว้างของท่อ",
    DECRESE_PIPE_GAP_INTERVAL: "[ดีบัพ] ความกว้างของท่อลดลง",
    MIN_PIPE_GAP: "ความกว้างของท่อต่ำสุด",
    INITIAL_PIPE_INTERVAL: "ระยะห่างของท่อ",
    DECRESE_PIPE_INTERVAL: "[ดีบัพ] ระยะห่างของท่อลดลง",
    MIN_PIPE_INTERVAL: "ระยะห่างของละท่อต่ำสุด",
    INITIAL_SPEED: "ความเร็วเริ่มต้น",
    INCRESE_SPEED: "[ดีบัพ] ความเร็วเพิ่มขึ้น",
    MAX_SPEED: "ความเร็วสูงสุด",
    GRAVITY: "ค่าแรงโน้มถ่วง",
    GRAVITY_TIME: "เวลาแรงโน้มถ่วง",
    SECONDE_PER_SCORE: "เวลาที่ได้รับ [ขนนก] (ms)",
    INCRESE_SCORE_PER_SECONDE: "[ขนนก] ที่ได้รับต่อครั้ง",
    INTERVAL_CHANGE_DIFFICULTY: "ช่วงเวลาที่ [ดีบัพ] แสดงผล (ms)",
    MULTIPLY_JUMP_HEIGHT: "การกระโดดของนก",
    COIN_PER_CLICK: "จำนวน [เหรียญ] ที่ได้ต่อการกระโดด",
};

export function gameConfigLabelToLabel(key: keyof GameConfig): string {
    return gameConfigLabelMap[key] ?? key;
}

export interface ItemInfo {
    _id: string;
    image: string;
    name: ItemInfoName;
    startLevel: number;
    starter: boolean;
    type: "character" | "hat";
    level: GameConfig[];
}

export interface Item {
    _id: string;
    userId: string;
    itemId: string;
    level: number;
    isInstall: boolean;
    info: ItemInfo;
}

export interface UserType {
    userId: string;
    pictureUrl: string;
    displayName: string;
    createdAt: string;
    coin?: number;
    daimond?: number;
    installItems: Item[];
}


export const initUserType: UserType = {
    userId: "",
    pictureUrl: "",
    displayName: "",
    createdAt: "",
    coin: 0,
    daimond: 0,
    installItems: [],
}

export interface GetOrCreateUser {
    userId: string;
    pictureUrl: string;
    displayName: string;
}

export interface GetUserStatusResponse {
    status: GameConfig;
    character: Item;
}

export interface InsertGameLogRequest {
    userId: string;
    point: number;
    coin: number;
    gameConfig: GameConfig;
}

export interface InsertGameLogResponse {
    status: boolean;
}

export interface ScoreBoard {
    bestPoint: number;
    bestCoin: number;
    userId: string;
    displayName: string;
    pictureUrl: string;
}

export interface GetScoreBoardResponse {
    data: ScoreBoard[];
}

export interface GetUserItemsResponse {
    installItems: Item[];
}
