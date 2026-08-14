# AGENTS.md

Guidance for AI coding agents working on this repository.

## What this is

ProofTrades — prop-firm challenge tracker & cashback leaderboard. Next.js + Prisma +
node-cron (in-process sync from the MT5 fleet orchestrator).

## Where it runs (IMPORTANT)

Self-hosted **Coolify**, server `worker-1` (167.86.102.187) — **NOT Railway** (migrated
2026-08-14; the Railway service in project `mt5-fleet-orchestrator` is a dormant fallback,
its DB is stale).

- App uuid `huqoaz5gatqhyovgmhmpjygw`, domain **https://prooftrades.com**, port 3000,
  Dockerfile build (`prisma db push` on boot).
- DB: Coolify Postgres 18 `leaderboard-db` (uuid `76wqmyx9wiiykgvne6zfuy0u`, db `leaderboard_db`).
- `ORCHESTRATOR_URL=https://mt5-orch.wael.today` (rewritten at migration from the old
  Railway URL — keep pointing at the custom domain, never a *.railway.app host).
- Push to `main` **auto-deploys** (GitHub webhook → Coolify). Dashboard: https://cool.wael.today.
- Secrets (JWT_SECRET, ORCHESTRATOR_API_KEY) live as Coolify envs — never commit.
- **prooftrades.com is a Railway-purchased domain**: DNS is managed via Railway's GraphQL API
  (workspace must stay alive), currently apex A → 167.86.102.187.

## Database rules

- Live DB is the Coolify one; migrated 2026-08-14 (count-verified, ~4 min gap). Railway DB is stale.
- `prisma db push --skip-generate` runs on container start.
- No automated backups yet (S3 pending) — treat destructive DB ops as unrecoverable.

## Local development

```bash
npm install && npm run dev   # needs DATABASE_URL (+ orchestrator vars for sync)
```
