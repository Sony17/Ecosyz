#!/bin/bash

echo "🚀 Starting local development setup..."

# Check if .env file exists, if not create from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update your .env file with your credentials"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Reset database and apply migrations (development only)
echo "🗄️  Setting up database..."
npx prisma migrate reset --force

# Start Prisma Studio in background
echo "🔍 Starting Prisma Studio..."
npx prisma studio &
PRISMA_PID=$!

# Start development server
echo "🌐 Starting Next.js development server..."
echo "🌟 You can access:"
echo "   - Next.js app: http://localhost:3000"
echo "   - Prisma Studio: http://localhost:5555"
echo "   - Auth Test Page: http://localhost:3000/auth-test"
echo ""
echo "📝 Available endpoints:"
echo "   - GitHub OAuth: /api/auth/github"
echo "   - Google OAuth: /api/auth/google"
echo "   - Session Check: /api/auth/session"
echo ""
echo "🛑 To stop all services, press Ctrl+C"

# Run Next.js development server
npm run dev

# Cleanup: Kill Prisma Studio when Next.js is stopped
kill $PRISMA_PID