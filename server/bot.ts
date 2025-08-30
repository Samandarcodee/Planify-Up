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
  
  const welcomeMessage = `Assalomu alaykum, ${firstName}! 🌟

🚀 **Planify Up** - Sizning hayot rejangiz!

Ushbu maxsus dastur sizga yordam beradi:
✨ Har kuni samarali reja tuzishda
🎯 Katta maqsadlaringizni qadamlab erishishda
📈 Muvaffaqiyatlaringizni ko'zda tutishda
💪 O'zingizni rivojlantirishda

Hayalingizni haqiqatga aylantirish uchun pastdagi tugmani bosing! 👇`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🌟 Hayallarimni amalga oshirish',
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
  
  const helpMessage = `🌟 **Planify Up - Yordam markazi**

**Komandalar:**
🚀 /start - Asosiy menyu va ilovani ochish
🆘 /help - Bu yordam bo'limi

**Ilovani ishlatish:**
✨ "🌟 Hayallarimni amalga oshirish" tugmasini bosing
🌍 Til sozlamalarini Profil bo'limidan o'zgartiring
➕ Yangi vazifa qo'shish uchun "+" belgisini bosing
📊 Progressingizni Statistika bo'limida kuzating
🎯 Maqsadlaringizni belgilab, ularni amalga oshiring

**Texnik yordam:**
Agar muammo yuzaga kelsa, /start buyrug'ini qayta ishlatib ko'ring.
Planify Up sizning muvaffaqiyat yo'lingizda eng yaxshi hamkoringiz! 💪`;

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