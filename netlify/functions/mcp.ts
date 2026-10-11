import type { Config } from "@netlify/functions";
import { handleMcp } from "../../src/handler.js";

export default async (req: Request) => handleMcp(req);

export const config: Config = {
  path: "/mcp",
  // A public endpoint an agent could call in a loop: cap it.
  rateLimit: { windowSize: 60, windowLimit: 120, aggregateBy: ["ip", "domain"] },
};
