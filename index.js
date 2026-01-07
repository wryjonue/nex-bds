// This is the main entry point for the Bedrock server wrapper.
// This is meant to only restart every 12 hours or more, so it spawns the actual server process as a child process
// So it developers can hot-reload logic without restarting the server process

import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import { pathToFileURL, fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const executable = process.platform === 'win32' ? 'bedrock_server.exe' : './bedrock_serverMC';

const child = spawn(executable, [], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
});

// ==== Logging Setup ====
if (!fs.existsSync(path.join(__dirname, 'Logs'))) fs.mkdirSync(path.join(__dirname, 'Logs'));
const now = new Date();
const pad = (n) => n.toString().padStart(2, '0');
const timestamp = `${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
const logStream = fs.createWriteStream(path.join(__dirname, 'Logs', `${timestamp}.txt`));


child.stderr.pipe(process.stderr);

process.stdin.on('data', (data) => {
    if (data.toString().trim() === "/reload") {
        reloadAndExecute();
    } else {
        child.stdin.write(data);
    }
});

let currentModule = null;

async function reloadAndExecute() {
    if (currentModule && currentModule.cleanup) {
        currentModule.cleanup(child);
    }

    const modulePath = pathToFileURL(path.resolve('./hot-index.js')).href;
    const versionedPath = `${modulePath}?v=${Date.now()}`;
    
    currentModule = await import(versionedPath);
    
    if (currentModule.main) {
        currentModule.main(child, logStream);
    }
    console.log("--- Hot Logic Reloaded ---");
}

reloadAndExecute();