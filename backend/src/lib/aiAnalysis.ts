import OpenAI from 'openai';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_CHAT_MODEL = process.env.GROQ_CHAT_MODEL || 'llama-3.3-70b-versatile';
const GROQ_EMBED_MODEL = process.env.GROQ_EMBED_MODEL || 'nomic-embed-text-v1.5';

const groqClient = GROQ_API_KEY
  ? new OpenAI({
      apiKey: GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    })
  : null;

function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || !b.length || a.length !== b.length) return 0;
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function lexicalOverlapScore(resumeText: string, jobDescription: string, userSkills: string[]) {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();
  const matchedSkills = userSkills.filter((s) => jdLower.includes(s.toLowerCase()));
  const skillScore = userSkills.length > 0 ? (matchedSkills.length / userSkills.length) * 100 : 0;
  const tokenOverlap = jdLower
    .split(/\W+/)
    .filter(Boolean)
    .filter((token) => token.length > 3 && resumeLower.includes(token)).length;
  const combined = Math.min(100, Math.round(skillScore * 0.7 + Math.min(30, tokenOverlap) * 1));
  return { combined, matchedSkills };
}

async function getEmbedding(text: string): Promise<number[] | null> {
  if (!groqClient) return null;
  try {
    const embeddingResponse = await groqClient.embeddings.create({
      model: GROQ_EMBED_MODEL,
      input: text.slice(0, 8000),
    });
    return embeddingResponse.data[0]?.embedding || null;
  } catch {
    return null;
  }
}

async function chatJson<T>(prompt: string, fallback: T): Promise<T> {
  if (!groqClient) return fallback;
  try {
    const response = await groqClient.chat.completions.create({
      model: GROQ_CHAT_MODEL,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are a strict JSON generator. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    const content = response.choices[0]?.message?.content;
    if (!content) return fallback;
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

export async function generateCompatibilityAnalysis(
  resumeText: string,
  jobDescription: string,
  userSkills: string[]
): Promise<{
  score: number;
  analysis: string;
  gaps: string[];
  strengths: string[];
}> {
  const lexical = lexicalOverlapScore(resumeText, jobDescription, userSkills);
  const [resumeEmb, jobEmb] = await Promise.all([
    getEmbedding(resumeText),
    getEmbedding(jobDescription),
  ]);

  const embeddingScore =
    resumeEmb && jobEmb ? Math.max(0, Math.min(100, Math.round(cosineSimilarity(resumeEmb, jobEmb) * 100))) : null;
  const blendedScore = embeddingScore !== null ? Math.round(embeddingScore * 0.6 + lexical.combined * 0.4) : lexical.combined;

  const llmResult = await chatJson<{
    analysis: string;
    gaps: string[];
    strengths: string[];
  }>(
    `Resume:\n${resumeText}\n\nJob:\n${jobDescription}\n\nSkills:\n${userSkills.join(', ')}\n\nReturn JSON with keys: analysis (string), gaps (string[]), strengths (string[]).`,
    {
      analysis: 'Match computed using embeddings + lexical overlap.',
      gaps: [],
      strengths: lexical.matchedSkills,
    }
  );

  return {
    score: blendedScore,
    analysis: llmResult.analysis,
    gaps: llmResult.gaps || [],
    strengths: llmResult.strengths || lexical.matchedSkills,
  };
}

export async function generatePreparationPlan(
  gaps: string[],
  targetJobTitle: string
): Promise<PreparationPlan[]> {
  const result = await chatJson<{ plans: PreparationPlan[] }>(
    `Create a practical preparation plan for role "${targetJobTitle}" and gaps: ${gaps.join(', ')}. Return JSON with key plans as array.`,
    { plans: [] }
  );
  return result.plans || [];
}

export async function generateResumeSuggestions(
  resumeText: string,
  jobDescription: string
): Promise<Improvement[]> {
  const result = await chatJson<{ suggestions: Improvement[] }>(
    `Review resume against job and return JSON with key suggestions: ${JSON.stringify({ resumeText, jobDescription })}`,
    { suggestions: [] }
  );
  return result.suggestions || [];
}

export async function generateJobRecommendations(
  userSkills: string[],
  experience: string,
  education: string
): Promise<string[]> {
  const result = await chatJson<{ recommendations: string[] }>(
    `Recommend 5 job titles for skills=${userSkills.join(', ')}, experience=${experience}, education=${education}. Return JSON with key recommendations.`,
    { recommendations: [] }
  );
  return result.recommendations || [];
}
