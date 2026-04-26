import {
  extractPdfText,
  extractSkills,
  extractResumeKeywords,
  isLikelyReadableResumeText,
} from '../utils/resumeParser.js';

export default async function uploadResumeRoute(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const buffer = file.buffer;
    const parsedText = await extractPdfText(buffer);
    const text = parsedText.trim();
    const isReadable = isLikelyReadableResumeText(text);

    if (!isReadable) {
      return res.json({
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

    const lowSignal = skills.length < 2 && meaningfulKeywords.length < 12;
    const shouldReject = lowSignal || !hasCareerSignals;
    
    if (shouldReject) {
      return res.json({
        text: '',
        skills: [],
        keywords: [],
        parseWarning:
          'Resume text was detected, but not enough skill/content signals were found for reliable matching. Please upload a cleaner PDF export.',
      });
    }

    return res.json({
      text,
      skills,
      keywords,
      parseWarning: '',
      message: 'Resume parsed successfully',
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
}
