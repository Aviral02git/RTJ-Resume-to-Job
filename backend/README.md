# Resume to Job - Backend API

Express.js backend API for the Resume to Job matching platform. Handles resume parsing, job matching, and deep analysis.

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.js         # Main Express application
│   ├── routes/           # API route handlers
│   │   ├── uploadResume.js
│   │   ├── parseResume.js
│   │   ├── jobs.js
│   │   └── analysis.js
│   ├── middleware/       # Express middleware
│   ├── lib/              # External service integrations
│   │   └── jobProviders.js
│   ├── utils/            # Utility functions
│   │   └── resumeParser.js
│   ├── config/           # Configuration
│   └── services/         # Business logic services
├── tests/                # Test files
├── scripts/              # Utility scripts
├── package.json
├── .env.example
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

```bash
cd backend
npm install
```

### Development

```bash
npm run dev
```

Server runs on [http://localhost:3001](http://localhost:3001)

### Environment Variables

Copy `.env.example` to `.env.local` and add:

```env
SERPAPI_KEY=your_key_here
GROQ_API_KEY=your_key_here
PORT=3001
NODE_ENV=development
```

## 🔧 Tech Stack

- **Framework:** Express.js 4.18.2
- **Runtime:** Node.js
- **File Upload:** Multer
- **CORS:** Express CORS
- **PDF Parsing:** pdf-parse
- **HTTP Client:** Axios
- **Environment:** dotenv

## 📡 API Endpoints

### Resume Upload & Parsing

**POST /api/upload/resume**
- Upload PDF resume and extract text
- Returns: parsed text, skills, keywords

**POST /api/upload/parse-resume**
- Parse resume with validation
- Returns: text, skills, keywords, warnings

### Job Fetching

**GET /api/jobs**
- Query parameters: `q` (search), `type` (job type), `limit` (results)
- Returns: array of matching jobs with metadata

### Deep Analysis

**POST /api/analysis/deep**
- Analyze resume against job market
- Request body: `{ skills, keywords, resumeText }`
- Returns: overall score, recommendations, roadmaps, project ideas

### Health Check

**GET /health**
- Returns: API status

## 🔍 Resume Parser

Located in `src/utils/resumeParser.js`:

- Extracts text from PDF files
- Detects skills automatically
- Generates resume keywords
- Validates resume quality

## 💼 Job Provider Integration

Located in `src/lib/jobProviders.js`:

- **SerpAPI:** Primary job search provider
- **Public Jobs Fallback:** Alternative job sources
- **Mock Jobs:** Default test data

## 🌐 CORS Configuration

Configure in `.env`:
```env
CORS_ORIGIN=http://localhost:3000
```

## 📦 Deployment (Render)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

### Production Environment

```env
NODE_ENV=production
PORT=3001 (Render will auto-assign)
SERPAPI_KEY=your_production_key
GROQ_API_KEY=your_production_key
CORS_ORIGIN=https://your-frontend.vercel.app
```

## 🧪 Testing

```bash
npm test
```

## 🛠️ Development

### Adding a New Route

1. Create handler in `src/routes/`
2. Import in `src/server.js`
3. Add route: `app.post('/api/path', handler)`
4. Test via API

### Adding Middleware

1. Create in `src/middleware/`
2. Import in `src/server.js`
3. Use: `app.use(middleware)`

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

