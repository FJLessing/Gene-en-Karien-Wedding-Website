// Option A, Champagne Disco: the quiet gold site after dark. Each visible GK
// monogram turns into gold mirror tiles and throws warm specks of light across the
// page. Champagne spotlights sweep in from the top corners, fine gold lasers fan
// out from behind the monogram, and glitter drifts down.
import { MONOGRAM_BOUNDS } from "~/utils/monogram";
import {
	TAU,
	clamp,
	fadeBeam,
	glow,
	hash,
	inMonogram,
	monogramCentre,
	monogramPath,
	ramp,
	seededRandom,
	smooth,
	softCone,
	star,
	type Point,
	type Rgb,
} from "~/utils/party/canvas";
import type { MonogramBox, PartyFrame, PartyScene } from "~/utils/party/scene";

const TILE = 2.7; // mirror tile size, in monogram units
const PHONE_AREA = 390 * 844; // particle counts are tuned for a phone, then scaled up

const SPOT_WARM: Rgb = [255, 206, 140];
const SPOT_PALE: Rgb = [255, 226, 190];
const LASER_GOLD: Rgb = [255, 212, 150];
const GLINT: Rgb = [255, 236, 200];
const SPECK_COLOURS: Rgb[] = [
	[255, 236, 200],
	[255, 214, 160],
	[255, 246, 228],
	[250, 200, 180],
];

// Points inside a tile tested against the glyph, so thin strokes still get tiles.
const TILE_PROBES: Point[] = [[0.5, 0.5], [0.1, 0.1], [0.9, 0.1], [0.1, 0.9], [0.9, 0.9]];

interface Tile {
	x: number;
	y: number;
	phase: number;
	speed: number;
	base: number;
}

// Mirror tiles that cover the glyph, in monogram units.
function buildTiles(): Tile[] {
	const probe = document.createElement("canvas").getContext("2d")!;
	const path = monogramPath();
	const tiles: Tile[] = [];
	const { x: bx, y: by, width, height } = MONOGRAM_BOUNDS;
	for (let y = by; y < by + height; y += TILE) {
		for (let x = bx; x < bx + width; x += TILE) {
			const covers = TILE_PROBES.some(([u, v]) => probe.isPointInPath(path, x + u * TILE, y + v * TILE));
			if (covers) tiles.push({ x, y, phase: hash(x, y) * TAU, speed: 0.6 + hash(y, x) * 2.4, base: hash(x * 3, y * 7) });
		}
	}
	return tiles;
}

export function createChampagneDiscoScene(): PartyScene {
	const random = seededRandom(7);
	const specks = Array.from({ length: 160 }, () => ({
		u: random(),
		v: random(),
		r: 2.5 + random() * 4.5,
		phase: random() * TAU,
		speed: 1 + random() * 2.5,
		colour: SPECK_COLOURS[Math.floor(random() * SPECK_COLOURS.length)]!,
	}));
	const glitter = Array.from({ length: 85 }, () => ({
		x: random(),
		y: random(),
		fall: 14 + random() * 22,
		r: 3 + random() * 5,
		phase: random() * TAU,
		speed: 1.5 + random() * 3,
	}));
	let tiles: Tile[] | null = null;

	function drawTiles(f: PartyFrame, box: MonogramBox): void {
		const { base, light, time, elapsed } = f;
		const reveal = ramp(elapsed, 0.5, 1.8);
		if (!reveal) return;
		tiles ??= buildTiles();
		// A shimmer front sweeps left to right, turning the glyph to mirror.
		const front = reveal * 1.3 - 0.15;
		const glints: [number, number, number][] = [];

		inMonogram(base, box, () => {
			base.globalAlpha = smooth(clamp(reveal * 3));
			base.fillStyle = "#2e2216";
			base.fill(monogramPath());
			base.globalAlpha = 1;
			base.clip(monogramPath());
			for (const tile of tiles!) {
				const nx = (tile.x - MONOGRAM_BOUNDS.x) / MONOGRAM_BOUNDS.width;
				if (nx > front) continue;
				const sweep = Math.pow(Math.max(0, Math.cos(tile.x * 0.07 - tile.y * 0.035 - time * 1.6)), 8);
				const twinkle = Math.sin(time * tile.speed + tile.phase) > 0.94 ? 0.9 : 0;
				const edge = Math.max(0, 1 - (front - nx) * 8);
				const b = clamp(0.18 + 0.22 * tile.base + 0.55 * sweep + twinkle + edge * 0.8);
				base.fillStyle = `rgb(${(96 + 159 * b) | 0},${(74 + 168 * b) | 0},${(46 + 168 * b) | 0})`;
				base.fillRect(tile.x + 0.3, tile.y + 0.3, TILE - 0.6, TILE - 0.6);
				if (b > 0.82) glints.push([tile.x + TILE / 2, tile.y + TILE / 2, b]);
			}
		});

		inMonogram(light, box, () => {
			for (const [x, y, b] of glints) {
				light.globalAlpha = (b - 0.8) * 4;
				light.drawImage(glow(GLINT), x - 6, y - 6, 12, 12);
			}
		});
		light.globalAlpha = 1;
	}

	function draw(f: PartyFrame): void {
		const { light, width, height, time, elapsed, monograms } = f;
		const reach = Math.hypot(width, height);
		const density = clamp((width * height) / PHONE_AREA, 1, 2.5);
		light.globalCompositeOperation = "lighter";

		const spotsIn = ramp(elapsed, 0.7, 2);
		if (spotsIn) {
			softCone(light, -20, -30, 1.05 + Math.sin(time * 0.45) * 0.28, reach, 0.2, SPOT_WARM, 0.16 * spotsIn);
			softCone(light, width + 20, -30, Math.PI - 1.05 + Math.sin(time * 0.45 + 2.2) * 0.28, reach, 0.2, SPOT_PALE, 0.16 * spotsIn);
		}

		// Gold laser starburst from behind each monogram (or high centre if none is on screen).
		const lasersIn = ramp(elapsed, 1.7, 3);
		if (lasersIn) {
			const origins: [Point, number][] = monograms.length
				? monograms.map((box) => [monogramCentre(box), box.scale])
				: [[[width / 2, height * 0.12], 1]];
			for (const [[cx, cy], scale] of origins) {
				for (let i = 0; i < 14; i++) {
					const a = time * 0.16 + (i * TAU) / 14;
					const pulse = 0.5 + 0.5 * Math.sin(time * 1.6 + i * 1.7);
					fadeBeam(light, cx + Math.cos(a) * 54 * scale, cy + Math.sin(a) * 40 * scale, a, reach * 0.7, LASER_GOLD, 0.7 * lasersIn * (0.35 + 0.65 * pulse), 0.7);
				}
			}
		}

		// Light specks thrown off the mirror, drifting across the room together.
		const specksIn = ramp(elapsed, 1.3, 2.6);
		if (specksIn) {
			const count = Math.min(specks.length, Math.round(64 * density));
			for (let i = 0; i < count; i++) {
				const s = specks[i]!;
				const u = (s.u + time * 0.028) % 1;
				const edge = Math.sin(Math.PI * u);
				const alpha = specksIn * edge * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
				if (alpha <= 0.01) continue;
				const w = s.r * 2 * (0.45 + 0.55 * edge);
				const h = s.r * 1.6;
				light.globalAlpha = alpha;
				light.drawImage(glow(s.colour), u * (width + 60) - 30 - w, s.v * height - h, w * 2, h * 2);
			}
			light.globalAlpha = 1;
		}

		for (const box of monograms) drawTiles(f, box);

		const glitterIn = ramp(elapsed, 2, 3.4);
		if (glitterIn) {
			const count = Math.min(glitter.length, Math.round(34 * density));
			for (let i = 0; i < count; i++) {
				const g = glitter[i]!;
				const y = ((g.y * height + time * g.fall) % (height + 40)) - 20;
				const x = g.x * width + Math.sin(time * 0.9 + g.phase) * 10;
				light.globalAlpha = glitterIn * (0.25 + 0.75 * Math.pow(Math.max(0, Math.sin(time * g.speed + g.phase)), 3));
				light.drawImage(star(), x - g.r, y - g.r, g.r * 2, g.r * 2);
			}
			light.globalAlpha = 1;
		}
	}

	return {
		dim: { color: "#150c04", opacity: 0.74, duration: 1.2 },
		draw,
	};
}
