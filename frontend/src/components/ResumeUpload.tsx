'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Backend URL configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
import {
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  FileText,
  LoaderCircle,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { motion } from 'framer-motion';

type DeepAnalysis = {
  overallScore: number;
  summary: string;
  topStrengths: string[];
  keyGaps: string[];
  recommendations: Array<{
    title: string;
    company: string;
    compatibility: number;
    reason: string;
  }>;
  actionPlan: Array<{
    step: number;
    skill: string;
    timeframe: string;
    activity: string;
  }>;
};

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [parsedSkills, setParsedSkills] = useState<string[]>([]);
  const [parsedKeywords, setParsedKeywords] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<DeepAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [parseWarning, setParseWarning] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const visibleKeywords = parsedKeywords.filter((keyword) => {
    const token = String(keyword || '').toLowerCase().trim();
    if (!token) return false;
    if (token.length < 3) return false;
    if (token.includes('resume') || token.includes('curriculum') || token.includes('vitae')) return false;
    if (['pdf', 'doc', 'docx', 'file', 'upload', 'attachment', 'final', 'latest'].includes(token)) return false;
    return true;
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  };

  const resetFile = () => {
    setFile(null);
    setError('');
    setSuccess(false);
    setParsedSkills([]);
    setParsedKeywords([]);
    setAnalysis(null);
    setParseWarning('');
    localStorage.removeItem('careermatch_last_analysis');
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');
    setAnalysis(null);
    localStorage.removeItem('careermatch_last_analysis');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BACKEND_URL}/api/upload/parse-resume`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setParsedSkills(data.skills || []);
        setParsedKeywords(data.keywords || []);
        setParseWarning(data.parseWarning || '');

        if (!data.text) {
          setAnalysis(null);
          setSuccess(false);
          setError(data.parseWarning || 'Could not read enough text from this PDF. Please upload a text-based resume.');
          return;
        }

        setAnalyzing(true);

        const deepResponse = await fetch(`${BACKEND_URL}/api/analysis/deep`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            skills: data.skills || [],
            keywords: data.keywords || [],
            resumeText: data.text || '',
          }),
        });

        if (!deepResponse.ok) {
          const deepError = await deepResponse.json().catch(() => ({}));
          setError(
            deepError?.error ||
              'Analysis failed for this resume. Please try another text-based PDF.'
          );
          setSuccess(false);
          return;
        }

        const deepData = await deepResponse.json();
        setAnalysis(deepData);
        localStorage.setItem(
          'careermatch_last_analysis',
          JSON.stringify({
            ...deepData,
            analyzedFileName: file.name,
            analyzedAt: new Date().toISOString(),
          })
        );

        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch {
      setError('An error occurred during upload');
    } finally {
      setAnalyzing(false);
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="w-full space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Step 1</p>
            <p className="mt-2 text-sm font-medium text-slate-700">Choose a PDF resume</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Step 2</p>
            <p className="mt-2 text-sm font-medium text-slate-700">Run deep analysis</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Step 3</p>
            <p className="mt-2 text-sm font-medium text-slate-700">Review fit and next moves</p>
          </div>
        </div>

        <div
          className={`rounded-[1.75rem] border p-6 transition-all sm:p-8 ${
            dragActive
              ? 'border-slate-900 bg-slate-50'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Upload</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Resume analysis</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Drag in a PDF or browse from your device. We&apos;ll extract skills and generate role recommendations.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              {success ? <CheckCircle className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
            </div>
          </div>

          <label
            htmlFor="file-input"
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`block cursor-pointer rounded-[1.5rem] border-2 border-dashed px-6 py-12 text-center transition-all ${
              dragActive
                ? 'border-slate-900 bg-slate-50'
                : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <FileText className="h-8 w-8 text-slate-700" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">Drop your resume here</h3>
            <p className="mt-2 text-sm text-slate-600">PDF only, or click to browse</p>
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
              Best with text-based PDFs
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
              Skills extracted automatically
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
              Dashboard saved locally
            </span>
          </div>

          {file && (
            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-left">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Selected file</p>
                  <p className="mt-1 text-base font-semibold text-slate-900 break-all">{file.name}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Ready to parse skills, keywords, and role fit signals.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetFile}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  disabled={uploading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {uploading ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      {analyzing ? 'Analyzing resume...' : 'Uploading resume...'}
                    </>
                  ) : (
                    <>
                      Upload and analyze
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
                <label
                  htmlFor="file-input"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Change file
                </label>
              </div>
            </div>
          )}

          {(uploading || analyzing) && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <LoaderCircle className="h-5 w-5 animate-spin text-slate-700" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Working on your analysis</p>
                  <p className="text-sm text-slate-600">
                    Extracting skills, building recommendations, and preparing your next-step summary.
                  </p>
                </div>
              </div>
            </div>
          )}

          {success && analysis && (
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-left">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-emerald-900">Analysis ready</p>
                <p className="text-sm text-emerald-700">
                  Resume parsed successfully. Your latest dashboard is available now.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
              >
                Open dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {!error && parseWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm text-amber-700">{parseWarning}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
