const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");

async function run(command, cwd) {
    return new Promise((resolve, reject) => {
        const proc = exec(command, { cwd }, (error) => {
            if (error) {
                console.error(`Error executing command: "${command}" in ${cwd}`, error);
                reject(error);
                return;
            }
            resolve();
        });
        proc.stdout.pipe(process.stdout);
        proc.stderr.pipe(process.stderr);
    });
}

(async () => {
    try {
        console.log("🛑 ctrl + C to stop servers");

        const backendPath = "./backend";
        const frontendPath = "./frontend";
        const envFilePath = path.join(backendPath, ".env");
        const seedScriptRelativePath = path.join("seed", "seed.js");

        // 1. Check for and create .env file if it doesn't exist
        try {
            await fs.access(envFilePath);
            console.log("✅ .env file found in backend.");
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log("⚠️ .env file not found in backend. Creating and initializing...");
                const envContent = `MONGODB_URI=mongodb://localhost:27017/restaurantDB
JWT_SECRET=yourSuperSecretKey
JWT_EXPIRES_IN=1h
NODE_ENV=development
PORT=5000
`;
                await fs.writeFile(envFilePath, envContent);
                console.log("✨ .env file created and initialized successfully.");
            } else {
                throw error;
            }
        }

        // 2. Install backend packages
        console.log("📦 Installing backend packages...");
        await run("npm install", backendPath);

        const seedScriptAbsolutePath = path.join(backendPath, seedScriptRelativePath);
        try {
            await fs.access(seedScriptAbsolutePath);
            console.log("🌱 Checking and seeding database (if not already seeded)...");
            await run(`node ${seedScriptRelativePath}`, backendPath);
            console.log("✅ Database seeding process completed.");
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`ℹ️ Database seed script not found at ${seedScriptAbsolutePath}. Skipping seeding.`);
            } else {
                console.error("❌ Error running database seed script:", error);
                process.exit(1);
            }
        }

        // 4. Start backend server
        console.log("🚀 Starting backend server...");
        run("npx nodemon server.js", backendPath);

        // 5. Install frontend packages
        console.log("📦 Installing frontend packages...");
        await run("npm install", frontendPath);

        // 6. Start frontend
        console.log("💻 Starting frontend...");
        run("npm start", frontendPath);

    } catch (err) {
        console.error("❌ An unhandled error occurred:", err);
        process.exit(1);
    }
})();