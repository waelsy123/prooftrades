export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Error tracking → self-hosted Bugsink (bugs.wael.today). No-op when
    // SENTRY_DSN is unset. console.error calls become events; uncaught
    // exceptions / unhandled rejections are captured by default.
    if (process.env.SENTRY_DSN) {
      const Sentry = await import("@sentry/node");
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.SENTRY_ENVIRONMENT || "production",
        integrations: [Sentry.captureConsoleIntegration({ levels: ["error"] })],
        tracesSampleRate: 0,
      });
      console.log("[sentry] error tracking enabled");
    }
    const cron = await import("node-cron");
    const { syncAllAccounts, cleanupSnapshots } = await import("./lib/sync");

    // Sync every 5 minutes
    cron.default.schedule("*/5 * * * *", async () => {
      console.log("[cron] Running sync...");
      try {
        await syncAllAccounts();
      } catch (err) {
        console.error("[cron] Sync failed:", err);
      }
    });

    // Cleanup old snapshots daily at 3am
    cron.default.schedule("0 3 * * *", async () => {
      try {
        await cleanupSnapshots();
      } catch (err) {
        console.error("[cron] Cleanup failed:", err);
      }
    });

    console.log("[cron] Sync scheduled every 5 minutes");
  }
}
