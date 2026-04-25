import { NextResponse } from 'next/server';
import { fetchPublicJobsFallback, fetchRapidApiJobs } from '../../../../lib/jobProviders.js';

const fallbackJobs = [
  {
    id: 'f-1',
    title: 'Frontend Developer',
    company: 'SkillBridge Tech',
    requiredSkills: ['JavaScript', 'React', 'TypeScript', 'CSS'],
    description: 'Build responsive user interfaces and optimize UX.',
  },
  {
    id: 'f-2',
    title: 'Full Stack Developer',
    company: 'CodeSprint Labs',
    requiredSkills: ['JavaScript', 'Node.js', 'React', 'SQL'],
    description: 'Deliver end-to-end web features across frontend and backend.',
  },
  {
    id: 'f-3',
    title: 'Software Engineer Intern',
    company: 'LaunchPad AI',
    requiredSkills: ['Python', 'Git', 'Problem Solving'],
    description: 'Support product teams with implementation and testing.',
  },
  {
    id: 'f-4',
    title: 'Backend Developer',
    company: 'ServerNest',
    requiredSkills: ['Node.js', 'Express', 'SQL', 'REST API'],
    description: 'Build APIs, business logic, and scalable backend services.',
  },
  {
    id: 'f-5',
    title: 'Data Analyst',
    company: 'InsightPulse',
    requiredSkills: ['SQL', 'Excel', 'Power BI', 'Data Analysis'],
    description: 'Analyze business data and build KPI dashboards.',
  },
  {
    id: 'f-6',
    title: 'Business Intelligence Analyst',
    company: 'MetricHive',
    requiredSkills: ['SQL', 'Power BI', 'Tableau', 'DAX'],
    description: 'Create BI reports, semantic models, and executive insights.',
  },
  {
    id: 'f-7',
    title: 'Data Scientist',
    company: 'Predictly',
    requiredSkills: ['Python', 'Machine Learning', 'Pandas', 'Statistics'],
    description: 'Build predictive models and experimentation pipelines.',
  },
  {
    id: 'f-8',
    title: 'Machine Learning Engineer',
    company: 'ModelForge',
    requiredSkills: ['Python', 'Machine Learning', 'Docker', 'MLOps'],
    description: 'Deploy and monitor ML models in production.',
  },
  {
    id: 'f-9',
    title: 'DevOps Engineer',
    company: 'CloudRail',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    description: 'Automate deployments and manage cloud infrastructure.',
  },
  {
    id: 'f-10',
    title: 'QA Automation Engineer',
    company: 'QualityGrid',
    requiredSkills: ['Testing', 'Cypress', 'Playwright', 'JavaScript'],
    description: 'Design and run automated test suites across releases.',
  },
  {
    id: 'f-11',
    title: 'Cloud Data Engineer',
    company: 'DataOrbit',
    requiredSkills: ['AWS', 'SQL', 'ETL', 'Spark'],
    description: 'Build cloud-native data pipelines and warehousing layers.',
  },
  {
    id: 'f-12',
    title: 'Product Analyst',
    company: 'GrowthLoop',
    requiredSkills: ['SQL', 'A/B Testing', 'Statistics', 'Python'],
    description: 'Drive product decisions via experimentation and metrics.',
  },
];

function unique(list) {
  return [...new Set(list.filter(Boolean))];
}

function normalizeSkillToken(value) {
  return String(value || '').trim().toLowerCase();
}

function tokenizeMeaningfulWords(text) {
  return unique(
    String(text || '')
      .toLowerCase()
      .match(/[a-z][a-z0-9.+#/-]{2,}/g) || []
  ).filter((token) => !isNoisyKeyword(token));
}

function inferResumeThemes(resumeText, skills, keywords) {
  const skillTokens = (Array.isArray(skills) ? skills : []).map(normalizeSkillToken);
  const keywordTokens = (Array.isArray(keywords) ? keywords : []).map(normalizeSkillToken);
  const text = `${String(resumeText || '').toLowerCase()} ${skillTokens.join(' ')} ${keywordTokens.join(' ')}`;

  const themeMap = {
    frontend: ['react', 'next', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript', 'ui', 'ux'],
    backend: ['node', 'express', 'java', 'spring', 'api', 'microservice', 'backend', 'postgres', 'mongodb', 'sql'],
    fullstack: ['full stack', 'fullstack', 'frontend', 'backend', 'mern', 'mean'],
    mobile: ['android', 'ios', 'swift', 'kotlin', 'flutter', 'react native', 'mobile'],
    data: ['python', 'pandas', 'numpy', 'power bi', 'tableau', 'sql', 'analytics', 'data'],
    ml: ['machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch', 'ai'],
    devops: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'devops', 'ci/cd'],
    qa: ['testing', 'qa', 'automation', 'selenium', 'cypress', 'playwright', 'junit', 'pytest'],
    pm: ['product manager', 'roadmap', 'stakeholder', 'agile', 'scrum', 'business analysis'],
  };

  return Object.entries(themeMap)
    .filter(([, signals]) => signals.some((signal) => text.includes(signal)))
    .map(([theme]) => theme);
}

function isNoisyKeyword(value) {
  const token = normalizeSkillToken(value);
  if (!token) return true;
  if (token.length < 3) return true;
  if (/\d/.test(token)) return true;
  if (token.includes('resume') || token.includes('curriculum') || token.includes('vitae')) return true;
  if (['pdf', 'doc', 'docx', 'file', 'upload', 'attachment', 'final', 'latest'].includes(token)) return true;
  return false;
}

function buildResumeSkillSet(skills, keywords, resumeText) {
  const directSkills = Array.isArray(skills) ? skills : [];
  const textSkills = extractSkillsFromText(String(resumeText || ''));
  const coreSkills = extractCoreSkillsFromResumeText(String(resumeText || ''));
  const cleanedKeywords = (Array.isArray(keywords) ? keywords : []).filter((k) => !isNoisyKeyword(k));
  const themes = inferResumeThemes(resumeText, directSkills, cleanedKeywords);

  const themeSkillBoost = {
    frontend: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML', 'CSS'],
    backend: ['Node.js', 'Express', 'SQL', 'PostgreSQL', 'REST API'],
    fullstack: ['JavaScript', 'React', 'Node.js', 'SQL'],
    mobile: ['Kotlin', 'Swift', 'Flutter', 'React Native'],
    data: ['Python', 'SQL', 'Excel', 'Power BI', 'Tableau'],
    ml: ['Machine Learning', 'Python', 'TensorFlow', 'PyTorch'],
    devops: ['AWS', 'Docker', 'Kubernetes', 'Git'],
    qa: ['Testing', 'Cypress', 'Playwright', 'Selenium'],
    pm: ['Agile', 'Scrum', 'A/B Testing', 'Data Analysis'],
  };

  const boosted = themes.flatMap((theme) => themeSkillBoost[theme] || []);

  // Prioritize real skill extraction and use keywords only as a backup signal.
  return unique([...directSkills, ...textSkills, ...coreSkills, ...boosted, ...cleanedKeywords]).slice(0, 30);
}

function extractCoreSkillsFromResumeText(text) {
  const lower = String(text || '').toLowerCase();
  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Python', 'Java', 'SQL',
    'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'HTML', 'CSS', 'REST API'
  ];

  return skills.filter((skill) => lower.includes(skill.toLowerCase()));
}

function isRelevantJob(job, resumeSkills, resumeText) {
  const title = String(job?.title || '').toLowerCase();
  const description = String(job?.description || '').toLowerCase();
  const content = `${title} ${description}`;
  const lowerResumeSkills = resumeSkills.map((s) => String(s).toLowerCase());

  const roleTerms = [
    'developer', 'engineer', 'software', 'frontend', 'backend', 'full stack',
    'web', 'mobile', 'data analyst', 'devops', 'qa', 'tester', 'intern'
  ];
  const noiseTerms = [
    'logo', 'worksheet', 'canva', 'dxf', 'sewing pattern', 'presentation editing',
    'photo retouch', 'poster design', 'thumbnail design', 'pdf editing only'
  ];

  const hasNoise = noiseTerms.some((term) => content.includes(term));
  if (hasNoise) return false;

  const hasRoleSignal = roleTerms.some((term) => content.includes(term));
  const hasSkillSignal = lowerResumeSkills.some((skill) => skill && content.includes(skill));
  const hasResumeRoleWord = ['developer', 'engineer', 'software', 'frontend', 'backend'].some((term) =>
    String(resumeText || '').toLowerCase().includes(term)
  );

  return hasRoleSignal || hasSkillSignal || hasResumeRoleWord;
}

function buildJobQueries(skills, resumeText) {
  const resumeLower = String(resumeText || '').toLowerCase();
  const keywordHints = [
    'frontend developer',
    'backend developer',
    'full stack developer',
    'data analyst',
    'product manager',
    'devops engineer',
    'ui ux designer',
    'software engineer',
    'software developer',
    'web developer',
    'mobile developer',
    'cloud engineer',
    'intern',
  ];

  // Only use cleaned professional skills to avoid filename/noise-based queries.
  const searchTerms = unique(Array.isArray(skills) ? skills : [])
    .map((s) => String(s).trim())
    .filter((s) => s.length > 2)
    .slice(0, 10);

  const matchedHints = keywordHints.filter((hint) => {
    const hintWords = hint.split(' ');
    return hintWords.every((word) => resumeLower.includes(word));
  });

  const queries = [];

  // 1. Matched Title + a key skill
  if (matchedHints.length > 0 && searchTerms.length > 0) {
    queries.push(`${matchedHints[0]} ${searchTerms[0]}`);
    if (searchTerms.length > 1) queries.push(`${matchedHints[0]} ${searchTerms[1]}`);
  }

  // 2. Title only
  if (matchedHints.length > 0) {
    queries.push(`${matchedHints[0]}`);
  }

  // 3. Skills only
  if (searchTerms.length > 0) {
    queries.push(searchTerms.slice(0, 2).join(' '));
    queries.push(searchTerms[0]);
  }

  // 4. Add some general developer queries to ensure we get results
  queries.push('software developer');
  queries.push('web developer');
  queries.push('frontend developer');

  // Fallback if no specific matches
  if (queries.length === 0) {
    queries.push('software engineer intern', 'entry level developer');
  }

  return unique(queries).slice(0, 5);
}

function calculateCompatibility(skills, job, resumeContext) {
  const requiredSkills = job.requiredSkills || [];
  const jobTitle = String(job.title || '').toLowerCase();
  const jobDescription = String(job.description || '').toLowerCase();
  const resumeTextLower = String(resumeContext?.resumeText || '').toLowerCase();

  // Extract additional skills from job description
  const descriptionSkills = extractSkillsFromText(jobDescription);

  // Combine required skills with description skills
  const allJobSkills = [...new Set([...requiredSkills, ...descriptionSkills])];

  if (!allJobSkills.length) return { score: 50, matched: [], missing: [] };

  const lowerResumeSkills = skills.map((s) => String(s).toLowerCase().trim());
  const resumeTokens = Array.isArray(resumeContext?.tokens) ? resumeContext.tokens : [];
  const resumeThemes = Array.isArray(resumeContext?.themes) ? resumeContext.themes : [];
  const matched = [];
  const missing = [];

  const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  const skillAliases = {
    javascript: ['js', 'javascript', 'ecmascript'],
    typescript: ['ts', 'typescript'],
    'node.js': ['node', 'nodejs', 'node.js'],
    react: ['react', 'reactjs', 'react.js'],
    'next.js': ['next', 'nextjs', 'next.js'],
    'power bi': ['powerbi', 'power bi'],
    'machine learning': ['ml', 'machine learning'],
    'rest api': ['rest', 'rest api', 'api'],
    'c++': ['c++', 'cpp'],
  };

  // Technology mapping for better matching
  const techMappings = {
    'javascript': ['js', 'javascript', 'typescript', 'node.js', 'nodejs', 'react', 'angular', 'vue'],
    'typescript': ['ts', 'typescript', 'javascript', 'angular', 'react'],
    'python': ['python', 'django', 'flask', 'fastapi', 'pandas', 'numpy'],
    'java': ['java', 'spring', 'kotlin', 'scala', 'android'],
    'react': ['react', 'javascript', 'typescript', 'next.js', 'redux'],
    'node.js': ['node', 'nodejs', 'javascript', 'express', 'npm'],
    'aws': ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
    'docker': ['docker', 'container', 'kubernetes', 'k8s'],
    'git': ['git', 'github', 'gitlab', 'version control']
  };

  for (const jobSkill of allJobSkills) {
    const jobSkillLower = String(jobSkill).toLowerCase().trim();
    let isMatched = false;

    // Check for exact match or substring match
    for (const resumeSkill of lowerResumeSkills) {
      if (resumeSkill.includes(jobSkillLower) || jobSkillLower.includes(resumeSkill)) {
        matched.push(jobSkill);
        isMatched = true;
        break;
      }
    }

    // If not matched, check technology mappings
    if (!isMatched) {
      for (const resumeSkill of lowerResumeSkills) {
        const resumeMappings = techMappings[resumeSkill] || [resumeSkill];
        if (resumeMappings.some(mapped => jobSkillLower.includes(mapped) || mapped.includes(jobSkillLower))) {
          matched.push(jobSkill);
          isMatched = true;
          break;
        }
      }
    }

    // If not matched, try normalized resume text and skill aliases.
    if (!isMatched) {
      const normalizedJobSkill = normalize(jobSkillLower);
      const aliases = skillAliases[normalizedJobSkill] || [normalizedJobSkill];
      const hasAliasMatch = aliases.some((alias) => {
        const normalizedAlias = normalize(alias);
        return (
          normalizedAlias &&
          (normalize(resumeTextLower).includes(normalizedAlias) ||
            resumeTokens.some((token) => normalize(token) === normalizedAlias))
        );
      });

      if (hasAliasMatch) {
        matched.push(jobSkill);
        isMatched = true;
      }
    }

    if (!isMatched) {
      missing.push(jobSkill);
    }
  }

  // Boost score if job title matches resume skills/themes
  let titleBoost = 0;
  const titleWords = jobTitle.split(/\s+/);
  for (const word of titleWords) {
    if (lowerResumeSkills.some(skill => skill.includes(word) || word.includes(skill))) {
      titleBoost += 15; // Increased boost
    }
  }

  // If job has very generic skills only, but title matches, give reasonable score
  const hasGenericSkillsOnly = allJobSkills.length > 0 && allJobSkills.every(skill =>
    ['communication', 'problem solving', 'teamwork', 'leadership', 'analytical'].includes(skill.toLowerCase())
  );

  if (hasGenericSkillsOnly && titleBoost > 0) {
    return {
      score: Math.min(100, 60 + titleBoost), // Give 60% + title boost for title-matched jobs with generic skills
      matched: [`${job.title} (title match)`],
      missing: allJobSkills.slice(0, 4),
    };
  }

  const baseScore = matched.length > 0 ? Math.round((matched.length / allJobSkills.length) * 100) : 0;

  // Thematic + token overlap to avoid identical low scores across different resumes.
  const themeSignals = {
    frontend: ['frontend', 'react', 'ui', 'web'],
    backend: ['backend', 'api', 'server', 'node', 'java'],
    fullstack: ['full stack', 'fullstack', 'frontend', 'backend'],
    mobile: ['mobile', 'android', 'ios', 'flutter', 'react native'],
    data: ['data', 'analyst', 'analytics', 'bi', 'sql'],
    ml: ['machine learning', 'ai', 'nlp', 'vision'],
    devops: ['devops', 'cloud', 'sre', 'platform', 'kubernetes', 'docker'],
    qa: ['qa', 'test', 'automation'],
    pm: ['product manager', 'product', 'program manager'],
  };

  const jobContent = `${jobTitle} ${jobDescription}`;
  const themeBoost = resumeThemes.reduce((boost, theme) => {
    const signals = themeSignals[theme] || [];
    return signals.some((signal) => jobContent.includes(signal)) ? boost + 8 : boost;
  }, 0);

  const overlapWords = resumeTokens.filter((token) => token.length > 3 && jobContent.includes(token));
  const tokenBoost = Math.min(12, overlapWords.length * 2);

  // Recovery score: when extracted skills are sparse, use lexical alignment
  // between resume text/tokens and job title + requirements.
  const roleWords = unique(
    `${jobTitle} ${(requiredSkills || []).join(' ')}`
      .toLowerCase()
      .match(/[a-z][a-z0-9+#./-]{2,}/g) || []
  );
  const normalizedResumeTokens = new Set(resumeTokens.map((t) => normalize(t)).filter(Boolean));
  const roleWordMatches = roleWords.filter((word) => {
    const normalizedWord = normalize(word);
    if (!normalizedWord || normalizedWord.length < 3) return false;
    return (
      normalizedResumeTokens.has(normalizedWord) ||
      normalize(resumeTextLower).includes(normalizedWord)
    );
  }).length;

  const lexicalRecoveryScore = roleWords.length
    ? Math.min(45, Math.round((roleWordMatches / roleWords.length) * 60))
    : 0;

  const finalScore = Math.min(
    100,
    Math.max(baseScore + titleBoost + themeBoost + tokenBoost, lexicalRecoveryScore)
  );

  return {
    score: finalScore,
    matched,
    missing: missing.slice(0, 6), // Limit missing skills shown
  };
}

function extractSkillsFromText(text) {
  const skillKeywords = [
    // Programming languages
    'javascript', 'typescript', 'python', 'java', 'c\\+\\+', 'c#', 'php', 'ruby', 'swift', 'kotlin', 'go', 'rust', 'scala',
    // Web technologies
    'html', 'css', 'react', 'angular', 'vue', 'next\\.js', 'nextjs', 'nuxt', 'svelte', 'jquery', 'bootstrap', 'tailwind',
    'sass', 'less', 'webpack', 'babel', 'eslint', 'prettier',
    // Backend frameworks
    'node\\.js', 'nodejs', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp\\.net', 'fastapi',
    // Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'cassandra', 'elasticsearch', 'dynamodb', 'sqlite',
    // Cloud platforms
    'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean', 'linode', 'vercel', 'netlify',
    // DevOps & Tools
    'docker', 'kubernetes', 'jenkins', 'gitlab ci', 'github actions', 'circleci', 'travis', 'terraform', 'ansible',
    'bash', 'shell', 'linux', 'ubuntu', 'centos', 'debian',
    // Testing
    'jest', 'mocha', 'chai', 'cypress', 'playwright', 'selenium', 'junit', 'pytest', 'rspec',
    // Version control
    'git', 'github', 'gitlab', 'bitbucket', 'svn',
    // Other tools
    'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'graphql', 'rest api', 'soap', 'json', 'xml',
    'machine learning', 'ai', 'data science', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn',
    'tableau', 'power bi', 'excel', 'sap', 'oracle', 'salesforce', 'servicenow'
  ];

  const found = new Set();
  const lowerText = text.toLowerCase();

  for (const skill of skillKeywords) {
    // Normalize escaped skill tokens before building regex.
    const normalizedSkill = skill.replace(/\\/g, '');
    const escapedSkill = normalizedSkill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    if (regex.test(lowerText)) {
      // Capitalize the first letter of each word
      const displayName = skill.replace(/\\\+/g, '+').replace(/\\\./g, '.').replace(/\b\w/g, (char) => char.toUpperCase());
      found.add(displayName);
    }
  }

  return [...found];
}

function buildRecommendations(skills, jobs, resumeContext) {
  const recommendations = jobs
    .map((job) => {
      const result = calculateCompatibility(skills, job, resumeContext);
      return {
        jobId: job.id,
        title: job.title,
        company: job.company,
        compatibility: result.score,
        matchedSkills: result.matched,
        missingSkills: result.missing,
        reason:
          result.score >= 75
            ? 'Strong profile alignment for this role.'
            : result.score >= 45
              ? 'Good potential match with a few skill gaps.'
              : 'Low match currently; needs focused upskilling.',
      };
    })
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 5);

  const hasOnlyZeroScores =
    recommendations.length > 0 && recommendations.every((rec) => rec.compatibility === 0);

  if (!hasOnlyZeroScores) return recommendations;

  const resumeText = String(resumeContext?.resumeText || '').toLowerCase();
  const resumeTokens = new Set(
    [
      ...(Array.isArray(resumeContext?.tokens) ? resumeContext.tokens : []),
      ...(resumeText.match(/[a-z][a-z0-9+#./-]{2,}/g) || []),
    ].map((t) => String(t).toLowerCase())
  );

  return recommendations.map((rec) => {
    const roleTokens = `${String(rec.title || '').toLowerCase()} ${String(rec.reason || '').toLowerCase()}`
      .match(/[a-z][a-z0-9+#./-]{2,}/g) || [];
    const overlap = roleTokens.filter((token) => resumeTokens.has(token)).length;
    const fallbackScore = Math.min(55, 15 + overlap * 8);

    return {
      ...rec,
      compatibility: fallbackScore,
      reason:
        'Resume text detected but skill extraction was limited. Showing an estimated fit; improve PDF quality for sharper scoring.',
    };
  });
}

function getThemeSignalsForFallback(theme) {
  const map = {
    frontend: ['frontend', 'react', 'javascript', 'ui', 'web'],
    backend: ['backend', 'node', 'api', 'server', 'sql'],
    fullstack: ['full stack', 'frontend', 'backend', 'react', 'node'],
    mobile: ['mobile', 'android', 'ios', 'flutter', 'react native'],
    data: ['data', 'analyst', 'analytics', 'bi', 'power bi', 'tableau'],
    ml: ['machine learning', 'ai', 'nlp', 'computer vision', 'mlops'],
    devops: ['devops', 'cloud', 'aws', 'kubernetes', 'docker', 'ci/cd'],
    qa: ['qa', 'testing', 'automation', 'cypress', 'playwright', 'selenium'],
    pm: ['product manager', 'product', 'roadmap', 'stakeholder', 'agile'],
  };
  return map[theme] || [];
}

function selectFallbackJobs(skills, resumeContext) {
  const resumeThemes = Array.isArray(resumeContext?.themes) ? resumeContext.themes : [];
  const lowerSkills = (Array.isArray(skills) ? skills : []).map((s) => String(s).toLowerCase());

  const scored = fallbackJobs
    .map((job) => {
      const content = `${String(job.title || '').toLowerCase()} ${String(job.description || '').toLowerCase()} ${(job.requiredSkills || []).join(' ').toLowerCase()}`;
      let score = 0;

      for (const skill of lowerSkills) {
        if (skill && content.includes(skill)) score += 3;
      }

      for (const theme of resumeThemes) {
        const signals = getThemeSignalsForFallback(theme);
        if (signals.some((signal) => content.includes(signal))) score += 6;
      }

      return { job, score };
    })
    .sort((a, b) => b.score - a.score);

  // If we have strong theme/skill evidence, use ranked fallback jobs.
  if (scored[0]?.score > 0) {
    return scored.map((item) => item.job).slice(0, 8);
  }

  // Otherwise keep a mixed fallback set so users still see variety.
  return fallbackJobs.slice(0, 8);
}

function buildActionPlan(missingSkills) {
  const prioritized = unique(missingSkills).slice(0, 6);
  return prioritized.map((skill, idx) => ({
    step: idx + 1,
    skill,
    timeframe: idx < 2 ? '1-2 weeks' : idx < 4 ? '2-4 weeks' : '4-6 weeks',
    activity: `Build one mini project using ${skill} and add measurable outcomes to your resume.`,
  }));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const rawSkills = Array.isArray(body?.skills) ? body.skills : [];
    const keywords = Array.isArray(body?.keywords) ? body.keywords : [];
    const resumeText = String(body?.resumeText || '');
    const skills = buildResumeSkillSet(rawSkills, keywords, resumeText);
    const resumeTokens = tokenizeMeaningfulWords(`${resumeText} ${(keywords || []).join(' ')}`).slice(0, 40);
    const resumeThemes = inferResumeThemes(resumeText, skills, keywords);
    const resumeContext = {
      tokens: resumeTokens,
      themes: resumeThemes,
      resumeText,
    };

    if (skills.length < 2 && resumeTokens.length < 12 && resumeThemes.length === 0) {
      return NextResponse.json(
        {
          error:
            'Resume parsing quality is too low for reliable matching. Please upload a clearer text-based resume PDF.',
        },
        { status: 400 }
      );
    }

    const queries = buildJobQueries(skills, resumeText);
    if (!queries.length || (!skills.length && !keywords.length && resumeText.trim().length < 40)) {
      return NextResponse.json(
        {
          error: 'Could not extract enough resume text to generate matching jobs. Please upload a text-based PDF resume.',
        },
        { status: 400 }
      );
    }
    let jobs = [];

    for (const query of queries) {
      const fetched = await fetchRapidApiJobs({ query, limit: 12, numPages: 2 });
      jobs.push(...fetched);
    }

    jobs = unique(jobs.map((job) => JSON.stringify(job))).map((job) => JSON.parse(job));

    if (!jobs.length) {
      const publicJobs = await fetchPublicJobsFallback({
        query: queries[0] || 'software developer',
        limit: 30,
      });
      jobs = publicJobs;
    }

    // Keep only career-relevant technical roles, drop noisy gig-design PDF tasks.
    const relevantJobs = jobs.filter((job) => isRelevantJob(job, skills, resumeText));
    jobs = relevantJobs.length > 0 ? relevantJobs : [];

    if (!jobs.length) jobs = selectFallbackJobs(skills, resumeContext);

    const recommendations = buildRecommendations(skills, jobs, resumeContext);
    const allMissing = recommendations.flatMap((r) => r.missingSkills || []);
    const allMatched = recommendations.flatMap((r) => r.matchedSkills || []);

    const overallScore =
      recommendations.length > 0
        ? Math.round(
            recommendations.reduce((sum, r) => sum + r.compatibility, 0) / recommendations.length
          )
        : 0;

    const summary =
      overallScore >= 75
        ? 'Your profile is highly aligned with current market developer roles.'
        : overallScore >= 50
          ? 'Your profile has a moderate match. Upskilling can significantly improve outcomes.'
          : 'You need focused skill building before targeting top roles.';

    return NextResponse.json({
      overallScore,
      summary,
      topStrengths: unique(allMatched).slice(0, 8),
      keyGaps: unique(allMissing).slice(0, 8),
      recommendations,
      actionPlan: buildActionPlan(allMissing),
      resumeHighlights: resumeText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 20)
        .slice(0, 4),
    });
  } catch (error) {
    console.error('Deep analysis error:', error);
    return NextResponse.json({ error: 'Failed to generate deep analysis' }, { status: 500 });
  }
}
