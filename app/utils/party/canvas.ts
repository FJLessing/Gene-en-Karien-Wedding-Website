// Drawing helpers shared by the party mode scenes: easing, seeded randomness,
// cached glow sprites and the beam / cone / quad primitives.
import { MONOGRAM_BOUNDS, MONOGRAM_PATH } from "~/utils/monogram";
import type { MonogramBox } from "~/utils/party/scene";

export const TAU = Math.PI * 2;

export type Rgb = readonly [number, number, number];
export type Point = readonly [number, number];

export const rgba = (c: Rgb, alpha: number): string => `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;

// Mix a colour halfway to white, for the bright core of a beam.
export const whiten = (c: Rgb): Rgb => [(c[0] + 255) >> 1, (c[1] + 255) >> 1, (c[2] + 255) >> 1];

export const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));

// 0 before `from`, 1 after `to`, linear in between. Drives the intro timelines.
export const ramp = (t: number, from: number, to: number): number => clamp((t - from) / (to - from));

export const smooth = (x: number): number => x * x * (3 - 2 * x);

export const backOut = (x: number): number => {
	const c1 = 1.4;
	const c3 = c1 + 1;
	return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

// Stable pseudo-random value in [0, 1) for a set of integers.
export function hash(a: number, b = 0, c = 0): number {
	const h = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
	return h - Math.floor(h);
}

// Seeded generator (mulberry32) so particle layouts are the same on every visit.
export function seededRandom(seed: number): () => number {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function hsl(hue: number, saturation: number, lightness: number): Rgb {
	const h = ((hue % 360) + 360) % 360;
	const a = saturation * Math.min(lightness, 1 - lightness);
	const f = (n: number): number => {
		const k = (n + h / 30) % 12;
		return Math.round((lightness - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))) * 255);
	};
	return [f(0), f(8), f(4)];
}

// Soft round glow, cached per colour. Keep the number of distinct colours small.
const glowCache = new Map<string, HTMLCanvasElement>();
export function glow(c: Rgb): HTMLCanvasElement {
	const key = c.join(",");
	const cached = glowCache.get(key);
	if (cached) return cached;
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = 64;
	const ctx = canvas.getContext("2d")!;
	const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
	gradient.addColorStop(0, rgba(c, 1));
	gradient.addColorStop(0.25, rgba(c, 0.5));
	gradient.addColorStop(1, rgba(c, 0));
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 64, 64);
	glowCache.set(key, canvas);
	return canvas;
}

// Four-point twinkle star with a warm halo (glitter, mirror ball glints).
let starSprite: HTMLCanvasElement | null = null;
export function star(): HTMLCanvasElement {
	if (starSprite) return starSprite;
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = 48;
	const ctx = canvas.getContext("2d")!;
	ctx.drawImage(glow([255, 226, 170]), 12, 12, 24, 24);
	ctx.fillStyle = "rgb(255,248,232)";
	ctx.beginPath();
	ctx.moveTo(24, 2);
	ctx.quadraticCurveTo(26, 22, 46, 24);
	ctx.quadraticCurveTo(26, 26, 24, 46);
	ctx.quadraticCurveTo(22, 26, 2, 24);
	ctx.quadraticCurveTo(22, 22, 24, 2);
	ctx.fill();
	starSprite = canvas;
	return canvas;
}

let monogramPath2D: Path2D | null = null;
export function monogramPath(): Path2D {
	return (monogramPath2D ??= new Path2D(MONOGRAM_PATH));
}

export function monogramCentre(box: MonogramBox): Point {
	return [
		box.x + (MONOGRAM_BOUNDS.x + MONOGRAM_BOUNDS.width / 2) * box.scale,
		box.y + (MONOGRAM_BOUNDS.y + MONOGRAM_BOUNDS.height / 2) * box.scale,
	];
}

// Run `draw` in monogram path units for the given box.
export function inMonogram(ctx: CanvasRenderingContext2D, box: MonogramBox, draw: () => void): void {
	ctx.save();
	ctx.translate(box.x, box.y);
	ctx.scale(box.scale, box.scale);
	draw();
	ctx.restore();
}

export function line(ctx: CanvasRenderingContext2D, x: number, y: number, x2: number, y2: number): void {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

export function quad(ctx: CanvasRenderingContext2D, p1: Point, p2: Point, p3: Point, p4: Point): void {
	ctx.beginPath();
	ctx.moveTo(p1[0], p1[1]);
	ctx.lineTo(p2[0], p2[1]);
	ctx.lineTo(p3[0], p3[1]);
	ctx.lineTo(p4[0], p4[1]);
	ctx.closePath();
	ctx.fill();
}

// Laser beam: wide faint halo, mid glow and a near-white core.
export function beam(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, length: number, c: Rgb, alpha: number, width: number): void {
	const x2 = x + Math.cos(angle) * length;
	const y2 = y + Math.sin(angle) * length;
	ctx.lineCap = "round";
	ctx.strokeStyle = rgba(c, alpha * 0.14);
	ctx.lineWidth = width * 7;
	line(ctx, x, y, x2, y2);
	ctx.strokeStyle = rgba(c, alpha * 0.42);
	ctx.lineWidth = width * 2.4;
	line(ctx, x, y, x2, y2);
	ctx.strokeStyle = rgba(whiten(c), alpha);
	ctx.lineWidth = width * 0.8;
	line(ctx, x, y, x2, y2);
}

// Fine beam that fades out along its length.
export function fadeBeam(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, length: number, c: Rgb, alpha: number, width: number): void {
	const x2 = x + Math.cos(angle) * length;
	const y2 = y + Math.sin(angle) * length;
	const gradient = ctx.createLinearGradient(x, y, x2, y2);
	gradient.addColorStop(0, rgba(c, alpha));
	gradient.addColorStop(1, rgba(c, 0));
	ctx.strokeStyle = gradient;
	ctx.lineCap = "round";
	ctx.globalAlpha = 0.18;
	ctx.lineWidth = width * 6;
	line(ctx, x, y, x2, y2);
	ctx.globalAlpha = 1;
	ctx.lineWidth = width;
	line(ctx, x, y, x2, y2);
}

// Spotlight cone with soft edges (three nested wedges).
export function softCone(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, length: number, spread: number, c: Rgb, alpha: number): void {
	for (const k of [1, 0.62, 0.3]) {
		const s = spread * k;
		const gradient = ctx.createLinearGradient(x, y, x + Math.cos(angle) * length, y + Math.sin(angle) * length);
		gradient.addColorStop(0, rgba(c, alpha * 0.5));
		gradient.addColorStop(1, rgba(c, 0));
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + Math.cos(angle - s) * length, y + Math.sin(angle - s) * length);
		ctx.lineTo(x + Math.cos(angle + s) * length, y + Math.sin(angle + s) * length);
		ctx.closePath();
		ctx.fill();
	}
}

// Full-screen white flash. Callers keep flashes under three a second.
export function flash(ctx: CanvasRenderingContext2D, width: number, height: number, alpha: number): void {
	ctx.fillStyle = `rgba(255,255,255,${alpha})`;
	ctx.fillRect(0, 0, width, height);
}
