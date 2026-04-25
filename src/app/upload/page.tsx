'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, LayoutGrid, BrainCircuit } from 'lucide-react';
import ResumeUpload from '../../components/ResumeUpload';

const highlights = [
  {
    icon: BrainCircuit,
    title: 'AI parsing',
    description: 'Extracts skills, experience, projects, and education from your resume.',
  },
  {
    icon: LayoutGrid,
    title: 'Job matching',
    description: 'Compares your profile against openings and highlights the best fits.',
  },
  {
    icon: Sparkles,
    title: 'Resume fit tips',
    description: 'Shows what to improve for specific companies and roles.',
  },
  {
    icon: ShieldCheck,
    title: 'Calm workflow',
    description: 'Clean, student-friendly interface designed to reduce stress.',
  },
];

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#ffffff_40%,#f8f4ff_100%)]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start"
        >
          <div>
            <div className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-100 backdrop-blur">
              Upload resume · AI compatibility · Job fit
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight text-slate-900">
              Upload your resume and discover better opportunities
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600">
              Get compatibility scores, resume-fit suggestions, and a personalized preparation blueprint for internships and jobs.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/85 p-4 sm:p-6 shadow-[0_30px_80px_rgba(15,23,42,0.14)] backdrop-blur">
            <ResumeUpload />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
