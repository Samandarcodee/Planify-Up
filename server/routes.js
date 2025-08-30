import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTaskSchema, insertGoalSchema, insertAchievementSchema } from "@shared/schema";
import { rateLimit, hashPassword, generateToken } from "./auth";
import { cacheMiddleware, invalidateCache } from "./cache";
export async function registerRoutes(app) {
    // Apply rate limiting to all routes
    app.use(rateLimit(100, 15 * 60 * 1000)); // 100 requests per 15 minutes
    // User routes
    app.post("/api/users", async (req, res) => {
        try {
            const userData = insertUserSchema.parse(req.body);
            // Hash password before storing
            if (userData.password) {
                userData.password = await hashPassword(userData.password);
            }
            const user = await storage.createUser(userData);
            // Generate JWT token
            const token = generateToken(user.id, user.username);
            res.json({ user, token });
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Invalid user data" });
        }
    });
    // Login route
    app.post("/api/auth/login", async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: "Username and password are required" });
            }
            const user = await storage.getUserByUsername(username);
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            // Verify password
            const isValidPassword = await storage.verifyPassword(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            // Generate JWT token
            const token = generateToken(user.id, user.username);
            res.json({ user, token });
        }
        catch (error) {
            res.status(500).json({ message: "Login failed" });
        }
    });
    app.get("/api/users/:id", cacheMiddleware(10 * 60 * 1000), async (req, res) => {
        try {
            const user = await storage.getUser(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to get user" });
        }
    });
    app.get("/api/users/telegram/:telegramId", async (req, res) => {
        try {
            const user = await storage.getUserByTelegramId(req.params.telegramId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to get user" });
        }
    });
    // Task routes
    app.get("/api/tasks/:userId", cacheMiddleware(2 * 60 * 1000), async (req, res) => {
        try {
            const tasks = await storage.getUserTasks(req.params.userId);
            res.json(tasks);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to get tasks" });
        }
    });
    app.get("/api/tasks/:userId/date/:date", async (req, res) => {
        try {
            const tasks = await storage.getTasksByDate(req.params.userId, req.params.date);
            res.json(tasks);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to get tasks for date" });
        }
    });
    app.post("/api/tasks", invalidateCache("tasks"), async (req, res) => {
        try {
            const taskData = insertTaskSchema.parse(req.body);
            const task = await storage.createTask(taskData);
            res.json(task);
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Invalid task data" });
        }
    });
    app.patch("/api/tasks/:id", async (req, res) => {
        try {
            const updates = req.body;
            const task = await storage.updateTask(req.params.id, updates);
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            res.json(task);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to update task" });
        }
    });
    app.delete("/api/tasks/:id", async (req, res) => {
        try {
            const deleted = await storage.deleteTask(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: "Task not found" });
            }
            res.json({ message: "Task deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Failed to delete task" });
        }
    });
    // Goal routes
    app.get("/api/goals/:userId", async (req, res) => {
        try {
            const goals = await storage.getUserGoals(req.params.userId);
            res.json(goals);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to get goals" });
        }
    });
    app.get("/api/goals/:userId/active", async (req, res) => {
        try {
            const goals = await storage.getActiveGoals(req.params.userId);
            res.json(goals);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to get active goals" });
        }
    });
    app.post("/api/goals", async (req, res) => {
        try {
            const goalData = insertGoalSchema.parse(req.body);
            const goal = await storage.createGoal(goalData);
            res.json(goal);
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Invalid goal data" });
        }
    });
    app.patch("/api/goals/:id", async (req, res) => {
        try {
            const updates = req.body;
            const goal = await storage.updateGoal(req.params.id, updates);
            if (!goal) {
                return res.status(404).json({ message: "Goal not found" });
            }
            res.json(goal);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to update goal" });
        }
    });
    app.delete("/api/goals/:id", async (req, res) => {
        try {
            const deleted = await storage.deleteGoal(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: "Goal not found" });
            }
            res.json({ message: "Goal deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Failed to delete goal" });
        }
    });
    // Achievement routes
    app.get("/api/achievements/:userId", async (req, res) => {
        try {
            const achievements = await storage.getUserAchievements(req.params.userId);
            res.json(achievements);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to get achievements" });
        }
    });
    app.post("/api/achievements", async (req, res) => {
        try {
            const achievementData = insertAchievementSchema.parse(req.body);
            const achievement = await storage.createAchievement(achievementData);
            res.json(achievement);
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Invalid achievement data" });
        }
    });
    // Statistics routes
    app.get("/api/stats/:userId", async (req, res) => {
        try {
            const stats = await storage.getUserStats(req.params.userId);
            res.json(stats);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to get user statistics" });
        }
    });
    // Notification routes
    app.post("/api/notifications/send", async (req, res) => {
        try {
            const { userId, type } = req.body;
            if (!userId || !type) {
                return res.status(400).json({ message: "userId and type are required" });
            }
            const { scheduler } = await import("./scheduler");
            await scheduler.sendImmediateNotification(userId, type);
            res.json({ message: "Notification sent successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Failed to send notification" });
        }
    });
    app.post("/api/notifications/test", async (req, res) => {
        try {
            const { notificationService } = await import("./notification-service");
            // Test notification
            await notificationService.sendMotivationalMessage("722b51ba-3593-44ac-82e1-ae79ac0c3304");
            res.json({ message: "Test notification sent" });
        }
        catch (error) {
            res.status(500).json({ message: "Failed to send test notification" });
        }
    });
    const httpServer = createServer(app);
    return httpServer;
}
