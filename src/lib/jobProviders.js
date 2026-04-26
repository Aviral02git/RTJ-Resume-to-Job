function normalizeJobTypeFromText(jobTypeText = '', isRemote = false) {
  if (isRemote) return 'WFH';
  const lower = String(jobTypeText).toLowerCase();
  if (lower.includes('hybrid')) return 'Hybrid';
  return 'WFO';
}

function dedupeJobs(jobs) {
  const seen = new Set();
  return jobs.filter((job) => {
    const key = `${String(job.title || '').toLowerCase()}|${String(job.company || '').toLowerCase()}|${String(job.location || '').toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchSerpApiJobs({ query, type, limit = 60 }) {
  const serpApiKey = (process.env.SERPAPI_KEY || '').trim();
  const serpApiEndpoint = process.env.SERPAPI_ENDPOINT || 'https://serpapi.com/search';

  if (!serpApiKey) {
    return [];
  }

  const q = query?.trim() || 'software developer jobs in india';
  const params = new URLSearchParams({
    engine: 'google_jobs',
    q,
    api_key: serpApiKey,
  });

  try {
    const response = await fetch(`${serpApiEndpoint}?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('SerpApi jobs fetch failed', response.status);
      return [];
    }

    const data = await response.json();
    const sourceItems = Array.isArray(data?.jobs_results) ? data.jobs_results : [];

    let jobs = sourceItems.map((item, index) => {
      const extensionText = Array.isArray(item?.extensions)
        ? item.extensions.join(' ')
        : '';
      const detectedText = Array.isArray(item?.detected_extensions)
        ? item.detected_extensions.join(' ')
        : '';
      const location =
        item.location ||
        item?.job_location ||
        item?.detected_extensions?.location ||
        'Not specified';
      const description = item.snippet || item.description || 'No description available.';

      const company =
        item.company_name ||
        item.source ||
        item.displayed_link ||
        item.link?.replace(/^https?:\/\//, '').split('/')[0] ||
        'Unknown company';

      const jobType = normalizeJobTypeFromText(
        `${item?.employment_type || ''} ${extensionText} ${detectedText}`,
        /remote/i.test(`${description} ${extensionText} ${location}`)
      );

      return {
        id: item.job_id || item.position ? `serp-${item.position}-${index}` : `serp-${index}`,
        title: item.title || 'Untitled role',
        company,
        location,
        jobType,
        salaryRange: undefined,
        workingHours: 'As per company policy',
        description,
        requiredSkills: ['Communication', 'Problem Solving'],
        preferredSkills: [],
        experience: undefined,
        postedDate: item.date || item.detected_extensions?.posted_at || new Date().toISOString(),
        deadline: undefined,
        benefits: [],
        workingConditions: /remote/i.test(`${description} ${location}`)
          ? 'Remote-friendly role'
          : 'On-site / hybrid as per company',
      };
    });

    jobs = dedupeJobs(jobs);

    if (type) jobs = jobs.filter((job) => job.jobType === type);

    return jobs.slice(0, limit);
  } catch (error) {
    console.error('SerpApi jobs error:', error);
    return [];
  }
}

// Backward-compatible alias for older imports
export async function fetchRapidApiJobs({ query, type, limit = 60 }) {
  return fetchSerpApiJobs({ query, type, limit });
}

export async function fetchPublicJobsFallback({ query, type, limit = 60 }) {
  try {
    const response = await fetch('https://www.arbeitnow.com/api/job-board-api', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) return [];

    const data = await response.json();
    const jobs = (data.data || []).map((job, index) => {
      const tags = Array.isArray(job.tags) ? job.tags : [];
      const isRemote = String(job.remote || '').toLowerCase() === 'true' || String(job.location || '').toLowerCase().includes('remote');

      return {
        id: job.slug || `public-${index}`,
        title: job.title || 'Untitled role',
        company: job.company_name || 'Unknown company',
        location: job.location || (isRemote ? 'Remote' : 'Not specified'),
        jobType: normalizeJobTypeFromText('', isRemote),
        description: job.description || 'No description available.',
        requiredSkills: tags.length ? tags.slice(0, 8) : ['Communication', 'Problem Solving'],
        preferredSkills: [],
        experience: undefined,
        postedDate: job.created_at || new Date().toISOString(),
        benefits: [],
        workingHours: 'As per company policy',
        workingConditions: isRemote ? 'Remote-friendly role' : 'On-site / hybrid as per company',
      };
    });

    let filtered = dedupeJobs(jobs);

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.requiredSkills.some((skill) => String(skill).toLowerCase().includes(q))
      );
    }

    if (type) filtered = filtered.filter((job) => job.jobType === type);

    return filtered.slice(0, limit);
  } catch (error) {
    console.error('Public jobs fallback error:', error);
    return [];
  }
}
