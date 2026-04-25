'use client';

import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
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

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');
    setAnalysis(null);
    localStorage.removeItem('careermatch_last_analysis');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/parse-resume', {
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

        const deepResponse = await fetch('/api/analysis/deep', {
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
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err) {
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-8 border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 animate-pulse" />
        </div>

        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-4">
            {success ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
            ) : (
              <Upload className="w-16 h-16 text-blue-500" />
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="file-input"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="cursor-pointer block"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Drop your resume here
              </h3>
              <p className="text-gray-600 mb-4">or click to select a PDF file</p>
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200 text-left">
                <p className="text-gray-800 font-medium mb-4">
                  Selected: {file.name}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload & Analyze'}
                </motion.button>
              </div>
            )}
          </div>

          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-left">
              <p className="font-semibold text-green-800">Resume uploaded successfully!</p>
              <p className="text-sm text-green-700">
                Your resume is being analyzed. You’ll see recommendations below.
              </p>
              {analyzing && <p className="mt-2 text-sm font-medium text-indigo-600">Running deep analysis...</p>}
            </div>
          )}

          {parsedSkills.length > 0 && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {parsedSkills.slice(0, 8).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-white/80 text-blue-700 text-xs font-semibold shadow-sm border border-blue-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {visibleKeywords.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {visibleKeywords.slice(0, 8).map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 rounded-full bg-white/80 text-slate-700 text-xs font-semibold shadow-sm border border-slate-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}

          {analysis && (
            <div className="mt-6 space-y-4 text-left">
              <div className="rounded-xl border border-indigo-100 bg-white/90 p-4">
                <p className="text-xs uppercase tracking-wide text-indigo-600 font-bold">Deep Analysis Score</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{analysis.overallScore}%</p>
                <p className="text-sm text-slate-600 mt-1">{analysis.summary}</p>
              </div>

              {analysis.recommendations?.length > 0 && (
                <div className="rounded-xl border border-blue-100 bg-white/90 p-4">
                  <p className="text-sm font-bold text-slate-900 mb-3">Top Job Recommendations</p>
                  <div className="space-y-3">
                    {analysis.recommendations.slice(0, 3).map((rec, idx) => (
                      <div key={`${rec.title}-${idx}`} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-slate-900 text-sm">{rec.title}</p>
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                            {rec.compatibility}% fit
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{rec.company}</p>
                        <p className="text-xs text-slate-600 mt-2">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.actionPlan?.length > 0 && (
                <div className="rounded-xl border border-purple-100 bg-white/90 p-4">
                  <p className="text-sm font-bold text-slate-900 mb-2">Action Plan</p>
                  <ul className="space-y-2">
                    {analysis.actionPlan.slice(0, 3).map((step) => (
                      <li key={`${step.step}-${step.skill}`} className="text-xs text-slate-700">
                        <span className="font-semibold">Step {step.step}:</span> {step.skill} · {step.timeframe}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}

          {!error && parseWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-left"
            >
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-amber-700 text-sm">{parseWarning}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
