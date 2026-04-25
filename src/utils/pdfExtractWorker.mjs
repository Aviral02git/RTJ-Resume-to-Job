#!/usr/bin/env node
/**
 * Standalone PDF text extraction worker.
 * Runs as a subprocess to avoid Next.js's module system freezing pdfjs-dist.
 *
 * Usage: node pdfExtractWorker.mjs <base64-encoded-pdf-bytes>
 * Output: JSON { text: string } on stdout
 */

import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

async function extractText(base64Data) {
  const bytes = Buffer.from(base64Data, 'base64');

  const task = getDocument({
    data: new Uint8Array(bytes),
    disableWorker: true,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: false,
    verbosity: 0,
  });

  const doc = await task.promise;
  const pageTexts = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => (typeof item?.str === 'string' ? item.str : ''))
      .join(' ')
      .trim();
    if (text) pageTexts.push(text);
  }

  return pageTexts.join('\n');
}

// Read base64 from stdin
const chunks = [];
for await (const chunk of process.stdin) {
  chunks.push(chunk);
}
const inputData = Buffer.concat(chunks).toString('utf8').trim();

try {
  const text = await extractText(inputData);
  process.stdout.write(JSON.stringify({ text }));
} catch (error) {
  process.stdout.write(JSON.stringify({ text: '', error: error.message }));
}
