


// start.js  (your root‐level launcher)

const { exec } = require("child_process");
const fs      = require("fs").promises;
const path    = require("path");

async function run(cmd, cwd) {
  return new Promise((res, rej) => {
    const p = exec(cmd, { cwd }, e => e ? rej(e) : res());
    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
  });
}

(async () => {
  try {
    console.log("🛑 Press CTRL+C to stop.");

    const reset        = process.argv.includes("--reset");
    const backendPath  = path.resolve(__dirname, "backend");
    const frontendPath = path.resolve(__dirname, "frontend");
    const envFile      = path.join(backendPath, ".env");
    const seedRel      = path.join("seed", "seed.js");

    // 1. Ensure .env
    try {
      await fs.access(envFile);
      console.log("✅ .env exists");
    } catch {
      console.log("⚠️  Creating .env");
      await fs.writeFile(envFile,
`MONGODB_URI=mongodb://localhost:27017/restaurantDB
JWT_SECRET=yourSuperSecretKey
JWT_EXPIRES_IN=1h
NODE_ENV=development
PORT=5000
`);
    }

    // 2. Backend install
    console.log("📦 Installing backend deps...");
    await run("npm install", backendPath);

    // 3. Seed (with --force if reset)
    console.log(`🌱 Seeding database${reset ? " (--force)" : ""}…`);
    await run(
      `node ${seedRel}${reset ? " --force" : ""}`,
      backendPath
    );

    // 4. Start backend
    console.log("🚀 Starting backend (nodemon)...");
    run("npx nodemon server.js", backendPath);

    // 5. Frontend install
    console.log("📦 Installing frontend deps...");
    await run("npm install", frontendPath);

    // 6. Start frontend
    console.log("💻 Starting frontend…");
    run("npm start", frontendPath);

  } catch (err) {
    console.error("❌ Fatal error:", err);
    process.exit(1);
  }
})();
