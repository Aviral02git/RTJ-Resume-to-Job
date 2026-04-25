import fs from 'fs';
import { extractPdfText } from './src/utils/resumeParser.js';

async function run() {
  const buf = fs.readFileSync('dummy.pdf');
  try {
    const text = await extractPdfText(buf);
    console.log('Result:', text);
  } catch (e) {
    console.error('Error:', e);
  }
}
run();
