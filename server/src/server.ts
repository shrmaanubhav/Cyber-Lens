// server/src/server.ts

import "dotenv/config";
import app from "./app";
import { testConnection } from "./db";
import { runMigrations } from "./db/migrate";
import { startNewsCron } from "./cron/newsCron";
import { runNewsScraper } from "./services/newsScraper";

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

async function startServer() {
  try {
    // 1. Database connection check
    await testConnection();
    console.log("Database connection successful");

    // 2. Run migrations only if enabled (recommended for deployment)
    if (process.env.RUN_MIGRATIONS === "true") {
      console.log("Running migrations...");
      await runMigrations();
      console.log("Migrations completed");
    }

    // 3. Start cron + scraper
    startNewsCron();
    console.log("News scraper cron started");

    runNewsScraper().catch((err) => {
      console.error("Initial news scrape failed:", err);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }

  // 4. Start server (bind to 0.0.0.0 for Railway/Render/Fly)
  const server = app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });

  // 5. Handle server errors
  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use`);
    } else {
      console.error("Server error:", err);
    }
    process.exit(1);
  });

  // 6. Graceful shutdown (optional but good)
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down...");
    server.close(() => process.exit(0));
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received. Shutting down...");
    server.close(() => process.exit(0));
  });
}

startServer();
