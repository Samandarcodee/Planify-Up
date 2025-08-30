# 🚀 Vercel Deployment Guide

## 📋 Prerequisites

1. **Vercel Account**: [vercel.com](https://vercel.com) da ro'yxatdan o'ting
2. **GitHub Repository**: Loyihani GitHubga push qiling
3. **Environment Variables**: Kerakli environment variablelarni tayyorlang

## 🔧 Step 1: Environment Setup

### 1.1 Environment Variables
`.env` faylini yarating va quyidagilarni to'ldiring:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here

# JWT Security
JWT_SECRET=your-super-secret-key-here

# Environment
NODE_ENV=production
```

### 1.2 Database Setup
```bash
# Database migration
npm run db:push
```

## 🌐 Step 2: Vercel Deployment

### 2.1 Vercel CLI Installation
```bash
npm install -g vercel
```

### 2.2 Login to Vercel
```bash
vercel login
```

### 2.3 Deploy to Vercel
```bash
# Development deployment
vercel

# Production deployment
vercel --prod
```

### 2.4 Manual Deployment Steps
1. **Vercel Dashboard**ga kiring
2. **New Project** ni bosing
3. GitHub repositoryni tanlang
4. **Framework Preset**: Other
5. **Build Command**: `npm run vercel-build`
6. **Output Directory**: `dist/public`
7. **Install Command**: `npm install && cd client && npm install`

## ⚙️ Step 3: Environment Variables in Vercel

Vercel dashboardda quyidagi environment variablelarni o'rnating:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string |
| `TELEGRAM_BOT_TOKEN` | `1234567890:...` | Your Telegram bot token |
| `JWT_SECRET` | `your-secret-key` | JWT signing secret |
| `NODE_ENV` | `production` | Environment mode |

## 🔗 Step 4: Update Telegram Bot Webhook

Deployment tugagandan so'ng, bot webhook URLini yangilang:

```typescript
// Your webhook URL will be:
https://your-project.vercel.app/bot${TELEGRAM_BOT_TOKEN}

// Example:
https://planify-up.vercel.app/bot1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

## 🧪 Step 5: Testing

### 5.1 API Endpoints
```bash
# Test health check
curl https://your-project.vercel.app/api/health

# Test bot webhook
curl -X POST https://your-project.vercel.app/bot${TELEGRAM_BOT_TOKEN}
```

### 5.2 Telegram Bot
1. Botga `/start` xabarini yuboring
2. Web app linkini bosing
3. Ilovani test qiling

## 🔧 Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain
1. Vercel dashboard → Project Settings → Domains
2. **Add Domain** ni bosing
3. Domain nomini kiriting
4. DNS sozlamalarini yangilang

### 6.2 Update CORS
`server/middleware.ts` faylida CORS originsni yangilang:

```typescript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'https://your-project.vercel.app'
];
```

## 📊 Step 7: Monitoring

### 7.1 Vercel Analytics
- **Speed Insights**: Performance monitoring
- **Web Analytics**: User behavior tracking
- **Real-time Performance**: Live metrics

### 7.2 Error Tracking
- **Function Logs**: Serverless function logs
- **Build Logs**: Deployment logs
- **Performance Monitoring**: Response times

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs
vercel logs

# Local build test
npm run vercel-build
```

#### 2. Environment Variables
```bash
# Verify environment variables
vercel env ls

# Set missing variables
vercel env add DATABASE_URL
```

#### 3. Database Connection
```bash
# Test database connection
curl -X POST https://your-project.vercel.app/api/health
```

#### 4. CORS Issues
```bash
# Check CORS configuration
# Update allowed origins in middleware.ts
```

## 🔄 Step 8: Updates and Maintenance

### 8.1 Automatic Deployments
- GitHub repositoryga push qilganda avtomatik deploy
- Branch-based deployments (main = production)

### 8.2 Manual Updates
```bash
# Force redeploy
vercel --prod --force

# Rollback to previous version
vercel rollback
```

### 8.3 Database Migrations
```bash
# Run migrations after deployment
npm run db:push
```

## 📱 Final Checklist

- [ ] Environment variables o'rnatildi
- [ ] Database migration bajarildi
- [ ] Telegram bot webhook yangilandi
- [ ] API endpoints test qilindi
- [ ] Bot funksionalligi tekshirildi
- [ ] Custom domain sozlandi (agar kerak bo'lsa)
- [ ] Monitoring sozlandi
- [ ] Documentation yangilandi

## 🎉 Success!

Loyiha muvaffaqiyatli deploy qilindi! 

**Next Steps:**
1. Foydalanuvchilarga bot linkini yuboring
2. Feedback yig'ing va yaxshilang
3. Performance monitoring qiling
4. Regular updates va maintenance

---

**Need Help?** 
- [Vercel Documentation](https://vercel.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [GitHub Issues](https://github.com/yourusername/planify-up/issues)
