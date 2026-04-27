function normalizeExtractedText(rawText) {
  const cleaned = String(rawText || '')
    .replace(/\u0000/g, ' ')
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();

  return cleaned;
}

function isLikelyUsefulText(text) {
  const clean = normalizeExtractedText(text);
  const words = clean.match(/[a-zA-Z]{2,}/g) || [];
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
  return clean.length >= 60 && words.length >= 12 && uniqueWords.size >= 8;
}

async function extractWithSubprocess(bytes) {
  return new Promise(async (resolve, reject) => {
    try {
      const cp = await import('child_process');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const workerPath = path.join(__dirname, 'pdfExtractWorker.mjs');
      const spawnFn = cp.default ? cp.default.spawn : cp.spawn;
      const child = spawnFn('node', [workerPath], { stdio: ['pipe', 'pipe', 'pipe'] });
      let stdoutData = '';
      let stderrData = '';

      child.stdout.setEncoding('utf8');
      child.stderr.setEncoding('utf8');

      child.stdout.on('data', (data) => { stdoutData += data; });
      child.stderr.on('data', (data) => { stderrData += data; });

      child.on('error', (err) => {
        reject(err);
      });

      child.on('close', () => {
        try {
          if (!stdoutData) {
            return resolve('');
          }
          const result = JSON.parse(stdoutData);
          if (result.error) {
            console.error('Subprocess PDF extraction error:', result.error, stderrData);
            resolve('');
          } else {
            resolve(normalizeExtractedText(result.text || ''));
          }
        } catch (err) {
          console.error('Failed to parse worker output:', err, 'Output:', stdoutData);
          resolve('');
        }
      });

      const base64 = Buffer.from(bytes).toString('base64');
      child.stdin.write(base64);
      child.stdin.end();
    } catch (err) {
      reject(err);
    }
  });
}

function extractWithRawPdfStreams(bytes) {
  // Fallback for PDFs where parser backends fail due to runtime incompatibilities.
  // Extracts text from parenthesized strings, hex-encoded strings, and BT/ET text blocks.
  const ascii = Buffer.from(bytes).toString('latin1');
  const textChunks = [];

  // 1. Extract parenthesized text strings — the most common PDF text encoding
  const parenthesized = ascii.match(/\(([^()]{2,800})\)/g) || [];
  for (const chunk of parenthesized) {
    const inner = chunk.slice(1, -1)
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\')
      .replace(/\\([()])/g, '$1');
    // Only keep chunks that have readable content
    if (/[a-zA-Z]{2,}/.test(inner)) {
      textChunks.push(inner);
    }
  }

  // 2. Extract hex-encoded text strings
  const angleBrackets = ascii.match(/<([0-9A-Fa-f]{4,800})>/g) || [];
  for (const hexChunk of angleBrackets.slice(0, 500)) {
    const hex = hexChunk.slice(1, -1);
    if (hex.length % 2 !== 0) continue;
    try {
      const decoded = Buffer.from(hex, 'hex').toString('utf8');
      if (/[a-zA-Z]{2,}/.test(decoded)) textChunks.push(decoded);
    } catch {
      // ignore bad hex chunks
    }
  }

  // 3. Try to extract text from stream content (between "stream" and "endstream")
  const streamRegex = /stream\r?\n([\s\S]*?)endstream/g;
  let streamMatch;
  while ((streamMatch = streamRegex.exec(ascii)) !== null) {
    const streamContent = streamMatch[1];
    // Look for text showing operators: Tj, TJ, ', "
    const tjMatches = streamContent.match(/\(([^()]{2,300})\)\s*Tj/g) || [];
    for (const tj of tjMatches) {
      const inner = tj.match(/\(([^()]+)\)/)?.[1];
      if (inner && /[a-zA-Z]{2,}/.test(inner)) {
        textChunks.push(inner);
      }
    }
  }

  return normalizeExtractedText(textChunks.join(' '));
}

export async function extractPdfText(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

  // Basic guard: if it doesn't look like a PDF header, skip expensive parsing.
  const header = Buffer.from(bytes.slice(0, 8)).toString('latin1');
  if (!header.startsWith('%PDF-')) return '';

  // Collect text from all methods and return the best result
  let bestText = '';

  try {
    const text = await extractWithSubprocess(bytes);
    if (text.length > bestText.length) bestText = text;
    if (isLikelyUsefulText(bestText)) return bestText;
  } catch (error) {
    console.error('Subprocess extraction failed:', error?.message || error);
  }

  try {
    const text = extractWithRawPdfStreams(bytes);
    if (text.length > bestText.length) bestText = text;
    if (isLikelyUsefulText(bestText)) return bestText;
  } catch (error) {
    console.error('Raw PDF stream extraction failed:', error?.message || error);
  }

  try {
    const pdfParseModule = await import('pdf-parse');
    const pdfParse = pdfParseModule.default || pdfParseModule;
    const parsed = await pdfParse(Buffer.from(bytes));
    const text = normalizeExtractedText(String(parsed?.text || ''));
    if (text.length > bestText.length) bestText = text;
  } catch (error) {
    console.error('pdf-parse fallback failed:', error?.message || error);
  }

  // Return whatever we got — even partial text is better than nothing
  // The downstream validators (isLikelyReadableResumeText) will decide if it's usable
  return bestText;
}

export function isLikelyReadableResumeText(text) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length < 60) return false;

  const lower = clean.toLowerCase();
  const resumeSignals = [
    'experience',
    'education',
    'skills',
    'projects',
    'summary',
    'internship',
    'work',
    'certification',
    'developer',
    'engineer',
    'analyst',
    'university',
    'college',
    'bachelor',
    'master',
    'degree',
  ];
  const hasResumeSignal = resumeSignals.some((signal) => lower.includes(signal));

  const pdfArtifacts = ['endobj', 'xref', 'stream', '/type', '/font', 'obj'];
  const artifactHits = pdfArtifacts.reduce((count, marker) => count + (lower.includes(marker) ? 1 : 0), 0);

  const words = clean.match(/[a-zA-Z]{3,}/g) || [];
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
  const alphaChars = (clean.match(/[a-zA-Z]/g) || []).length;
  const alphaRatio = alphaChars / Math.max(clean.length, 1);

  // Reject parser garbage dominated by symbols/control fragments.
  if (alphaRatio < 0.35) return false;

  // Accept if it has a resume signal and reasonable word counts (relaxed thresholds)
  return hasResumeSignal && artifactHits <= 3 && words.length >= 15 && uniqueWords.size >= 10;
}

function isNoisySkillCandidate(value) {
  const token = String(value || '').toLowerCase().trim();
  if (!token) return true;
  if (token.length < 2 || token.length > 50) return true;
  if (token.includes('resume') || token.includes('curriculum') || token.includes('vitae')) return true;
  if (token.endsWith('.pdf') || token.endsWith('.doc') || token.endsWith('.docx')) return true;
  if (/^\w+[-_]\d+(?:[-_.]\w+)*$/.test(token)) return true;
  if (/\b(pdf|doc|docx|file|upload|attachment|final|latest)\b/.test(token)) return true;
  if ((token.match(/\d/g) || []).length >= 2) return true;
  if ((token.match(/[a-z]/g) || []).length < 2) return true;
  return false;
}

function sanitizeSkills(skills) {
  const cleaned = [];

  for (const skill of Array.isArray(skills) ? skills : []) {
    const compact = String(skill || '').replace(/\s+/g, ' ').trim();
    if (!compact) continue;
    if (isNoisySkillCandidate(compact)) continue;
    if (compact.length > 50) continue;
    cleaned.push(compact.replace(/\b\w/g, (ch) => ch.toUpperCase()));
  }

  return [...new Set(cleaned)].slice(0, 50);
}

export function extractSkills(text) {
  const normalizedText = String(text || '').replace(/\s+/g, ' ');
  const skillPatterns = [
    /(?:skills?|proficiencies?|expertise|technologies?)[\s\n]*:?([\s\S]*?)(?=(?:experience|education|projects|certifications|awards|summary|$))/i,
  ];

  const detected = new Set();

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
    'project management', 'agile', 'scrum', 'testing', 'jest', 'cypress', 'playwright',
    'salesforce', 'tableau', 'sap', 'oracle', 'php', 'ruby', 'rails', 'swift', 'kotlin',
    'docker', 'jenkins', 'terraform', 'ansible', 'linux', 'bash'
  ];

  const lowerText = normalizedText.toLowerCase();
  keywordSkills.forEach((skill) => {
    if (lowerText.includes(skill.toLowerCase())) {
      detected.add(skill.replace(/\b\w/g, (char) => char.toUpperCase()));
    }
  });

  return sanitizeSkills([...detected]);
}

export function extractResumeKeywords(text) {
  const tokens = String(text || '')
    .toLowerCase()
    .match(/[a-z][a-z0-9.+#/]{2,}/g) || [];

  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'you', 'are', 'was', 'have', 'has',
    'resume', 'experience', 'skills', 'work', 'team', 'developer', 'engineer', 'project', 'projects',
    'managed', 'build', 'built', 'using', 'based', 'role', 'roles', 'company', 'student', 'professional',
    'pdf', 'docx', 'file', 'upload', 'uploaded', 'attached', 'attachment', 'curriculum', 'vitae', 'cv',
    'final', 'latest', 'updated'
  ]);

  return [...new Set(tokens.filter((token) => !stopWords.has(token) && !/\d/.test(token)).slice(0, 30))];
}
