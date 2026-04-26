# 📁 Project Folder Structure

This document explains the modern, scalable folder structure of the RTJ (Resume to Job) platform.

## Overview

```
RTJ-Resume-to-Job/
├── frontend/                  # Next.js Frontend Application (Deploy to Vercel)
├── backend/                   # Express.js Backend API (Deploy to Render)
├── DEPLOYMENT_GUIDE.md
├── README.md
└── ... (documentation files)
```

## Frontend Structure (`frontend/`)

### Modern Next.js 14+ App Router Structure

```
frontend/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Dashboard
│   │   ├── upload/
│   │   │   └── page.tsx       # Upload page
│   │   ├── jobs/
│   │   │   └── page.tsx       # Jobs listing
│   │   └── error.tsx          # Error page
│   │
│   ├── components/            # Reusable Components
│   │   ├── Header.tsx
│   │   ├── ResumeUpload.tsx
│   │   ├── JobsList.tsx
│   │   ├── AnalysisResults.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Loading.tsx
│   │
│   ├── lib/                   # Business Logic & Integrations
│   │   ├── api.ts            # API client
│   │   ├── jobProviders.ts   # Job data sources
│   │   └── constants.ts      # App constants
│   │
│   ├── utils/                 # Utility Functions
│   │   ├── resumeParser.ts   # PDF parsing
│   │   ├── skillExtractor.ts
│   │   └── formatters.ts
│   │
│   ├── styles/                # Global Styles
│   │   ├── globals.css       # Tailwind imports
│   │   └── themes.css
│   │
│   └── config/                # Configuration
│       └── env.ts            # Type-safe env
│
├── public/                    # Static Assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── tests/                     # Test Files
│   ├── __tests__/
│   └── setup.ts
│
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript config
├── next.config.ts           # Next.js config
├── tailwind.config.ts       # Tailwind config
├── postcss.config.mjs       # PostCSS config
├── eslint.config.mjs        # ESLint config
├── .env.example             # Environment template
├── .env.local               # Local env (git ignored)
├── .gitignore
└── README.md
```

## Backend Structure (`backend/`)

### Modern Express.js Structure

```
backend/
├── src/
│   ├── server.js            # Express app initialization
│   │
│   ├── routes/              # API Route Handlers
│   │   ├── uploadResume.js      # POST /api/upload/resume
│   │   ├── parseResume.js       # POST /api/upload/parse-resume
│   │   ├── jobs.js              # GET /api/jobs
│   │   └── analysis.js          # POST /api/analysis/deep
│   │
│   ├── middleware/          # Custom Middleware
│   │   ├── errorHandler.js
│   │   ├── validation.js
│   │   └── auth.js
│   │
│   ├── lib/                 # External Service Integrations
│   │   ├── jobProviders.js
│   │   ├── aiService.js
│   │   └── apiClients.js
│   │
│   ├── utils/               # Utility Functions
│   │   ├── resumeParser.js      # PDF parsing logic
│   │   ├── skillExtractor.js    # Skill extraction
│   │   ├── validators.js        # Input validation
│   │   └── logger.js            # Logging
│   │
│   ├── config/              # Configuration
│   │   ├── env.js          # Environment variables
│   │   ├── constants.js    # App constants
│   │   └── database.js     # DB config
│   │
│   └── services/            # Business Logic Services
│       ├── resumeService.js
│       ├── jobService.js
│       └── analysisService.js
│
├── tests/                   # Test Files
│   ├── unit/
│   ├── integration/
│   └── setup.js
│
├── scripts/                 # Utility Scripts
│   ├── seed.js
│   └── migrate.js
│
├── package.json            # Dependencies
├── .env.example            # Environment template
├── .env.local              # Local env (git ignored)
├── .gitignore
└── README.md
```

## Key Design Principles

### 1. **Separation of Concerns**
- **Frontend** handles UI, state, user interactions
- **Backend** handles business logic, data processing, API integrations

### 2. **Scalability**
- Each feature has its own folder
- Services handle complex logic
- Middleware handles cross-cutting concerns

### 3. **Maintainability**
- Clear folder hierarchy
- Consistent naming conventions
- Type safety with TypeScript

### 4. **Reusability**
- Shared components in `components/`
- Common utilities in `utils/`
- Business logic in `services/`

### 5. **Security**
- Environment variables for secrets
- `.gitignore` prevents committing sensitive files
- Input validation in middleware

## File Naming Conventions

### Frontend
- **Components:** `PascalCase` (e.g., `ResumeUpload.tsx`)
- **Utilities:** `camelCase` (e.g., `skillExtractor.ts`)
- **Hooks:** `useXxx` (e.g., `useResume.ts`)
- **Types:** `*.types.ts`

### Backend
- **Route files:** `camelCase` (e.g., `uploadResume.js`)
- **Services:** `camelCase` + `Service.js` (e.g., `resumeService.js`)
- **Middleware:** `camelCase` + `Middleware.js`
- **Utils:** `camelCase` (e.g., `validators.js`)

## Import Paths

### Frontend
```typescript
// Relative imports
import { Header } from '@/components/Header'
import { api } from '@/lib/api'
import { formatters } from '@/utils/formatters'
```

### Backend
```javascript
// CommonJS/ESM
import { uploadResumeRoute } from './routes/uploadResume.js'
import { resumeService } from './services/resumeService.js'
import { logger } from './utils/logger.js'
```

## Environment Management

### Frontend `.env.local`
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### Backend `.env.local`
```env
PORT=3001
NODE_ENV=development
SERPAPI_KEY=xxx
```

## Deployment Structure

### Frontend (Vercel)
```
Root: frontend/
Build: npm run build
Start: npm start
```

### Backend (Render)
```
Root: backend/
Build: npm install
Start: npm start
```

## Benefits of This Structure

✅ **Scalable** - Easy to add new features
✅ **Maintainable** - Clear organization
✅ **Testable** - Each module is independent
✅ **Secure** - Secrets properly managed
✅ **Modern** - Follows industry standards
✅ **Documented** - Clear folder purposes
✅ **DevOps Ready** - Easy deployment setup

## Migration Notes

If migrating from monolith to this structure:
1. Move Next.js files to `frontend/src/app/`
2. Move Express files to `backend/src/`
3. Update all relative imports
4. Create separate `package.json` for each
5. Set up deployment with separate roots
6. Test thoroughly before deploying

## Git Strategy

```bash
# Keep both in same repo
git add .
git commit -m "Update structure"

# Or separate repos (advanced)
# Frontend: RTJ-Frontend repo
# Backend: RTJ-Backend repo
```

## Quick Reference

| Need | Location |
|------|----------|
| API URL | `frontend/src/lib/api.ts` |
| Add route | `backend/src/routes/` |
| Add component | `frontend/src/components/` |
| Add service | `backend/src/services/` |
| Add utility | `frontend/src/utils/` or `backend/src/utils/` |
| Add type | `*/types/` or `*.types.ts` |
| Tests | `*/tests/` |

## Next Steps

1. Run `npm install` in both `frontend/` and `backend/`
2. Copy `.env.example` to `.env.local`
3. Update environment variables
4. Run `npm run dev` in each folder
5. Start building! 🚀
