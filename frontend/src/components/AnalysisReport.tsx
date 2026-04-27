'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Target, TrendingUp, Zap, BookOpen,
  Briefcase, Star, ChevronDown, ChevronUp, Award, BarChart3,
  Clock, ArrowRight, FileText, Layers, Sparkles, AlertTriangle,
  ExternalLink, Trophy, Brain,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export type AnalysisData = {
  overallScore: number;
  summary: string;
  topStrengths: string[];
  keyGaps: string[];
  recommendations: Array<{
    jobId?: string;
    title: string;
    company: string;
    compatibility: number;
    matchedSkills?: string[];
    missingSkills?: string[];
    reason: string;
  }>;
  actionPlan: Array<{
    step: number;
    skill: string;
    timeframe: string;
    activity: string;
  }>;
  resumeHighlights?: string[];
  resumeInsights?: Array<{
    icon: string;
    label: string;
    value: string;
    detail?: string;
  }>;
};

/* ─── Score Ring ─── */
function ScoreRing({ score }: { score: number }) {
  const r = 60;
  const circ = 2 * Math.PI * r;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const glow = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Good Match' : 'Needs Work';
  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg className="absolute inset-0 -rotate-90" width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
        <motion.circle
          cx="80" cy="80" r={r} fill="none"
          stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (score / 100) * circ }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 0.4 }}
          style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
        />
      </svg>
      <div className="flex flex-col items-center text-center">
        <motion.span
          className="text-4xl font-black text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
        >
          {score}%
        </motion.span>
        <span className="text-xs font-semibold mt-0.5" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}

/* ─── Skill Pill ─── */
function Pill({ label, variant }: { label: string; variant: 'strength' | 'gap' | 'matched' | 'missing' | 'neutral' }) {
  const styles = {
    strength: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 ring-emerald-500/20',
    gap:      'bg-rose-500/15 text-rose-300 border-rose-500/30 ring-rose-500/20',
    matched:  'bg-sky-500/15 text-sky-300 border-sky-500/30 ring-sky-500/20',
    missing:  'bg-amber-500/15 text-amber-300 border-amber-500/30 ring-amber-500/20',
    neutral:  'bg-white/10 text-slate-300 border-white/20 ring-white/10',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${styles[variant]}`}>
      {label}
    </span>
  );
}

/* ─── Animated Bar ─── */
function Bar({ score, delay = 0 }: { score: number; delay?: number }) {
  const color = score >= 75 ? 'from-emerald-400 to-emerald-600' : score >= 50 ? 'from-amber-400 to-orange-500' : 'from-rose-400 to-rose-600';
  return (
    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.9, ease: 'easeOut', delay }}
        style={{ boxShadow: score >= 75 ? '0 0 8px rgba(16,185,129,0.5)' : score >= 50 ? '0 0 8px rgba(245,158,11,0.5)' : '0 0 8px rgba(239,68,68,0.4)' }}
      />
    </div>
  );
}

/* ─── Score category pill ─── */
function ScoreCategory({ label, score, icon: Icon }: { label: string; score: number; icon: React.ComponentType<{ className?: string }> }) {
  const color = score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400';
  return (
    <div className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-4">
      <Icon className={`w-5 h-5 ${color}`} />
      <div className={`text-2xl font-black ${color}`}>{score}%</div>
      <div className="text-xs text-slate-400 font-medium text-center">{label}</div>
    </div>
  );
}

/* ─── Job Card ─── */
function JobRecommendCard({ rec, index }: { rec: AnalysisData['recommendations'][0]; index: number }) {
  const [open, setOpen] = useState(false);
  const scoreColor = rec.compatibility >= 75 ? 'text-emerald-400' : rec.compatibility >= 50 ? 'text-amber-400' : 'text-rose-400';
  const scoreBorder = rec.compatibility >= 75 ? 'border-emerald-500/30' : rec.compatibility >= 50 ? 'border-amber-500/30' : 'border-rose-500/30';
  const scoreBg = rec.compatibility >= 75 ? 'bg-emerald-500/10' : rec.compatibility >= 50 ? 'bg-amber-500/10' : 'bg-rose-500/10';
  const tier = rec.compatibility >= 75 ? { label: 'Best Fit', cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
    : rec.compatibility >= 50 ? { label: 'Good Match', cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }
    : { label: 'Stretch', cls: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden hover:border-white/20 transition-all hover:bg-white/8"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${tier.cls}`}>{tier.label}</span>
            </div>
            <p className="font-bold text-white text-base leading-tight">{rec.title}</p>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> {rec.company}
            </p>
          </div>
          <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${scoreBg} border ${scoreBorder} flex items-center justify-center`}>
            <span className={`text-lg font-black ${scoreColor}`}>{rec.compatibility}%</span>
          </div>
        </div>

        <div className="mt-3">
          <Bar score={rec.compatibility} delay={0.1 * index} />
        </div>

        <p className="mt-3 text-xs text-slate-400 leading-relaxed">{rec.reason}</p>

        {((rec.matchedSkills?.length ?? 0) > 0 || (rec.missingSkills?.length ?? 0) > 0) && (
          <button
            onClick={() => setOpen(!open)}
            className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {open ? 'Hide' : 'Skill breakdown'}
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-3 border-t border-white/8 space-y-3">
              {rec.matchedSkills && rec.matchedSkills.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> You have ({rec.matchedSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.matchedSkills.map(s => <Pill key={s} label={s} variant="matched" />)}
                  </div>
                </div>
              )}
              {rec.missingSkills && rec.missingSkills.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> To develop ({rec.missingSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.missingSkills.map(s => <Pill key={s} label={s} variant="missing" />)}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Section wrapper ─── */
function Section({ title, subtitle, icon: Icon, children, delay = 0 }: {
  title: string; subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white text-base sm:text-lg">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

/* ─── Client-side Insights Generator ─── */
type InsightItem = { icon: React.ComponentType<{ className?: string }>; color: string; label: string; value: string; detail?: string };

function generateInsights(analysis: AnalysisData): InsightItem[] {
  const items: InsightItem[] = [];
  const { topStrengths, keyGaps, recommendations, actionPlan, overallScore, resumeInsights } = analysis;

  // If API returned structured insights, use them with proper icon mapping
  if (resumeInsights && resumeInsights.length > 0) {
    const iconLookup: Record<string, React.ComponentType<{ className?: string }>> = {
      graduation: Award, briefcase: Briefcase, code: Layers, folder: BookOpen,
      target: Target, check: CheckCircle2, award: Trophy, link: ExternalLink, zap: Zap,
    };
    const colorLookup: Record<string, string> = {
      graduation: 'text-indigo-400', briefcase: 'text-sky-400', code: 'text-emerald-400',
      folder: 'text-purple-400', target: 'text-amber-400', check: 'text-emerald-400',
      award: 'text-yellow-400', link: 'text-cyan-400', zap: 'text-orange-400',
    };
    for (const ins of resumeInsights) {
      items.push({
        icon: iconLookup[ins.icon] || Star,
        color: colorLookup[ins.icon] || 'text-indigo-400',
        label: ins.label,
        value: ins.value,
        detail: ins.detail,
      });
    }
    return items;
  }

  // Otherwise, generate insights from analysis data directly
  // 1. Overall profile tier
  const tier = overallScore >= 80 ? 'Strong' : overallScore >= 55 ? 'Competitive' : overallScore >= 30 ? 'Growing' : 'Early Stage';
  items.push({
    icon: Trophy,
    color: overallScore >= 70 ? 'text-emerald-400' : overallScore >= 45 ? 'text-amber-400' : 'text-rose-400',
    label: 'Profile Tier',
    value: `${tier} — ${overallScore}% overall market fit`,
    detail: overallScore >= 70
      ? 'Your profile stands out for current openings'
      : 'Focused upskilling will significantly improve your positioning',
  });

  // 2. Technical strengths
  if (topStrengths.length > 0) {
    items.push({
      icon: Sparkles,
      color: 'text-emerald-400',
      label: 'Core Strengths',
      value: `${topStrengths.length} skills matched across job listings`,
      detail: topStrengths.slice(0, 6).join(' · '),
    });
  }

  // 3. Top matched role
  const topRec = recommendations[0];
  if (topRec) {
    items.push({
      icon: Briefcase,
      color: 'text-sky-400',
      label: 'Best Role Match',
      value: `${topRec.title} at ${topRec.company} — ${topRec.compatibility}% fit`,
      detail: topRec.matchedSkills && topRec.matchedSkills.length > 0
        ? `Matched: ${topRec.matchedSkills.slice(0, 4).join(', ')}`
        : undefined,
    });
  }

  // 4. Skill gaps to close
  if (keyGaps.length > 0) {
    items.push({
      icon: Target,
      color: 'text-amber-400',
      label: 'Priority Gaps',
      value: `${keyGaps.length} technical skill${keyGaps.length > 1 ? 's' : ''} to develop`,
      detail: keyGaps.slice(0, 4).join(' · '),
    });
  }

  // 5. Readiness assessment
  const matchedCount = recommendations.filter(r => r.compatibility >= 60).length;
  items.push({
    icon: BarChart3,
    color: 'text-indigo-400',
    label: 'Job Readiness',
    value: `Ready for ${matchedCount} of ${recommendations.length} roles at ≥60% fit`,
    detail: matchedCount >= 3
      ? 'Strong position — start applying to top matches'
      : 'Build 1-2 portfolio projects targeting your gap skills',
  });

  // 6. Action plan summary
  if (actionPlan.length > 0) {
    const firstSkill = actionPlan[0]?.skill;
    const totalWeeks = actionPlan.length <= 2 ? '2-3' : actionPlan.length <= 4 ? '4-6' : '6-8';
    items.push({
      icon: Zap,
      color: 'text-orange-400',
      label: 'Quick Win',
      value: `Start with ${firstSkill} — biggest impact in shortest time`,
      detail: `Full roadmap: ${actionPlan.length} steps over ~${totalWeeks} weeks`,
    });
  }

  return items;
}

function InsightsSection({ analysis }: { analysis: AnalysisData }) {
  const insights = generateInsights(analysis);
  if (insights.length === 0) return null;

  return (
    <Section title="Resume Insights" subtitle="Key findings and recommendations" icon={FileText} delay={0.5}>
      <div className="grid gap-3 sm:grid-cols-2">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.04 }}
              className="flex gap-3.5 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors"
            >
              <div className={`flex-shrink-0 w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center ${insight.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{insight.label}</p>
                <p className="text-[13px] font-semibold text-white mt-0.5 leading-snug">{insight.value}</p>
                {insight.detail && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{insight.detail}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

/* ─── Main export ─── */
export default function AnalysisReport({ analysis, fileName }: { analysis: AnalysisData; fileName?: string }) {
  const bestFit = analysis.recommendations.filter(r => r.compatibility >= 70);
  const goodMatch = analysis.recommendations.filter(r => r.compatibility >= 40 && r.compatibility < 70);
  const stretch = analysis.recommendations.filter(r => r.compatibility < 40);

  // Derive score categories
  const skillsScore = Math.min(100, analysis.topStrengths.length * 10 + (analysis.topStrengths.length > 0 ? 20 : 0));
  const jobFitScore = analysis.overallScore;
  const gapScore = Math.max(0, 100 - analysis.keyGaps.length * 12);
  const readinessScore = Math.round((skillsScore + jobFitScore + gapScore) / 3);

  const encodedSkills = encodeURIComponent(analysis.topStrengths.slice(0, 3).join(' '));

  return (
    <div className="w-full space-y-6">
      {/* ── Dark hero banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        }}
      >
        {/* Glowing orbs */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-indigo-600 rounded-full opacity-20 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600 rounded-full opacity-15 blur-[60px] pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 justify-between">
            {/* Left content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Intelligence Report</span>
              </div>

              {fileName && (
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-400 truncate">{fileName}</span>
                </div>
              )}

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Resume Intelligence
              </h2>
              <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
                {analysis.summary}
              </p>

              {/* Stats row */}
              <div className="mt-5 flex flex-wrap gap-3">
                {[
                  { icon: Briefcase, label: `${analysis.recommendations.length} jobs matched` },
                  { icon: Star, label: `${analysis.topStrengths.length} strengths` },
                  { icon: Zap, label: `${analysis.actionPlan.length} action steps` },
                  { icon: AlertTriangle, label: `${analysis.keyGaps.length} skill gaps` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-3 py-1.5 text-xs font-semibold text-white border border-white/15">
                    <Icon className="w-3.5 h-3.5 text-indigo-300" />
                    {label}
                  </div>
                ))}
              </div>

              {/* CTA links */}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/jobs?q=${encodedSkills}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-900/50"
                >
                  <Briefcase className="w-4 h-4" /> Browse Matched Jobs
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 px-4 py-2 text-sm font-bold text-white transition-all"
                >
                  <Brain className="w-4 h-4" /> Skills Explorer
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Score ring */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <ScoreRing score={analysis.overallScore} />
              <p className="text-xs text-slate-400 font-medium">Overall Fit Score</p>
            </div>
          </div>

          {/* Score category row */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ScoreCategory label="Skills Match" score={skillsScore} icon={Sparkles} />
            <ScoreCategory label="Job Fit" score={jobFitScore} icon={Target} />
            <ScoreCategory label="Gap Score" score={gapScore} icon={TrendingUp} />
            <ScoreCategory label="Readiness" score={readinessScore} icon={Trophy} />
          </div>
        </div>
      </motion.div>

      {/* ── Dark container for rest of report ── */}
      <div
        className="rounded-3xl p-6 sm:p-8 space-y-6"
        style={{ background: 'linear-gradient(180deg,#12121e 0%,#0d0d1a 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Strengths + Gaps row */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Strengths */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white">Your Strengths</h3>
              <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                {analysis.topStrengths.length} skills
              </span>
            </div>
            {analysis.topStrengths.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.topStrengths.map(s => <Pill key={s} label={s} variant="strength" />)}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No specific strengths detected — upload a clearer PDF.</p>
            )}
          </motion.div>

          {/* Gaps */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-white">Skill Gaps</h3>
              <span className="ml-auto text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-semibold">
                {analysis.keyGaps.length} gaps
              </span>
            </div>
            {analysis.keyGaps.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.keyGaps.map(s => <Pill key={s} label={s} variant="gap" />)}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No major skill gaps — strong profile!</p>
            )}
          </motion.div>
        </div>

        {/* Compatibility chart */}
        <Section title="Compatibility Overview" subtitle="Your fit score per role" icon={BarChart3} delay={0.25}>
          <div className="space-y-4">
            {analysis.recommendations.map((rec, i) => {
              const color = rec.compatibility >= 75 ? 'text-emerald-400' : rec.compatibility >= 50 ? 'text-amber-400' : 'text-rose-400';
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-40 sm:w-52 text-sm font-semibold text-slate-300 truncate flex-shrink-0">{rec.title}</div>
                  <div className="flex-1"><Bar score={rec.compatibility} delay={0.03 * i} /></div>
                  <div className={`w-10 text-right text-sm font-black flex-shrink-0 ${color}`}>{rec.compatibility}%</div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Best fit jobs */}
        {bestFit.length > 0 && (
          <Section title="Best Fit Roles" subtitle={`${bestFit.length} role${bestFit.length > 1 ? 's' : ''} with ≥70% match`} icon={Trophy} delay={0.3}>
            <div className="grid gap-4 sm:grid-cols-2">
              {bestFit.map((rec, i) => <JobRecommendCard key={i} rec={rec} index={i} />)}
            </div>
          </Section>
        )}

        {/* Good match jobs */}
        {goodMatch.length > 0 && (
          <Section title="Good Opportunities" subtitle={`${goodMatch.length} role${goodMatch.length > 1 ? 's' : ''} with 40–69% match`} icon={Target} delay={0.35}>
            <div className="grid gap-4 sm:grid-cols-2">
              {goodMatch.map((rec, i) => <JobRecommendCard key={i} rec={rec} index={i} />)}
            </div>
          </Section>
        )}

        {/* Stretch roles */}
        {stretch.length > 0 && (
          <Section title="Stretch Roles" subtitle="Achievable with focused upskilling" icon={Layers} delay={0.4}>
            <div className="grid gap-4 sm:grid-cols-2">
              {stretch.map((rec, i) => <JobRecommendCard key={i} rec={rec} index={i} />)}
            </div>
          </Section>
        )}

        {/* Action plan */}
        {analysis.actionPlan.length > 0 && (
          <Section title="Personalized Action Plan" subtitle="Step-by-step roadmap to close gaps" icon={BookOpen} delay={0.45}>
            <div className="space-y-5">
              {analysis.actionPlan.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.07 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-black flex items-center justify-center shadow-lg shadow-indigo-900/50">
                      {step.step}
                    </div>
                    {i < analysis.actionPlan.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-indigo-500/40 to-transparent mt-2 min-h-5" />
                    )}
                  </div>
                  <div className="flex-1 pb-5">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-white text-sm">{step.skill}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500 bg-white/8 px-2 py-0.5 rounded-full border border-white/10">
                        <Clock className="w-3 h-3" /> {step.timeframe}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.activity}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>
        )}

        {/* Resume Insights — always generated client-side from analysis data */}
        <InsightsSection analysis={analysis} />

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-6 text-center"
        >
          <p className="text-slate-400 text-sm mb-1">Want a sharper score?</p>
          <p className="text-white text-lg font-black mb-4">Update your resume and re-run the analysis anytime.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/jobs?q=${encodedSkills}`}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-bold text-white transition-all"
            >
              <Briefcase className="w-4 h-4" /> View Matched Jobs
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 px-5 py-2.5 text-sm font-bold text-white transition-all"
            >
              <Brain className="w-4 h-4" /> Explore Career Paths
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Analysed · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
