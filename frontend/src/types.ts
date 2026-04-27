export interface CompanyReviews {
  overallRating: number;
  reviewCount: number;
}

export interface SalaryRange {
  min: number;
  max: number;
}

export interface JobListing {
  id: string | number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salaryRange?: SalaryRange;
  stipend?: number | string;
  companyReviews?: CompanyReviews;
  requiredSkills: string[];
}

export interface CompatibilityScore {
  overallScore: number;
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  gaps: string[];
}
