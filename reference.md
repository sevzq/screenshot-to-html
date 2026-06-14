# screenshot-to-html — Reference

Deep detail for faithful, rendered-state replication. Read this when you need the
full analysis rubric, comparison method, or guidance on fonts/colors/assets.

## Why rendered-state beats computed-state (with examples)

The goal is `render(your_code) ≈ target_image`, judged visually. Copying resolved
values is a trap:

| Computed-state (avoid) | Rendered-state (do) |
|---|---|
| `position:absolute; left:247px; top:83px` for every element | a `flex`/`grid` container with `gap`, `justify-content` |
| eyedropper a different hex per element | 4-8 named tokens in `:root`, reused everywhere |
| `font-size:23.5px` measured off pixels | a type scale (e.g. 14/16/20/32/48) chosen to look right |
| `width:1043px` fixed | `width:min(1240px, 92vw)` centered container |
| one screenshot at one size | render + compare + iterate at the design width |

Why it wins: tokens make small errors *consistent* (and easy to fix globally),
semantic layout survives resizing, and the visual loop catches what the eye —
not a number — actually notices.

## Canvas & scale (decide before building)

Inputs vary in pixel size and pixel ratio; resolve this *first* so you build at a
real size, not a miniature.

1. **Measure** — `sips -g pixelWidth -g pixelHeight <image>` (or `sharp`).
2. **Classify device + DPR.** Desktop web shots are usually `@2x` (e.g. `2560`,
   `1920`, `2880` wide); phone shots are `@2x`/`@3x` (e.g. `1170`, `1290` wide).
3. **Choose a CSS design width at a real breakpoint** — web: `1280` or `1440`;
   mobile: `375`/`390`/`393`/`414`. Avoid both the raw pixel width and a naive
   `pixels / DPR` (which often lands on an awkward, tiny `960`).
4. **Use real-world type sizes** at that width and keep everything **fluid**
   (`clamp()`, `max-width`, `%`, `min()`), so the page is correct at 100% and scales.
   The trap to avoid: halving everything "for retina" and shipping a 960-wide page
   with `~10px` text — it only matches the screenshot when downscaled and looks tiny
   in a real browser.
5. **Render the loop at this design width.** `--scale 2` sharpens the diff; it does
   not mean author at half size. To compare a non-2x screenshot exactly, render with
   a matching `--scale` (or let the side-by-side normalize both to one column width).

## Phase 1 analysis rubric

Derive **relationships and tokens**, not coordinates.

**Layout**
- Page container max-width (content edges vs full-bleed bands).
- Column structure per section (1, 2, 3, 4-up; asymmetric like `1.04fr .96fr`).
- Vertical rhythm: large section padding vs tight component gaps.
- Alignment: centered vs left; where things snap to a grid.

**Color** (never trust a single pixel)
- Name tokens: `--bg --surface --ink --muted --line --brand --accent`.
- Detect gradients (direction + stops), overlays on imagery, and opacity
  (e.g. text at ~60% white). Reproduce with `linear-gradient`, `rgba()`.
- Note dark vs light theme and overall contrast level.

**Typography**
- Family vibe -> closest Google Font: geometric sans (Poppins, Archivo), neutral
  sans (Inter, Manrope), humanist (Source Sans), serif/display (Instrument Serif,
  Playfair). Match x-height and weight, not just the name.
- Scale: read the ratio between hero/title/body/caption; pick clean steps.
- Weight, letter-spacing (display type is often tight, e.g. `-0.03em`),
  line-height (headings ~1.0-1.1, body ~1.5-1.7).

**Surface details**
- Border radius family (e.g. 12 / 20 / 28; or pills `99px`).
- Shadow depth/softness; borders/dividers (often `rgba(255,255,255,.09)` on dark).
- Spacing base unit (4 or 8) and pad scale.

**Components & content**
- Identify repeated units (cards, nav links, stats) — build one, map an array.
- Transcribe **exact** visible text, including super/subscripts (™, ®), numbers,
  and casing. Do not translate or paraphrase.

## Phase 3 comparison methodology

Put the target and your latest render next to each other and scan **top to
bottom, region by region**: nav -> hero -> each section -> footer.

For each region check, in priority order:
1. **Structure** — same blocks in the same arrangement? missing/extra elements?
2. **Proportion & spacing** — relative sizes, gaps, padding, alignment.
3. **Color & contrast** — hue, lightness, gradient direction, overlay strength.
4. **Typography** — size relationships, weight, tracking, wrapping/line breaks.
5. **Polish** — radii, shadows, borders, icon shapes, hover affordances.

Write the diffs as a short prioritized list, fix the top few, re-render, repeat.
Stop when only cosmetic differences remain.

**Common illusions / gotchas**
- A scaled export (e.g. full page in 1024x576) changes apparent sizes — design at
  a normal width and compare composition, not absolute pixels.
- Subpixel font rendering differs across OS/browser; don't chase 1px text shifts.
- `backdrop-filter` and gradients can read differently at 1x vs 2x — use
  `--scale 1` when you need a faithful overlay.
- Anti-aliased edges make thin borders look lighter than their hex.

## Fonts

If unsure of the exact font, pick the closest Google Font and move on — the loop
will tell you if weight/size/tracking are off. Load only the weights you use.
Always include a robust fallback stack incl. CJK if the text has Chinese, e.g.
`'Inter','PingFang SC','Microsoft YaHei',sans-serif`.

## Images & assets

Fill every image slot automatically (no questions by default). Don't default to "crop
everything" — **choose per slot by specificity + quality**, and never ship a blurry asset.

Decide by what the slot actually is:
- **Brand logo / icon** → the real mark. Recreate simple marks as inline SVG; for a real logo
  prefer the official SVG/PNG (the brand's press / brand page) over a soft crop.
- **Specific, unique content shown in the target** (a particular product card, album cover,
  chart, screenshot-in-screenshot) → **crop it from the source** so the replica shows the same
  thing: `node scripts/crop.mjs --in <target.png> --rect x,y,w,h --out assets/<name>.png`
  (estimate the rect by eye; cropping tolerates approximation) — but only if the source region
  is sharp enough (see the quality gate).
- **Generic photography** (hero shots, listing/profile photos, avatars, backgrounds) → a real,
  sharp stock photo beats a fuzzy crop and looks better. Download one from
  [Unsplash](https://unsplash.com) to `assets/` (the old `source.unsplash.com` is deprecated) or
  `https://picsum.photos`; match subject, crop, and tone to the target.
- **Last resort** → `https://placehold.co/<w>x<h>` (optionally `/<bg>/<fg>?text=`) or a CSS
  gradient/solid block, with a `<!-- asset: ... -->` note.
- **User-supplied** assets (in `inbox/` or `assets/`) always win — use as-is.

**Quality gate (showcase-grade).** A crop from a low-res screenshot, upscaled to fill a big slot,
looks soft — that *is* the AI-slop "fuzzy stand-in" look. If a crop is soft, swap to a sharp
real/stock asset. Prefer 2x sources and keep crops near their native size.

**Anti-AI-slop.** Use real imagery (above) instead of CSS-drawn silhouettes for product/people
shots; avoid emoji-as-icons (use inline SVG), generic purple gradients, and Inter-as-display when
the target clearly uses something else. Match the target's real palette and type, not a default.

## Responsive

Build **fluid by default**: a centered `max-width` container, `%`/`min()` widths, and
`clamp()` type — so the single file is a usable, adaptive page, not a fixed-width
snapshot that only looks right at one size. Replicate the breakpoint shown first, then
add sensible behavior for other widths (stack columns, shrink type, hide secondary
bits) without inventing layouts you cannot see. Verify with a second render at
`--width 390`.

## Interactions & states

A screenshot is one frozen frame, so matching it pixel-for-pixel still ships a page where
nothing is clickable and nothing reacts. Treat interactivity as part of fidelity, not an
optional add-on (this is Phase 4).

**Baseline affordances (always).**
- Real elements: clickable things are `<button>` / `<a href>` (or `role="button"` +
  `tabindex="0"`), never inert `<div>`s; inputs are real `<input>`/`<textarea>`.
- A state on every control: `cursor: pointer`, a `:hover` change (bg / color / subtle lift), a
  `:focus-visible` ring for keyboard users, an `:active` press. Add `transition` ~120-180ms.
- Links point somewhere (`#` is fine); buttons have a `type`.

**Functional behavior (only when the image implies it).** Keep JS minimal and inline:
- Tabs / segmented controls / filters → switch the visible panel.
- Multi-screen mobile apps → state-driven navigation inside the device frame (bottom-nav and
  cards push/replace the screen).
- Modals, menus, dropdowns, accordions → open/close; dismiss on `Esc` / backdrop click.
- In-page nav → smooth-scroll to sections.
Don't fabricate flows you can't see; wire only what the UI obviously offers.

**Accessibility & motion.** Logical heading order, `alt` on images, visible focus, adequate
contrast; honor `prefers-reduced-motion` for transitions.

**Verify (don't assume).** `node scripts/shot.mjs --in <file> --verify` flags clickable-looking
elements that are inert or lack a hover/focus state; `--states` captures hover / focus / open
frames for review and the gallery. Fix every dead control before delivery.

**Tactile depth (dependency-free).** When the frame implies a richer gesture — a swipeable photo
gallery, a drag-to-snap deck, a slider, a heart that pops — make it *feel* hand-built with a small
pointer-drag primitive (velocity + snap) and CSS keyframes. This is all plain JS + CSS: **do not
reach for a motion library for tactile feedback.** Recipes and copy-paste snippets in
[references/interaction.md](references/interaction.md).

Optional GSAP motion is separate and **on request only** — see Phase 6 and
[references/animation.md](references/animation.md). When capturing, `shot.mjs` freezes animations
(`--still`, default) for a stable settled frame; pass `--motion` to keep them running.

## Multiple screenshots

- Different pages of one site -> distinct pages, linked in the nav.
- Tabs/views of one app -> one page with navigation that switches views.
- Unrelated -> scaffold "Screenshot 1/2/3" sections for easy navigation.
- Mobile shots -> reproduce only the UI, not the device frame or browser chrome.

## When to ask the user

Default to **full autonomy** — pick a sensible default, note it, and keep going.
Assets are handled automatically via the four-layer strategy above, so you normally
ask nothing.

Ask **only** when it genuinely blocks fidelity, and keep it to a single non-blocking
message:
- A **brand-critical** asset that no automatic layer can approximate — an exact logo
  or specific product photography that must be pixel-correct.
- Text is cut off / illegible in the image and you cannot infer it.
- The stack or output path is ambiguous and the choice matters.

Otherwise: do not ask. Crop, substitute, or placeholder; note it; move on.

Never ask whether to add motion/animation. Baseline interactivity (Phase 4) is always part of
the deliverable, but GSAP motion is opt-in: only animate when the user's request explicitly
includes it (see Phase 6).
