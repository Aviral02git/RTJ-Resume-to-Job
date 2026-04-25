export interface ResumeData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  summary?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  internships: Internship[];
  certifications?: string[];
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  skills?: string[];
  isCurrent?: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  field: string;
  graduationDate: string;
  gpa?: number;
  activities?: string[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate: string;
  endDate?: string;
}

export interface Internship {
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string;
  skills?: string[];
  stipend?: number;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: 'WFH' | 'WFO' | 'Hybrid';
  salaryRange?: {
    min: number;
    max: number;
  };
  stipend?: number;
  workingHours?: string;
  description: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  experience?: string;
  postedDate: string;
  deadline?: string;
  companyReviews?: CompanyReview;
  workingConditions?: string;
  benefits?: string[];
}

export interface CompanyReview {
  overallRating: number;
  cultureRating: number;
  workLifeBalance: number;
  compensationRating: number;
  reviewCount: number;
}

export interface CompatibilityScore {
  jobId: string;
  overallScore: number;
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  projectMatch: number;
  internshipMatch: number;
  gaps: string[];
  strengths: string[];
  preparationBlueprint: PreparationPlan[];
}

export interface PreparationPlan {
  skill: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  targetLevel: 'Intermediate' | 'Advanced' | 'Expert';
  resources: Resource[];
  estimatedHours: number;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Resource {
  title: string;
  type: 'Course' | 'Book' | 'Project' | 'Practice' | 'Blog';
  link?: string;
  duration?: string;
}

export interface ResumeFitAnalysis {
  jobId: string;
  overallFit: number;
  sections: SectionAnalysis[];
  improvements: Improvement[];
  strengths: string[];
  weaknesses: string[];
}

export interface SectionAnalysis {
  section: 'Summary' | 'Skills' | 'Experience' | 'Projects' | 'Education';
  score: number;
  feedback: string;
}

export interface Improvement {
  section: string;
  suggestion: string;
  example?: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface User {
  id: string;
  email: string;
  name: string;
  resumes: ResumeData[];
  savedJobs: string[];
  createdAt: string;
}
