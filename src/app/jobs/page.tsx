'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import JobCard from '../../components/JobCard';
import { JobListing } from '../../types';

// Backend URL configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobType, setJobType] = useState('');
  const [source, setSource] = useState<'serpapi' | 'public-fallback' | 'mock'>('mock');
  const [serpConfigured, setSerpConfigured] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (jobType) params.append('type', jobType);

        params.append('limit', '60');
        const response = await fetch(`${BACKEND_URL}/api/jobs?${params}`);
        const data = await response.json();
        setJobs(data.jobs || []);
        setSource(data.source || 'mock');
        setSerpConfigured(Boolean(data?.meta?.serpConfigured));
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchJobs, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery, jobType]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.10),transparent_35%),linear-gradient(180deg,#f8fbff_0%,#ffffff_45%,#f7f5ff_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-100 backdrop-blur">
            Hiring Platform · Smart Matching · AI Insights
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Explore opportunities that feel made for your profile
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Compare jobs, company culture, salary ranges, and fit score in one calm, modern space.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 rounded-3xl bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 backdrop-blur"
        >
          {/* Search */}
          <div className="col-span-1 md:col-span-2 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title, company, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Job Type Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full appearance-none cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3.5 text-slate-900 outline-none transition-all focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">All Job Types</option>
              <option value="WFH">Work From Home</option>
              <option value="WFO">Work From Office</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full"
            />
          </div>
        ) : (
          <>
            {(source === 'mock' || source === 'public-fallback') && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
              >
                {source === 'public-fallback'
                  ? 'Showing real jobs from a public fallback source. Configure SerpApi key for broader and fresher listings.'
                  : serpConfigured
                    ? 'SerpApi returned no jobs for this filter. Showing demo data.'
                    : 'SerpApi key not configured. Add SERPAPI_KEY in .env.local to unlock more genuine opportunities.'}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <p className="text-gray-600">
                Found <span className="font-bold text-blue-600">{jobs.length}</span> opportunities
              </p>
            </motion.div>

            {jobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  No jobs found
                </p>
                <p className="text-gray-600">
                  Try adjusting your search filters
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job, idx) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <JobCard
                      job={job}
                      onApply={() => {
                        console.log('Apply for:', job.id);
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
