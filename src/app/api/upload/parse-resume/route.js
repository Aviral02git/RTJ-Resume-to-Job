import { NextResponse } from 'next/server';
import {
  extractPdfText,
  extractSkills,
  extractResumeKeywords,
  isLikelyReadableResumeText,
} from '../../../../utils/resumeParser.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const parsedText = await extractPdfText(buffer);
    const text = parsedText.trim();
    const isReadable = isLikelyReadableResumeText(text);

    if (!isReadable) {
      return NextResponse.json({
        text: '',
        skills: [],
        keywords: [],
        parseWarning:
          'Could not extract readable resume content from this PDF. Please upload a text-based resume PDF (not a scanned image) and re-export it from Word/Docs.',
      });
    }

    const skills = extractSkills(text);
    const keywords = extractResumeKeywords(text);

    const meaningfulKeywords = keywords.filter((token) => {
      const value = String(token || '').toLowerCase().trim();
      if (!value || value.length < 3) return false;
      if (/\d/.test(value)) return false;
      if (/\b(pdf|doc|docx|file|upload|attachment|final|latest|resume|curriculum|vitae)\b/.test(value)) return false;
      return true;
    });

    const lowerText = text.toLowerCase();
    const hasCareerSignals = [
      'experience',
      'education',
      'project',
      'skills',
      'developer',
      'engineer',
      'analyst',
      'intern',
      'work',
    ].some((signal) => lowerText.includes(signal));

    const lowSignal = skills.length < 1 && meaningfulKeywords.length < 5;
    const shouldReject = lowSignal && !hasCareerSignals;
    if (shouldReject) {
      // Still pass through the text so deep analysis can attempt to work with it
      return NextResponse.json({
        text,
        skills,
        keywords,
        parseWarning:
          'Resume text was detected, but not enough skill/content signals were found for reliable matching. Results may be less accurate.',
      });
    }

    return NextResponse.json({
      text,
      skills,
      keywords,
      parseWarning: '',
      message: 'Resume parsed successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 });
  }
}
