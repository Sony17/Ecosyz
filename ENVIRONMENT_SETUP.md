# Environment Setup Guide

This guide will help you set up all the necessary environment variables for the OpenIdea platform.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual credentials in the `.env` file (never commit this file!)

## Required Services & Configuration

### 🗄️ **Supabase (Database & Authentication)**
- **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Public anon key from Supabase
- **SUPABASE_SERVICE_ROLE_KEY**: Service role key (keep secret!)
- **DATABASE_URL**: PostgreSQL connection string for pooled connections
- **DIRECT_URL**: Direct PostgreSQL connection string

### 🔐 **OAuth Authentication**
- **GITHUB_CLIENT_ID** & **GITHUB_CLIENT_SECRET**: GitHub OAuth app credentials
- **GOOGLE_CLIENT_ID** & **GOOGLE_CLIENT_SECRET**: Google OAuth app credentials

### 🤖 **AI & APIs**
- **OPENAI_API_KEY**: OpenAI API key for AI features
- **YOUTUBE_API_KEY**: YouTube Data API v3 key for video search

### 📧 **Email Service**
- **RESEND_API_KEY**: Resend API key for email functionality
- **NEXT_PUBLIC_COMPANY_EMAIL**: Your company/support email address

### 💾 **Caching (Redis)**
- **UPSTASH_REDIS_REST_URL**: Upstash Redis REST API URL
- **UPSTASH_REDIS_REST_TOKEN**: Upstash Redis auth token

### 💳 **Payment Processing**
- **NEXT_PUBLIC_STRIPE_PUBLIC_KEY**: Stripe publishable key
- **STRIPE_SECRET_KEY**: Stripe secret key
- **STRIPE_WEBHOOK_SECRET**: Stripe webhook endpoint secret
- **NEXT_PUBLIC_PAYPAL_CLIENT_ID**: PayPal client ID
- **PAYPAL_CLIENT_SECRET**: PayPal client secret
- **NEXT_PUBLIC_UPI_ID**: UPI ID for Indian payments
- **NEXT_PUBLIC_MERCHANT_NAME**: Display name for payments

## Development vs Production

- Use `.env.local` for local development overrides
- Use `.env.production.local` for production-specific variables
- Never commit actual `.env` files to version control

## Security Notes

⚠️ **Important Security Guidelines:**
- Never share or commit actual API keys
- Use environment-specific configurations
- Rotate keys regularly
- Use least-privilege access for service accounts
- Monitor API usage for unusual activity

## Verification

After setting up your environment:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Check that all services are working:
   - Database connections
   - Authentication providers
   - API integrations
   - Payment systems

## Getting Help

If you encounter issues:
1. Verify all required environment variables are set
2. Check service-specific documentation
3. Ensure API keys have proper permissions
4. Review application logs for specific error messages