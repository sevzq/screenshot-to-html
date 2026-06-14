<sub>🌐 English · <a href="README.zh-CN.md">中文</a></sub>

<div align="center">

# screenshot-to-html

**Drop a screenshot — get back a pixel-faithful, fully interactive single-file HTML page.**

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
  <img src="assets/hero.gif" alt="Inside a real Claude Code terminal: install the skill with 'npx skills add sevzq/screenshot-to-html', paste a screenshot of the Modal homepage, and type 'Clone this screenshot into one interactive, self-contained HTML file.' The skill reads the image, writes output.html, and verifies the controls in headless Chrome, then reveals the finished page — a pixel-faithful, fully interactive single HTML file." width="100%">
</p>

<p align="center"><sub>
  ▲ Install the skill, open <b>Claude Code</b> (or Cursor / Codex), paste a screenshot, and type one line. The skill reads the image, writes a single <code>output.html</code>, and <b>verifies the interactions in real Chrome</b> — then reveals the finished page.
  &nbsp;·&nbsp; <a href="assets/hero.mp4">Hi-res MP4</a>
</sub></p>

> **Every replica in this README was produced by the skill** and verified interactive with headless Chrome — each is a single HTML file with inline CSS/JS, no framework, no build step.

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

### Cloudflare — landing page

![Cloudflare landing page: original screenshot vs HTML replica](examples/landing-cloudflare/comparison.webp)

[Source](examples/landing-cloudflare/input.png) · [HTML replica](examples/landing-cloudflare/output.html) — the giant black-and-orange headline, full nav, and bottom report band are pure HTML/CSS; only the geodesic sphere is cropped from the source and bled off the right edge. Both CTAs, every nav item, and the "Under attack?" button are real controls with hover/focus.

### Modal — landing page (dark / neon)

![Modal landing page: original screenshot vs HTML replica](examples/landing-modal/comparison.webp)

[Source](examples/landing-modal/input.png) · [HTML replica](examples/landing-modal/output.html) — a pure-black hero with a spring-green accent; the glowing translucent cube is cropped from the source and `screen`-blended onto the black so there's no seam, and the customer logo strip is real imagery. The announcement link, floating nav pill, and both hero buttons are real controls with hover/focus.

### Clay — landing page (colorful)

![Clay landing page: original screenshot vs HTML replica](examples/landing-clay/comparison.webp)

[Source](examples/landing-clay/input.png) · [HTML replica](examples/landing-clay/output.html) — a cream hero panel on white with a huge display headline; the four colorful clay sculptures are cropped and `multiply`-blended so they straddle the panel edge cleanly, and the 20-brand logo wall is real imagery. Nav, ⌘K search, "Get a demo", and Sign-up all have hover/focus.

### Tesla — charging screen (iOS / mobile)

![Tesla charging screen: original screenshot vs HTML replica](examples/mobile-tesla/comparison.webp)

[Source](examples/mobile-tesla/input.png) · [HTML replica](examples/mobile-tesla/output.html) — authored at 393px @3x in a decorative iPhone frame; the black Model 3 render with its green charge cable is cropped and color-matched to the screen so it's seamless. The charge-limit slider is a real `range` input that updates its green fill, and every control has hover/focus.

### Stripe — landing page

![Stripe landing page: original screenshot vs HTML replica](examples/landing-stripe/comparison.webp)

[Source](examples/landing-stripe/input.png) · [HTML replica](examples/landing-stripe/output.html) — the diagonal gradient and multiply-blended headline are pure CSS; only the floating checkout + dashboard cluster is cropped from the source. The nav, announcement pill, and a working email field + Start-now button are all real controls with hover/focus.

### Spotify — web player (dark)

![Spotify web player: original screenshot vs HTML replica](examples/app-spotify/comparison.webp)

[Source](examples/app-spotify/input.png) · [HTML replica](examples/app-spotify/output.html) — a dark three-pane player; every cover and album thumbnail is real imagery cropped from the source, and all icons are inline SVG. Fully interactive: rows highlight on hover with a play glyph, the transport (play / shuffle / repeat) toggles, the now-playing panel collapses, and volume is a real slider. _([Watch the live interaction demo](assets/spotify-demo.gif).)_

### Airbnb — iOS app (mobile)

![Airbnb iOS app: original screenshot vs HTML replica](examples/mobile-airbnb/comparison.webp)

[Source](examples/mobile-airbnb/input.png) · [HTML replica](examples/mobile-airbnb/output.html) — authored at 393px @3x and wrapped in a decorative iPhone frame; each card's lead photo and the 3D category icons are cropped from the source (extra carousel shots are royalty-free Unsplash interiors). Fully interactive: every listing card is a swipeable photo carousel (drag to flick through, velocity snap, dot indicators, hover arrows), the hearts toggle with a tactile pop, and the bottom tab bar / category tabs switch the screen inside the frame — all with zero dependencies. _([Watch the live interaction demo](assets/airbnb-demo.gif).)_

### Linear — landing page

![Linear landing page: original screenshot vs HTML replica](examples/landing-linear/comparison.webp)

[Source](examples/landing-linear/input.png) · [HTML replica](examples/landing-linear/output.html) — the product-UI card is lifted from the source with [`crop.mjs`](scripts/crop.mjs); everything else is hand-built HTML/CSS. Nav links and the Sign-up button have hover/focus states, and in-page links smooth-scroll.

### Stripe — dashboard

![Stripe dashboard: original screenshot vs HTML replica](examples/dashboard-stripe/comparison.webp)

[Source](examples/dashboard-stripe/input.png) · [HTML replica](examples/dashboard-stripe/output.html) — the charts are inline SVG and the stacked bar is CSS; the entire screen is rebuilt as code with zero image crops. Interactive: the sidebar nav, the Test-mode switch, and the date/period pills all respond, and cards/rows highlight on hover.

## Optional: motion with GSAP

Motion is **opt-in** — the agent never asks for it and never adds it unless you do. When you ask, Phase 6 layers in restrained, self-contained [GSAP](https://gsap.com/) (one CDN tag, no build step) and always animates *into* the final CSS state, so no-JS and `prefers-reduced-motion` visitors still get the finished page.

Here's the Modal replica with an optional motion pass — a staggered hero load-in, an ambient floating compute cube, and spring-y button hovers:

![Modal replica with an optional GSAP motion pass: staggered hero load-in and a floating compute cube](assets/gsap-modal.gif)

[Motion source](examples/landing-modal/output.gsap.html) · [hi-res MP4](assets/gsap-modal.mp4) — the exact same markup as the [static Modal replica](examples/landing-modal/output.html), plus ~20 lines of GSAP. Reusable patterns live in [`references/animation.md`](references/animation.md).

## How it works

```
Phase 0  Setup        — inputs, stack, and the true design width / scale
Phase 1  Read         — design tokens, layout intent, exact text
Phase 2  Build        — a semantic, self-contained first draft
Phase 3  Loop         — shot.mjs → compare to target → fix   (repeat 2–4×)
Phase 4  Interact     — real hover / focus / active states, then --verify
Phase 5  Final checks — responsive, exact text, fidelity
Phase 6  Motion       — optional, only if you ask
```

The render step uses [`scripts/shot.mjs`](scripts/shot.mjs), which drives your installed Chrome via `playwright-core` (no browser download). The same script audits interactivity (`--verify`) and captures hover / focus / open states (`--hover` / `--focus` / `--click` / `--states`).

## Install

### npx skills (recommended)

Auto-detects your agent (Cursor, Claude Code, Codex, Windsurf, Copilot, 40+):

```bash
npx skills add sevzq/screenshot-to-html
```

### Cursor

**Settings → Rules → Add Rule → Remote Rule (GitHub)** → `sevzq/screenshot-to-html`, or just use `npx skills add` above.

### Other agents (Codex, OpenCode, Gemini CLI, …)

Point the agent at this repo and tell it to use the skill, starting from [`SKILL.md`](SKILL.md):

```text
https://github.com/sevzq/screenshot-to-html
```

### Manual

Clone the repo straight into your agent's skills directory (the repo root *is* the skill):

| Agent        | Skills directory             |
| ------------ | ---------------------------- |
| Claude Code  | `~/.claude/skills/`          |
| Cursor       | `~/.cursor/skills/`          |
| OpenAI Codex | `~/.codex/skills/`           |
| OpenCode     | `~/.config/opencode/skills/` |

```bash
git clone https://github.com/sevzq/screenshot-to-html.git ~/.cursor/skills/screenshot-to-html
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
- **Quality-first assets (automatic).** Each image slot is resolved without asking you, by what looks sharpest and most specific: **assets you supplied** → **official brand SVG/logos** → a **crisp crop** from the source ([`crop.mjs`](scripts/crop.mjs)) → a real [Unsplash](https://unsplash.com) / `picsum.photos` photo → `placehold.co` as a last resort.
- **Motion is opt-in.** Baseline interactivity (hover / focus / active states) ships by default, but animation is **only** added when you explicitly ask — Phase 6 layers in restrained, self-contained GSAP via CDN. See [`references/animation.md`](references/animation.md).

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
