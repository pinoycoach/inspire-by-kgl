# Inspire by KGL — MCP server

One engine for the ChatGPT plugin now and the Claude plugin next. Read The KGL Bible first.

## What it does

| Tool | Purpose |
| --- | --- |
| `get_daily_line` | Today's line (same for everyone on a given UTC day) |
| `find_lines` | Lines by theme (keep, give, live, enough, rest, gratitude) or words |
| `show_card` | Renders the line as a KGL card (Paper, Ink, one of five shades) with Keep / Give / Live |

Nothing is sold. Live opens the KGL shop (`SHOP_URL`, default https://keepgivelive.com) — never a checkout page.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000/mcp
npx @modelcontextprotocol/inspector   # choose Streamable HTTP, enter the URL
```

## Deploy (Netlify)

1. Push this folder to a GitHub repo and import it in Netlify (no build step; the function lives in `netlify/functions/mcp.ts`, served at `/mcp`).
2. Optional env var: `SHOP_URL`.
3. Point a subdomain such as `inspire.keepgivelive.com` at the site.
4. In ChatGPT, turn on developer mode and add the connector with `https://<site>/mcp` to test before review.

## The library

`src/library.ts`. Every line has `source`, `translation`, `publicDomain`, `proofUrl`, `themes`, `status`.
The current lines are a **sample** taken from Cash's own stated KGL lines. Replace them with the approved first pack before submitting. Nothing enters the library without passing the Jev gate and Cash's yes.

## Preview the card

`npx -p playwright tsx scripts/render-card.mts <out-dir>` writes PNG previews of the widget (needs a local Chromium).
