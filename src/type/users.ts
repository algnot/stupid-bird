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
    INCRESE_SECONDE: number;
}

const gameConfigLabelMap: Partial<Record<keyof GameConfig, string>> = {
    BIRD_SIZE: "ขนาดลำตัว",
    INITIAL_PIPE_GAP: "ความกว้างเริ่มต้นของท่อ",
    DECRESE_PIPE_GAP_INTERVAL: "ความกว้างลดลง",
    MIN_PIPE_GAP: "ความกว้างต่ำสุดของท่อ",
    INITIAL_PIPE_INTERVAL: "ระยะห่างเริ่มต้นของท่อ",
    DECRESE_PIPE_INTERVAL: "ระยะห่างลดลง",
    MIN_PIPE_INTERVAL: "ระยะห่างต่ำสุด",
    INITIAL_SPEED: "ความเร็วเริ่มต้น",
    INCRESE_SPEED: "ความเร็วเพิ่มขึ้น",
    MAX_SPEED: "ความเร็วสูงสุด",
    GRAVITY: "แรงโน้มถ่วง",
    GRAVITY_TIME: "เวลาแรงโน้มถ่วง",
    SECONDE_PER_SCORE: "รับคะแนนทุก ๆ ",
    INCRESE_SECONDE: "จำนวนคะแนนที่ได้รับ",
    INTERVAL_CHANGE_DIFFICULTY: "ช่วงเวลาเปลี่ยนความยาก",
    MULTIPLY_JUMP_HEIGHT: "คูณความสูงในการกระโดด",
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
    items: Item[];
    installItems: Item[];
}


export const initUserType: UserType = {
    userId: "",
    pictureUrl: "",
    displayName: "",
    createdAt: "",
    coin: 0,
    daimond: 0,
    items: [],
    installItems: [],
}

export interface GetOrCreateUser {
    userId: string;
    pictureUrl: string;
    displayName: string;
}