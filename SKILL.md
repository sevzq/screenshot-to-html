---
name: screenshot-to-html
description: >-
  Replicate a UI screenshot/image/mockup into a high-fidelity, self-contained
  HTML page. Faithful image-to-HTML / screenshot-to-code cloning that matches the
  RENDERED result (not copied computed numbers) through a render -> screenshot ->
  compare -> refine loop using the local Chrome. Use whenever the user gives an
  image/screenshot/mockup/Figma export and wants HTML/CSS (plain or Tailwind), or
  asks to "复刻 / 还原 / clone / recreate / turn this design into a webpage".
---

# screenshot-to-html — Screenshot to High-Fidelity HTML

Turn a UI image into a clean, self-contained HTML page whose **rendered output
matches the target image**. Respond to the user in their language (they often
write Chinese); keep chat replies short and let the work happen in files.

## Core principle: replicate the RENDERED state, not the COMPUTED state

The target image is the ground truth of the final **rendered pixels**. Reproduce
that, not a mechanical transcription of per-element values.

- **Computed-state cloning (do NOT do this).** Eyedropper every hex, "measure"
  pixel coordinates/sizes, and paste `getComputedStyle`-style numbers into
  absolute-positioned divs. Result: magic-number soup, non-semantic, not
  responsive, brittle — and small extraction errors compound so it looks *worse*.
- **Rendered-state cloning (DO this).** Read the design like a developer: infer
  semantic structure, a small set of **design tokens** (palette, type scale,
  spacing rhythm, radii, shadows), and **layout intent** (flex/grid). Build it,
  then **render your code, screenshot it, and compare against the target**, and
  iterate. Optimize "does my render look like the target," goal: `render(code) ≈ target`.

This is why the workflow is a feedback loop, not a one-shot dump.

## Workflow

Copy this checklist and track progress:

```
- [ ] Phase 0 — Setup (inputs, stack, target width, deps, assets)
- [ ] Phase 1 — Read the design (global -> components -> exact text)
- [ ] Phase 2 — Build the first draft (semantic + tokens, self-contained)
- [ ] Phase 3 — Rendered-state loop (render, compare, fix; repeat 2-4x)
- [ ] Phase 4 — Interactivity & states (affordances + behavior, then verify)
- [ ] Phase 5 — Final checks
- [ ] Phase 6 — Enhance with motion (optional)
```

### Phase 0 — Setup
- Confirm inputs: the target image path(s) and the desired output file path.
- **Assets are automatic (no questions by default).** Fill each slot with what gives the
  sharpest, most faithful result — not "crop everything": user-supplied assets win; real logos as
  inline SVG / official files; **specific unique content cropped from the source**
  (`scripts/crop.mjs`) when that region is sharp; generic photos from Unsplash / `picsum`; a
  `https://placehold.co` block as last resort. Quality gate: never ship a blurry upscaled crop —
  swap a soft crop for a sharp stock photo. Only ask **once** (non-blocking) if an asset is
  brand-critical AND no layer can approximate it. See *Images & assets* in [reference.md](reference.md).
- Pick the **stack** (ask only if unclear): `vanilla` (HTML + plain CSS,
  self-contained, default) or `tailwind` (HTML + Tailwind CDN). See *Stacks*.
- **Understand the canvas & scale FIRST — before writing any CSS.** Read the pixel
  size (`sips -g pixelWidth -g pixelHeight <image>`), then decide a **design width in
  CSS px**, not the raw pixel count:
  - Screenshots are usually retina (`@2x`/`@3x`), so the file is 2-3x the CSS width.
    Do **not** just divide and build at that size — that ships a shrunken page with
    `~10px` nav text that looks tiny at 100% zoom. Map to a **real breakpoint**:
    web -> `1280` or `1440`; mobile -> `375`/`390`/`393`.
  - Build at that width with **real-world type sizes** (hero ~48-72px, body ~16-18px)
    and keep it **responsive/fluid** (`clamp()`, `max-width`, `%`), so it opens at a
    normal size and adapts — never a fixed miniature.
  - Run the render/compare loop at this design width; `--scale 2` only sharpens the
    diff, it does **not** mean "author at half size."
- Ensure render deps once (no browser download): `npm i -D playwright-core`.

### Phase 1 — Read the design (global first, then local)
Look at the image carefully and write a short build spec. **Global before local:**
- Layout: page max-width, column grid, section order, alignment.
- Color tokens: name 4-8 colors (bg, surface, ink, muted, brand, accent, line).
  Account for gradients/overlays/opacity — never trust one pixel.
- Type: families (serif vs sans, geometric vs humanist -> closest Google Font),
  the heading->body **scale**, weights, letter-spacing, line-height.
- Spacing rhythm (base 4/8px), border-radii, shadow depth, borders/dividers.
- Components: nav, hero, feature/bento, stats, cards, testimonials, CTA, footer —
  note structure and repetition (build one, loop the data).
- Content: transcribe the **exact visible text** (do not invent or translate it).

Do NOT record pixel coordinates. Record *relationships and tokens*.
For the full rubric see [reference.md](reference.md).

### Phase 2 — Build the first draft
- One **self-contained** file (inline `<style>`, minimal inline JS only if needed).
- Semantic HTML (`header/nav/main/section/article/footer`, headings in order).
- Put tokens in `:root` CSS variables; build layout with **flex/grid**, fluid
  sizing (`clamp`, `min()`), not fixed pixel frames.
- Use the **exact text** from the image.
- Images: fill each slot with the best layer for that slot (see Phase 0) — crop **specific,
  unique** content from the source when it's sharp (`node scripts/crop.mjs --in <target>
  --rect x,y,w,h --out assets/<name>.png`), use a sharp Unsplash/`picsum` photo for generic
  imagery (a fuzzy crop is worse than a real photo), else `https://placehold.co/<w>x<h>` with a
  `<!-- asset: ... -->` note. Icons: inline SVG (avoid emoji-as-icon).
- Match the image's breakpoint first; add sensible responsive behavior without
  inventing layouts you cannot see.

### Phase 3 — Rendered-state loop (the important part)
1. Render your draft to a screenshot:
   ```bash
   node scripts/shot.mjs \
     --in <output.html> --out tmp/screenshot-to-html/v1.png --width <DESIGN_WIDTH>
   ```
2. **View both** the target image and your render. Compare region by region and
   list concrete diffs, **prioritized**: layout/structure > sizing/spacing >
   color/contrast > typography > polish (shadows, radii, gradients).
3. Fix the top issues with semantic edits (adjust tokens/layout, not magic
   numbers). Re-render to `v2.png`, `v3.png`, ...
4. Repeat until differences are cosmetic (usually 2-4 rounds). Each round must
   reduce the visual gap; if a change makes it worse, revert it.

Comparison tips and common illusions are in [reference.md](reference.md).

### Phase 4 — Interactivity & states (make it a page, not an image)
A screenshot is one frozen frame — it can't show hover, focus, or what's clickable. Matching it
alone ships a "webpage that's secretly an image." Make the replica behave like a real page:
- **Real elements.** Anything that looks clickable is a `<button>` or `<a href>` (or
  `role="button"` + `tabindex="0"`), never an inert `<div>`/`<span>`; inputs are real `<input>`.
- **Affordances by default (always).** Every control gets `cursor: pointer`, a visible `:hover`
  change, a `:focus-visible` ring (keyboard), and an `:active` press, with a short
  `transition` (~120-180ms). These don't alter the resting look — they add feedback.
- **Functional behavior when the image implies it** (minimal inline JS): tab/segmented controls
  switch the visible panel; a multi-screen mobile app navigates inside its device frame
  (bottom-nav / cards swap screens); modals/menus/dropdowns/accordions open and close (Esc /
  backdrop to dismiss); in-page nav smooth-scrolls. Don't invent flows you cannot infer.
- **A11y & motion.** Logical heading order, `alt` text, visible focus, decent contrast; honor
  `prefers-reduced-motion`.
- **Verify, don't assume:** `node scripts/shot.mjs --in <file> --verify` flags clickable-looking
  elements that are inert or missing a hover/focus state; `--states` captures hover/focus/open
  frames. Fix every dead control. Full detail in [reference.md](reference.md).
- **Tactile depth (zero-dependency).** For the controls the screenshot *implies* — swipeable
  galleries, sliders, a heart that pops, drag-to-snap decks — make them *feel* hand-built with
  plain JS + CSS (pointer drag, velocity snap, press/scale). No motion library needed for any of
  it. Patterns and copy-paste snippets in [references/interaction.md](references/interaction.md).

### Phase 5 — Final checks
- Side-by-side render vs target reads as "the same page."
- Exact text; correct color/contrast; type scale and weights match.
- Responsive sanity: render at a second width (e.g. `--width 390`) — nothing
  overlaps or overflows.
- **Interactivity:** every clickable-looking element is real and shows hover/focus; `--verify` passes.
- Self-contained and valid; no leftover probe/temp files (keep `tmp/screenshot-to-html/`
  out of the deliverable). Report the final file path + final render.

### Phase 6 — Enhance with motion (optional, only on request)
Interactivity (Phase 4) ships by default; **GSAP motion/animation does not.** Rich tactile
feedback — drag, snap, like-pop — needs **no library** ([references/interaction.md](references/interaction.md));
GSAP is only for heavier, explicitly-requested choreography. Do not add motion
on your own, and never ask about it — only enhance when the user explicitly requests animation ("加动效",
"make it animated"). Then add **restrained** GSAP animation — high-impact moments,
not AI-slop everywhere. Read [references/animation.md](references/animation.md) for
the patterns (load-in stagger, scroll-triggered reveal, hover micro-interactions),
CDN setup, and pitfalls. Keep the HTML self-contained (GSAP via CDN) and honor
`prefers-reduced-motion`; verify a settled frame with `node scripts/shot.mjs --motion`.
This skill is self-contained; for deeper choreography you may optionally also install
the official GSAP skills (`npx skills add github.com/greensock/gsap-skills`) — not required.

## Scripts (paths relative to this skill directory)
**`scripts/shot.mjs`** — render a local HTML file with installed Google Chrome via
`playwright-core` (no browser download); the render step of the loop.
```bash
# full-page (default), crisp 2x:
node scripts/shot.mjs --in replica.html --out tmp/screenshot-to-html/v1.png --width 1280
# exact-pixel overlay: add --scale 1 ; above-the-fold only: --viewport-only ; keep motion: --motion
```
If Chrome is missing it falls back to bundled chromium (`npx playwright install chromium`).

**`scripts/crop.mjs`** — crop a rectangle out of the source screenshot to reuse real
imagery (asset layer 2). Uses `sharp` if installed, else macOS `sips`.
```bash
node scripts/crop.mjs --in <target.png> --rect x,y,w,h --out assets/hero.png
```

## Stacks
Pick per request; both produce a single self-contained file.

**vanilla** (default) — HTML + plain CSS in one file. Tokens in `:root`. Best for
matching a bespoke visual identity and staying dependency-free.

**tailwind** — add `<script src="https://cdn.tailwindcss.com"></script>` and build
with utilities; map the palette/scale via the `tailwind.config` inline object.

Both stacks:
- Fonts: Google Fonts `<link>` (pick the closest match to the image).
- Icons: inline SVG, or Font Awesome `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`.
- Missing images: layered fallback (crop from source -> Unsplash/picsum -> `placehold.co`).

## Output & temp conventions
- Final HTML: the path the user asks for. Default `index.html`; **if a file
  already exists there and is unrelated, do not overwrite it** — confirm or write
  to `replica.html`.
- Screenshots/intermediates: `tmp/screenshot-to-html/` (safe to delete). Create it if missing.

## Quality expectations
- Semantic, readable, maintainable; design tokens over magic numbers.
- No absolute-position-everything layouts; no "measured" pixel coordinates.
- Fidelity to the image: layout, exact text, color, type, spacing, radii, shadows.
- Multiple screenshots = multiple pages/tabs: link or scaffold them sensibly.

## Additional resources
- [reference.md](reference.md) — analysis rubric, comparison methodology,
  computed-state traps, fonts/colors/assets, the four-layer asset strategy.
- [references/interaction.md](references/interaction.md) — zero-dependency tactile-polish
  standard (Phase 4): pointer-drag primitive, swipe/carousel snap, like-pop, toggles, reduced-motion.
- [references/animation.md](references/animation.md) — optional GSAP motion patterns
  (Phase 6): CDN setup, load-in/scroll/hover recipes, reduced-motion, pitfalls.
