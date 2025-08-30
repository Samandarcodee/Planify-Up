import { bot } from './bot';
import { storage } from './storage';
import type { User, Task, Goal } from '@shared/schema';

export interface NotificationMessage {
  userId: string;
  telegramId: string;
  message: string;
  type: 'task_reminder' | 'goal_progress' | 'achievement' | 'daily_summary' | 'motivation';
}

export class NotificationService {
  private static instance: NotificationService;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Vazifa eslatmasi yuborish
  async sendTaskReminder(userId: string, task: Task): Promise<void> {
    try {
      const user = await storage.getUser(userId);
      if (!user?.telegramId) return;

      const message = `⏰ Vazifa eslatmasi!

📝 ${task.title}
📅 Bugun: ${task.time || 'Vaqt belgilanmagan'}
📂 Kategoriya: ${task.category}

${task.description ? `📄 ${task.description}` : ''}

Vazifani bajarishni unutmang! 💪`;

      await this.sendNotification(user.telegramId, message);
    } catch (error) {
      console.error('Task reminder yuborishda xato:', error);
    }
  }

  // Maqsad progress xabari
  async sendGoalProgress(userId: string, goal: Goal): Promise<void> {
    try {
      const user = await storage.getUser(userId);
      if (!user?.telegramId) return;

      const progress = Math.round((goal.currentValue! / goal.targetValue) * 100);
      
      let message = `🎯 Maqsad progressi yangilandi!

📊 ${goal.title}
📈 Progress: ${goal.currentValue}/${goal.targetValue} ${goal.unit} (${progress}%)
📅 Muddat: ${goal.deadline}

`;

      if (progress >= 100) {
        message += `🎉 Tabriklaymiz! Maqsadingizni muvaffaqiyatli amalga oshirdingiz! 🏆`;
      } else if (progress >= 75) {
        message += `🔥 Ajoyib! Deyarli maqsadga yetdingiz! Davom eting! 💪`;
      } else if (progress >= 50) {
        message += `👍 Yaxshi natija! Yarim yo'lni bosib o'tdingiz! 🚀`;
      } else if (progress >= 25) {
        message += `✨ Yaxshi boshlanish! Davom eting! 📈`;
      } else {
        message += `🌱 Birinchi qadamlar qo'yildi! Oldinga! 🎯`;
      }

      await this.sendNotification(user.telegramId, message);
    } catch (error) {
      console.error('Goal progress yuborishda xato:', error);
    }
  }

  // Yutuq xabari
  async sendAchievementUnlock(userId: string, achievement: { title: string; description: string; type: string }): Promise<void> {
    try {
      const user = await storage.getUser(userId);
      if (!user?.telegramId) return;

      const emoji = this.getAchievementEmoji(achievement.type);
      
      const message = `🏆 Yangi yutuq qo'lga kiritildi!

${emoji} ${achievement.title}

${achievement.description}

Tabriklaymiz! Sizning mehnatingizdagi davomiylik va intilish ajoyib natija berdi! 🎉✨

Keyingi yutuqlar uchun davom eting! 💪🚀`;

      await this.sendNotification(user.telegramId, message);
    } catch (error) {
      console.error('Achievement yuborishda xato:', error);
    }
  }

  // Kunlik xulosa
  async sendDailySummary(userId: string): Promise<void> {
    try {
      const user = await storage.getUser(userId);
      if (!user?.telegramId) return;

      const today = new Date().toISOString().split('T')[0];
      const todayTasks = await storage.getTasksByDate(userId, today);
      const completedTasks = todayTasks.filter(task => task.completed);
      const stats = await storage.getUserStats(userId);

      const completionRate = todayTasks.length > 0 ? Math.round((completedTasks.length / todayTasks.length) * 100) : 0;

      let message = `📊 Bugungi kun xulosasi

📝 Vazifalar: ${completedTasks.length}/${todayTasks.length} bajarildi
📈 Bajarilish darajasi: ${completionRate}%
🔥 Umuman streak: ${stats.currentStreak} kun

`;

      if (completionRate === 100 && todayTasks.length > 0) {
        message += `🎉 Mukammal! Bugungi barcha vazifalarni bajardingiz! 🏆`;
      } else if (completionRate >= 80) {
        message += `👏 Ajoyib kun bo'ldi! Deyarli barcha rejalarni amalga oshirdingiz! 🌟`;
      } else if (completionRate >= 60) {
        message += `👍 Yaxshi natija! Ertaga yanada yaxshi bo'ladi! 💪`;
      } else if (completionRate >= 40) {
        message += `🌱 Yaxshi boshlanish! Ertaga ko'proq qilishga harakat qiling! 📈`;
      } else {
        message += `💡 Ertaga yangi imkoniyatlar! Kichik qadamlar ham muhim! 🚀`;
      }

      message += `\n\nErtaga ham muvaffaqiyatli kun bo'lsin! 🌅`;

      await this.sendNotification(user.telegramId, message);
    } catch (error) {
      console.error('Daily summary yuborishda xato:', error);
    }
  }

  // Motivatsion xabar
  async sendMotivationalMessage(userId: string): Promise<void> {
    try {
      const user = await storage.getUser(userId);
      if (!user?.telegramId) return;

      const motivationalMessages = [
        `🌟 Har bir katta muvaffaqiyat kichik qadamlardan boshlanadi! Bugun qanday qadamlarni qo'yasiz? 🚀`,
        `💪 Sizning imkoniyatlaringiz cheksiz! Bugun o'zingizga ishoning va oldinga boring! ✨`,
        `🎯 Maqsadlaringiz sizni kutmoqda! Har bir kun yangi imkoniyat! 🌅`,
        `🔥 Muvaffaqiyat yo'lida eng muhimi - davomiylik! Siz bunga qodirsiz! 💫`,
        `🌱 Kichik o'zgarishlar katta natijalar beradi! Bugun bitta vazifani bajarishdan boshlang! 📈`,
        `🏆 Siz ajoyib natijalarga erishishingiz mumkin! Faqat boshlash kerak! ⚡`,
        `✨ Har bir yangi kun - yangi imkoniyat! Bugun qanday yutuqlarga erisha olasiz? 🎉`
      ];

      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      
      await this.sendNotification(user.telegramId, randomMessage);
    } catch (error) {
      console.error('Motivational message yuborishda xato:', error);
    }
  }

  // Asosiy notification yuborish funksiyasi
  private async sendNotification(telegramId: string, message: string): Promise<void> {
    try {
      await bot.sendMessage(telegramId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      });
      console.log(`Notification yuborildi: ${telegramId}`);
    } catch (error) {
      console.error('Notification yuborishda xato:', error);
    }
  }

  // Yutuq emoji olish
  private getAchievementEmoji(type: string): string {
    const emojiMap: { [key: string]: string } = {
      'streak': '🔥',
      'goal_completed': '🎯',
      'milestone': '🏁',
      'first_task': '🌟',
      'productivity': '⚡',
      'consistency': '💎',
      'champion': '👑'
    };
    return emojiMap[type] || '🏆';
  }

  // Haftalik hisobot
  async sendWeeklyReport(userId: string): Promise<void> {
    try {
      const user = await storage.getUser(userId);
      if (!user?.telegramId) return;

      const stats = await storage.getUserStats(userId);
      const goals = await storage.getActiveGoals(userId);
      
      let message = `📊 Haftalik hisobot

📝 Jami vazifalar: ${stats.totalTasks}
✅ Bajarilgan: ${stats.completedTasks}
📈 Haftalik bajarilish: ${stats.weeklyCompletionRate}%
🎯 Faol maqsadlar: ${goals.length}
🏆 Bajarilgan maqsadlar: ${stats.completedGoals}

`;

      if (stats.weeklyCompletionRate >= 80) {
        message += `🎉 Ajoyib hafta! Siz juda yaxshi natijalar ko'rsatdingiz! 🌟`;
      } else if (stats.weeklyCompletionRate >= 60) {
        message += `👍 Yaxshi natija! Keyingi hafta yanada yaxshi bo'ladi! 💪`;
      } else {
        message += `🌱 Yangi hafta - yangi imkoniyatlar! Kichik qadamlar ham muhim! 🚀`;
      }

      message += `\n\nKeyingi hafta ham muvaffaqiyatli bo'lsin! 🎯`;

      await this.sendNotification(user.telegramId, message);
    } catch (error) {
      console.error('Weekly report yuborishda xato:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();