# Resume to Job (RTJ)

🎯 A modern platform that matches your resume with the best job opportunities. Upload your resume, get analyzed against market trends, and discover personalized job matches with a complete upskilling roadmap.

## 📊 Project Overview

```
RTJ-Resume-to-Job/
├── frontend/                   # Next.js Frontend (Vercel)
│   ├── src/
│   │   ├── app/               # Next.js routes & pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Helper functions
│   │   ├── utils/             # Shared utilities
│   │   ├── styles/            # Global styles
│   │   └── config/            # Configuration
│   ├── public/                # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
│
├── backend/                    # Express Backend (Render)
│   ├── src/
│   │   ├── server.js          # Express app
│   │   ├── routes/            # API routes
│   │   │   ├── uploadResume.js
│   │   │   ├── parseResume.js
│   │   │   ├── jobs.js
│   │   │   └── analysis.js
│   │   ├── middleware/        # Custom middleware
│   │   ├── lib/               # External integrations
│   │   ├── utils/             # Utility functions
│   │   ├── config/            # Configuration
│   │   └── services/          # Business logic
│   ├── tests/                 # Test files
│   ├── scripts/               # Utility scripts
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
│
├── DEPLOYMENT_GUIDE.md        # Full deployment instructions
├── FEATURES.md                # Feature documentation
├── PROJECT_SUMMARY.md         # Project details
├── QUICKSTART.md              # Quick setup guide
├── START_HERE.md              # Getting started
└── README.md                  # This file
```

## 🚀 Quick Start

### Frontend Setup (Local)

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Backend Setup (Local)

```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
```

### Environment Files

**Frontend (.env.local)**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

**Backend (.env.local)**
```env
SERPAPI_KEY=your_key
GROQ_API_KEY=your_key
PORT=3001
NODE_ENV=development
```

## 🌐 Deployment

### Frontend → Vercel

1. Connect GitHub repo to Vercel
2. Set root directory: `frontend/`
3. Add env variable: `NEXT_PUBLIC_BACKEND_URL`
4. Deploy

### Backend → Render

1. Create new Web Service on Render
2. Connect GitHub repo
3. Set root directory: `backend/`
4. Build: `npm install`
5. Start: `npm start`
6. Add environment variables
7. Deploy

**Result URLs:**
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.onrender.com`

## 📱 Features

### Resume Analysis
- 📄 Upload & parse PDF resumes
- 🔍 Extract skills automatically
- 📊 Keyword extraction
- ✅ Resume quality validation

### Job Matching
- 🎯 AI-powered job recommendations
- 💼 Market trend analysis
- 📈 Compatibility scoring
- 🏆 Top matches personalized

### Career Roadmap
- 📚 Skill gap analysis
- 🛣️ Learning roadmaps
- 💡 Project ideas
- 🎓 Resource recommendations

### Deep Insights
- 📊 Overall market fit score
- 🎓 Upskilling recommendations
- 🏢 Internship opportunities
- 💰 Salary insights

## 🔧 Tech Stack

### Frontend
- **Framework:** Next.js 16.2.4
- **UI:** React 19.2.4 + Tailwind CSS
- **Forms:** React Hook Form + Zod
- **Animation:** Framer Motion
- **Charts:** Recharts

### Backend
- **Framework:** Express.js 4.18.2
- **Language:** Node.js (ES modules)
- **PDF Parsing:** pdf-parse
- **File Upload:** Multer
- **Job Data:** SerpAPI + Public APIs

## 📡 API Documentation

See [Backend README](backend/README.md) for full API documentation.

### Core Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/upload/resume` | Upload & parse PDF |
| POST | `/api/upload/parse-resume` | Parse resume text |
| GET | `/api/jobs` | Get job matches |
| POST | `/api/analysis/deep` | Deep analysis |
| GET | `/health` | Health check |

## 🔐 Environment Variables

### Frontend Required
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL

### Backend Required
- `SERPAPI_KEY` - Job search API key
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

### Backend Optional
- `GROQ_API_KEY` - AI analysis key
- `CORS_ORIGIN` - Frontend URL for CORS

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Production deployment
- [Features](FEATURES.md) - Detailed feature list
- [Quick Start](QUICKSTART.md) - Get started quickly
- [Frontend README](frontend/README.md) - Frontend documentation
- [Backend README](backend/README.md) - Backend documentation

## 🎯 Workflow

1. **Upload Resume** → User uploads PDF resume
2. **Parse & Extract** → Backend extracts skills and keywords
3. **Analyze Market** → Compare against job market
4. **Match & Recommend** → AI finds best matches
5. **Create Roadmap** → Generate learning path
6. **Track Progress** → User follows upskilling plan

## 🐛 Troubleshooting

### Backend not connecting?
- Check `NEXT_PUBLIC_BACKEND_URL` in frontend
- Ensure backend is running on port 3001
- Verify CORS settings

### Resume parsing failing?
- Upload text-based PDF (not scanned image)
- Ensure PDF is readable
- Check file size < 10MB

### Jobs not loading?
- Verify SERPAPI_KEY is valid
- Check rate limits
- Fallback to mock jobs enabled

## 📦 Dependencies

**Frontend** - 8 core dependencies
- Next.js, React, Tailwind CSS, Framer Motion, Recharts, React Hook Form, Zod, next-cloudinary

**Backend** - 7 core dependencies
- Express, Cors, Dotenv, Multer, Axios, pdf-parse, pdfjs-dist

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💼 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check documentation first
- See troubleshooting guide

## 🎉 Getting Started

**First time?** Start with [START_HERE.md](START_HERE.md)

**Quick deployment?** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**Want features?** Check [FEATURES.md](FEATURES.md)

---

**Happy Job Hunting! 🚀**
