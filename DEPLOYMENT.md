# Deployment Guide - Resume to Job

## Quick Deployment

### Deploy to Vercel (Recommended)

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New" → "Project"
   - Select repository: `RTJ-Resume-to-Job`

2. **Configure Environment Variables**
   Add these from your `.env.local`:
   ```
   SERPAPI_KEY=your_key_here
   SERPAPI_ENDPOINT=https://serpapi.com/search
   GROQ_API_KEY=your_key_here
   GROQ_CHAT_MODEL=llama-3.3-70b-versatile
   GROQ_EMBED_MODEL=nomic-embed-text-v1.5
   DATABASE_URL=file:./prisma/dev.db
   NEXT_PUBLIC_API_URL=your_vercel_url
   NODE_ENV=production
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your live URL will be provided

### Database Setup (Optional)

For production database, use Render PostgreSQL:

1. Go to [render.com](https://render.com)
2. Create PostgreSQL database
3. Update `DATABASE_URL` in Vercel with the connection string
4. Run migrations (if needed)

## Environment Variables Needed

| Variable | Purpose |
|----------|---------|
| `SERPAPI_KEY` | Google Search API for job listings |
| `GROQ_API_KEY` | AI analysis of resumes |
| `DATABASE_URL` | Database connection string |
| `NEXT_PUBLIC_API_URL` | Frontend API URL (auto-set to Vercel domain) |

## API Routes Available

- `POST /api/upload/resume` - Upload resume
- `POST /api/upload/parse-resume` - Parse resume content
- `GET /api/jobs` - Get job listings
- `POST /api/analysis/deep` - Deep analysis

## Local Testing Before Deploy

```bash
npm install
npm run build
npm start
```

Visit `http://localhost:3000`

## Live URLs After Deployment

- **Frontend**: `https://your-project.vercel.app`
- **API**: `https://your-project.vercel.app/api/*`

---

For support or issues, check the logs in Vercel Dashboard.
