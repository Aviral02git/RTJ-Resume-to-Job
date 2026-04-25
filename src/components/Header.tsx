'use client';

import Link from 'next/link';
import { BarChart3, Brain, Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 border-b border-blue-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Data Career Explorer
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#skills"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              <Brain className="w-5 h-5" />
              Skills
            </Link>
            <Link
              href="#roles"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              <Sparkles className="w-5 h-5" />
              Roles
            </Link>
            <Link
              href="#skills"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105"
            >
              Run Analysis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-blue-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-in slide-in-from-top-2">
            <Link
              href="#skills"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Skills
            </Link>
            <Link
              href="#roles"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Roles
            </Link>
            <Link
              href="#skills"
              className="block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium"
            >
              Run Analysis
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
