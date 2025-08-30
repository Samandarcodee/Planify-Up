import TelegramBot from 'node-telegram-bot-api';
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.log('Telegram bot token not found. Bot will not start.');
    process.exit(0);
}
// Create a bot without polling in Replit environment
const bot = new TelegramBot(token, {
    polling: false
});
// Bot kommandalari
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from?.first_name || 'Foydalanuvchi';
    const welcomeMessage = `Xush kelibsiz, Planify Up!

Bu bot sizga yordam beradi:

📝 Kunlik vazifalarni boshqarish
🎯 Maqsadlar qo'yish va amalga oshirish
📊 Progressingizni kuzatish
🏆 Yutuqlarga erishish

Mini ilovaga kirish uchun pastdagi tugmani bosing! 👇`;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '🚀 Sayohatni boshlash',
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
    const helpMessage = `🎯 **Planify Up - Sizning shaxsiy assistentingiz**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**🎮 Asosiy komandalar:**
🚀 /start - Ilovani ishga tushirish
🆘 /help - Batafsil yo'riqnoma

**📱 Ilovadan foydalanish:**
✨ "🚀 Sayohatni boshlash" tugmasini bosing
🌐 Til (O'zbek/Rus/Ingliz) ni Profil bo'limidan tanlang
➕ Yangi vazifa qo'shish - "+" tugmasini bosing
📊 Statistikada progressingizni kuzating
🎯 Maqsadlar yarating va ularni amalga oshiring
📅 Kunlik rejalaringizni tuzib boring

**🏆 Imkoniyatlar:**
• Vazifalarni kategoriyalar bo'yicha guruhlash
• Maqsadlar uchun progress tracking
• Achievement tizimi orqali motivatsiya
• Har kuni yangi challenge'lar
• Shaxsiy statistika va tahlillar

**🔧 Yordam kerakmi?**
Muammo bo'lsa, /start ni qayta ishlatib ko'ring
Planify Up - sizning muvaffaqiyat kalit! 🗝️✨`;
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
export const setupBotWebhook = (app) => {
    const webhookPath = `/bot${token}`;
    app.post(webhookPath, (req, res) => {
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
