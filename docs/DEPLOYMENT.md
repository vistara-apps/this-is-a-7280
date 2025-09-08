# 🚀 CineMatch AI Deployment Guide

This guide provides step-by-step instructions for deploying CineMatch AI to production.

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ **Supabase project** set up with database schema
- ✅ **Stripe account** with products and webhooks configured
- ✅ **OpenAI/OpenRouter API key** for AI recommendations
- ✅ **Domain name** (optional but recommended)
- ✅ **SSL certificate** (handled automatically by most platforms)

## 🏗️ Infrastructure Setup

### 1. Supabase Configuration

#### Database Setup
1. **Create Supabase Project**
   ```bash
   # Visit https://supabase.com/dashboard
   # Create new project
   # Note down your project URL and anon key
   ```

2. **Run Database Schema**
   ```sql
   -- Copy and paste the contents of database/schema.sql
   -- into the Supabase SQL editor and execute
   ```

3. **Configure Authentication**
   - Enable Email authentication
   - Configure OAuth providers (Google, GitHub, etc.)
   - Set up redirect URLs for your domain

4. **Set up Row Level Security**
   ```sql
   -- RLS policies are included in the schema
   -- Verify they're applied correctly
   ```

#### Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Stripe Configuration

#### Products and Pricing
1. **Create Products**
   ```bash
   # In Stripe Dashboard:
   # 1. Go to Products
   # 2. Create "CineMatch AI Premium" product
   # 3. Add price: $4.99/month recurring
   # 4. Note the price ID
   ```

2. **Configure Webhooks**
   ```bash
   # Webhook URL: https://yourdomain.com/api/webhooks/stripe
   # Events to listen for:
   # - customer.subscription.created
   # - customer.subscription.updated
   # - customer.subscription.deleted
   # - invoice.payment_succeeded
   # - invoice.payment_failed
   ```

3. **Update Price IDs**
   ```javascript
   // In src/lib/stripe.js
   export const STRIPE_CONFIG = {
     PRICE_IDS: {
       PREMIUM_MONTHLY: 'price_your_actual_price_id', // Update this
     }
   }
   ```

#### Environment Variables
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. AI Service Configuration

#### OpenAI Setup
```env
VITE_OPENAI_API_KEY=sk-your-openai-key
```

#### OpenRouter Setup (Alternative)
```env
VITE_OPENROUTER_API_KEY=sk-or-your-openrouter-key
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables**
   ```bash
   # In Vercel Dashboard:
   # 1. Go to your project
   # 2. Settings > Environment Variables
   # 3. Add all required variables
   ```

5. **Set up Custom Domain** (Optional)
   ```bash
   # In Vercel Dashboard:
   # 1. Go to Domains
   # 2. Add your custom domain
   # 3. Configure DNS records
   ```

#### Vercel Configuration
Create `vercel.json`:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option 2: Netlify

#### Steps
1. **Connect Repository**
   - Go to Netlify Dashboard
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Set Environment Variables**
   - Go to Site settings > Environment variables
   - Add all required variables

4. **Configure Redirects**
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Option 3: Docker + Cloud Provider

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://backend:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

#### Deploy to Cloud
```bash
# Build and push to registry
docker build -t cinematch-ai .
docker tag cinematch-ai your-registry/cinematch-ai:latest
docker push your-registry/cinematch-ai:latest

# Deploy to your cloud provider
# (AWS ECS, Google Cloud Run, Azure Container Instances, etc.)
```

### Option 4: Traditional VPS

#### Prerequisites
- VPS with Ubuntu/CentOS
- Domain name pointing to VPS IP
- SSL certificate (Let's Encrypt recommended)

#### Steps
1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/cinematch-ai.git
   cd cinematch-ai

   # Install dependencies
   npm install

   # Build application
   npm run build

   # Serve with PM2
   pm2 serve dist 3000 --name cinematch-ai
   pm2 startup
   pm2 save
   ```

3. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/cinematch-ai
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable SSL with Let's Encrypt**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx -y

   # Get SSL certificate
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

   # Auto-renewal
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## 🔧 Environment Configuration

### Production Environment Variables

Create `.env.production`:
```env
# App Configuration
VITE_APP_URL=https://yourdomain.com
VITE_API_URL=https://yourdomain.com/api

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Stripe Configuration (LIVE keys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# AI Configuration
VITE_OPENAI_API_KEY=sk-your-openai-key
VITE_OPENROUTER_API_KEY=sk-or-your-openrouter-key

# Feature Flags
VITE_ENABLE_PREMIUM_FEATURES=true
VITE_ENABLE_AI_RECOMMENDATIONS=true
```

### Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use platform-specific environment variable management
   - Rotate API keys regularly

2. **HTTPS Only**
   - Always use HTTPS in production
   - Set up proper SSL certificates
   - Configure HSTS headers

3. **Content Security Policy**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; 
                  script-src 'self' 'unsafe-inline' https://js.stripe.com; 
                  style-src 'self' 'unsafe-inline'; 
                  img-src 'self' data: https:; 
                  connect-src 'self' https://api.openai.com https://openrouter.ai https://*.supabase.co;">
   ```

## 📊 Monitoring & Analytics

### 1. Application Monitoring

#### Sentry Setup
```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

#### Vercel Analytics
```bash
npm install @vercel/analytics
```

```javascript
// src/main.jsx
import { Analytics } from '@vercel/analytics/react';

// Add <Analytics /> to your app
```

### 2. Performance Monitoring

#### Web Vitals
```javascript
// src/utils/analytics.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 3. Database Monitoring

#### Supabase Monitoring
- Monitor database performance in Supabase Dashboard
- Set up alerts for high CPU/memory usage
- Monitor API request patterns

#### Custom Metrics
```javascript
// Track recommendation generation
const trackRecommendation = (userId, filters, responseTime) => {
  // Send to analytics
  analytics.track('recommendation_generated', {
    userId,
    filters,
    responseTime,
    timestamp: new Date().toISOString()
  });
};
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Verify environment variables
echo $VITE_SUPABASE_URL
```

#### Runtime Errors
```bash
# Check browser console for errors
# Verify API endpoints are accessible
# Check CORS configuration
# Validate environment variables
```

#### Database Connection Issues
```bash
# Verify Supabase URL and key
# Check RLS policies
# Ensure database is accessible from your domain
```

#### Payment Issues
```bash
# Verify Stripe keys (test vs live)
# Check webhook configuration
# Validate webhook signatures
# Monitor Stripe Dashboard for errors
```

### Performance Optimization

#### Bundle Size Optimization
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          stripe: ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
});
```

#### Caching Strategy
```javascript
// Service Worker for caching
// Cache API responses
// Implement offline functionality
```

## 📈 Scaling Considerations

### Database Scaling
- Monitor query performance
- Add database indexes as needed
- Consider read replicas for high traffic
- Implement connection pooling

### API Rate Limiting
- Implement rate limiting per user
- Cache frequent requests
- Use CDN for static assets
- Monitor API usage patterns

### Cost Optimization
- Monitor Supabase usage and costs
- Optimize AI API calls
- Use efficient database queries
- Implement proper caching

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📝 Post-Deployment Checklist

- [ ] **Verify all pages load correctly**
- [ ] **Test user registration and login**
- [ ] **Confirm AI recommendations work**
- [ ] **Test subscription flow end-to-end**
- [ ] **Verify webhook endpoints respond correctly**
- [ ] **Check SSL certificate is valid**
- [ ] **Monitor error rates and performance**
- [ ] **Set up monitoring and alerts**
- [ ] **Update DNS records if needed**
- [ ] **Test mobile responsiveness**

## 🆘 Support

If you encounter issues during deployment:

1. **Check the logs** for specific error messages
2. **Verify environment variables** are set correctly
3. **Test API endpoints** individually
4. **Review the troubleshooting section** above
5. **Contact support** if issues persist

---

**🎉 Congratulations! Your CineMatch AI application is now live in production!**

Remember to monitor your application regularly and keep dependencies updated for security and performance.
