#!/bin/bash

echo "🚀 Planify Up - Deployment Script"
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create one from env.example"
    echo "cp env.example .env"
    echo "Then edit .env with your configuration"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd client && npm install && cd ..

# Build the project
echo "🔨 Building the project..."
npm run vercel-build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo "📱 Don't forget to:"
echo "   1. Set environment variables in Vercel dashboard"
echo "   2. Update Telegram bot webhook URL"
echo "   3. Test the application"
