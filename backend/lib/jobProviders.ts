import { JobListing } from '../types';

type FetchJobsInput = {
  query?: string;
  type?: string;
};

type RapidApiJob = {
  job_id?: string;
  job_title?: string;
  employer_name?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_is_remote?: boolean;
  job_employment_type?: string;
  job_description?: string;
  job_posted_at_datetime_utc?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_required_skills?: string[];
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
};

function normalizeJobType(job: RapidApiJob): JobListing['jobType'] {
  if (job.job_is_remote) return 'WFH';
  const employmentType = (job.job_employment_type || '').toLowerCase();
  if (employmentType.includes('hybrid')) return 'Hybrid';
  return 'WFO';
}

function mapRapidApiJob(job: RapidApiJob, index: number): JobListing {
  const locationParts = [job.job_city, job.job_state, job.job_country].filter(Boolean);
  const description = job.job_description || 'No description available.';

  const inferredSkills =
    job.job_required_skills && job.job_required_skills.length > 0
      ? job.job_required_skills
      : (job.job_highlights?.Qualifications || [])
          .flatMap((q) => q.split(/[,|/]/))
          .map((s) => s.trim())
          .filter((s) => s.length > 1)
          .slice(0, 8);

  return {
    id: job.job_id || `rapid-${index}`,
    title: job.job_title || 'Untitled role',
    company: job.employer_name || 'Unknown company',
    location: locationParts.length > 0 ? locationParts.join(', ') : 'Not specified',
    jobType: normalizeJobType(job),
    salaryRange:
      typeof job.job_min_salary === 'number' && typeof job.job_max_salary === 'number'
        ? { min: Math.round(job.job_min_salary / 1000), max: Math.round(job.job_max_salary / 1000) }
        : undefined,
    workingHours: 'As per company policy',
    description,
    requiredSkills: inferredSkills.length > 0 ? inferredSkills : ['Communication', 'Problem Solving'],
    preferredSkills: [],
    experience: undefined,
    postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
    deadline: undefined,
    benefits: job.job_highlights?.Benefits || [],
    workingConditions: job.job_is_remote ? 'Remote-friendly role' : 'On-site / hybrid as per company',
  };
}

export async function fetchRapidApiJobs({ query, type }: FetchJobsInput): Promise<JobListing[]> {
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  const rapidApiHost = process.env.RAPIDAPI_HOST || 'jsearch.p.rapidapi.com';

  if (!rapidApiKey) {
    return [];
  }

  const q = query?.trim() || 'developer jobs in india';
  const params = new URLSearchParams({
    query: q,
    page: '1',
    num_pages: '1',
    date_posted: 'all',
  });

  try {
    const response = await fetch(`https://${rapidApiHost}/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': rapidApiHost,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('RapidAPI jobs fetch failed', response.status);
      return [];
    }

    const data = (await response.json()) as { data?: RapidApiJob[] };
    let jobs = (data.data || []).map(mapRapidApiJob);

    if (type) {
      jobs = jobs.filter((job) => job.jobType === type);
    }

    return jobs;
  } catch (error) {
    console.error('RapidAPI jobs error:', error);
    return [];
  }
}
