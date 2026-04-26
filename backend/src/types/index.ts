// Type definitions for RTJ Backend

export type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: 'WFO' | 'WFH' | 'Hybrid';
  description: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  experience?: string;
  salaryRange?: { min: number; max: number };
  postedDate?: string;
  deadline?: string;
  url?: string;
};

export type ResumeData = {
  text: string;
  skills: string[];
  keywords: string[];
  parseWarning?: string;
};

export type AnalysisResult = {
  overallScore: number;
  summary: string;
  topStrengths: string[];
  keyGaps: string[];
  recommendations: Recommendation[];
  actionPlan: ActionItem[];
  skillRoadmaps: SkillRoadmap[];
  projectIdeas: ProjectIdea[];
};

export type Recommendation = {
  title: string;
  company?: string;
  compatibility: number;
  matchedSkills: string[];
  missingSkills: string[];
  reason?: string;
};

export type ActionItem = {
  step: number;
  skill: string;
  timeframe: string;
  activity: string;
};

export type SkillRoadmap = {
  skill: string;
  targetLevel: string;
  estimatedDuration: string;
  milestones: Milestone[];
};

export type Milestone = {
  week: string;
  title: string;
  outcome: string;
  resources?: LearningResource[];
};

export type LearningResource = {
  title: string;
  type: string;
  url?: string;
};

export type ProjectIdea = {
  title: string;
  difficulty: string;
  impact: string;
  description: string;
  resumeBullet: string;
};

export type PreparationPlan = {
  step: number;
  skill: string;
  timeframe: string;
  resources: LearningResource[];
};

export type Improvement = {
  area: string;
  current: string;
  target: string;
  steps: string[];
};
