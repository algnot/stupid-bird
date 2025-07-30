import { ErrorResponse } from '@/type/payload';
import { GetOrCreateUser, GetScoreBoardResponse, GetUserStatusResponse, initUserType, InsertGameLogRequest, InsertGameLogResponse, UserType } from '@/type/users';
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
            const response = await this.client.post("/api/user-status", {
                userId
            });
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
}