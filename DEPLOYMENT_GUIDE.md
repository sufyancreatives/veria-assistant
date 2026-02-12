# Serenity - Deployment Guide

> **Step-by-Step Instructions for Production Deployment**

---

## Overview

This guide covers deploying Serenity to production with:
- **Frontend**: Vercel (recommended) or Netlify
- **Backend**: Render (recommended) or Railway

**Estimated Time**: 30-45 minutes

---

## Prerequisites

- GitHub account (for repository)
- Vercel/Netlify account (frontend)
- Render/Railway account (backend)
- OpenAI API key

---

## Part 1: Prepare for Deployment

### 1. Create GitHub Repository

```bash
cd hackathon/
git init
git add .
git commit -m "Initial commit - Serenity mental wellness chatbot"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/serenity-mental-wellness.git
git branch -M main
git push -u origin main
```

**Important**: Ensure `.env` files are gitignored!

---

### 2. Update CORS for Production

Edit `server/index.js`:

```javascript
// Development
// app.use(cors())

// Production - replace with your frontend URL
app.use(cors({
  origin: 'https://your-frontend-url.vercel.app',
  credentials: true
}))
```

---

### 3. Update API URL in Frontend

Edit `mental-wellness-bot/src/pages/Chat.jsx`:

```javascript
// Development
// const API_URL = 'http://localhost:4000/api/chat'

// Production
const API_URL = process.env.VITE_API_URL || 'https://your-backend-url.onrender.com/api/chat'
```

---

## Part 2: Deploy Backend (Render)

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Click "New +" → "Web Service"

---

### Step 2: Connect Repository

1. Select your GitHub repo
2. Choose branch: `main`
3. Root Directory: `server`

---

### Step 3: Configure Service

```yaml
Name: serenity-backend
Environment: Node
Region: Oregon (US West) # or closest to users
Branch: main
Root Directory: server
Build Command: npm install
Start Command: npm start
```

---

### Step 4: Add Environment Variables

In Render dashboard, add:

```
OPENAI_API_KEY = your_actual_openai_api_key_here
PORT = 4000
NODE_ENV = production
```

**⚠️ Critical**: Keep your API key secret!

---

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (~2-3 minutes)
3. Note the URL: `https://serenity-backend-xxxx.onrender.com`

---

### Step 6: Test Backend

```bash
curl https://serenity-backend-xxxx.onrender.com/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-02-12T..."}
```

---

## Part 3: Deploy Frontend (Vercel)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Click "Add New..." → "Project"

---

### Step 2: Import Repository

1. Select your GitHub repo
2. Configure:
   ```yaml
   Framework Preset: Vite
   Root Directory: mental-wellness-bot
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

---

### Step 3: Add Environment Variables

In Vercel dashboard, add:

```
VITE_API_URL = https://serenity-backend-xxxx.onrender.com/api/chat
```

**Note**: Vercel exposes env vars starting with `VITE_` to the client.

---

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build (~1-2 minutes)
3. Note the URL: `https://serenity-xxxx.vercel.app`

---

### Step 5: Update CORS (Backend)

Go back to Render dashboard:

1. Edit `server/index.js` CORS config:
   ```javascript
   app.use(cors({
     origin: 'https://serenity-xxxx.vercel.app'
   }))
   ```
2. Commit and push changes
3. Render auto-redeploys

---

### Step 6: Test Live Application

1. Visit `https://serenity-xxxx.vercel.app`
2. Complete onboarding
3. Send a test message
4. Verify AI responds

---

## Part 4: Alternative Platforms

### Option B: Netlify (Frontend)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build frontend
cd mental-wellness-bot/
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

**Environment Variables**: Add in Netlify dashboard

---

### Option C: Railway (Backend)

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repo, Set root directory: `server`
4. Add environment variables in dashboard
5. Railway auto-deploys

**Note**: Railway provides free $5/month credit

---

## Part 5: Custom Domain (Optional)

### Frontend (Vercel)

1. Go to project settings → Domains
2. Add custom domain (e.g., `serenity-app.com`)
3. Configure DNS records as instructed
4. Vercel auto-provisions SSL certificate

### Backend (Render)

1. Go to service settings → Custom Domain
2. Add custom domain (e.g., `api.serenity-app.com`)
3. Configure DNS CNAME record
4.Render auto-provisions SSL certificate

---

## Part 6: Post-Deployment Checklist

### Functional Testing

- [ ] Onboarding page loads correctly
- [ ] Chat sends and receives messages
- [ ] AI responses are appropriate
- [ ] Crisis button opens modal
- [ ] Info page accessible
- [ ] 3D particles render smoothly
- [ ] Custom cursor works

### Security Checks

- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Environment variables secure
- [ ] CORS restricted to frontend domain
- [ ] No API keys in client code
- [ ] `.env` files gitignored

### Performance

- [ ] Page load time < 3 seconds
- [ ] AI response time < 5 seconds
- [ ] No console errors

---

## Part 7: Monitoring & Maintenance

### Health Monitoring

**Uptime Monitoring** (Free options):
- UptimeRobot: Ping `/api/health` every 5 minutes
- Better Uptime: More advanced monitoring

**Setup**:
1. Add monitor for `https://your-backend-url.onrender.com/api/health`
2. Configure email alerts for downtime
3. Expected uptime: 99.9%

---

### Error Tracking

**Recommended**: Sentry (free tier available)

```bash
# Install in frontend
npm install @sentry/react

# Initialize in main.jsx
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "your-sentry-dsn" });
```

---

### Cost Monitoring

**OpenAI API Costs**:
1. Set usage limits in OpenAI dashboard
2. Enable email alerts at 50%, 75%, 90%
3. Estimated cost: $0.002-0.01 per conversation

**Typical Monthly Costs**:
- 100 users, 5 conversations each = $1-5/month
- 1000 users, 5 conversations each = $10-50/month

---

### Platform Costs

**Free Tiers**:
- Vercel: Unlimited personal projects
- Render: 750 hours/month free (1 instance)
- Railway: $5/month credit

**Production Scale**:
- Vercel Pro: $20/month (if needed)
- Render: $7-25/month per instance
- Railway: Pay-as-you-go

---

## Part 8: Troubleshooting

### Issue: CORS errors

**Symptoms**: Frontend can't connect to backend

**Solution**:
1. Verify CORS origin matches frontend URL exactly
2. Check for trailing slashes
3. Ensure HTTPS (not HTTP)

---

### Issue: Environment variables not working

**Symptoms**: `OPENAI_API_KEY` undefined

**Solution**:
1. Verify env vars in platform dashboard
2. Ensure they're spelled correctly
3. Redeploy after changes
4. Check naming: `VITE_` prefix for frontend

---

### Issue: Build failures

**Symptoms**: Deployment fails during build

**Solution**:
1. Check build logs in platform dashboard
2. Verify all dependencies in `package.json`
3. Test build locally: `npm run build`
4. Ensure Node.js version compatibility

---

### Issue: High API costs

**Symptoms**: Unexpectedly high OpenAI charges

**Solution**:
1. Add rate limiting to `/api/chat`
2. Implement request queuing
3. Cache common responses (future enhancement)
4. Monitor token usage in OpenAI dashboard

---

## Part 9: Scaling Strategy

### Current Setup (MVP)

```
Vercel (Frontend) → Render (1 backend instance) → OpenAI API
```

**Capacity**: 50-100 concurrent users

---

### Scaling to 1000+ Users

```
Vercel/CDN (Frontend)
          ↓
    Load Balancer
          ↓
   ┌──────┴──────┐
   ↓             ↓
Backend 1    Backend 2
   └──────┬──────┘
          ↓
     Redis Cache  ← Cache common responses
          ↓
     OpenAI API
```

**Implementation**:
1. Enable Render auto-scaling (scale to 2-5 instances)
2. Add Redis for response caching
3. Implement rate limiting per user
4. Use CDN for static assets

---

## Part 10: Continuous Deployment

### Auto-Deploy on Git Push

Both Vercel and Render support automatic deployments:

1. **Production branch**: `main`
2. **Preview branches**: feature branches deploy to preview URLs
3. **Rollback**: One-click rollback in dashboards

### Recommended Git Workflow

```bash
# Feature development
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "Add new feature"
git push origin feature/new-feature

# Creates preview deployment automatically

# Merge to main (production)
git checkout main
git merge feature/new-feature
git push origin main

# Auto-deploys to production
```

---

## Part 11: Security Best Practices

### 1. API Key Security

✅ **DO**:
- Store in environment variables
- Rotate keys periodically
- Use separate keys for dev/prod

❌ **DON'T**:
- Commit to Git
- Hardcode in source files
- Share publicly

---

### 2. Rate Limiting (Production Essential)

```javascript
// Add to server/index.js
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.'
})

app.use('/api/chat', limiter)
```

---

### 3. Input Validation

```javascript
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body
  
  // Validate
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request' })
  }
  
  if (messages.length > 50) {
    return res.status(400).json({ error: 'Too many messages' })
  }
  
  // ... continue
})
```

---

## Conclusion

Serenity is now deployed and accessible to users worldwide! 🚀

**Key Links**:
- Frontend: `https://serenity-xxxx.vercel.app`
- Backend: `https://serenity-backend-xxxx.onrender.com`
- Health Check: `https://serenity-backend-xxxx.onrender.com/api/health`

**Next Steps**:
1. Share the link with testers
2. Monitor for errors/issues
3. Gather user feedback
4. Iterate and improve

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **OpenAI API**: https://platform.openai.com/docs
- **Mental Health Resources**: See Info page in app
