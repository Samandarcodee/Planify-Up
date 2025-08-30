import { type User, type InsertUser, type Task, type InsertTask, type Goal, type InsertGoal, type Achievement, type InsertAchievement } from "@shared/schema";
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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tasks: Map<string, Task>;
  private goals: Map<string, Goal>;
  private achievements: Map<string, Achievement>;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.goals = new Map();
    this.achievements = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.telegramId === telegramId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Task methods
  async getUserTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async getTasksByDate(userId: string, date: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      task => task.userId === userId && task.date === date
    );
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = { 
      ...insertTask, 
      id, 
      completed: false,
      createdAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Goal methods
  async getUserGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }

  async getActiveGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(
      goal => goal.userId === userId && !goal.completed
    );
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = { 
      ...insertGoal, 
      id, 
      currentValue: 0,
      completed: false,
      createdAt: new Date()
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    
    const updatedGoal = { ...goal, ...updates };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(id: string): Promise<boolean> {
    return this.goals.delete(id);
  }

  // Achievement methods
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      achievement => achievement.userId === userId
    );
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = { ...insertAchievement, id };
    this.achievements.set(id, achievement);
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

export const storage = new MemStorage();
