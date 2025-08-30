import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.log('Telegram bot token not found. Bot will not start.');
  process.exit(0);
}

// Create a bot without polling in Replit environment
const bot = new TelegramBot(token, { 
  polling: false,
  request: {
    agentOptions: {
      timeout: 30000
    }
  }
});

// Bot kommandalari
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from?.first_name || 'Foydalanuvchi';
  
  const welcomeMessage = `Salom ${firstName}! 👋

🎯 **Planify Up** ga xush kelibsiz!

Bu bot orqali siz:
📝 Kunlik vazifalarni boshqarishingiz
🎯 Maqsadlar belgilashingiz  
📊 O'z progressingizni kuzatishingiz
🏆 Yutuqlarga erishishingiz mumkin

Mini ilovani ochish uchun pastdagi tugmani bosing! 👇`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🚀 Ilovani ochish',
            web_app: {
              url: process.env.REPLIT_DOMAINS?.split(',')[0] 
                ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
                : 'https://your-replit-domain.replit.app'
            }
          }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, welcomeMessage, options);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `🆘 **Yordam**

**Mavjud komandalar:**
/start - Botni qayta ishga tushirish
/help - Yordam ma'lumotlari

**Ilovadan foydalanish:**
• Mini ilovani ochish uchun "🚀 Ilovani ochish" tugmasini bosing
• Tilni o'zgartirish uchun Profil bo'limiga o'ting
• Vazifa qo'shish uchun "+" tugmasini bosing
• Maqsadlaringizni Statistics bo'limida kuzating

**Qo'llab-quvvatlash:**
Savol yoki muammo bo'lsa, /start kommandasini ishlatib qayta urinib ko'ring.`;

  bot.sendMessage(chatId, helpMessage);
});

// Xato holatlarini boshqarish
bot.on('polling_error', (error) => {
  console.log('Polling error:', error);
});

bot.on('webhook_error', (error) => {
  console.log('Webhook error:', error);
});

// Webhook endpoint qo'shamiz
export const setupBotWebhook = (app: any) => {
  const webhookPath = `/bot${token}`;
  
  app.post(webhookPath, (req: any, res: any) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
  
  // Set webhook URL if in production
  if (process.env.REPLIT_DOMAINS) {
    const domain = process.env.REPLIT_DOMAINS.split(',')[0];
    const webhookUrl = `https://${domain}${webhookPath}`;
    
    bot.setWebHook(webhookUrl).then(() => {
      console.log(`Telegram bot webhook set to: ${webhookUrl}`);
    }).catch((error) => {
      console.log('Failed to set webhook:', error.message);
    });
  }
};

console.log('Telegram bot configured successfully! 🤖');

export { bot };