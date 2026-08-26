#!/usr/bin/env node
/**
 * Web41 Mockup CLI
 *
 * Screenshots a page and composites it into a device render, using the very
 * same renderer as studio.html — the HTML file is loaded headlessly and driven
 * through its window.__mockup API, so the CLI and the GUI can never drift.
 *
 *   node capture.mjs --url http://localhost:3000/projections --out projections.webp
 *   node capture.mjs --file ./shot.png --device phone --bg acid
 *   node capture.mjs --all
 *
 * Run `npm install` in this folder once before first use.
 */

import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const STUDIO = path.join(HERE, "studio.html");
const CONFIG = path.join(HERE, "projects.json");
const OUT_DIR = path.resolve(HERE, "..", "..", "public", "images", "projects");

const DEFAULTS = {
  device: "laptop",
  bg: "dark",
  finish: "silver",
  fit: "top",
  size: 78,
  reflect: true,
  glare: true,
  w: 628,
  h: 500,
  wait: 1200,
  full: true,
  hide: "",
  quality: 0.92
};

/* ------------------------------ args ------------------------------ */

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      out[key] = true;
    } else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function bool(v, fallback) {
  if (v === undefined) return fallback;
  if (v === true || v === "true" || v === "1" || v === "yes") return true;
  if (v === false || v === "false" || v === "0" || v === "no") return false;
  return fallback;
}

/* Turn CLI flags / config entries into the shape window.__mockup.set wants. */
function toOptions(src) {
  const o = { ...DEFAULTS, ...src };
  const custom = typeof o.bg === "string" && o.bg.startsWith("#");
  return {
    device: o.device,
    finish: o.finish,
    fit: o.fit,
    size: num(o.size, DEFAULTS.size),
    reflect: bool(o.reflect, DEFAULTS.reflect),
    glare: bool(o.glare, DEFAULTS.glare),
    bg: custom ? "custom" : o.bg,
    custom: custom ? o.bg : "#3E5BFF",
    w: num(o.w, DEFAULTS.w),
    h: num(o.h, DEFAULTS.h)
  };
}

/* ------------------------------ capture ------------------------------ */

const VIEWPORTS = {
  laptop:  { width: 1440, height: 1400 },
  browser: { width: 1440, height: 1400 },
  phone:   { width: 430,  height: 1500 }
};

async function screenshotUrl(browser, url, opts) {
  const vp = VIEWPORTS[opts.device] || VIEWPORTS.laptop;
  const ctx = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: 2,
    isMobile: opts.device === "phone",
    hasTouch: opts.device === "phone"
  });
  const page = await ctx.newPage();

  let res;
  try {
    res = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    // networkidle never settles on pages with polling or long-lived sockets
    res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  }

  // a 404 page still screenshots fine — catch it here rather than shipping it
  if (res && !res.ok()) {
    await ctx.close();
    throw new Error(`${url} returned ${res.status()} — check the route`);
  }

  if (opts.hide) {
    await page.addStyleTag({
      content: opts.hide.split(",").map((s) => `${s.trim()}{display:none !important}`).join("\n")
    });
  }

  // let fonts settle and scroll once so lazy images and reveal animations fire
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(num(opts.wait, DEFAULTS.wait));

  const buf = await page.screenshot({ fullPage: bool(opts.full, DEFAULTS.full), type: "png" });
  await ctx.close();
  return buf;
}

/* ------------------------------ render ------------------------------ */

async function openStudio(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("file://" + STUDIO.split(path.sep).join("/"));
  await page.waitForFunction(() => !!window.__mockup, null, { timeout: 15000 });
  return { ctx, page, errors };
}

async function renderOne(page, pngBuffer, opts, fmt, quality) {
  const dataUrl = "data:image/png;base64," + pngBuffer.toString("base64");
  await page.evaluate((d) => window.__mockup.setImage(d), dataUrl);
  await page.evaluate((o) => window.__mockup.set(o), opts);
  const out = await page.evaluate(
    ([t, q]) => window.__mockup.toDataURL(t, q),
    [fmt === "png" ? "image/png" : "image/webp", quality]
  );
  return Buffer.from(out.split(",")[1], "base64");
}

/* ------------------------------ jobs ------------------------------ */

async function resolveJobs(args) {
  if (args.all) {
    let raw;
    try {
      raw = JSON.parse(await fs.readFile(CONFIG, "utf8"));
    } catch (e) {
      throw new Error(`Could not read ${path.relative(process.cwd(), CONFIG)} — ${e.message}`);
    }
    const shared = raw.defaults || {};
    const list = Array.isArray(raw.projects) ? raw.projects : [];
    if (!list.length) throw new Error("projects.json has no entries under \"projects\".");
    return list
      .filter((p) => !p.skip)
      .map((p) => ({ ...shared, ...p, out: p.out || `${p.slug}.webp` }));
  }

  if (!args.url && !args.file) {
    throw new Error("Give me something to render: --url <address>, --file <image>, or --all.");
  }

  const name =
    args.out ||
    (args.url
      ? (new URL(args.url).pathname.split("/").filter(Boolean).pop() || "home") + ".webp"
      : path.basename(String(args.file)).replace(/\.[^.]+$/, "") + ".webp");

  return [{ ...args, out: name }];
}

/* ------------------------------ main ------------------------------ */

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    console.log(`
Web41 Mockup CLI

  --url <address>      page to screenshot (a running dev server is fine)
  --file <image>       use an existing screenshot instead of capturing one
  --all                render every entry in projects.json
  --out <name>         output filename (default: derived from url/file)
  --outdir <path>      output folder (default: ../../public/images/projects)

  --device laptop|phone|browser     default laptop
  --bg dark|light|acid|ink|#hex     default dark
  --finish silver|black             default silver
  --fit top|whole                   default top
  --size <45-96>                    default 78
  --w <px> --h <px>                 default 628 x 500
  --reflect true|false              default true
  --glare true|false                default true

  --wait <ms>          settle time after load (default 1200)
  --full true|false    full-page capture (default true)
  --hide "<selectors>" comma-separated selectors to hide before capture
  --format webp|png    default webp
`.trim());
    return;
  }

  const jobs = await resolveJobs(args);
  const outDir = path.resolve(args.outdir || OUT_DIR);
  await fs.mkdir(outDir, { recursive: true });

  const fmt = args.format === "png" ? "png" : "webp";
  const quality = num(args.quality, DEFAULTS.quality);

  const browser = await chromium.launch();
  const { ctx, page, errors } = await openStudio(browser);

  const done = [];
  const failed = [];

  for (const job of jobs) {
    const label = job.url || job.file;
    try {
      let png;
      if (job.url) {
        png = await screenshotUrl(browser, job.url, { ...DEFAULTS, ...job });
      } else {
        const p = path.resolve(String(job.file));
        png = await fs.readFile(p);
      }

      const buf = await renderOne(page, png, toOptions(job), fmt, quality);
      const outName = job.out.endsWith(`.${fmt}`) ? job.out : job.out.replace(/\.[^.]+$/, "") + `.${fmt}`;
      const dest = path.join(outDir, outName);
      await fs.writeFile(dest, buf);

      const kb = (buf.length / 1024).toFixed(1);
      console.log(`  ok  ${outName.padEnd(28)} ${String(kb).padStart(6)} KB   ${label}`);
      done.push(outName);
    } catch (e) {
      console.error(`  --  ${String(job.out).padEnd(28)} ${e.message}`);
      failed.push({ job: job.out, reason: e.message });
    }
  }

  await ctx.close();
  await browser.close();

  if (errors.length) {
    console.error("\nRenderer reported errors:");
    errors.forEach((e) => console.error("  " + e));
  }

  console.log(`\n${done.length} image${done.length === 1 ? "" : "s"} written to ${path.relative(process.cwd(), outDir) || "."}`);
  if (failed.length) {
    console.log(`${failed.length} failed.`);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("\n" + e.message);
  if (String(e.message).includes("playwright")) {
    console.error("Install it first:  cd tools/mockup && npm install");
  }
  process.exit(1);
});
