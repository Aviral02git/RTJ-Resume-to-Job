'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BarChart3, Briefcase, Target, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
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

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<DeepAnalysis | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('careermatch_last_analysis');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as DeepAnalysis;
      setAnalysis(parsed);
    } catch {
      setAnalysis(null);
    }
  }, []);

  const topRecommendation = useMemo(() => analysis?.recommendations?.[0], [analysis]);
  const matchingJobs = useMemo(() => analysis?.recommendations?.slice(0, 4) || [], [analysis]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#ffffff_45%,#f7f5ff_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-100 shadow-sm">
            Smart Career Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">Your Job Readiness Dashboard</h1>
          <p className="mt-2 text-slate-600">Track compatibility, strengths, and next steps from your latest resume analysis.</p>
        </motion.div>

        {!analysis ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">No analysis found yet</h2>
            <p className="mt-2 text-slate-600">Upload your resume first to generate deep analysis and recommendations.</p>
            <Link href="/upload" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white">
              Go to Upload
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-indigo-50 p-4 border border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm"><BarChart3 className="h-4 w-4" /> Overall Score</div>
                  <p className="mt-1 text-3xl font-black text-slate-900">{analysis.overallScore}%</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm"><Sparkles className="h-4 w-4" /> Strengths</div>
                  <p className="mt-1 text-3xl font-black text-slate-900">{analysis.topStrengths.length}</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm"><Target className="h-4 w-4" /> Gaps</div>
                  <p className="mt-1 text-3xl font-black text-slate-900">{analysis.keyGaps.length}</p>
                </div>
              </div>

              <p className="mt-5 text-slate-700">{analysis.summary}</p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="font-bold text-slate-900 mb-2">Top Strengths</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.topStrengths.slice(0, 8).map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="font-bold text-slate-900 mb-2">Priority Skill Gaps</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keyGaps.slice(0, 8).map((g) => (
                      <span key={g} className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">{g}</span>
                    ))}
                  </div>
                </div>
              </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Best Matching Role</h3>
              {topRecommendation ? (
                <>
                  <p className="mt-3 text-sm font-semibold text-indigo-700">{topRecommendation.compatibility}% fit</p>
                  <p className="mt-1 text-xl font-black text-slate-900">{topRecommendation.title}</p>
                  <p className="text-sm text-slate-600">{topRecommendation.company}</p>
                  <p className="mt-3 text-sm text-slate-700">{topRecommendation.reason}</p>
                </>
              ) : (
                <p className="mt-3 text-sm text-slate-600">No recommendation yet.</p>
              )}

              <div className="mt-6 space-y-3">
                <Link href="/jobs" className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Briefcase className="h-4 w-4" /> Explore Jobs</span>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </Link>
                <Link href="/upload" className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800"><TrendingUp className="h-4 w-4" /> Re-run Analysis</span>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </Link>
              </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">More Matching Jobs</h2>
                  <p className="mt-1 text-sm text-slate-600">A ranked list of roles from your latest analysis.</p>
                </div>
                <Link href="/jobs" className="text-sm font-semibold text-indigo-700 hover:text-indigo-800">
                  Browse all jobs →
                </Link>
              </div>
              {matchingJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {matchingJobs.map((job, index) => (
                    <div key={`${job.title}-${job.company}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Match #{index + 1}</p>
                          <h3 className="mt-1 text-base font-bold text-slate-900 leading-tight">{job.title}</h3>
                          <p className="mt-1 text-sm text-slate-600">{job.company}</p>
                        </div>
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                          {job.compatibility}%
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-700 line-clamp-3">{job.reason}</p>
                      <Link
                        href={`/jobs?q=${encodeURIComponent(job.title)}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-800"
                      >
                        View similar jobs
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">Upload a resume to generate multiple matching jobs.</p>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
