# Backend Setup

This is the backend API server for Resume to Job matching platform.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Environment Variables
Copy `.env.example` to `.env.local` and add your API keys:
- SERPAPI_KEY
- GROQ_API_KEY
- DATABASE_URL

### Run Locally
```bash
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

- `POST /api/upload/resume` - Upload and parse PDF resume
- `POST /api/upload/parse-resume` - Parse resume text
- `GET /api/jobs` - Fetch matching jobs
- `POST /api/analysis/deep` - Deep analysis of resume vs jobs
- `GET /health` - Health check

## Deploy on Render

1. Create new Web Service on Render
2. Connect this GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env.example`
6. Deploy

## Documentation

For frontend integration, see DEPLOYMENT_GUIDE.md in the root directory.
