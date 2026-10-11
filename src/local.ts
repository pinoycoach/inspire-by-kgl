// Local dev server: http://localhost:3000/mcp
import http from "node:http";
import { handleMcp } from "./handler.js";

const port = Number(process.env.PORT || 3000);

http
  .createServer(async (req, res) => {
    if (!req.url?.startsWith("/mcp")) {
      res.writeHead(200, { "content-type": "text/plain" }).end("Inspire by KGL MCP server. Endpoint: /mcp");
      return;
    }
    const chunks: Buffer[] = [];
    for await (const c of req) chunks.push(c as Buffer);
    const body = chunks.length ? Buffer.concat(chunks) : undefined;
    const request = new Request(`http://localhost:${port}${req.url}`, {
      method: req.method,
      headers: req.headers as Record<string, string>,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
    });
    const response = await handleMcp(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  })
  .listen(port, () => console.log(`Inspire MCP on http://localhost:${port}/mcp`));
