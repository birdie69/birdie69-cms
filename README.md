# birdie69-cms

> Strapi v5 Content Management System for **birdie69** — manages the daily question bank.

**Status:** Scaffold pending (Day 3)

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

See [birdie69-docs/ARCHITECTURE_OVERVIEW.md](https://github.com/learn-claude/birdie69-docs/blob/main/ARCHITECTURE_OVERVIEW.md) — CMS Architecture section.

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

## Jira

[B69 Project](https://narwhal.atlassian.net/projects/B69) — Ticket: B69-3
