import { ErrorResponse } from '@/type/payload';
import { GetItemShopResponse } from '@/type/shop';
import { GetOrCreateUser, GetScoreBoardResponse, GetUserItemsResponse, GetUserStatusResponse, initUserType, InsertGameLogRequest, InsertGameLogResponse, UserType } from '@/type/users';
import axios, { AxiosInstance } from "axios";

export class BackendClient {
    private readonly client: AxiosInstance;

    constructor() {
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
            const response = await this.client.get("/api/user-status?userId=" + userId);
            return response.data;
        } catch (e) {
            console.error("Failed to fetch", e);
            return {
                "error": "cannot get user status"
            };
        }
    }

    async insertGameLog(payload: InsertGameLogRequest): Promise<InsertGameLogResponse | ErrorResponse> {
        try {
            const response = await this.client.post("/api/game-log", payload);
            return response.data;
        } catch (e) {
            console.error("Failed to fetch", e);
            return {
                "error": "cannot insert game log"
            };
        }
    }

    async GetScoreBoard(): Promise<GetScoreBoardResponse | ErrorResponse> {
        try {
            const response = await this.client.get("/api/score-board");
            return response.data;
        } catch (e) {
            console.error("Failed to fetch", e);
            return {
                "error": "cannot insert game log"
            };
        }
    }

    async GetUserItems(userId: string, isInstall: "true" | "false" | "all"): Promise<GetUserItemsResponse | ErrorResponse> {
        try {
            const response = await this.client.get("/api/user-items?userId=" + userId + "&isInstall=" + isInstall);
            return response.data;
        } catch (e) {
            console.error("Failed to fetch", e);
            return {
                "error": "cannot insert game log"
            };
        }
    }

    async GetSaleItems(): Promise<GetItemShopResponse | ErrorResponse> {
        try {
            const response = await this.client.get("/api/shop");
            return response.data;
        } catch (e) {
            console.error("Failed to fetch", e);
            return {
                "error": "cannot insert sale items"
            };
        }
    }
}