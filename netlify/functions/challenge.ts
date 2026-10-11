import type { Config } from "@netlify/functions";

// OpenAI apps domain verification token (public by design; not a secret).
const TOKEN = "5bj9f0pipMt10dYjlfhJKij0Wzh25wMnfA5tq3VYYlk";

export default async () =>
  new Response(TOKEN, { status: 200, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });

export const config: Config = { path: "/.well-known/openai-apps-challenge" };
