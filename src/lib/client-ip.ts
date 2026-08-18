import { NextRequest } from "next/server";

// Real client IP behind the Coolify/Traefik proxy: first hop of
// X-Forwarded-For (Traefik appends the peer it saw), else x-real-ip.
export function clientIp(request: NextRequest): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}
