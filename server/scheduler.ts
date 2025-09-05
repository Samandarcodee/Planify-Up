import { notificationService } from './notification-service';
import { storage } from './storage';
import type { User } from '@shared/schema';

export class NotificationScheduler {
  private static instance: NotificationScheduler;
  private intervals: { [key: string]: NodeJS.Timeout } = {};

  public static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler();
    }
    return NotificationScheduler.instance;
  }

  // Scheduler ni ishga tushirish
  public start(): void {
    console.log('🔔 Notification Scheduler ishga tushdi');

    // Har 30 daqiqada vazifa eslatmalari
    this.intervals.taskReminders = setInterval(async () => {
      await this.sendTaskReminders();
    }, 30 * 60 * 1000); // 30 daqiqa

    // Kunlik xulosa (soat 20:00 da)
    this.intervals.dailySummary = setInterval(async () => {
      const now = new Date();
      if (now.getHours() === 20 && now.getMinutes() === 0) {
        await this.sendDailySummaries();
      }
    }, 60 * 1000); // Har daqiqada tekshirish

    // Motivatsion xabarlar (ertalab 9:00 da)
    this.intervals.motivation = setInterval(async () => {
      const now = new Date();
      if (now.getHours() === 9 && now.getMinutes() === 0) {
        await this.sendMotivationalMessages();
      }
    }, 60 * 1000); // Har daqiqada tekshirish

    // Haftalik hisobot (yakshanba kuni soat 18:00 da)
    this.intervals.weeklyReport = setInterval(async () => {
      const now = new Date();
      if (now.getDay() === 0 && now.getHours() === 18 && now.getMinutes() === 0) {
        await this.sendWeeklyReports();
      }
    }, 60 * 1000); // Har daqiqada tekshirish
  }

  // Scheduler ni to'xtatish
  public stop(): void {
    Object.values(this.intervals).forEach(interval => {
      clearInterval(interval);
    });
    this.intervals = {};
    console.log('🔕 Notification Scheduler to\'xtatildi');
  }

  // Vazifa eslatmalarini yuborish
  private async sendTaskReminders(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const currentHour = new Date().getHours();
      
      // Barcha foydalanuvchilarni olish (soddalashtirilgan)
      const users = await this.getAllUsers();
      
      for (const user of users) {
        if (!user.telegramId) continue;
        
        const todayTasks = await storage.getTasksByDate(user.id, today);
        const pendingTasks = todayTasks.filter(task => !task.completed && task.time);
        
        for (const task of pendingTasks) {
          if (task.time) {
            const taskHour = parseInt(task.time.split(':')[0]);
            // 30 daqiqa oldin eslatma
            if (currentHour === taskHour - 1) {
              await notificationService.sendTaskReminder(user.id, task);
            }
          }
        }
      }
    } catch (error) {
      console.error('Task reminders yuborishda xato:', error);
    }
  }

  // Kunlik xulosalarni yuborish
  private async sendDailySummaries(): Promise<void> {
    try {
      const users = await this.getAllUsers();
      
      for (const user of users) {
        if (user.telegramId) {
          await notificationService.sendDailySummary(user.id);
        }
      }
    } catch (error) {
      console.error('Daily summaries yuborishda xato:', error);
    }
  }

  // Motivatsion xabarlarni yuborish
  private async sendMotivationalMessages(): Promise<void> {
    try {
      const users = await this.getAllUsers();
      
      for (const user of users) {
        if (user.telegramId) {
          // Tasodifiy ravishda 50% foydalanuvchilarga yuborish
          if (Math.random() > 0.5) {
            await notificationService.sendMotivationalMessage(user.id);
          }
        }
      }
    } catch (error) {
      console.error('Motivational messages yuborishda xato:', error);
    }
  }

  // Haftalik hisobotlarni yuborish
  private async sendWeeklyReports(): Promise<void> {
    try {
      const users = await this.getAllUsers();
      
      for (const user of users) {
        if (user.telegramId) {
          await notificationService.sendWeeklyReport(user.id);
        }
      }
    } catch (error) {
      console.error('Weekly reports yuborishda xato:', error);
    }
  }

  // Barcha foydalanuvchilarni olish (yordamchi funksiya)
  private async getAllUsers(): Promise<User[]> {
    // Bu soddalashtirilgan usul - aslida database dan barcha foydalanuvchilarni olish kerak
    // Hozircha mavjud foydalanuvchilarni qaytaramiz
    const users: User[] = [];
    
    // Demo user
    try {
      const demoUser = await storage.getUser('722b51ba-3593-44ac-82e1-ae79ac0c3304');
      if (demoUser) users.push(demoUser);
    } catch (e) {}
    
    // Telegram users ni qo'shish mumkin
    return users;
  }

  // Manual notification yuborish
  public async sendImmediateNotification(userId: string, type: 'task_reminder' | 'goal_progress' | 'achievement' | 'motivation'): Promise<void> {
    try {
      switch (type) {
        case 'motivation':
          await notificationService.sendMotivationalMessage(userId);
          break;
        case 'achievement':
          // Demo achievement
          await notificationService.sendAchievementUnlock(userId, {
            title: 'Test yutuq',
            description: 'Bu test yutuqi!',
            type: 'milestone'
          });
          break;
        default:
          console.log('Manual notification type not implemented:', type);
      }
    } catch (error) {
      console.error('Manual notification yuborishda xato:', error);
    }
  }
}

export const scheduler = NotificationScheduler.getInstance();