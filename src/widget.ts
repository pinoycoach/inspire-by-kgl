// The Inspire card, rendered inside ChatGPT (MCP Apps / window.openai).
// House look: Paper field, Ink type, one of the five shades as a quiet band.

export const WIDGET_URI = "ui://inspire/card-v1.html";

export const WIDGET_HTML = /* html */ `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
<style>
  :root {
    --paper: #F3EEE4; --ink: #2A2218; --oxblood: #6E3030; --quiet: #6B6358;
    --shade: #1D2026; --rule: rgba(42,34,24,.14);
  }
  * { box-sizing: border-box; margin: 0; }
  html, body { background: transparent; }
  body { font-family: Inter, system-ui, sans-serif; color: var(--ink); padding: 4px; }
  .card {
    background: var(--paper); border-radius: 14px; overflow: hidden;
    border: 1px solid var(--rule); max-width: 560px; margin: 0 auto;
  }
  .band { height: 10px; background: var(--shade); border-bottom: 1px solid var(--rule); }
  .body { padding: 40px 32px 28px; text-align: center; }
  .line {
    font-family: "Cormorant Garamond", Georgia, serif; font-weight: 500;
    font-size: clamp(26px, 6vw, 36px); line-height: 1.2; letter-spacing: .005em;
    text-wrap: balance;
  }
  .source { margin-top: 18px; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--quiet); }
  .translation { margin-top: 4px; font-size: 12px; color: var(--quiet); font-style: italic; }
  .foot {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 14px 20px; border-top: 1px solid var(--rule); flex-wrap: wrap;
  }
  .mark { font-family: "Cormorant Garamond", Georgia, serif; font-size: 15px; font-weight: 600; letter-spacing: .02em; }
  .mark span { color: var(--quiet); font-weight: 500; font-style: italic; }
  .acts { display: flex; gap: 8px; }
  button {
    font: 500 13px Inter, system-ui, sans-serif; color: var(--ink); background: transparent;
    border: 1px solid var(--ink); border-radius: 999px; padding: 8px 16px; cursor: pointer; min-height: 36px;
  }
  button:hover { background: rgba(42,34,24,.06); }
  button:focus-visible { outline: 2px solid var(--oxblood); outline-offset: 2px; }
  button.done { border-color: var(--oxblood); color: var(--oxblood); }
  .note { text-align: center; font-size: 12px; color: var(--quiet); min-height: 18px; padding: 6px 0 2px; }
  .empty { padding: 48px 24px; text-align: center; color: var(--quiet); font-size: 14px; }
</style>
</head>
<body>
<div id="root"><div class="card"><div class="empty">Finding a line…</div></div></div>
<script type="module">
  const root = document.getElementById("root");
  let current = null;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function render(data) {
    if (!data || !data.line) return;
    current = data;
    const { line, shade } = data;
    root.innerHTML = \`
      <div class="card" style="--shade:\${esc(shade?.hex || "#1D2026")}">
        <div class="band" aria-hidden="true"></div>
        <div class="body">
          <p class="line">\${esc(line.text)}</p>
          <p class="source">\${esc(line.source)}</p>
          \${line.translation ? \`<p class="translation">\${esc(line.translation)}</p>\` : ""}
        </div>
        <div class="foot">
          <div class="mark">Inspire <span>by KGL</span></div>
          <div class="acts">
            <button id="keep" type="button">Keep</button>
            <button id="give" type="button">Give</button>
            <button id="live" type="button">Live</button>
          </div>
        </div>
      </div>
      <p class="note" id="note" role="status"></p>\`;
    const kept = window.openai?.widgetState?.kept;
    if (kept) mark("keep", "Kept");
    document.getElementById("keep").onclick = keep;
    document.getElementById("give").onclick = give;
    document.getElementById("live").onclick = live;
  }

  function mark(id, label) { const b = document.getElementById(id); if (b) { b.textContent = label; b.classList.add("done"); } }
  function note(t) { const n = document.getElementById("note"); if (n) n.textContent = t; }

  async function keep() {
    try { await window.openai?.setWidgetState?.({ kept: true, lineId: current.line.id }); } catch {}
    mark("keep", "Kept");
    note("Kept in this conversation.");
  }

  async function give() {
    const text = \`\${current.line.text}\\n— \${current.line.source}\`;
    try {
      if (navigator.share) { await navigator.share({ text }); mark("give", "Given"); return; }
    } catch {}
    try { await navigator.clipboard.writeText(text); mark("give", "Copied"); note("Copied. Pass it to someone."); }
    catch { note(text); }
  }

  function live() {
    const href = current.shopUrl;
    if (window.openai?.openExternal) window.openai.openExternal({ href });
    else window.open(href, "_blank", "noopener");
  }

  // ChatGPT: window.openai globals
  render(window.openai?.toolOutput);
  window.addEventListener("openai:set_globals", (e) => render(e.detail?.globals?.toolOutput ?? window.openai?.toolOutput));

  // MCP Apps bridge: tool-result notification over postMessage
  window.addEventListener("message", (e) => {
    const m = e.data;
    if (m && m.method === "ui/notifications/tool-result") render(m.params?.structuredContent);
  });
</script>
</body>
</html>`;
