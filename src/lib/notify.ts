// Fire-and-forget ops notification via the fleet's central notify hub
// (Telegram devops channel + email). Never throws, never blocks the caller.
// NOTIFY_URL = https://hooks.wael.today/notify/<secret> (Coolify env).
export function notifyOps(title: string, message: string, level: "critical" | "warning" | "info" | "ok" = "info"): void {
  const url = process.env.NOTIFY_URL;
  if (!url) return;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, message, level }),
  }).catch(() => {});
}
