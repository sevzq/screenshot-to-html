# Interaction & tactile polish (zero-dependency)

Phase 4 makes the replica behave like a page (real controls, hover/focus/active,
working tabs/nav/modals). This file is the deeper bar: how to make those controls
feel *tactile* — drag, snap, spring-back, "pop" — at the level of a hand-built
flagship page.

**Everything here is plain vanilla JS + CSS. You do NOT need GSAP, Lenis, or any
library for any of it.** GSAP (Phase 6, [animation.md](animation.md)) is a separate,
opt-in tool for heavier choreography on request — it is never required for tactile
feedback, and never added on your own.

## Principle: fidelity first

A screenshot is one static frame. Add only the interactions it **implies** — a button
presses, a slider drags, a photo gallery swipes, a heart toggles, tabs switch. Do
**not** bolt entrance animations, scroll-jacking, or split-text reveals onto a replica:
they are not in the frame, they fight the `comparison` (which matches a still), and they
read as gratuitous. (Those belong only to original/landing showcases — see Recipe E.)

Resting look never changes. Tactility is *added feedback*, layered on top of a render
that already matches the target.

## Tactile baseline (extends Phase 4)

On top of `cursor:pointer` + `:hover` + `:focus-visible` + `:active`:

```css
.ix { transition: transform .14s ease, background-color .14s, border-color .14s, opacity .14s; }
.ix:active { transform: translateY(1px) scale(.985); }   /* real press */
/* animate transform/opacity only — never width/height/top/left (layout thrash) */
```

- Add `will-change: transform` only to elements you actively animate; remove it after.
- Keep durations short (120-220ms). Use `cubic-bezier(.34,1.56,.64,1)` for a little
  spring on toggles/likes.
- Honor reduced motion (see end). Final/resting state always lives in CSS so no-JS users
  get a complete page.

## Recipe A - pointer-drag primitive (swipe deck / image carousel / slider)

One small, reusable helper. Uses Pointer Events (mouse + touch + pen), pointer capture,
and velocity sampling so a flick counts even if it is short.

```js
// Drag with velocity. No library. Call onMove during, onEnd on release.
function onDrag(el, { onStart, onMove, onEnd } = {}) {
  let d = null;
  el.addEventListener('pointerdown', (e) => {
    el.setPointerCapture?.(e.pointerId);
    d = { id: e.pointerId, sx: e.clientX, sy: e.clientY, s: [] };
    onStart?.();
  });
  el.addEventListener('pointermove', (e) => {
    if (!d || e.pointerId !== d.id) return;
    const now = performance.now();
    d.s.push({ t: now, x: e.clientX });
    while (d.s.length > 2 && now - d.s[0].t > 110) d.s.shift();      // ~last 110ms
    onMove?.({ dx: e.clientX - d.sx, dy: e.clientY - d.sy });
  });
  const end = (e) => {
    if (!d || e.pointerId !== d.id) return;
    const a = d.s[0], b = d.s[d.s.length - 1];
    const vx = d.s.length > 1 ? (b.x - a.x) / Math.max(1, b.t - a.t) : 0; // px/ms
    const r = { dx: e.clientX - d.sx, dy: e.clientY - d.sy, vx };
    d = null;
    onEnd?.(r);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}
```

Image carousel (snap to nearest, commit on flick), CSS-driven motion:

```js
const N = slides.length; let i = 0;
const place = (anim) => { track.style.transition = anim ? 'transform .42s cubic-bezier(.22,1,.36,1)' : 'none';
                          track.style.transform = `translateX(${-i * 100}%)`; };
onDrag(viewport, {
  onMove: ({ dx }) => { track.style.transition = 'none';
    track.style.transform = `translateX(calc(${-i * 100}% + ${dx}px))`; },
  onEnd: ({ dx, vx }) => {
    const w = viewport.clientWidth;
    if ((dx < -w * .25 || vx < -.4) && i < N - 1) i++;
    else if ((dx > w * .25 || vx > .4) && i > 0) i--;
    place(true); dots[i] && syncDots();
  },
});
```

- Put `touch-action: pan-y` on a horizontal carousel viewport (lets the page still scroll
  vertically while you own horizontal drags). Use `touch-action: none` for a free 2-axis
  drag (swipe deck).
- A range/volume/seek control should just be a real `<input type="range">` styled with
  `accent-color` or a `--p:NN%` fill — only hand-roll a drag when you need a custom thumb.

## Recipe B - state-tracking feedback

Reflect the in-progress gesture, then a payoff on commit.

```js
// drag distance -> indicator opacity (e.g. a LIKE/NOPE stamp, page-turn hint)
onMove: ({ dx }) => stamp.style.opacity = Math.min(1, Math.max(0, dx / 90));
```

Like/heart "pop" + ring burst, pure CSS:

```css
.like { transition: transform .14s ease; }
.like.on .heart { fill: var(--brand); }
.like.pop  { animation: pop .42s cubic-bezier(.34,1.56,.64,1); }
.like.pop::after { content:''; position:absolute; inset:-6px; border-radius:50%;
  border:2px solid var(--brand); animation: ring .5s ease-out forwards; }
@keyframes pop  { 0%{transform:scale(1)} 35%{transform:scale(1.28)} 100%{transform:scale(1)} }
@keyframes ring { from{opacity:.6; transform:scale(.6)} to{opacity:0; transform:scale(1.5)} }
```

```js
likeBtn.addEventListener('click', () => {
  const on = likeBtn.classList.toggle('on');
  likeBtn.setAttribute('aria-pressed', on);
  likeBtn.classList.remove('pop'); void likeBtn.offsetWidth; // restart anim
  if (on) likeBtn.classList.add('pop');
});
```

## Recipe C - toggles, tabs & segmented controls

```js
tabs.forEach((t) => t.addEventListener('click', () => {
  tabs.forEach((x) => { const on = x === t;
    x.classList.toggle('active', on); x.setAttribute('aria-selected', on); });
  show(t.dataset.tab);                       // swap the visible panel/screen
}));
```

- Use `role="tablist"`/`role="tab"` + `aria-selected`, or `aria-pressed` for on/off
  buttons (play/pause, mute, follow).
- Move an underline/pill with a `transform` transition rather than re-rendering, so it
  glides between tabs.

## Recipe D - optional flourishes (off by default for strict replicas)

Only when the design clearly has them (a playful landing, a hero CTA). Skip on
information-dense UIs (dashboards, feeds).

```js
// Magnetic button — pull toward the cursor, release on leave
btn.addEventListener('pointermove', (e) => { const r = btn.getBoundingClientRect();
  btn.style.transform = `translate(${(e.clientX - r.left - r.width/2) * .3}px,
                                    ${(e.clientY - r.top - r.height/2) * .3}px)`; });
btn.addEventListener('pointerleave', () => btn.style.transform = '');

// 3D tilt — perspective on a wrapper, rotate the card
card.style.transformPerspective = '900px';
card.addEventListener('pointermove', (e) => { const r = card.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
  card.style.transform = `rotateX(${-py * 6}deg) rotateY(${px * 8}deg)`; });
card.addEventListener('pointerleave', () => card.style.transform = '');
```

A custom cursor (dot + ring following the pointer) is a flourish too — gate it behind
`matchMedia('(hover:hover) and (pointer:fine)')` and never on touch.

## Recipe E - showcase-only motion (NOT for faithful replicas)

Reveal-on-scroll and count-up add motion the screenshot does not contain. Use them **only**
when the user wants an original/landing showcase, never when matching a static target.
Still dependency-free:

```js
const io = new IntersectionObserver((es) => es.forEach((en) => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: .18 });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
// CSS: [data-reveal]{opacity:0;transform:translateY(24px);transition:.7s} .in{opacity:1;transform:none}

// count-up
const tick = (el, to, ms = 1400) => { const t0 = performance.now();
  (function f(t){ const k = Math.min(1, (t - t0) / ms);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(f); })(t0); };
```

## Reduced motion & accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration:.01ms!important; transition-duration:.01ms!important; }
}
```

Also early-return JS flourishes (drag stays — it is user-driven, not auto-motion):

```js
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!REDUCE) { /* pop, ring burst, magnetic, tilt, reveal, count-up */ }
```

Keep logical heading order, `alt` text, visible focus, and keyboard paths (Enter/Space
activate; Esc closes; arrow keys move a carousel/tablist).

## Verify

```bash
node scripts/shot.mjs --in <file> --verify     # dead controls + missing hover/focus
node scripts/shot.mjs --in <file> --states     # base + :hover + :focus frames
```

Fix every flagged dead control. A draggable region should be a real control (or have
`role`/`tabindex` + keyboard fallback), not an inert `<div>`.

## Pitfalls

- Animate `transform`/`opacity` only; never `top/left/width/height`.
- Always `setPointerCapture` on drag so a fast pointer that leaves the element still
  tracks; handle `pointercancel`.
- `touch-action`: `pan-y` for horizontal carousels, `none` for free swipe — or mobile
  drags fight the page scroll.
- Restart a CSS animation with `el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop')`.
- One signature interaction done well (a swipe, a satisfying like) beats ten twitchy
  micro-animations. Don't out-animate the screenshot.
