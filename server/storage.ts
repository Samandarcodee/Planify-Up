import { users, type User, type InsertUser, tasks, type Task, type InsertTask, goals, type Goal, type InsertGoal, achievements, type Achievement, type InsertAchievement } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task methods
  getUserTasks(userId: string): Promise<Task[]>;
  getTasksByDate(userId: string, date: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Goal methods
  getUserGoals(userId: string): Promise<Goal[]>;
  getActiveGoals(userId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | undefined>;
  deleteGoal(id: string): Promise<boolean>;
  
  // Achievement methods
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // Statistics methods
  getUserStats(userId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    totalGoals: number;
    completedGoals: number;
    currentStreak: number;
    weeklyCompletionRate: number;
  }>;
}

// MemStorage kept for backup, using DatabaseStorage now

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Task methods
  async getUserTasks(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async getTasksByDate(userId: string, date: string): Promise<Task[]> {
    return await db.select().from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.date, date)));
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return task || undefined;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Goal methods
  async getUserGoals(userId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId));
  }

  async getActiveGoals(userId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(and(eq(goals.userId, userId), eq(goals.completed, false)));
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const [goal] = await db
      .insert(goals)
      .values(insertGoal)
      .returning();
    return goal;
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | undefined> {
    const [goal] = await db
      .update(goals)
      .set(updates)
      .where(eq(goals.id, id))
      .returning();
    return goal || undefined;
  }

  async deleteGoal(id: string): Promise<boolean> {
    const result = await db.delete(goals).where(eq(goals.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Achievement methods
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.userId, userId));
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db
      .insert(achievements)
      .values(insertAchievement)
      .returning();
    return achievement;
  }

  // Statistics methods
  async getUserStats(userId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    totalGoals: number;
    completedGoals: number;
    currentStreak: number;
    weeklyCompletionRate: number;
  }> {
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
