const fs = require('fs');
const path = require('path');
const cp = require('child_process');

async function test() {
  const bytes = fs.readFileSync('dummy.pdf');
  const base64 = bytes.toString('base64');
  const workerPath = path.join(process.cwd(), 'src', 'utils', 'pdfExtractWorker.mjs');

  console.log("Spawning worker...");
  const child = cp.spawn('node', [workerPath], { stdio: ['pipe', 'pipe', 'pipe'] });

  let stdoutData = '';
  let stderrData = '';
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  child.stdout.on('data', (data) => { stdoutData += data; });
  child.stderr.on('data', (data) => { stderrData += data; });

  child.on('close', () => {
    console.log("Closed. stdout:", stdoutData);
    console.log("stderr:", stderrData);
  });
  
  child.stdin.write(base64);
  child.stdin.end();
}
test();
