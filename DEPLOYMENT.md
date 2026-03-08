# 🚀 Quantum AI - Live Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Step 1: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with GitHub
3. **Import Project**: Click "Add New" → "Project"
4. **Select Repository**: Choose `mohanrajcyber/QuantamAI`
5. **Configure**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. **Deploy**: Click "Deploy"

Your frontend will be live at: `https://quantum-ai-[random].vercel.app`

### Step 2: Deploy Backend to Render (Free)

1. **Go to Render**: https://render.com
2. **Sign in** with GitHub
3. **New Web Service**: Click "New" → "Web Service"
4. **Connect Repository**: Choose `mohanrajcyber/QuantamAI`
5. **Configure**:
   - Name: `quantum-ai-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`
6. **Add Environment Variables** (Optional):
   ```
   OPENAI_API_KEY=your_key
   GROQ_API_KEY=your_key
   GEMINI_API_KEY=your_key
   YOUTUBE_API_KEY=your_key
   ```
7. **Deploy**: Click "Create Web Service"

Your backend will be live at: `https://quantum-ai-backend.onrender.com`

### Step 3: Connect Frontend to Backend

1. **Update Frontend Config**:
   - Go to Vercel Dashboard
   - Select your project
   - Go to "Settings" → "Environment Variables"
   - Add: `VITE_API_URL=https://quantum-ai-backend.onrender.com`
   - Redeploy

### Step 4: Update CORS in Backend

Update `backend/server.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://quantum-ai-[your-vercel-url].vercel.app'],
  credentials: true
}));
```

---

## Alternative: One-Click Deploy with Railway

### Deploy Everything Together

1. **Go to Railway**: https://railway.app
2. **Sign in** with GitHub
3. **New Project**: Click "New Project" → "Deploy from GitHub repo"
4. **Select Repository**: Choose `mohanrajcyber/QuantamAI`
5. **Add Services**:
   - Service 1: Frontend (Root directory: `/`)
   - Service 2: Backend (Root directory: `/backend`)
6. **Configure Frontend**:
   - Build Command: `npm run build`
   - Start Command: `npm run preview`
7. **Configure Backend**:
   - Build Command: `npm install`
   - Start Command: `npm start`
8. **Deploy**: Railway will auto-deploy

---

## Alternative: Netlify (Frontend Only)

1. **Go to Netlify**: https://netlify.com
2. **Sign in** with GitHub
3. **Add New Site**: Click "Add new site" → "Import an existing project"
4. **Connect to GitHub**: Choose `mohanrajcyber/QuantamAI`
5. **Configure**:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Deploy**: Click "Deploy site"

For backend, use Render or Railway as mentioned above.

---

## 🎯 Recommended Setup

**Best for Hackathon Demo:**
- **Frontend**: Vercel (Fast, Free, Auto-deploy)
- **Backend**: Render (Free, Always-on)

**Total Cost**: $0 (100% Free!)

**Live in**: ~5 minutes

---

## 📝 After Deployment

1. **Test the Live Site**: Visit your Vercel URL
2. **Update README**: Add live demo link
3. **Share with Judges**: Send the live link

---

## 🔧 Troubleshooting

**Frontend not loading?**
- Check build logs in Vercel
- Verify `dist` folder is created

**Backend not responding?**
- Check Render logs
- Verify environment variables
- Backend may sleep after 15 min (free tier) - first request wakes it up

**CORS errors?**
- Update backend CORS settings with your Vercel URL
- Redeploy backend

---

## 🎉 Success!

Your Quantum AI is now live and accessible to everyone!

Share your link: `https://your-quantum-ai.vercel.app`
