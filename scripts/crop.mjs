#!/usr/bin/env node
/*
 * crop.mjs — Crop a rectangle out of a source screenshot to reuse real imagery.
 *
 * Asset layer 2 of the screenshot-to-html four-layer strategy: when the target screenshot
 * already contains the real photo/avatar/product shot, lift that region out and
 * reference it in the replica instead of a placeholder.
 *
 * Prefers `sharp` (npm i -D sharp). Falls back to macOS `sips` if sharp is missing.
 *
 * Usage:
 *   node crop.mjs --in target.png --rect x,y,w,h --out assets/hero.png
 *   node crop.mjs --in target.png --rect 720,180,520,640 --out assets/hero.png --scale 2
 *
 * Options:
 *   --in <file>      source screenshot (required)
 *   --out <file>     output PNG path (required)
 *   --rect x,y,w,h   crop rectangle in source pixels (required)
 *   --scale <n>      multiply the rect by n — use 2 if you eyeballed coords on a 1x
 *                    preview of a 2x screenshot (default 1)
 */
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

function parseArgs(argv) {
  const a = { scale: 1 };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const val = () => argv[++i];
    if (flag === '--in') a.in = val();
    else if (flag === '--out') a.out = val();
    else if (flag === '--rect') a.rect = val();
    else if (flag === '--scale') a.scale = parseFloat(val());
  }
  return a;
}

const args = parseArgs(process.argv.slice(2));
if (!args.in || !args.out || !args.rect) {
  console.error('[crop] usage: node crop.mjs --in <src.png> --rect x,y,w,h --out <out.png> [--scale n]');
  process.exit(2);
}

const src = path.resolve(args.in);
if (!existsSync(src)) { console.error(`[crop] input not found: ${src}`); process.exit(2); }

let [x, y, w, h] = String(args.rect).split(',').map(Number);
if ([x, y, w, h].some((n) => !Number.isFinite(n))) {
  console.error('[crop] --rect must be four numbers: x,y,w,h'); process.exit(2);
}
const s = args.scale || 1;
x = Math.round(x * s); y = Math.round(y * s); w = Math.round(w * s); h = Math.round(h * s);

const out = path.resolve(args.out);
mkdirSync(path.dirname(out), { recursive: true });

async function withSharp() {
  const { default: sharp } = await import('sharp');
  const meta = await sharp(src).metadata();
  const left = Math.max(0, Math.min(x, (meta.width || x + 1) - 1));
  const top = Math.max(0, Math.min(y, (meta.height || y + 1) - 1));
  const width = Math.max(1, Math.min(w, (meta.width || left + w) - left));
  const height = Math.max(1, Math.min(h, (meta.height || top + h) - top));
  await sharp(src).extract({ left, top, width, height }).toFile(out);
  return `${width}x${height}+${left}+${top} via sharp`;
}

function withSips() {
  // macOS best-effort fallback. sips crops to <h> <w> at the given top/left offset.
  execFileSync('sips', ['--cropOffset', String(y), String(x), '-c', String(h), String(w), src, '--out', out], { stdio: 'pipe' });
  return `${w}x${h}+${x}+${y} via sips`;
}

try {
  console.log(`[crop] ${await withSharp()} -> ${out}`);
} catch (sharpErr) {
  try {
    console.log(`[crop] ${withSips()} -> ${out}`);
  } catch (sipsErr) {
    console.error('[crop] could not crop. Install sharp (recommended) or use macOS sips.');
    console.error('  npm i -D sharp');
    console.error(String((sharpErr && sharpErr.message) || sharpErr));
    process.exit(3);
  }
}
