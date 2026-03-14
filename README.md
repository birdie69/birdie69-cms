# birdie69-cms

> Strapi v5 Content Management System for **birdie69** — manages the daily question bank.

**Status:** ✅ Scaffold complete (Day 3 — 2026-03-10)

---

## Overview

Strapi v5 CMS used exclusively for **question bank management**.  
Content editors create, categorize, and schedule daily questions here.  
The `.NET 8 API` reads questions from Strapi (read-only, via API token).

## Content Types

| Type | Fields | Description |
|------|--------|-------------|
| `Question` | title, body, category, scheduledDate, tags, isActive | Daily question |

## Architecture

See [birdie69-docs/ARCHITECTURE_OVERVIEW.md](https://github.com/birdie69/birdie69-docs/blob/main/ARCHITECTURE_OVERVIEW.md) — CMS Architecture section.

## Prerequisites

- Node.js 20+
- Docker Desktop (for PostgreSQL)

## Development

```bash
# Start dependencies
docker compose up -d

# Install dependencies
npm install

# Start Strapi in dev mode
npm run develop
```

## Seeding Question Bank

The seed script creates 28 questions (today through today+27), distributed evenly across four categories (`fun`, `values`, `deep`, `future`). It is **idempotent** — running it multiple times will not create duplicates; any date that already has a question is skipped.

### 1. Start Strapi locally

```bash
# Start PostgreSQL
docker-compose up -d

# Install dependencies (first time only)
npm install

# Start Strapi in dev mode
npm run develop
```

Strapi will be available at http://localhost:1337.

### 2. Get an admin API token

1. Open the Strapi admin panel at http://localhost:1337/admin
2. Navigate to **Settings → API Tokens**
3. Click **Create new API Token**
4. Set **Token type** to **Full access**, give it a name (e.g. `seed-script`), and save
5. Copy the generated token — it is shown only once

### 3. Run the seed script

```bash
STRAPI_ADMIN_TOKEN=<your-token> npx ts-node scripts/seed-questions.ts
```

To target a different Strapi instance, also set `STRAPI_URL`:

```bash
STRAPI_URL=https://cms.birdie69.app STRAPI_ADMIN_TOKEN=<your-token> npx ts-node scripts/seed-questions.ts
```

The script prints each action (`CREATE` or `SKIP`) and a summary on completion.

### 4. Verify

```bash
curl "http://localhost:1337/api/questions?pagination[pageSize]=30" \
  -H "Authorization: Bearer <your-token>"
```

Expected: 28 records in `data`.

---

## Jira

[B69 Project](https://narwhal.atlassian.net/projects/B69) — Tickets: B69-3, B69-17
