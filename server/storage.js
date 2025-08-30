import { users, tasks, goals, achievements } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { verifyPassword } from "./auth";
// MemStorage kept for backup, using DatabaseStorage now
// DatabaseStorage implementation
export class DatabaseStorage {
    async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || undefined;
    }
    async getUserByUsername(username) {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user || undefined;
    }
    async getUserByTelegramId(telegramId) {
        const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));
        return user || undefined;
    }
    async createUser(insertUser) {
        const [user] = await db
            .insert(users)
            .values(insertUser)
            .returning();
        return user;
    }
    async verifyPassword(password, hashedPassword) {
        return await verifyPassword(password, hashedPassword);
    }
    // Task methods
    async getUserTasks(userId) {
        return await db.select().from(tasks).where(eq(tasks.userId, userId));
    }
    async getTasksByDate(userId, date) {
        return await db.select().from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.date, date)));
    }
    async createTask(insertTask) {
        const [task] = await db
            .insert(tasks)
            .values(insertTask)
            .returning();
        // Vazifa yaratilganda notification yuborish
        try {
            const { notificationService } = await import("./notification-service");
            setTimeout(() => {
                notificationService.sendTaskReminder(task.userId, task);
            }, 5000); // 5 soniya kechikish bilan
        }
        catch (error) {
            console.log('Notification yuborishda xato:', error);
        }
        return task;
    }
    async updateTask(id, updates) {
        const [task] = await db
            .update(tasks)
            .set(updates)
            .where(eq(tasks.id, id))
            .returning();
        return task || undefined;
    }
    async deleteTask(id) {
        const result = await db.delete(tasks).where(eq(tasks.id, id));
        return (result.rowCount || 0) > 0;
    }
    // Goal methods
    async getUserGoals(userId) {
        return await db.select().from(goals).where(eq(goals.userId, userId));
    }
    async getActiveGoals(userId) {
        return await db.select().from(goals).where(and(eq(goals.userId, userId), eq(goals.completed, false)));
    }
    async createGoal(insertGoal) {
        const [goal] = await db
            .insert(goals)
            .values(insertGoal)
            .returning();
        return goal;
    }
    async updateGoal(id, updates) {
        const [goal] = await db
            .update(goals)
            .set(updates)
            .where(eq(goals.id, id))
            .returning();
        // Maqsad yangilanganda progress notification yuborish
        if (goal && updates.currentValue !== undefined) {
            try {
                const { notificationService } = await import("./notification-service");
                setTimeout(() => {
                    notificationService.sendGoalProgress(goal.userId, goal);
                }, 2000);
            }
            catch (error) {
                console.log('Goal progress notification yuborishda xato:', error);
            }
        }
        return goal || undefined;
    }
    async deleteGoal(id) {
        const result = await db.delete(goals).where(eq(goals.id, id));
        return (result.rowCount || 0) > 0;
    }
    // Achievement methods
    async getUserAchievements(userId) {
        return await db.select().from(achievements).where(eq(achievements.userId, userId));
    }
    async createAchievement(insertAchievement) {
        const [achievement] = await db
            .insert(achievements)
            .values(insertAchievement)
            .returning();
        return achievement;
    }
    // Statistics methods
    async getUserStats(userId) {
        const userTasks = await this.getUserTasks(userId);
        const userGoals = await this.getUserGoals(userId);
        const totalTasks = userTasks.length;
        const completedTasks = userTasks.filter(task => task.completed).length;
        const totalGoals = userGoals.length;
        const completedGoals = userGoals.filter(goal => goal.completed).length;
        // Calculate current streak (simplified)
        const today = new Date().toISOString().split('T')[0];
        const todayTasks = userTasks.filter(task => task.date === today);
        const todayCompleted = todayTasks.filter(task => task.completed).length;
        const currentStreak = todayCompleted; // Simplified calculation
        // Calculate weekly completion rate
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekTasks = userTasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate >= weekAgo;
        });
        const weekCompleted = weekTasks.filter(task => task.completed).length;
        const weeklyCompletionRate = weekTasks.length > 0 ? Math.round((weekCompleted / weekTasks.length) * 100) : 0;
        return {
            totalTasks,
            completedTasks,
            totalGoals,
            completedGoals,
            currentStreak,
            weeklyCompletionRate,
        };
    }
}
export const storage = new DatabaseStorage();
