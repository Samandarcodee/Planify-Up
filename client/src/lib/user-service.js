import { tgApp } from "./telegram";
import { apiRequest } from "./queryClient";
export class UserService {
    constructor() {
        this.currentUser = null;
    }
    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    async getCurrentUser() {
        if (this.currentUser) {
            return this.currentUser;
        }
        const tgUser = tgApp.getUser();
        if (!tgUser) {
            // For demo purposes, create a default user
            return this.createDemoUser();
        }
        try {
            // Try to get user by Telegram ID
            const response = await apiRequest("GET", `/api/users/telegram/${tgUser.id}`);
            if (response.ok) {
                this.currentUser = await response.json();
                return this.currentUser;
            }
        }
        catch (error) {
            console.log("User not found, creating new user");
        }
        // User doesn't exist, create new one
        try {
            const newUser = {
                username: tgUser.username || `user_${tgUser.id}`,
                password: "telegram_auth", // We don't use passwords for Telegram auth
                name: `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}`,
                telegramId: tgUser.id.toString()
            };
            const response = await apiRequest("POST", "/api/users", newUser);
            if (response.ok) {
                this.currentUser = await response.json();
                return this.currentUser;
            }
        }
        catch (error) {
            console.error("Failed to create user:", error);
        }
        return null;
    }
    async createDemoUser() {
        if (this.currentUser) {
            return this.currentUser;
        }
        try {
            const demoUser = {
                username: "demo_user",
                password: "demo_password",
                name: "Demo Foydalanuvchi",
                telegramId: null
            };
            const response = await apiRequest("POST", "/api/users", demoUser);
            if (response.ok) {
                this.currentUser = await response.json();
                return this.currentUser;
            }
        }
        catch (error) {
            // If demo user already exists, try to get it
            try {
                const response = await apiRequest("GET", "/api/users/722b51ba-3593-44ac-82e1-ae79ac0c3304");
                if (response.ok) {
                    this.currentUser = await response.json();
                    return this.currentUser;
                }
            }
            catch (e) {
                console.error("Failed to get demo user:", e);
            }
        }
        // Return a fallback user
        return {
            id: "demo-user",
            username: "demo_user",
            password: "demo_password",
            name: "Demo Foydalanuvchi",
            telegramId: null
        };
    }
    getUserId() {
        return this.currentUser?.id || "demo-user";
    }
    clearUser() {
        this.currentUser = null;
    }
}
export const userService = UserService.getInstance();
