// index.js
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This variable NEVER dies because index.js never restarts
let globalState = {
    players: ['wryjonue', 'guest1'],
    score: 100
};

async function reloadAndExecute() {
    // 1. Create a "cache-busting" URL
    const modulePath = pathToFileURL(path.resolve('./hot-index.js')).href;
    const versionedPath = `${modulePath}?v=${Date.now()}`;

    // 2. Import the NEW version of the code
    const { main : runLogic } = await import(versionedPath);

    // 3. Pass your live variables into the new code
    runLogic(globalState);
}

const executable = process.platform === 'win32'
	? 'bedrock_server.exe'
	: './bedrock_serverMC';

const child = spawn(executable, {
	cwd: __dirname,
	stdio: ['pipe', 'pipe', 'pipe']
});


// ==== Logging ====
const now = new Date();
const utc = now.getTime() + now.getTimezoneOffset() * 60000;
const gmt8 = new Date(utc + 8 * 3600000);
const pad = (n) => n.toString().padStart(2, '0');
const timestamp = `${pad(gmt8.getMonth() + 1)}-${pad(gmt8.getDate())}_${pad(gmt8.getHours())}-${pad(gmt8.getMinutes())}-${pad(gmt8.getSeconds())}`;
const logFileName = `${timestamp}.txt`;
const logStream = fs.createWriteStream(path.join(__dirname, 'Logs', logFileName));

child.stderr.pipe(process.stderr);
child.stderr.pipe(logStream);
process.stdin.pipe(child.stdin);