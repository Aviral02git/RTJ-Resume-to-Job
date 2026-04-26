# Quick Start: Deployment Ready (Vercel + Render)

Your project is now split into **Frontend** and **Backend** for optimal deployment!

## 📦 Current Status

✅ **Frontend Separation Complete**
- API routes removed from Next.js app
- Components updated to call backend API
- Ready for Vercel deployment

✅ **Backend Created**
- Express.js server with all API routes
- Located in `/backend` folder
- Ready for Render deployment

---

## 🚀 Next Steps

### Step 1: Push Backend to GitHub

```bash
# Navigate to backend
cd backend

# Initialize new git repo (or add as subtree)
git init
git add -A
git commit -m "Initial backend setup"
git branch -M main

# Push to new GitHub repo
git remote add origin https://github.com/Aviral02git/RTJ-Backend.git
git push -u origin main
```

**OR** if you want a clean start:
1. Create a new GitHub repo: `RTJ-Backend`
2. Copy `backend/` contents to a new local folder
3. Initialize git and push

### Step 2: Deploy Backend on Render

1. Go to [render.com](https://render.com)
2. Create **New Web Service**
3. Connect GitHub repo: `RTJ-Backend`
4. Configuration:
   ```
   Build Command: npm install
   Start Command: npm start
   Port: 3001
   ```
5. Add Environment Variables:
   ```
   SERPAPI_KEY=your_key_here
   GROQ_API_KEY=your_key_here
   DATABASE_URL=file:./prisma/dev.db
   NODE_ENV=production
   PORT=3001
   ```
6. Click **Deploy**

📍 You'll get a URL like: `https://rtj-backend.onrender.com`

### Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Create **New Project**
3. Select: `RTJ-Resume-to-Job` repository
4. Environment Variable:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://rtj-backend.onrender.com
   ```
5. Click **Deploy**

📍 You'll get a URL like: `https://rtj-resume-to-job.vercel.app`

---

## 🧪 Test Locally First

### Terminal 1: Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on: `http://localhost:3001`

### Terminal 2: Start Frontend
```bash
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000`

**Test:**
1. Open http://localhost:3000
2. Upload a resume
3. Should work end-to-end with backend on 3001

---

## 📋 Deployment Checklist

- [ ] Backend repo created and pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Backend URL copied to Vercel env var
- [ ] Frontend deployed on Vercel
- [ ] Test upload on Vercel frontend works
- [ ] Check Render logs for any errors
- [ ] Verify backend health: `https://rtj-backend.onrender.com/health`

---

## 🔗 Final URLs

- **Frontend:** `https://[your-vercel-domain].vercel.app`
- **Backend API:** `https://[your-render-domain].onrender.com`

---

## 📝 Environment Variables Summary

**Frontend (.env.local):**
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
NODE_ENV=production
```

**Backend (.env.local in /backend):**
```env
SERPAPI_KEY=your_serpapi_key
GROQ_API_KEY=your_groq_key
DATABASE_URL=file:./prisma/dev.db
NODE_ENV=production
PORT=3001
```

---

## 🆘 Troubleshooting

**Frontend can't connect to backend?**
- Check `NEXT_PUBLIC_BACKEND_URL` is set correctly in Vercel
- Verify backend is running: `curl https://your-backend.onrender.com/health`
- Check CORS is enabled (it is in our Express setup)

**Backend errors in Render logs?**
- Check all env variables are set
- Verify API keys are valid
- Review Render deployment logs for details

**Resume upload not working?**
- Verify backend is receiving the file
- Check console logs on both frontend and backend
- Ensure PDF is text-based (not scanned image)

---

Good to deploy! 🎉
