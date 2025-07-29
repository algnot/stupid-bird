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