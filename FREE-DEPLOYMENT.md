# 🎉 100% FREE Deployment Guide - Quantum AI

## 🚀 Deploy for FREE using GitHub Pages + Render

### Total Cost: ₹0 (100% FREE!)

---

## Step 1: Deploy Frontend to GitHub Pages (FREE)

### Method A: Automatic Deployment (Recommended)

1. **Enable GitHub Pages**:
   - Go to: https://github.com/mohanrajcyber/QuantamAI/settings/pages
   - Under "Build and deployment":
     - Source: Select "GitHub Actions"
   - Click "Save"

2. **Push to GitHub** (Already done!):
   ```bash
   git push origin main
   ```

3. **Wait for Deployment**:
   - Go to: https://github.com/mohanrajcyber/QuantamAI/actions
   - Watch the deployment progress
   - Takes ~2-3 minutes

4. **Your Live Link**:
   ```
   https://mohanrajcyber.github.io/QuantamAI/
   ```

### Method B: Manual Build & Deploy

```bash
# Build the project
npm run build

# Install gh-pages
npm install -g gh-pages

# Deploy to GitHub Pages
gh-pages -d dist
```

---

## Step 2: Deploy Backend to Render (FREE)

### Why Render?
- ✅ 750 hours/month FREE
- ✅ Auto-deploy from GitHub
- ✅ HTTPS included
- ✅ No credit card needed

### Steps:

1. **Sign Up**:
   - Go to: https://render.com
   - Click "Get Started for Free"
   - Sign in with GitHub

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Click "Connect account" (if needed)
   - Select repository: `mohanrajcyber/QuantamAI`

3. **Configure Service**:
   ```
   Name: quantum-ai-backend
   Region: Singapore (closest to India)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Add Environment Variables** (Optional):
   - Click "Advanced" → "Add Environment Variable"
   ```
   NODE_ENV=production
   PORT=3001
   
   # Optional API Keys (if you have them)
   OPENAI_API_KEY=your_key_here
   GROQ_API_KEY=your_key_here
   GEMINI_API_KEY=your_key_here
   YOUTUBE_API_KEY=your_key_here
   ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Your backend URL: `https://quantum-ai-backend.onrender.com`

---

## Step 3: Connect Frontend to Backend

### Update API URL in Frontend

1. **Create Environment File**:
   Create `src/config.ts`:
   ```typescript
   export const API_URL = 'https://quantum-ai-backend.onrender.com';
   ```

2. **Update API Calls**:
   In your API service files, use:
   ```typescript
   import { API_URL } from './config';
   
   fetch(`${API_URL}/api/chat`, {
     method: 'POST',
     // ...
   });
   ```

3. **Commit and Push**:
   ```bash
   git add .
   git commit -m "Connect frontend to Render backend"
   git push origin main
   ```

4. **Wait for Auto-Deploy**:
   - GitHub Actions will automatically rebuild and deploy
   - Check: https://github.com/mohanrajcyber/QuantamAI/actions

---

## Step 4: Update Backend CORS

Update `backend/server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://mohanrajcyber.github.io',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

Commit and push:
```bash
git add backend/server.js
git commit -m "Update CORS for GitHub Pages"
git push origin main
```

Render will auto-deploy the backend!

---

## 🎯 Your Live Links

**Frontend (GitHub Pages):**
```
https://mohanrajcyber.github.io/QuantamAI/
```

**Backend (Render):**
```
https://quantum-ai-backend.onrender.com
```

---

## 📱 Share Your Project

**For Hackathon Judges:**
```
🚀 Quantum AI - Live Demo
Frontend: https://mohanrajcyber.github.io/QuantamAI/
Backend: https://quantum-ai-backend.onrender.com
GitHub: https://github.com/mohanrajcyber/QuantamAI

✨ Features:
- Multi-Provider AI (OpenAI, Groq, Gemini, Ollama)
- Multi-Language (English, Tamil, Hindi)
- Responsive Design (Phone, Tablet, Laptop, Desktop)
- 8 Color Themes + Custom Wallpaper
- Voice Input/Output
- File Upload with Smart Recognition
```

---

## 🔧 Troubleshooting

### Frontend Issues

**Page shows 404:**
- Check GitHub Pages settings
- Verify deployment completed in Actions tab
- Wait 2-3 minutes after deployment

**Blank page:**
- Check browser console for errors
- Verify `base` in vite.config.ts is correct
- Clear browser cache

### Backend Issues

**Backend not responding:**
- Check Render logs: Dashboard → Your Service → Logs
- Render free tier sleeps after 15 min inactivity
- First request takes 30-60 seconds to wake up

**CORS errors:**
- Verify CORS settings in backend/server.js
- Check frontend is using correct backend URL
- Redeploy backend after CORS changes

### API Key Issues

**AI not responding:**
- Backend works without API keys (uses free providers)
- Add API keys in Render environment variables
- Restart backend service after adding keys

---

## 💡 Pro Tips

1. **Custom Domain (Optional)**:
   - Buy domain from Namecheap (~₹500/year)
   - Add CNAME record pointing to `mohanrajcyber.github.io`
   - Update in GitHub Pages settings

2. **Keep Backend Awake**:
   - Use UptimeRobot (free) to ping backend every 5 minutes
   - Prevents sleep on Render free tier

3. **Monitor Usage**:
   - Render: 750 hours/month = 31 days (always on!)
   - GitHub Pages: Unlimited bandwidth

4. **Auto-Deploy**:
   - Every `git push` auto-deploys both frontend and backend
   - No manual steps needed!

---

## 🎉 Success Checklist

- ✅ GitHub Pages enabled
- ✅ Frontend deployed and accessible
- ✅ Backend deployed on Render
- ✅ CORS configured correctly
- ✅ Frontend connected to backend
- ✅ All features working
- ✅ Link shared with judges

---

## 📞 Need Help?

**GitHub Pages Issues:**
- Docs: https://docs.github.com/pages

**Render Issues:**
- Docs: https://render.com/docs
- Support: https://render.com/support

**Quantum AI Issues:**
- GitHub Issues: https://github.com/mohanrajcyber/QuantamAI/issues
- Email: mohanraj.cyber@gmail.com

---

## 🚀 You're Live!

Your Quantum AI is now accessible to everyone worldwide - 100% FREE!

Share your link and impress the judges! 🎯
