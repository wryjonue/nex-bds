// This is the file where hot module replacement is handled
let child;
export async function main(childProcess, logStream) {
    child = childProcess;
    child.stdout.on('data', (data) => {
        const log = data.toString().trim();

        if (log.includes("minecraft:behavior.nearest_attackable_target")) return;
        logStream.write(log + '\n');
        console.log(log)
    })
}