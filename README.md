<sub>🌐 English · <a href="README.zh-CN.md">中文</a></sub>

<div align="center">

# screenshot-to-html

**Drop a screenshot — get a pixel-faithful, _actually-clickable_ HTML page back.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3da639.svg)](LICENSE)
[![Agent Skill](https://img.shields.io/badge/Agent-Skill-2b6cb0)](https://agentskills.io)
[![skills.sh Compatible](https://img.shields.io/badge/skills.sh-Compatible-22c55e)](https://skills.sh)
[![Agent-Agnostic](https://img.shields.io/badge/Agent-Agnostic-7c3aed)](#install)
[![Verified with Chrome](https://img.shields.io/badge/interactive-verified-000000)](#under-the-hood)

<br>

An AI coding-agent skill that rebuilds any UI screenshot as **one clean, self-contained, interactive HTML file**. Not a one-shot guess — a **rendered-state loop**: build → screenshot the result with real Chrome → compare to your image → refine, until `render(code) ≈ target`. Then it wires up real hover / focus / click states and **verifies them with headless Chrome**.

```
npx skills add sevzq/screenshot-to-html
```

Works in **Cursor · Claude Code · Codex · Windsurf · Copilot** — and 40+ agents.

[See the gallery](#gallery) · [Install](#install) · [How it works](#how-it-works) · [Why it's different](#why-its-different)

</div>

---

<p align="center">
  <img src="assets/hero.gif" alt="A generated Spotify replica being used live: hovering track rows reveals the play glyph, the green button toggles play/pause, shuffle turns green, and the now-playing panel collapses — all in one self-contained HTML file" width="100%">
</p>

<p align="center"><sub>
  ▲ A <b>generated</b> Spotify replica, used live — hover tracks, toggle play/pause &amp; shuffle, collapse the now-playing panel. One self-contained HTML file.
  &nbsp;·&nbsp; <a href="assets/hero.mp4">Hi-res MP4</a>
</sub></p>

> **Every replica in this README was produced by the skill** and verified clickable with headless Chrome — each is a single HTML file with inline CSS/JS, no framework, no build step.

---

## Why it's different

Most "screenshot to code" tools generate once and stop. `screenshot-to-html` optimizes what you actually *see* — and what you can actually *click*:

- **Pixel-faithful by loop, not luck** — it screenshots its own output with real Chrome and diffs against your image region-by-region (layout → spacing → color → type → polish), refining until it matches. Semantic HTML + design tokens, not a pile of absolute-positioned magic numbers.
- **Actually interactive — and verified** — real `<button>` / `<a>`, hover / focus / active states, and working tabs, nav, and modals where the screenshot implies them. Audited with `shot.mjs --verify`, which fails the build on dead controls. Not a static picture pretending to be a page.
- **One self-contained file** — inline CSS/JS, zero dependencies, zero build step. Open it anywhere.
- **Sharp assets, automatically** — every image slot is filled by what looks best: a crisp crop from your screenshot, an official logo SVG, or a real stock photo — never a blurry stand-in or an AI-slop silhouette. No questions, no manual steps.
- **Real size & responsive** — authored at the true design width with fluid units (`clamp()` / `max-width`), so it opens correctly at 100% zoom and adapts. Never a fixed miniature.
- **Runs in the agent you already use** — no web app to deploy, no separate API key, no infra. It's just a skill.

## Gallery

Real app screenshot (left) vs the generated single-file HTML replica (right) — light & dark, desktop & mobile, landing pages, dashboards, and full app UIs. Full sources in [`examples/`](examples/). Every replica is **interactive** and passes `node scripts/shot.mjs --verify`.

### Stripe — landing page

![Stripe landing page: original screenshot vs HTML replica](examples/landing-stripe/comparison.webp)

[Source](examples/landing-stripe/input.png) · [HTML replica](examples/landing-stripe/output.html) — the diagonal gradient and multiply-blended headline are pure CSS; only the floating checkout + dashboard cluster is cropped from the source. The nav, announcement pill, and a working email field + Start-now button are all real controls with hover/focus.

### Spotify — web player (dark)

![Spotify web player: original screenshot vs HTML replica](examples/app-spotify/comparison.webp)

[Source](examples/app-spotify/input.png) · [HTML replica](examples/app-spotify/output.html) — a dark three-pane player; every cover and album thumbnail is real imagery cropped from the source, and all icons are inline SVG. Fully interactive: rows highlight on hover with a play glyph, the transport (play / shuffle / repeat) toggles, the now-playing panel collapses, and volume is a real slider. _(This is the page in the hero above.)_

### Airbnb — iOS app (mobile)

![Airbnb iOS app: original screenshot vs HTML replica](examples/mobile-airbnb/comparison.webp)

[Source](examples/mobile-airbnb/input.png) · [HTML replica](examples/mobile-airbnb/output.html) — authored at 393px @3x and wrapped in a decorative iPhone frame; the listing photos and 3D category icons are cropped from the source. Interactive prototype: the bottom tab bar switches screens inside the frame, the Homes / Experiences / Services tabs switch, and the hearts toggle.

### Linear — landing page

![Linear landing page: original screenshot vs HTML replica](examples/landing-linear/comparison.webp)

[Source](examples/landing-linear/input.png) · [HTML replica](examples/landing-linear/output.html) — the product-UI card is lifted from the source with [`crop.mjs`](skills/screenshot-to-html/scripts/crop.mjs); everything else is hand-built HTML/CSS. Nav links and the Sign-up button have hover/focus states, and in-page links smooth-scroll.

### Stripe — dashboard

![Stripe dashboard: original screenshot vs HTML replica](examples/dashboard-stripe/comparison.webp)

[Source](examples/dashboard-stripe/input.png) · [HTML replica](examples/dashboard-stripe/output.html) — the charts are inline SVG and the stacked bar is CSS; the entire screen is rebuilt as code with zero image crops. Interactive: the sidebar nav, the Test-mode switch, and the date/period pills all respond, and cards/rows highlight on hover.

### Stitch — home

![Stitch home: original screenshot vs HTML replica](examples/app-stitch/comparison.webp)

[Source](examples/app-stitch/input.png) · [HTML replica](examples/app-stitch/output.html) — the dotted-grid canvas, sidebar, and prompt composer are rebuilt in CSS; only the small project thumbnails are cropped from the source. Interactive: the My Projects / Shared tabs switch, the prompt is a real textarea, and the App/Web toggle works.

## How it works

```
Phase 0  Setup        — inputs, stack, and the true design width / scale
Phase 1  Read         — design tokens, layout intent, exact text
Phase 2  Build        — a semantic, self-contained first draft
Phase 3  Loop         — shot.mjs → compare to target → fix   (repeat 2–4×)
Phase 4  Interact     — real hover / focus / clickable states, then --verify
Phase 5  Final checks — responsive, exact text, fidelity
Phase 6  Motion       — optional, only if you ask
```

The render step uses [`scripts/shot.mjs`](skills/screenshot-to-html/scripts/shot.mjs), which drives your installed Chrome via `playwright-core` (no browser download). The same script audits interactivity (`--verify`) and captures hover / focus / open states (`--hover` / `--focus` / `--click` / `--states`).

## Install

### npx skills (recommended)

Auto-detects your agent (Cursor, Claude Code, Codex, Windsurf, Copilot, 40+):

```bash
npx skills add sevzq/screenshot-to-html
```

### Claude Code (plugin)

```text
/plugin marketplace add https://github.com/sevzq/screenshot-to-html
/plugin install screenshot-to-html@screenshot-to-html
```

Then invoke it with `/screenshot-to-html:screenshot-to-html`.

### Cursor

**Settings → Rules → Add Rule → Remote Rule (GitHub)** → `sevzq/screenshot-to-html`, or just use `npx skills add` above.

### Other agents (Codex, OpenCode, Gemini CLI, …)

Point the agent at this repo and tell it to use the skill, starting from [`SKILL.md`](skills/screenshot-to-html/SKILL.md):

```text
https://github.com/sevzq/screenshot-to-html
```

### Manual

Copy the skill folder into your agent's skills directory:

| Agent        | Skills directory             |
| ------------ | ---------------------------- |
| Claude Code  | `~/.claude/skills/`          |
| Cursor       | `~/.cursor/skills/`          |
| OpenAI Codex | `~/.codex/skills/`           |
| OpenCode     | `~/.config/opencode/skills/` |

```bash
git clone https://github.com/sevzq/screenshot-to-html.git
cp -R screenshot-to-html/skills/screenshot-to-html ~/.cursor/skills/
```

The render/crop scripts need Node deps once (from the repo root): `npm i` installs `playwright-core`; add `sharp` for cropping with `npm i -D sharp`.

## Usage

Point your agent at a screenshot and ask it to replicate:

```text
Clone this screenshot into HTML:  ./design.png
```

It reads the design, builds a draft, then loops (render → compare → refine), wires up the interactions, and hands you a single self-contained HTML file plus a side-by-side comparison.

## Under the hood

- **Verified interactivity.** `node scripts/shot.mjs --in page.html --verify` audits the page for dead controls (clickable-looking `<div>`s), missing `cursor: pointer`, and absent `:hover` / `:focus` rules — and reports `WARN` until they're fixed. Interactivity is treated as part of fidelity, not an afterthought.
- **Quality-first assets (automatic).** Each image slot is resolved without asking you, by what looks sharpest and most specific: **assets you supplied** → **official brand SVG/logos** → a **crisp crop** from the source ([`crop.mjs`](skills/screenshot-to-html/scripts/crop.mjs)) → a real [Unsplash](https://unsplash.com) / `picsum.photos` photo → `placehold.co` as a last resort.
- **Motion is opt-in.** Baseline interactivity (hover / focus / clickable) ships by default, but animation is **only** added when you explicitly ask — Phase 6 layers in restrained, self-contained GSAP via CDN. See [`references/animation.md`](skills/screenshot-to-html/references/animation.md).

## Star history

<p align="center">
  <a href="https://star-history.com/#sevzq/screenshot-to-html&Date">
    <img src="https://api.star-history.com/svg?repos=sevzq/screenshot-to-html&type=Date" alt="Star History Chart" width="70%">
  </a>
</p>

## Contributing

Issues and PRs welcome — new example replicas especially. See [AGENTS.md](AGENTS.md) for the skill structure and authoring conventions.

## License

[MIT](LICENSE) © SevenZhang

> Example screenshots are real app UIs used for replication demos only; they belong to their respective owners.
