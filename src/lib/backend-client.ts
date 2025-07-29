import { ErrorResponse } from '@/type/payload';
import { GetOrCreateUser, GetUserStatusResponse, initUserType, UserType } from '@/type/users';
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
            console.error("Failed to fetch user info:", e);
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
            console.error("Failed to fetch user info:", e);
            return {
                "error": "cannot get user status"
            };
        }
    }
}