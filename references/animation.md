# Animation patterns (optional Phase 5)

Restrained GSAP motion for a replicated page. Goal: a few high-impact moments that
make the page feel alive — not motion on everything ("AI slop"). The HTML stays
self-contained (GSAP from a CDN). Always honor `prefers-reduced-motion`.

This file is self-contained — nothing else needs to be installed. For deeper
choreography (SplitText, MorphSVG, Flip, ScrollSmoother, framework integrations) you
may optionally add the official GSAP skills, but it is not required:

```bash
npx skills add github.com/greensock/gsap-skills
```

Authoritative GSAP docs: <https://gsap.com> · source: <https://github.com/greensock/GSAP>

## Setup (CDN, keeps the file self-contained)

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script>
  gsap.registerPlugin(ScrollTrigger);
  // Respect reduced-motion: skip animation, leave the final state visible.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    /* tweens go here */
  }
</script>
```

## Recipe 1 — Hero load-in (staggered reveal)

Use once, on above-the-fold content. Animate transforms + opacity (cheap), not layout.

```js
gsap.from('[data-reveal]', {
  y: 24, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08,
});
```

Mark elements with `data-reveal` in source order (eyebrow, h1, subhead, CTAs).

## Recipe 2 — Scroll-triggered section reveals

Reveal each section as it enters the viewport. `once: true` so it settles.

```js
gsap.utils.toArray('section').forEach((sec) => {
  gsap.from(sec.querySelectorAll('[data-reveal]'), {
    y: 30, autoAlpha: 0, duration: 0.6, ease: 'power2.out', stagger: 0.06,
    scrollTrigger: { trigger: sec, start: 'top 80%', once: true },
  });
});
```

## Recipe 3 — Hover micro-interactions

Prefer CSS for simple hovers; use GSAP when you want spring-y, interruptible motion.

```js
document.querySelectorAll('.card').forEach((el) => {
  el.addEventListener('mouseenter', () => gsap.to(el, { y: -6, scale: 1.02, duration: 0.25, ease: 'power2.out' }));
  el.addEventListener('mouseleave', () => gsap.to(el, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' }));
});
```

## Recipe 4 — Subtle parallax (optional)

Keep it small; large parallax reads as gimmicky.

```js
gsap.to('.hero-bg', {
  yPercent: 12, ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
});
```

## Pitfalls

- Animate `transform` / `autoAlpha`, never `top/left/width/height` (layout thrash).
- `autoAlpha` = opacity + visibility — avoids invisible-but-clickable elements.
- Put the **final** state in CSS; `gsap.from()` animates *into* it, so no-JS and
  reduced-motion users still see the finished page.
- Call `ScrollTrigger.refresh()` after fonts/images change layout.
- One well-orchestrated load-in beats scattered micro-animations everywhere.

## Capture a moving frame

Screenshots freeze motion by default. To capture a running/settled animated frame:

```bash
node scripts/shot.mjs --in replica.html --out tmp/screenshot-to-html/motion.png --width 1280 --motion
```
