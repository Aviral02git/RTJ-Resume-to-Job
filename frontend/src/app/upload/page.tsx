'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, LayoutGrid, BrainCircuit } from 'lucide-react';
import ResumeUpload from '../../components/ResumeUpload';

const highlights = [
  {
    icon: BrainCircuit,
    title: 'Fast parsing',
    description: 'Pulls out skills, keywords, and job signals from your PDF in one flow.',
  },
  {
    icon: LayoutGrid,
    title: 'Clear matching',
    description: 'Shows which roles fit now and where your strongest path is emerging.',
  },
  {
    icon: Sparkles,
    title: 'Useful feedback',
    description: 'Highlights strengths, skill gaps, and practical next steps.',
  },
  {
    icon: ShieldCheck,
    title: 'Low-friction flow',
    description: 'Designed to keep the upload and review process calm and focused.',
  },
];

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.05),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#ffffff_42%,#f8fafc_100%)]">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.06)] sm:p-10">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
              Resume review workspace
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              Upload once, get a cleaner view of where your profile fits
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              This version focuses on clarity instead of decoration: upload a resume, review extracted signals, and move straight into role fit and next actions.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Input</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">PDF resume</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Output</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Role fit + roadmap</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Experience</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Minimal and focused</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm font-medium text-slate-500">
              <span>Scroll after upload to review extracted strengths and recommendations.</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-6">
            <ResumeUpload />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
