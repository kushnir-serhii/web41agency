# Mockup tool

Turns a page into a portfolio image: screenshots it, drops it into a device
render, writes a 628 × 500 WebP into `public/images/projects/`.

No Figma file and no mockup plugin — nothing here has a free-tier limit.

## Install (once)

```bash
cd tools/mockup
npm install
```

That pulls Playwright and one Chromium build (~150 MB) into `tools/mockup/node_modules`.
The site's own `package.json` is untouched.

## Use

Start the dev server in another terminal (`npm run dev`), then:

```bash
cd tools/mockup

# one page
npm run mockup -- --url http://localhost:3000/projections

# a live site
npm run mockup -- --url https://example.com --bg light

# an existing screenshot
npm run mockup -- --file ~/Desktop/shot.png --device phone --bg acid

# everything listed in projects.json
npm run all
```

The output filename comes from the URL's last path segment unless you pass
`--out`. Files land in `public/images/projects/`.

## Options

| Flag | Values | Default |
|---|---|---|
| `--url` | page to capture | — |
| `--file` | existing screenshot | — |
| `--out` | output filename | derived from url/file |
| `--outdir` | output folder | `public/images/projects` |
| `--device` | `laptop` `phone` `browser` | `laptop` |
| `--bg` | `dark` `light` `acid` `ink` or `#hex` | `dark` |
| `--finish` | `silver` `black` | `silver` |
| `--fit` | `top` `whole` | `top` |
| `--size` | 45–96 | `78` |
| `--w` `--h` | output pixels | `628` `500` |
| `--reflect` `--glare` | `true` `false` | `true` |
| `--wait` | ms to settle after load | `1200` |
| `--full` | full-page capture | `true` |
| `--hide` | CSS selectors to hide, comma-separated | — |
| `--format` | `webp` `png` | `webp` |

`--hide` is for whatever sits on top of the page you don't want in the shot:

```bash
npm run mockup -- --url https://example.com --hide "#cookie-banner,.intercom-frame"
```

## Batch

`projects.json` holds one entry per image. `defaults` applies to all of them,
each entry overrides what it needs, and `"skip": true` leaves one out of a run.

```json
{
  "defaults": { "device": "laptop", "bg": "dark", "w": 628, "h": 500 },
  "projects": [
    { "slug": "projections", "url": "http://localhost:3000/projections" },
    { "slug": "building", "url": "https://bolex.example", "bg": "light" }
  ]
}
```

Then `npm run all`. Handy when the look changes and every image needs redoing —
the whole grid regenerates in one command and stays consistent.

## The GUI

`studio.html` opens in any browser by double-clicking it. Same renderer, drag
and drop instead of flags — better when you're still deciding how a shot should
look. Once you've settled on the settings, put them in `projects.json` so the
image can be rebuilt later without redoing the choices.

`capture.mjs` drives `studio.html` headlessly through its `window.__mockup`
API rather than reimplementing the drawing, so the CLI and the GUI cannot
produce different output. If you change the renderer, change it in
`studio.html` and both follow.

## Notes

- The phone frame wants a mobile screenshot. `--device phone` already captures
  at a 430 px viewport, so a `--url` run handles that for you; only `--file`
  runs need you to supply a mobile capture yourself.
- `--fit top` scales the screenshot to the screen width and keeps the top of the
  page — the fold does the cropping. `--fit whole` shrinks the entire page in.
- Existing images are 10–35 KB. If a render comes out much heavier, drop
  `--quality` (default `0.92`).
