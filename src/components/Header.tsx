'use client';

import Link from 'next/link';
import { BarChart3, LayoutDashboard, Menu, BriefcaseBusiness, Upload, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 transition-transform group-hover:scale-105">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              CareerMatch AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
            >
              <BarChart3 className="w-5 h-5" />
              Home
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
            >
              <Upload className="w-5 h-5" />
              Upload
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/jobs"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
            >
              <BriefcaseBusiness className="w-5 h-5" />
              Jobs
            </Link>
            <Link
              href="/upload"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Analyze Resume
            </Link>
          </div>

          <button
            className="rounded-lg p-2 transition-colors hover:bg-slate-100 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="space-y-3 pb-4 md:hidden animate-in slide-in-from-top-2">
            <Link
              href="/"
              className="block rounded-xl px-4 py-2 text-slate-700 transition-colors hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              href="/upload"
              className="block rounded-xl px-4 py-2 text-slate-700 transition-colors hover:bg-slate-100"
            >
              Upload
            </Link>
            <Link
              href="/dashboard"
              className="block rounded-xl px-4 py-2 text-slate-700 transition-colors hover:bg-slate-100"
            >
              Dashboard
            </Link>
            <Link
              href="/jobs"
              className="block rounded-xl px-4 py-2 text-slate-700 transition-colors hover:bg-slate-100"
            >
              Jobs
            </Link>
            <Link
              href="/upload"
              className="block rounded-xl bg-slate-900 px-4 py-2 font-medium text-white"
            >
              Analyze Resume
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
