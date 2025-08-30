# Planify Up - Telegram Web App

A modern task and goal management application built as a Telegram Web App (TWA) for personal productivity tracking.

## 🚀 Features

- **Task Management**: Create, edit, and track daily tasks with categories
- **Goal Setting**: Set long-term goals with progress tracking
- **Achievement System**: Unlock achievements for motivation
- **Real-time Notifications**: Telegram bot notifications and reminders
- **Multi-language Support**: Uzbek, Russian, and English
- **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS
- **Responsive Design**: Works on all devices

## 🏗️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS + shadcn/ui
- TanStack Query for state management
- Wouter for routing

### Backend
- Express.js + TypeScript
- Drizzle ORM with PostgreSQL
- JWT authentication
- Rate limiting and security middleware

### Integrations
- Telegram Bot API
- Telegram Web App
- Neon Database (PostgreSQL)

## 📱 Telegram Bot Commands

- `/start` - Launch the app and get web app link
- `/help` - Detailed user guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Telegram Bot Token

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/planify-up.git
cd planify-up
```

2. **Install dependencies**
```bash
npm install
cd client && npm install
cd ..
```

3. **Environment setup**
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Database setup**
```bash
npm run db:push
```

5. **Start development server**
```bash
npm run dev
```

## 🌐 Deployment to Vercel

### 1. Prepare for Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy to Vercel**
```bash
vercel
```

### 2. Environment Variables in Vercel

Set these environment variables in your Vercel dashboard:

- `DATABASE_URL` - Your PostgreSQL connection string
- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Set to "production"

### 3. Custom Domain (Optional)

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain

### 4. Update Telegram Bot Webhook

After deployment, update your bot's webhook URL:

```typescript
// The webhook URL will be:
https://your-domain.vercel.app/bot${TELEGRAM_BOT_TOKEN}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No (default: development) |

### Database Schema

The application uses 4 main tables:
- `users` - User accounts and profiles
- `tasks` - Daily tasks and to-dos
- `goals` - Long-term objectives
- `achievements` - User accomplishments

## 📱 Usage

### For Users

1. **Start the bot**: Send `/start` to your Telegram bot
2. **Open the app**: Click "🚀 Sayohatni boshlash" button
3. **Create tasks**: Use the "+" button to add new tasks
4. **Set goals**: Create long-term objectives
5. **Track progress**: Monitor your daily and weekly progress

### For Developers

1. **API Endpoints**: All endpoints are prefixed with `/api`
2. **Authentication**: Use JWT tokens in Authorization header
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **Error Handling**: Structured error responses with status codes

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents abuse
- **CORS Protection**: Configurable origin restrictions
- **Security Headers**: Helmet.js security middleware
- **Input Validation**: Zod schema validation

## 🧪 Testing

```bash
# Run type checking
npm run check

# Run database migrations
npm run db:push

# Build for production
npm run build
```

## 📊 Performance

- **Frontend**: Optimized with Vite and code splitting
- **Backend**: Efficient database queries with Drizzle ORM
- **Caching**: React Query for client-side caching
- **Bundle Size**: Optimized with tree shaking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Create an issue on GitHub
- **Telegram**: Contact @your_username
- **Email**: support@yourdomain.com

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Drizzle ORM](https://orm.drizzle.team/) for database management
- [Telegram Bot API](https://core.telegram.org/bots/api) for bot functionality
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Made with ❤️ for productivity enthusiasts**
