# CareerMatch - AI-Powered Resume to Job Compatibility Platform

Transform your career journey with CareerMatch! Our intelligent platform analyzes your resume, matches you with perfect job opportunities, and provides personalized preparation plans and resume optimization tips.

##  Features

### Core Features
- **Resume Analysis**: Upload your PDF resume and get instant parsing and skill extraction
- **Job Compatibility Scoring**: AI-powered matching algorithm scores your compatibility with job postings (0-100%)
- **Skill Gap Analysis**: Identify missing skills and experience for target roles
- **Preparation Blueprints**: Get customized learning paths with estimated hours and resources
- **Resume Fit Suggestions**: AI recommendations on how to improve your resume for specific jobs
- **Company Insights**: Access real company reviews, ratings, work conditions, and benefits
- **Job Filtering**: Filter by location, job type (WFH/WFO/Hybrid), salary, and more

### AI-Powered Features
- Intelligent resume parsing and content extraction
- OpenAI integration for advanced analysis and suggestions
- Personalized job recommendations based on your profile
- Automated resume improvement suggestions
- Skill matching with industry standards

### Modern UI/UX
- Clean, modern, and calming design (non-stressful)
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Accessibility-first approach
- Gradient backgrounds and professional color schemes

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide Icons, Custom Components
- **Animations**: Framer Motion
- **Forms**: React Hook Form, Zod validation

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: Prisma ORM with SQLite (easily switch to PostgreSQL)

### AI & Integration
- **AI**: OpenAI GPT-3.5-turbo
- **PDF Processing**: pdf-parse
- **Data Validation**: Zod

### Development
- **Package Manager**: npm
- **Dev Tools**: ESLint, Turbopack
- **Build Tool**: Next.js built-in

## 📋 Project Structure

```
resumetojob/
├── src/
│   ├── app/
│   │   ├── api/              # API Routes
│   │   │   ├── upload/       # Resume upload & parsing
│   │   │   ├── jobs/         # Job fetching & filtering
│   │   │   └── analysis/     # AI analysis endpoints
│   │   ├── layout.tsx        # Root layout with Header & Footer
│   │   ├── page.tsx          # Landing page
│   │   └── globals.css       # Global styles
│   ├── components/           # Reusable React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ResumeUpload.tsx
│   │   └── JobCard.tsx
│   ├── lib/                  # Utilities & AI integration
│   │   └── aiAnalysis.ts
│   ├── utils/                # Helper functions
│   │   └── resumeParser.ts
│   └── types/                # TypeScript types
│       └── index.ts
├── prisma/                   # Database schema
│   └── schema.prisma
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+
- OpenAI API key (for AI features)

### Installation

1. **Navigate to project**
   ```bash
   cd resumetojob
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env.local
   echo "OPENAI_API_KEY=your_openai_api_key" > .env.local
   echo "DATABASE_URL=\"file:./dev.db\"" >> .env.local
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📖 How to Use

### For Job Seekers/Students

1. **Upload Resume**
   - Click "Upload Your Resume" on the home page
   - Drag & drop or select a PDF file
   - System analyzes your skills and experience

2. **Browse Jobs**
   - View all available job opportunities
   - Filter by location, job type, and salary
   - See compatibility scores at a glance

3. **Check Compatibility**
   - Click any job to see detailed compatibility analysis
   - Review skill matches, experience levels, and gaps
   - Read AI-generated resume suggestions

4. **Get Preparation Plan**
   - View customized learning path for target role
   - Access resources and estimated learning hours
   - Track progress on skill development

5. **Improve Resume**
   - Get specific resume improvement suggestions
   - See how to better highlight relevant skills
   - Optimize for specific job descriptions

## 🎯 Key Components

### ResumeUpload Component
- Drag-and-drop PDF upload
- Client-side file validation
- Real-time feedback
- Success/error states with animations

### JobCard Component
- Job details display
- Compatibility score visualization
- Skills matching breakdown
- Company ratings and reviews
- One-click preparation plan access

### Header & Footer
- Responsive navigation
- Mobile-friendly menu
- Brand identity
- Quick access to key pages

## 🤖 AI Features

### Resume Analysis
- Extracts: name, email, skills, experience, education, projects, certifications
- Calculates: skill relevance, years of experience, education match
- Identifies: strengths and improvement areas

### Compatibility Scoring
Algorithm considers:
- Skill matches (40% weight)
- Experience alignment (30% weight)
- Education requirements (15% weight)
- Project/portfolio relevance (10% weight)
- Overall fit (5% weight)

### Preparation Blueprints
- Identifies skill gaps
- Recommends learning resources
- Estimates learning time
- Prioritizes by importance

### Resume Optimization
- Section-specific suggestions
- ATS optimization tips
- Keyword recommendations
- Format improvements

## 💾 Database Schema

### Users
- ID, Email, Name, CreatedAt, UpdatedAt
- Relationships: Resumes, SavedJobs

### Resumes
- ID, UserID, Name, Email, Phone, Location, Skills, FullData
- Stores complete resume information

### Jobs
- ID, Title, Company, Location, JobType, Salary/Stipend, Description
- Skills, Experience, CompanyRatings, Benefits, WorkingConditions

### SavedJobs
- Bookmark/save jobs for later

### CompatibilityScores
- Cache analysis results for performance

## 🔒 Security Considerations

- [ ] Implement user authentication (Firebase, NextAuth.js)
- [ ] Add rate limiting on API endpoints
- [ ] Encrypt sensitive data in database
- [ ] Validate all file uploads
- [ ] Implement CORS properly
- [ ] Use environment variables for secrets

## 📊 Performance

- Optimized images with Next.js Image component
- Code splitting with dynamic imports
- Caching strategies for API responses
- Database indexing on frequently queried fields
- Turbopack for faster dev builds

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
# Connect your GitHub repo
# Vercel automatically deploys on push

# Or deploy manually
npm run build
vercel
```

### Environment Variables for Production
```
OPENAI_API_KEY=your_production_key
DATABASE_URL=your_production_db_url
NODE_ENV=production
```

## 🔧 API Endpoints

### Resume Upload
- `POST /api/upload/parse-resume` - Upload and parse resume PDF

### Jobs
- `GET /api/jobs` - List all jobs with optional filters
- `POST /api/jobs` - Create new job listing

### Analysis
- `POST /api/analysis/compatibility` - Get job compatibility score
- `POST /api/analysis/preparation-plan` - Generate learning blueprint
- `POST /api/analysis/resume-fit` - Get resume improvement suggestions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project!

---

**Built with ❤️ for students, job seekers, and career changers**

CareerMatch - Your AI Career Companion

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
