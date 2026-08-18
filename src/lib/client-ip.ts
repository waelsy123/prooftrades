import { NextRequest } from "next/server";

// Real client IP. Order matters:
// 1. CF-Connecting-IP — set by Cloudflare when the zone record is proxied
//    (Traefik passes it through; XFF gets rewritten to the CF edge IP).
// 2. X-Forwarded-For first hop — direct (DNS-only) traffic via Traefik.
// 3. x-real-ip fallback.
export function clientIp(request: NextRequest): string | null {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}
