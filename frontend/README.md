# Resume to Job - Frontend

Modern Next.js frontend for the Resume to Job matching platform. Upload your resume and get matched with the best job opportunities.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app directory (routes, layouts)
│   ├── components/       # Reusable React components
│   ├── lib/              # Utility functions and helpers
│   ├── utils/            # Shared utilities (resume parser, etc.)
│   ├── styles/           # Global styles
│   └── config/           # Configuration files
├── public/               # Static assets
├── tests/                # Test files
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── .env.example
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Environment Variables

Copy `.env.example` to `.env.local` and update:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001  # Local development
# or
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com  # Production
```

### Build for Production

```bash
npm run build
npm start
```

## 🔧 Tech Stack

- **Framework:** Next.js 16.2.4
- **UI Library:** React 19.2.4
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Validation:** Zod

## 📡 API Integration

The frontend communicates with the backend API at the URL specified in `NEXT_PUBLIC_BACKEND_URL`.

### Available API Endpoints

- `POST /api/upload/resume` - Upload and parse PDF resume
- `POST /api/upload/parse-resume` - Parse resume text
- `GET /api/jobs` - Fetch matching jobs
- `POST /api/analysis/deep` - Deep analysis of resume vs jobs

See [Backend README](../backend/README.md) for full API documentation.

## 📚 Components

- **ResumeUpload:** File upload and PDF parsing
- **JobsList:** Display matching job opportunities
- **Analysis:** Show resume-job compatibility analysis
- **Header:** Navigation and branding
- **Dashboard:** User dashboard with analytics

## 🧪 Testing

```bash
npm test
```

## 📦 Deployment (Vercel)

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically on push

[See Full Deployment Guide](../DEPLOYMENT_GUIDE.md)

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
