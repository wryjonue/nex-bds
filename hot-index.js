// Keep a reference to the function so we can remove it later
let logHandler;

export function cleanup(child) {
    if (logHandler) {
        child.stdout.removeListener('data', logHandler);
    }
}

export async function main(child, logStream) {
    logHandler = (data) => {
        const log = data.toString();
        // Filter out annoying spam
        if (log.includes("minecraft:behavior.nearest_attackable_target")) return;
        process.stdout.write(log);
        logStream.write(log);
    };
    child.stdout.on('data', logHandler);
}