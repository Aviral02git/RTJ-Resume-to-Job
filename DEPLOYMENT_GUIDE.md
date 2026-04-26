# Deployment Guide: Frontend (Vercel) + Backend (Render)

## **Phase 1: Prepare for Separation**

### Step 1: Create Backend Folder Structure
You need to extract your API routes into a separate Express server.

```bash
# Create backend directory at project root
mkdir -p backend/routes
mkdir -p backend/utils
mkdir -p backend/middleware
```

### Step 2: Create Express Backend Server

#### `backend/server.js` (Node.js/Express API)
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Import your route handlers
import uploadResumeRoute from './routes/uploadResume.js';
import parseResumeRoute from './routes/parseResume.js';
import jobsRoute from './routes/jobs.js';
import analysisRoute from './routes/analysis.js';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb' }));

// Routes
app.post('/api/upload/resume', upload.single('file'), uploadResumeRoute);
app.post('/api/upload/parse-resume', parseResumeRoute);
app.get('/api/jobs', jobsRoute);
app.post('/api/analysis/deep', analysisRoute);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
```

#### `backend/package.json`
```json
{
  "name": "rtj-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "multer": "^1.4.5-lts.1",
    "axios": "^1.6.0",
    "pdf-parse": "^2.4.5",
    "pdfjs-dist": "^5.6.0",
    "@prisma/client": "^7.7.0"
  }
}
```

---

## **Phase 2: Move API Routes to Backend**

For each API route, create a corresponding backend route handler:

### Move: `src/app/api/upload/resume/route.js` → `backend/routes/uploadResume.js`

```javascript
import { extractPdfText, extractSkills, extractResumeKeywords } from '../utils/resumeParser.js';

export default async function uploadResumeRoute(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const buffer = file.buffer;
    const parsedText = await extractPdfText(buffer);
    // ... rest of your logic
    
    res.json({ skills, keywords, text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

Repeat for:
- `src/app/api/upload/parse-resume/route.js` → `backend/routes/parseResume.js`
- `src/app/api/jobs/route.js` → `backend/routes/jobs.js`
- `src/app/api/analysis/deep/route.js` → `backend/routes/analysis.js`

---

## **Phase 3: Update Frontend for Vercel**

### Step 1: Update API Calls
In your React components (e.g., [src/components/ResumeUpload.tsx](src/components/ResumeUpload.tsx)):

**Before:**
```typescript
const response = await fetch('/api/upload/resume', {
  method: 'POST',
  body: formData
});
```

**After:**
```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const response = await fetch(`${BACKEND_URL}/api/upload/resume`, {
  method: 'POST',
  body: formData
});
```

### Step 2: Delete API Routes from Frontend
```bash
rm -rf src/app/api
```

### Step 3: Update `.env.local`
```env
# Frontend
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
NODE_ENV=production

# Backend endpoints will call these
SERPAPI_KEY=your_key
GROQ_API_KEY=your_key
DATABASE_URL=file:./prisma/dev.db
```

---

## **Phase 4: Deploy Backend to Render**

### Step 1: Create Git Repo for Backend
```bash
cd backend
git init
git add .
git commit -m "Initial backend setup"
```

### Step 2: Push to GitHub
```bash
git remote add origin https://github.com/Aviral02git/RTJ-Backend.git
git push -u origin main
```

### Step 3: Deploy on Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo (`RTJ-Backend`)
4. Configuration:
   - **Name:** rtj-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Port:** 3001

5. Add Environment Variables:
   ```
   SERPAPI_KEY=your_key
   GROQ_API_KEY=your_key
   DATABASE_URL=your_db_url
   NODE_ENV=production
   ```

6. Click "Create Web Service"

Render will give you a URL like: `https://rtj-backend.onrender.com`

---

## **Phase 5: Deploy Frontend to Vercel**

### Step 1: Remove API Routes from Your Repo
```bash
git rm -r src/app/api
git commit -m "Remove API routes - moved to separate backend"
git push origin main
```

### Step 2: Update Environment Variable
In root `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=https://rtj-backend.onrender.com
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Select `RTJ-Resume-to-Job` repository
4. Configure:
   - **Framework:** Next.js
   - **Environment Variable:**
     ```
     NEXT_PUBLIC_BACKEND_URL=https://rtj-backend.onrender.com
     ```
5. Click "Deploy"

---

## **Final URLs**
- **Frontend:** `https://your-frontend.vercel.app`
- **Backend:** `https://rtj-backend.onrender.com`

---

## **Quick Checklist**
- [ ] Create backend folder with Express server
- [ ] Move API routes to backend
- [ ] Update frontend API calls to use `NEXT_PUBLIC_BACKEND_URL`
- [ ] Remove `src/app/api` from frontend
- [ ] Push backend repo to GitHub
- [ ] Deploy backend on Render
- [ ] Deploy frontend on Vercel
- [ ] Test API calls from frontend to backend
- [ ] Verify database connections work

