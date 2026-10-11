import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { LIBRARY, THEMES, SHADES, SHADE_IDS, lineForDate, findLines, getLine, type ShadeId } from "./library.js";
import { WIDGET_URI, WIDGET_HTML } from "./widget.js";

const SHOP_URL = process.env.SHOP_URL || "https://keepgivelive.com";
const MIME = "text/html;profile=mcp-app";

const INSTRUCTIONS = `Inspire by KGL is a small, verified library of lines. Use only lines returned by these tools; never invent, paraphrase or attribute a quote yourself. Show a line with its source. To show a card, call get_daily_line or find_lines first, then show_card with the line id. Speak plainly and quietly: no hype, no "manifest", no "lucky" or "your color". Shades are offered as a choice, never assigned. After show_card, the card is already on screen: do not redraw, restyle or repeat it; add at most one short sentence. Everything here is free; nothing digital is sold.`;

const lineSchema = z.object({
  id: z.string(),
  text: z.string(),
  source: z.string(),
  translation: z.string().nullable(),
  publicDomain: z.boolean(),
  proofUrl: z.string().nullable(),
  themes: z.array(z.string()),
  status: z.string(),
});

const todayIso = () => new Date().toISOString().slice(0, 10);

export function createServer(): McpServer {
  const server = new McpServer({ name: "inspire-by-kgl", version: "0.1.0" }, { instructions: INSTRUCTIONS });

  server.registerResource(
    "inspire-card",
    WIDGET_URI,
    { title: "Inspire card", mimeType: MIME },
    async () => ({
      contents: [
        {
          uri: WIDGET_URI,
          mimeType: MIME,
          text: WIDGET_HTML,
          _meta: {
            ui: {
              prefersBorder: false,
              csp: {
                connectDomains: [],
                resourceDomains: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
              },
            },
            "openai/widgetDescription": "A single line from the Inspire library, set on a card with its source. The card is shown to the user; do not repeat it.",
            "openai/widgetPrefersBorder": false,
            "openai/widgetCSP": {
              connect_domains: [],
              resource_domains: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
            },
          },
        },
      ],
    }),
  );

  server.registerTool(
    "get_daily_line",
    {
      title: "Today's line",
      description:
        "Use when the user wants today's line, a daily quote, or something to start the day. Returns one line from the Inspire library with its source. Everyone sees the same line on the same day.",
      inputSchema: { date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("ISO date, YYYY-MM-DD. Defaults to today (UTC).") },
      outputSchema: { date: z.string(), line: lineSchema },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    },
    async ({ date }) => {
      const d = date ?? todayIso();
      const line = lineForDate(d);
      return {
        structuredContent: { date: d, line },
        content: [{ type: "text", text: `${line.text} — ${line.source} (id: ${line.id})` }],
      };
    },
  );

  server.registerTool(
    "find_lines",
    {
      title: "Find lines",
      description:
        "Use when the user asks for a line about a theme (keep, give, live, enough, rest, gratitude) or with certain words. Returns matching lines from the library only. If nothing matches, say so; do not write a substitute quote.",
      inputSchema: {
        theme: z.enum(THEMES as [string, ...string[]]).optional(),
        query: z.string().max(80).optional().describe("Words to look for in the line"),
        limit: z.number().int().min(1).max(10).optional(),
      },
      outputSchema: { lines: z.array(lineSchema) },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    },
    async ({ theme, query, limit }) => {
      const lines = findLines(theme as any, query, limit ?? 5);
      const text = lines.length
        ? lines.map((l) => `${l.text} — ${l.source} (id: ${l.id})`).join("\n")
        : "No line in the library matches that yet.";
      return { structuredContent: { lines }, content: [{ type: "text", text }] };
    },
  );

  server.registerTool(
    "show_card",
    {
      title: "Show card",
      description:
        "Use after get_daily_line or find_lines to show a line as a card. Pass the line id. The user may pick a shade (bamboo, cinnabar, loess, frost, pine); if they don't, leave it out. Never tell the user a shade is theirs or lucky.",
      inputSchema: {
        lineId: z.string().describe("A line id from get_daily_line or find_lines"),
        shade: z.enum(SHADE_IDS as [string, ...string[]]).optional(),
      },
      outputSchema: { line: lineSchema, shade: z.object({ id: z.string(), name: z.string(), hex: z.string() }), shopUrl: z.string() },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      _meta: {
        ui: { resourceUri: WIDGET_URI },
        "openai/outputTemplate": WIDGET_URI,
        "openai/toolInvocation/invoking": "Setting the card…",
        "openai/toolInvocation/invoked": "Card ready",
      },
    },
    async ({ lineId, shade }) => {
      const line = getLine(lineId);
      if (!line) {
        return { isError: true, content: [{ type: "text", text: `No line with id ${lineId}. Call find_lines or get_daily_line first.` }] };
      }
      const id = (shade as ShadeId) ?? SHADE_IDS[LIBRARY.indexOf(line) % SHADE_IDS.length];
      const s = { id, ...SHADES[id] };
      return {
        structuredContent: { line, shade: s, shopUrl: SHOP_URL },
        content: [{ type: "text", text: `The card for "${line.text}" (${line.source}, ${s.name}) is now displayed to the user. Do not redraw or repeat it; reply with one short sentence at most.` }],
      };
    },
  );

  return server;
}
