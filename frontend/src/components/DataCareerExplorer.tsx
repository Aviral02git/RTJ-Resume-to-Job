'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  Brain,
  CheckCircle2,
  Circle,
  Layers3,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';

type SkillCategory = {
  name: string;
  skills: string[];
};

type Role = {
  title: string;
  required: string[];
  bonus: string[];
  salaryIndiaLPA: string;
  roadmap: string[];
};

const skillCategories: SkillCategory[] = [
  {
    name: 'Analytics & Reporting',
    skills: [
      'Excel',
      'SQL',
      'Power BI',
      'Tableau',
      'Looker Studio',
      'DAX',
      'A/B Testing',
    ],
  },
  {
    name: 'Programming & Manipulation',
    skills: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'R'],
  },
  {
    name: 'AI & Machine Learning',
    skills: [
      'Statistics',
      'Machine Learning',
      'Deep Learning',
      'NLP',
      'Computer Vision',
    ],
  },
  {
    name: 'Data Engineering',
    skills: [
      'Data Modeling',
      'ETL',
      'Spark',
      'Airflow',
      'Kafka',
      'dbt',
      'Git / Version Control',
      'System Design',
    ],
  },
  {
    name: 'Cloud & Strategy',
    skills: [
      'AWS',
      'Azure',
      'GCP',
      'GenAI / LLMs',
      'MLOps',
      'Docker',
      'Agile / Scrum',
      'Data Governance',
    ],
  },
];

const roles: Role[] = [
  {
    title: 'Data Analyst',
    required: ['Excel', 'SQL', 'Power BI', 'Statistics'],
    bonus: ['Python', 'A/B Testing', 'Tableau'],
    salaryIndiaLPA: '6-12 LPA',
    roadmap: [
      'Week 1: Strengthen SQL joins, windows, and CTEs',
      'Week 2: Build 2 dashboard case studies in Power BI/Tableau',
      'Week 3: Practice A/B testing and metrics storytelling',
      'Week 4: Mock interviews + portfolio polish',
    ],
  },
  {
    title: 'Business Intelligence Analyst',
    required: ['SQL', 'Power BI', 'Tableau', 'DAX'],
    bonus: ['Excel', 'Data Governance', 'Looker Studio'],
    salaryIndiaLPA: '8-15 LPA',
    roadmap: [
      'Week 1: Dimensional modeling fundamentals',
      'Week 2: Advanced DAX measures and KPIs',
      'Week 3: Executive storytelling decks',
      'Week 4: End-to-end BI project with documentation',
    ],
  },
  {
    title: 'Product Analyst',
    required: ['SQL', 'A/B Testing', 'Statistics', 'Python'],
    bonus: ['Power BI', 'Pandas', 'Agile / Scrum'],
    salaryIndiaLPA: '10-18 LPA',
    roadmap: [
      'Week 1: Product metrics and funnels',
      'Week 2: Experiment design and causal inference basics',
      'Week 3: Cohort and retention analysis notebook',
      'Week 4: Product case interview drills',
    ],
  },
  {
    title: 'Data Scientist',
    required: ['Python', 'Pandas', 'Statistics', 'Machine Learning'],
    bonus: ['Deep Learning', 'NLP', 'Matplotlib'],
    salaryIndiaLPA: '12-25 LPA',
    roadmap: [
      'Week 1: Feature engineering + model validation',
      'Week 2: Regression/classification project',
      'Week 3: Explainability and error analysis',
      'Week 4: Deploy model demo + interview prep',
    ],
  },
  {
    title: 'Machine Learning Engineer',
    required: ['Python', 'Machine Learning', 'Docker', 'MLOps'],
    bonus: ['AWS', 'System Design', 'Spark'],
    salaryIndiaLPA: '14-28 LPA',
    roadmap: [
      'Week 1: Pipeline design and packaging',
      'Week 2: Model serving and monitoring basics',
      'Week 3: CI/CD for ML with Docker',
      'Week 4: Scalability and reliability interview prep',
    ],
  },
  {
    title: 'NLP Engineer',
    required: ['Python', 'NLP', 'Machine Learning', 'Deep Learning'],
    bonus: ['GenAI / LLMs', 'MLOps', 'Docker'],
    salaryIndiaLPA: '15-30 LPA',
    roadmap: [
      'Week 1: Text processing and embeddings',
      'Week 2: Transformer fine-tuning mini-project',
      'Week 3: Prompting, evaluation, and safety basics',
      'Week 4: Build + deploy an NLP assistant',
    ],
  },
  {
    title: 'Computer Vision Engineer',
    required: ['Python', 'Computer Vision', 'Deep Learning', 'Statistics'],
    bonus: ['MLOps', 'Docker', 'AWS'],
    salaryIndiaLPA: '15-30 LPA',
    roadmap: [
      'Week 1: CNN architecture and image augmentation',
      'Week 2: Detection/segmentation project',
      'Week 3: Model optimization and inference speed',
      'Week 4: Deploy CV API + interview revision',
    ],
  },
  {
    title: 'Data Engineer',
    required: ['SQL', 'ETL', 'Data Modeling', 'Spark'],
    bonus: ['Airflow', 'Kafka', 'dbt'],
    salaryIndiaLPA: '10-22 LPA',
    roadmap: [
      'Week 1: Data warehouse modeling',
      'Week 2: Build ETL with orchestration',
      'Week 3: Spark performance tuning basics',
      'Week 4: Streaming mini-project + interview prep',
    ],
  },
  {
    title: 'Analytics Engineer',
    required: ['SQL', 'dbt', 'Data Modeling', 'Data Governance'],
    bonus: ['Power BI', 'Airflow', 'Python'],
    salaryIndiaLPA: '10-20 LPA',
    roadmap: [
      'Week 1: ELT and semantic layer concepts',
      'Week 2: dbt tests, macros, and docs',
      'Week 3: Analytics-ready marts + BI layer',
      'Week 4: Production readiness checklist',
    ],
  },
  {
    title: 'BI Developer',
    required: ['Power BI', 'DAX', 'SQL', 'Data Modeling'],
    bonus: ['Tableau', 'Excel', 'Looker Studio'],
    salaryIndiaLPA: '7-14 LPA',
    roadmap: [
      'Week 1: Star schema and optimization',
      'Week 2: Advanced DAX and calculated tables',
      'Week 3: Interactive dashboards and UX',
      'Week 4: Domain project and hiring prep',
    ],
  },
  {
    title: 'Data Architect',
    required: ['Data Modeling', 'System Design', 'Data Governance', 'AWS'],
    bonus: ['Spark', 'dbt', 'Kafka'],
    salaryIndiaLPA: '20-40 LPA',
    roadmap: [
      'Week 1: Lakehouse and warehouse patterns',
      'Week 2: Governance, quality, and lineage',
      'Week 3: Cost/performance architecture trade-offs',
      'Week 4: Architecture case studies',
    ],
  },
  {
    title: 'MLOps Engineer',
    required: ['MLOps', 'Docker', 'AWS', 'Machine Learning'],
    bonus: ['Kubernetes', 'Python', 'System Design'],
    salaryIndiaLPA: '16-35 LPA',
    roadmap: [
      'Week 1: Experiment tracking and registry',
      'Week 2: Model serving and observability',
      'Week 3: CI/CD and infrastructure fundamentals',
      'Week 4: End-to-end deployment capstone',
    ],
  },
  {
    title: 'Cloud Data Engineer',
    required: ['AWS', 'SQL', 'ETL', 'Spark'],
    bonus: ['Azure', 'GCP', 'Airflow'],
    salaryIndiaLPA: '12-26 LPA',
    roadmap: [
      'Week 1: Cloud storage and compute basics',
      'Week 2: Build managed ETL pipelines',
      'Week 3: Security and cost optimization',
      'Week 4: Cloud architecture interview prep',
    ],
  },
  {
    title: 'Data Product Manager',
    required: ['SQL', 'Agile / Scrum', 'Data Governance', 'A/B Testing'],
    bonus: ['Python', 'Power BI', 'GenAI / LLMs'],
    salaryIndiaLPA: '18-35 LPA',
    roadmap: [
      'Week 1: Product lifecycle and data strategy',
      'Week 2: Prioritization and impact metrics',
      'Week 3: Stakeholder communication simulations',
      'Week 4: PM case interviews',
    ],
  },
  {
    title: 'Risk Analyst',
    required: ['Excel', 'SQL', 'Statistics', 'Power BI'],
    bonus: ['Python', 'Tableau', 'Data Governance'],
    salaryIndiaLPA: '7-16 LPA',
    roadmap: [
      'Week 1: Risk metrics and probability',
      'Week 2: Monitoring dashboard build',
      'Week 3: Scenario analysis and stress testing',
      'Week 4: Domain interview prep',
    ],
  },
  {
    title: 'Marketing Analyst',
    required: ['Excel', 'SQL', 'A/B Testing', 'Looker Studio'],
    bonus: ['Python', 'Power BI', 'Statistics'],
    salaryIndiaLPA: '6-14 LPA',
    roadmap: [
      'Week 1: Campaign funnel analytics',
      'Week 2: Attribution and experiment analysis',
      'Week 3: Dashboard and narrative reporting',
      'Week 4: Portfolio with marketing case',
    ],
  },
  {
    title: 'Generative AI Specialist',
    required: ['Python', 'GenAI / LLMs', 'NLP', 'Machine Learning'],
    bonus: ['MLOps', 'Docker', 'AWS'],
    salaryIndiaLPA: '18-40 LPA',
    roadmap: [
      'Week 1: LLM foundations and prompting',
      'Week 2: RAG and retrieval workflows',
      'Week 3: Evaluation and guardrails',
      'Week 4: Build a production-ready GenAI demo',
    ],
  },
];

function getCompatibility(role: Role, selectedSkills: Set<string>) {
  const requiredMatches = role.required.filter((skill) => selectedSkills.has(skill));
  const bonusMatches = role.bonus.filter((skill) => selectedSkills.has(skill));

  const requiredScore = (requiredMatches.length / role.required.length) * 75;
  const bonusScore = role.bonus.length
    ? (bonusMatches.length / role.bonus.length) * 25
    : 0;

  return {
    score: Math.round(requiredScore + bonusScore),
    requiredMatches,
    bonusMatches,
    missingRequired: role.required.filter((skill) => !selectedSkills.has(skill)),
  };
}

function getScoreTone(score: number) {
  if (score >= 80) {
    return {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bar: 'from-emerald-500 to-teal-500',
      accent: 'text-emerald-700',
      surface: 'bg-emerald-50/80 border-emerald-100',
      label: 'Strong fit',
    };
  }

  if (score >= 55) {
    return {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      bar: 'from-amber-400 to-orange-500',
      accent: 'text-amber-700',
      surface: 'bg-amber-50/80 border-amber-100',
      label: 'Promising fit',
    };
  }

  return {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    bar: 'from-slate-400 to-slate-600',
    accent: 'text-slate-700',
    surface: 'bg-slate-100 border-slate-200',
    label: 'Longer path',
  };
}

export default function DataCareerExplorer() {
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [analysisRun, setAnalysisRun] = useState(false);

  const results = useMemo(() => {
    return roles
      .map((role) => {
        const compatibility = getCompatibility(role, selectedSkills);
        return { role, ...compatibility };
      })
      .sort((a, b) => b.score - a.score);
  }, [selectedSkills]);

  const topRole = results[0];

  const toggleSkill = (skill: string) => {
    setAnalysisRun(false);
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) {
        next.delete(skill);
      } else {
        next.add(skill);
      }
      return next;
    });
  };

  const clearSelections = () => {
    setSelectedSkills(new Set());
    setAnalysisRun(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-12"
      >
        <div className="grid items-end gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
              <Sparkles className="h-4 w-4" />
              Data Career Explorer
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Discover your best-fit data career path
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Select your current skills and get a cleaner, wider career analysis with role fit, salary range, and a focused 30-day plan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
              <p className="text-sm font-medium text-slate-500">Roles analyzed</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">17</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
              <p className="text-sm font-medium text-slate-500">Skills selected</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{selectedSkills.size}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
              <p className="text-sm font-medium text-slate-500">Top compatibility</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {analysisRun ? `${topRole?.score ?? 0}%` : '--'}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <section
        id="skills"
        className="mt-10 rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8"
      >
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Step 1</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Select your current stack</h2>
            <p className="mt-2 text-sm text-slate-600">
              Pick the skills you can already demonstrate through projects, internships, or work.
            </p>
          </div>
          <button
            type="button"
            onClick={clearSelections}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Clear selections
          </button>
        </div>

        <div className="space-y-7">
          {skillCategories.map((category) => (
            <div key={category.name} className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {category.name}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {category.skills.map((skill) => {
                  const selected = selectedSkills.has(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        selected
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setAnalysisRun(true)}
            disabled={selectedSkills.size === 0}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Run Career Analysis
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-sm text-slate-500">
            The analysis updates after you lock in a skill set.
          </p>
        </div>
      </section>

      {analysisRun && (
        <motion.section
          id="roles"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10 space-y-8"
        >
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
              <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(15,23,42,0.04),rgba(59,130,246,0.08))] p-6 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Top recommendation
                </p>
                <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h3 className="text-3xl font-semibold tracking-tight text-slate-900">
                      {topRole.role.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                      Your current stack aligns best with this role right now, making it the strongest near-term path to pursue.
                    </p>
                  </div>
                  <div className={`rounded-3xl border px-5 py-4 ${getScoreTone(topRole.score).surface}`}>
                    <p className="text-sm font-medium text-slate-500">Compatibility</p>
                    <p className="mt-2 text-4xl font-semibold text-slate-900">{topRole.score}%</p>
                    <p className={`mt-1 text-sm font-semibold ${getScoreTone(topRole.score).accent}`}>
                      {getScoreTone(topRole.score).label}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <BriefcaseBusiness className="h-4 w-4" />
                      Role
                    </div>
                    <p className="mt-2 text-base font-semibold text-slate-900">{topRole.role.title}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <TrendingUp className="h-4 w-4" />
                      Salary benchmark
                    </div>
                    <p className="mt-2 text-base font-semibold text-slate-900">{topRole.role.salaryIndiaLPA}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <Layers3 className="h-4 w-4" />
                      Matched required skills
                    </div>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {results[0].requiredMatches.length} of {topRole.role.required.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-slate-700" />
                    <h4 className="text-lg font-semibold text-slate-900">Fit snapshot</h4>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getScoreTone(topRole.score).bar}`}
                      style={{ width: `${topRole.score}%` }}
                    />
                  </div>
                  <div className="mt-5 space-y-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Matched skills
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {results[0].requiredMatches.length > 0 ? (
                          results[0].requiredMatches.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">No required matches yet.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                        Priority gaps
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {results[0].missingRequired.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700"
                          >
                            <Circle className="h-3.5 w-3.5" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-slate-700" />
                    <h4 className="text-lg font-semibold text-slate-900">30-day preparation roadmap</h4>
                  </div>
                  <div className="mt-5 grid gap-3">
                    {topRole.role.roadmap.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                        <p className="text-sm leading-6 text-slate-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.06)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Step 2
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Compare alternate paths</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                You still have multiple viable directions. Use these cards to compare role strength, salary range, and missing skills at a glance.
              </p>

              <div className="mt-6 grid gap-4">
                {results.slice(1, 4).map(({ role, score }) => (
                  <div key={role.title} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-base font-semibold text-slate-900">{role.title}</h4>
                        <p className="mt-1 text-sm text-slate-500">{role.salaryIndiaLPA}</p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getScoreTone(score).badge}`}>
                        {score}% fit
                      </span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getScoreTone(score).bar}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Full ranking
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Role recommendations</h3>
              </div>
              <p className="text-sm text-slate-500">Wider cards make the analysis easier to scan and compare.</p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
              {results.slice(0, 8).map(({ role, score, requiredMatches, missingRequired }) => (
                <article key={role.title} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-semibold text-slate-900">{role.title}</h4>
                      <p className="mt-1 text-sm text-slate-500">Salary benchmark: {role.salaryIndiaLPA}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${getScoreTone(score).badge}`}>
                      {score}% fit
                    </span>
                  </div>

                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getScoreTone(score).bar}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Matched skills
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {requiredMatches.length > 0 ? (
                          requiredMatches.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">No required matches yet</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                        Skill gaps
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {missingRequired.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-700"
                          >
                            <Circle className="h-3.5 w-3.5" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
