import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const CHROME = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9336;
const userData = mkdtempSync(join(tmpdir(), "article-measure-"));
const htmlPath = join(userData, "fixture.html");

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { margin: 0; font-family: system-ui; }
  .wrap { padding-left: 30px; }
  .m-0 { margin: 0; }
  .text-18 { font-size: 18px; }
  .text-16 { font-size: 16px; }
  .w-334 { width: 334px; max-width: 100%; }
  .flex { display: flex; }
  .items-center { align-items: center; }
  .line-clamp-4 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }
  .hidden { display: none; }
  @media (min-width: 1024px) {
    .lg-hidden { display: none !important; }
    .lg-block { display: block !important; }
    .lg-mt-22 { margin-top: 22px; }
    .lg-text-24 { font-size: 24px; }
    .lg-text-18 { font-size: 18px; }
    .lg-w-673 { width: 673px; }
  }
  @media (max-width: 1023px) {
    .course-article-download-icon { width: 26px; height: 24px; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <hr id="header-hr" style="margin:0;width:359px;border:0;border-top:1px solid #000;opacity:.6" />
    </header>
    <article id="lesson-intro">
      <div class="lg-hidden" style="height:35px"></div>
      <h2 class="m-0 text-18 lg-text-24">Introduction</h2>
      <div class="lg-hidden" style="height:12px"></div>
      <div class="lg-mt-22">
        <p class="m-0 w-334 text-16 lg-w-673 lg-text-18">The Ultimate Digital Painting Course will show you how to create advanced art that will stand up as professional work. This course will enhance or give you skills in the world of Digital Painting - or your money back.</p>
      </div>
      <div class="lg-hidden" style="height:35px"></div>
      <div class="hidden lg-block" style="height:48px"></div>
      <hr style="margin:0;width:359px;border:0;border-top:1px solid #000;opacity:.6" />
      <div class="hidden lg-block" style="height:24px"></div>
    </article>
    <article id="lesson-article">
      <div class="lg-hidden" style="height:35px"></div>
      <h2 class="m-0 text-18 lg-text-24">Course materials</h2>
      <div class="lg-hidden" style="height:20px"></div>
      <div class="lg-mt-22">
        <p id="article-body" class="m-0 line-clamp-4 w-334 text-16 lg-w-673 lg-text-18">The Ultimate Digital Painting Course will show you how to create advanced art that will stand up as professional work. This course will enhance or give you skills in the world of Digital Painting - or your money back.\\n\\nThe course is your track to obtaining digital drawing & painting skills like you always knew you should have! Whether for your own projects or to paint for clients.</p>
      </div>
      <div class="lg-hidden" style="height:38px"></div>
      <div class="hidden lg-block" style="height:39px"></div>
      <div class="flex items-center">
        <button id="view-btn" aria-expanded="false" style="display:flex;width:112px;height:42px;padding:0 16px;justify-content:center;align-items:center;border-radius:8px;border:1px solid #000;background:#FF8CFF;box-sizing:border-box">VIEW</button>
        <span style="margin-left:18px;display:inline-flex;align-items:center">
          <svg width="26" height="24" viewBox="0 0 28 26"></svg>
        </span>
        <span style="margin-left:12px;display:inline-flex;align-items:center">
          <svg class="course-article-download-icon" width="27" height="27" viewBox="0 0 29 29"></svg>
        </span>
      </div>
      <div class="lg-hidden" style="height:35px"></div>
      <div class="hidden lg-block" style="height:48px"></div>
      <hr style="margin:0;width:359px;border:0;border-top:1px solid #000;opacity:.6" />
    </article>
  </div>
  <script>
    document.getElementById('view-btn').onclick = function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      this.textContent = expanded ? 'VIEW' : 'LESS';
      document.getElementById('article-body').classList.toggle('line-clamp-4', expanded);
    };
  </script>
</body>
</html>`;

writeFileSync(htmlPath, html);
const PAGE_URL = pathToFileURL(htmlPath).href;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForJson(path, tries = 50) {
  for (let i = 0; i < tries; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}${path}`);
      if (res.ok) return res.json();
    } catch {}
    await sleep(200);
  }
  throw new Error(`CDP not ready: ${path}`);
}

function attachWs(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(String(ev.data));
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", (err) => reject(err));
  });
  async function send(method, params = {}) {
    await ready;
    id += 1;
    const current = id;
    const result = new Promise((resolve, reject) => {
      pending.set(current, { resolve, reject });
    });
    ws.send(JSON.stringify({ id: current, method, params }));
    return result;
  }
  return { ws, send, ready };
}

const MEASURE_FN = `(() => {
  const gap = (a, b) => Math.round((b.top - a.bottom) * 10) / 10;
  const measure = (el, kind, precedingHr) => {
    const h2 = el.querySelector("h2");
    const body = el.querySelector("p");
    const btn = el.querySelector("button");
    const trailingHr = el.querySelector("hr");
    const heart = el.querySelector("svg[viewBox='0 0 28 26']");
    const download = el.querySelector(".course-article-download-icon");
    const h2r = h2.getBoundingClientRect();
    const bodyr = body.getBoundingClientRect();
    const btnr = btn?.getBoundingClientRect();
    const hrr = trailingHr.getBoundingClientRect();
    const phr = precedingHr.getBoundingClientRect();
    return {
      kind,
      titleFromHr: gap(phr, h2r),
      titleToBody: gap(h2r, bodyr),
      bodyToButton: btnr ? gap(bodyr, btnr) : null,
      buttonToHr: btnr ? gap(btnr, hrr) : gap(bodyr, hrr),
      titleFontSize: getComputedStyle(h2).fontSize,
      bodyFontSize: getComputedStyle(body).fontSize,
      bodyWidth: Math.round(bodyr.width),
      buttonSize: btnr ? { w: Math.round(btnr.width), h: Math.round(btnr.height) } : null,
      heart: heart ? { w: Math.round(heart.getBoundingClientRect().width), h: Math.round(heart.getBoundingClientRect().height) } : null,
      download: download ? { w: Math.round(download.getBoundingClientRect().width), h: Math.round(download.getBoundingClientRect().height) } : null,
      viewLabel: btn?.textContent?.trim() || null,
      expanded: btn?.getAttribute("aria-expanded") || null,
      clamped: getComputedStyle(body).webkitLineClamp,
      left: Math.round(h2r.left),
    };
  };
  const intro = document.getElementById("lesson-intro");
  const article = document.getElementById("lesson-article");
  return {
    width: window.innerWidth,
    intro: measure(intro, "intro", document.getElementById("header-hr")),
    article: measure(article, "article", intro.querySelector("hr")),
  };
})()`;

const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    `--user-data-dir=${userData}`,
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ],
  { stdio: "ignore" }
);

const targets = await waitForJson("/json/list");
const page = (Array.isArray(targets) ? targets : []).find((t) => t.webSocketDebuggerUrl && t.type === "page");
if (!page) throw new Error(`No page: ${JSON.stringify(targets)}`);
const { send, ws } = attachWs(page.webSocketDebuggerUrl);
await send("Runtime.enable");
await send("Page.enable");

async function measureAt(width, clickView) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 2400,
    deviceScaleFactor: 1,
    mobile: width < 1024,
  });
  await send("Page.navigate", { url: PAGE_URL });
  await sleep(800);
  if (clickView) {
    await send("Runtime.evaluate", { expression: `document.getElementById("view-btn").click()` });
    await sleep(200);
  }
  const result = await send("Runtime.evaluate", { expression: MEASURE_FN, returnByValue: true });
  return result.result?.value ?? result;
}

try {
  const mobile = await measureAt(390, false);
  const mobileExpanded = await measureAt(390, true);
  const desktop = await measureAt(1280, false);
  console.log(JSON.stringify({ mobile, mobileExpanded, desktop }, null, 2));
} finally {
  try { ws.close(); } catch {}
  try { chrome.kill(); } catch {}
}
