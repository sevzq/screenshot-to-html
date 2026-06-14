# Guidance for AI agents working in this repo

This repository packages the **screenshot-to-html** skill — replicate a UI screenshot
into a high-fidelity, self-contained, interactive HTML page through a render → compare →
refine loop. It ships in the [Agent Skills](https://agentskills.io) format and installs
into Cursor, Claude Code, Codex, and 40+ agents via `npx skills`.

## Repo structure

- `skills/screenshot-to-html/` — the skill (authoritative source).
  - `SKILL.md` — entry point and workflow. Keep under ~500 lines.
  - `reference.md` — analysis rubric, comparison method, quality-first asset strategy, interactions & states.
  - `references/animation.md` — optional GSAP motion patterns (Phase 6, on request only).
  - `scripts/shot.mjs` — render a local HTML file with installed Chrome (playwright-core); also audits interactivity (`--verify`) and captures states (`--hover` / `--focus` / `--click` / `--states`).
  - `scripts/crop.mjs` — lift real imagery out of the source screenshot (sharp / macOS sips).
- `.claude-plugin/marketplace.json` + `plugin.json` — Claude Code install manifests (`source: "./"`, skills under `./skills/`).
- `examples/` — gallery cases: `<slug>/{input.png, output.html, comparison.png, assets/}`.
- `inbox/` — staging for source screenshots (gitignored).

## SKILL.md conventions (Agent Skills)

- Frontmatter `name` must be lowercase/hyphenated and match the directory (`screenshot-to-html`).
- `description` is third-person and includes trigger terms.
- Long material lives in `reference.md` / `references/`, linked from `SKILL.md`.

## Asset strategy (quality-first, automatic)

Fill every image slot with the sharpest, most specific source — never a blurry stand-in,
never a CSS silhouette of a real product shot. Priority: user-supplied assets → official
brand SVG / logos → a crisp crop from the source (`crop.mjs`) when it is sharp → a real
Unsplash / `picsum.photos` photo for generic imagery → `placehold.co` as a last resort.
Resolve it without interrogating the user.

## Running the scripts

From `skills/screenshot-to-html/`:

```bash
node scripts/shot.mjs --in replica.html --out tmp/screenshot-to-html/v1.png --width 1280
node scripts/shot.mjs --in replica.html --verify          # interactivity / dead-control audit
node scripts/crop.mjs --in target.png --rect x,y,w,h --out assets/hero.png
```

Install deps once at the repo root: `npm i` (playwright-core; `sharp` for cropping).

## Adding an example

1. Drop a source screenshot in `inbox/` (e.g. `landing-linear.png`).
2. Replicate it with the skill; save the result as `examples/<slug>/output.html` and run `--verify` until it PASSes.
3. Save the source as `examples/<slug>/input.png` and a side-by-side as `comparison.png`.
4. Add the case to the README gallery.

Example screenshots are real app UIs used for replication demos only and belong to
their respective owners.
