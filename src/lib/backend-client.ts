import { ErrorResponse } from '@/type/payload';
import { GetItemShopResponse } from '@/type/shop';
import { GetOrCreateUser, GetScoreBoardResponse, GetUserItemsResponse, GetUserStatusResponse, initUserType, InsertGameLogRequest, InsertGameLogResponse, UserType } from '@/type/users';
import axios, { AxiosInstance } from "axios";

const handlerError = (
    error: unknown,
    setAlert: (
        message: string,
        type: string,
        action: (() => void) | undefined,
        isOpen: boolean,
    ) => void,
): ErrorResponse => {
    if (axios.isAxiosError(error)) {
        if (error.status === 401) {
            return {
                error: "Session expired. Please login again.",
            };
        } else if (
            error.response &&
            error.response.data &&
            error.response.data.error
        ) {
            setAlert("error", error.response.data.error, () => { }, false);
            return {
                error: error.response.data.error,
            };
        } else {
            setAlert("error", error.message, () => { }, false);
            return {
                error: error.message,
            };
        }
    } else {
        setAlert("An unknown error occurred. Try again!", "error", () => { }, false);
        return {
            error: "An unknow error occurred. try again!",
        };
    }
};

export class BackendClient {
    private readonly client: AxiosInstance;
    private readonly setAlert: (
        message: string,
        type: string,
        action: (() => void) | undefined,
        isOpen: boolean,
    ) => void;

    constructor(setAlert: (
        message: string,
        type: string,
        action: (() => void) | undefined,
        isOpen: boolean,
    ) => void,) {
        this.setAlert = setAlert;
        this.client = axios.create();
    }

    async getOrCreateUser(payload: GetOrCreateUser): Promise<UserType | ErrorResponse> {
        try {
            const response = await this.client.post("/api/user", payload);
            return response.data;
        } catch (e) {
            console.error("Failed to fetch", e);
            return initUserType;
        }
    }

    async getUserStatus(userId: string): Promise<GetUserStatusResponse | ErrorResponse> {
        try {
            const response = await this.client.get("/api/user/status?userId=" + userId);
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async insertGameLog(payload: InsertGameLogRequest): Promise<InsertGameLogResponse | ErrorResponse> {
        try {
            const response = await this.client.post("/api/game-log", payload);
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async GetScoreBoard(): Promise<GetScoreBoardResponse | ErrorResponse> {
        try {
            const response = await this.client.get("/api/score-board");
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async GetUserItems(userId: string, isInstall: "true" | "false" | "all"): Promise<GetUserItemsResponse | ErrorResponse> {
        try {
            const response = await this.client.get("/api/user/items?userId=" + userId + "&isInstall=" + isInstall);
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async GetSaleItems(isDev: boolean): Promise<GetItemShopResponse | ErrorResponse> {
        try {
            let url = "/api/shop";
            if (isDev) {
                url += "?isDev=true"
            }
            const response = await this.client.get(url);
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async BuyItem(userId: string, shopId: string): Promise<void | ErrorResponse> {
        try {
            const response = await this.client.post("/api/shop/buy", {
                userId,
                shopId
            });
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async installItem(userId: string, itemId: string): Promise<void | ErrorResponse> {
        try {
            const response = await this.client.post("/api/user/items", {
                userId,
                itemId
            });
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }
}