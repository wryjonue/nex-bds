# NightShifts Exclusive BDS Bridge

A simple Node.js wrapper for Minecraft Bedrock Dedicated Server (BDS). This setup lets me change my JS code without having to stop and restart the whole Minecraft server.

## 🛠 How it Works
I use two different types of scripting here:

1. **The "Outside" (Node.js):** - Runs in the full Node.js environment on my PC.
   - It "wraps" around the Minecraft server process.
   - I can reload this code anytime using the `/reload` command without kicking players off the server.

2. **The "Inside" (Minecraft Scripting API [MCBSAPI]):**
   - These are the Behavior Packs running inside Minecraft itself.
   - Can also be reloaded anytime using `reload` command (no slash)
   - Handles game events like player movement, block breaks, and entity logic.

---

## 📂 Folders
* `index.js` - The main file that stays running. It keeps the BDS alive.
* `hot-index.js` - The "hot-reload" file. I put my logic here so I can update it live.
* `/Logs` - Where all the server console history is saved.
* `/development_behavior_packs/nsex-bp/scripts` - Where the inside MCBSAPI scripts located

## 🚀 How to use it
1. Run `node index.js`.
2. To update your code: 
   - Edit `hot-index.js`.
   - Type `/reload` in the terminal.
   - The logic updates instantly, but the Minecraft server stays up!

---

### Why I built this
I'm a 2nd-year CS student and I wanted a way to code while the server is live. This setup uses **Modular JS** to "hot-swap" code. It avoids the annoying 12-hour restart cycle as much as possible by keeping the "Bridge" (Node.js) and the "Game" (BDS) connected via pipes.
