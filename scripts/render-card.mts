import { WIDGET_HTML } from "../src/widget.ts";
import { chromium } from "playwright";
const S = process.argv[2];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const [name, shade, text, w] of [["loess","#C79A3E","Not all giving must be announced.",560],["frost","#ECEDEC","Keep. Give. Live.",380],["pine","#1D2026","Doing one without the others leads to chaos.",560]] as const) {
  const page = await browser.newPage({ viewport: { width: w, height: 420 }, deviceScaleFactor: 2 });
  const data = { line: { id: "x", text, source: "Keep. Give. Live.", translation: null }, shade: { id: name, name, hex: shade }, shopUrl: "https://keepgivelive.com" };
  await page.addInitScript({ content: `window.openai = { toolOutput: ${JSON.stringify(data)}, widgetState: null, setWidgetState: async () => {} };` });
  await page.route("**/card.html", r => r.fulfill({ contentType: "text/html", body: WIDGET_HTML }));
  await page.goto("http://inspire.local/card.html");
  await page.waitForSelector(".line", { timeout: 15000 });
  if (name === "pine") await page.click("#keep");
  await page.screenshot({ path: `${S}/card-${name}.png`, fullPage: true });
}
await browser.close();
