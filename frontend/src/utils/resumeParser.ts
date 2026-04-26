// PDF parsing utility - integrates with server-side API
export async function parsePDF(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload/parse-resume', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to parse PDF');
  const data = await response.json();
  return data.text;
}

export async function extractPdfText(buffer: ArrayBuffer | Uint8Array): Promise<string> {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const pdfDocument = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;

    const pageTexts: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      const page = await pdfDocument.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => (typeof item.str === 'string' ? item.str : ''))
        .join(' ')
        .trim();
      if (pageText) pageTexts.push(pageText);
    }

    const text = pageTexts.join('\n').trim();
    if (text) return text;
  } catch {
    // fall through to pdf-parse
  }

  try {
    const pdfParseModule = await import('pdf-parse');
    const pdfParse = pdfParseModule as unknown as (data: Buffer) => Promise<{ text?: string }>;
    const parsed = await pdfParse(Buffer.from(new Uint8Array(buffer)));
    return String(parsed?.text || '').trim();
  } catch {
    return '';
  }
}

export function extractSkills(text: string): string[] {
  const normalizedText = String(text || '').replace(/\s+/g, ' ');
  const skillPatterns = [
    /(?:skills?|proficiencies?|expertise|technologies?)[\s\n]*:?([\s\S]*?)(?=(?:experience|education|projects|certifications|awards|summary|$))/i,
  ];

  const detected = new Set<string>();

  for (const pattern of skillPatterns) {
    const match = String(text || '').match(pattern);
    if (!match) continue;
    match[1]
      .split(/[,•\n|/]/)
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0 && skill.length < 50)
      .forEach((skill) => detected.add(skill));
  }

  const keywordSkills = [
    'javascript', 'typescript', 'react', 'next.js', 'nextjs', 'node.js', 'nodejs',
    'python', 'java', 'c++', 'c#', 'html', 'css', 'tailwind css', 'redux', 'vue', 'angular',
    'express', 'django', 'flask', 'postgresql', 'mysql', 'mongodb', 'sql', 'git', 'github',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'figma', 'graphql', 'rest api', 'api',
    'machine learning', 'data analysis', 'power bi', 'excel', 'communication', 'problem solving',
    'project management', 'agile', 'scrum', 'testing', 'jest', 'cypress', 'playwright'
  ];

  const lowerText = normalizedText.toLowerCase();
  keywordSkills.forEach((skill) => {
    if (lowerText.includes(skill.toLowerCase())) {
      detected.add(skill.replace(/\b\w/g, (char) => char.toUpperCase()));
    }
  });

  return [...detected].slice(0, 50);
}

export function calculateSkillMatch(
  userSkills: string[],
  jobRequiredSkills: string[]
): number {
  if (jobRequiredSkills.length === 0) return 100;

  const userSkillsLower = userSkills.map((s) => s.toLowerCase());
  const matchedSkills = jobRequiredSkills.filter((skill) =>
    userSkillsLower.some(
      (userSkill) =>
        userSkill.includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill)
    )
  );

  return Math.round((matchedSkills.length / jobRequiredSkills.length) * 100);
}

export function calculateExperienceMatch(
  userExperience: number,
  jobExperienceText?: string
): number {
  if (!jobExperienceText) return 75;

  const experienceMatch = jobExperienceText.match(/(\d+)\+?\s*(?:years?|yrs?)/i);
  const requiredYears = experienceMatch ? parseInt(experienceMatch[1]) : 0;

  if (userExperience >= requiredYears) return 100;
  if (userExperience >= requiredYears * 0.7) return 80;
  if (userExperience >= requiredYears * 0.5) return 60;
  return 40;
}

export function calculateEducationMatch(
  userEducation: string[],
  jobDescription: string
): number {
  const educationKeywords = [
    'bachelor',
    'masters',
    'phd',
    'degree',
    'diploma',
    'certification',
  ];
  const jobEducationMatch = educationKeywords.filter((keyword) =>
    jobDescription.toLowerCase().includes(keyword)
  );

  if (jobEducationMatch.length === 0) return 100;
  if (userEducation.length > 0) return 90;
  return 60;
}

export function generatePreparationPlan(
  gaps: string[],
  skills: string[]
): string[] {
  const plans = gaps.map(
    (gap) => `Learn ${gap} - estimated 40-60 hours, practice with projects`
  );
  return plans;
}

export function extractResumeKeywords(text: string): string[] {
  const tokens = String(text || '')
    .toLowerCase()
    .match(/[a-z][a-z0-9.+#/-]{2,}/g) || [];

  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'you', 'are', 'was', 'have', 'has',
    'resume', 'experience', 'skills', 'work', 'team', 'developer', 'engineer', 'project', 'projects',
    'managed', 'build', 'built', 'using', 'based', 'role', 'roles', 'company', 'student', 'professional'
  ]);

  return [...new Set(tokens.filter((token) => !stopWords.has(token)).slice(0, 20))];
}
