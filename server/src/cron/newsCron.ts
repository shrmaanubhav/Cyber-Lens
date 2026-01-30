import cron from "node-cron";
import { runNewsScraper } from "../services/newsScraper";

let isRunning = false;

export function startNewsCron(): void {
    cron.schedule("0 * * * *", async () => {
        if (isRunning) {
            console.log("[CRON] News scraper already running, skipping");
            return;
        }
        isRunning = true;
        console.log("[CRON] Running news scraper");

        try {
            await runNewsScraper();
            console.log("[CRON] News scraper completed");
        } catch (err) {
            console.error("[CRON] News scraper failed", err);
        } finally {
            isRunning = false;
        }
    });
}