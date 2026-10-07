// Option C, Dance Floor: a light-up 70s floor rises along the bottom of the screen
// and chases the beat (104 BPM, the tempo of Stayin' Alive). A mirror ball drops in,
// each visible GK monogram lights up in chasing marquee bulbs, three coloured
// spotlights hunt across the page and a rainbow laser sweeps from the ball. Tapping
// the floor sends a ripple of light through it.
import {
	TAU,
	backOut,
	beam,
	clamp,
	glow,
	hash,
	hsl,
	inMonogram,
	line,
	monogramPath,
	quad,
	ramp,
	rgba,
	seededRandom,
	softCone,
	star,
	type Point,
	type Rgb,
} from "~/utils/party/canvas";
import type { PartyFrame, PartyScene } from "~/utils/party/scene";

const BEAT = 60 / 104; // seconds per beat
const PHONE_AREA = 390 * 844;
const BULB_COUNT = 96;

const FLOOR_COLOURS: Rgb[] = [
	[255, 179, 71],
	[255, 95, 162],
	[53, 208, 192],
	[169, 139, 255],
];
const FLOOR_DARK: Rgb = [26, 16, 34];
const SPOT_COLOURS: Rgb[] = [
	[255, 170, 60],
	[255, 80, 160],
	[60, 220, 200],
];
const BULB_GLOW: Rgb = [255, 200, 120];

// Perspective floor. World units: tiles are 0.5 wide; depth z runs from the near
// edge (just below the screen) to the far edge at 80% of the screen height.
interface Floor {
	width: number;
	cols: number;
	rows: number;
	near: number;
	far: number;
	depth: number; // z per row
	tile: number;
	left: number; // world x of the left edge
	horizon: number;
	ky: number;
	kx: number;
	top: number; // screen y of the far edge
}

function floorFor(width: number, height: number): Floor {
	const cols = clamp(Math.round(width / 45) | 1, 9, 21); // odd, so one column sits in the centre
	const rows = 8;
	const near = 1.2;
	const far = 4.4;
	const tile = 0.5;
	const top = height * 0.8;
	const ky = (height + 40 - top) / (1 / near - 1 / far);
	const left = (-cols * tile) / 2;
	return {
		width,
		cols,
		rows,
		near,
		far,
		depth: (far - near) / rows,
		tile,
		left,
		horizon: top - ky / far,
		ky,
		kx: (width * 0.47 * far) / -left, // far edge spans 94% of the width
		top,
	};
}

const project = (fl: Floor, x: number, z: number): Point => [fl.width / 2 + (x * fl.kx) / z, fl.horizon + fl.ky / z];

export function createDanceFloorScene(): PartyScene {
	const random = seededRandom(23);
	const specks = Array.from({ length: 135 }, () => ({
		u: random(),
		v: random() * 0.78,
		r: 2.5 + random() * 4,
		phase: random() * TAU,
		speed: 1 + random() * 2.5,
		hue: random() * 360,
	}));
	let floor: Floor | null = null;
	let ripples: { c: number; r: number; t: number }[] = [];
	let bulbs: Point[] | null = null;

	// Bulb positions along the glyph outline, read from the monogram on the page.
	function bulbPoints(): Point[] | null {
		if (bulbs) return bulbs;
		const path = document.querySelector<SVGPathElement>("[data-party-monogram] path");
		if (!path) return null;
		const length = path.getTotalLength();
		bulbs = Array.from({ length: BULB_COUNT }, (_, i) => {
			const p = path.getPointAtLength((i * length) / BULB_COUNT);
			return [p.x, p.y] as Point;
		});
		return bulbs;
	}

	function drawFloor(f: PartyFrame, fl: Floor, beats: number, pulse: number): void {
		const { base, light, height, time, elapsed } = f;
		const floorIn = ramp(elapsed, 0.15, 0.6);
		if (!floorIn) return;

		base.globalAlpha = floorIn;
		base.fillStyle = "#0d0813";
		quad(base, project(fl, fl.left, fl.far), project(fl, -fl.left, fl.far), [project(fl, -fl.left, fl.near)[0], height + 60], [project(fl, fl.left, fl.near)[0], height + 60]);
		base.globalAlpha = 1;

		const pattern = Math.floor(beats / 8) % 4;
		const beat = Math.floor(beats);
		const half = (beats % 1) > 0.5 ? 1 : 0;
		const centre = (fl.cols - 1) / 2;
		const gap = 0.04;

		for (let r = 0; r < fl.rows; r++) {
			// Rows light up front to back during the intro.
			const rowIn = ramp(elapsed, 0.25 + r * 0.11, 0.5 + r * 0.11);
			if (!rowIn) continue;
			const za = fl.near + r * fl.depth;
			const zb = za + fl.depth;
			for (let c = 0; c < fl.cols; c++) {
				let level: number;
				if (pattern === 0) level = (r + c + beat) % 2 === 0 ? 0.3 + 0.7 * pulse : 0.06; // checkerboard
				else if (pattern === 1) level = Math.pow(Math.max(0, Math.cos(Math.hypot(c - centre, r * 1.1) * 1.05 - beats * Math.PI * 0.5)), 4); // rings
				else if (pattern === 2) level = hash(r, c, beat) > 0.62 ? 0.25 + 0.75 * pulse : 0.06; // random
				else level = (c + r) % 6 === (beat * 2 + half) % 6 ? 1 : 0.08; // diagonal chase
				for (const rp of ripples) {
					const age = time - rp.t;
					const d = Math.hypot(c - rp.c, r - rp.r) - age * 7;
					level = Math.max(level, Math.exp(-d * d * 1.2) * Math.max(0, 1 - age / 1.4));
				}
				level *= rowIn;

				const colour = FLOOR_COLOURS[(c + r * 3) % FLOOR_COLOURS.length]!;
				const k = 0.1 + 0.9 * level;
				const xa = fl.left + c * fl.tile;
				const xb = xa + fl.tile;
				const p1 = project(fl, xa + gap, za + gap);
				const p2 = project(fl, xb - gap, za + gap);
				const p3 = project(fl, xb - gap, zb - gap);
				const p4 = project(fl, xa + gap, zb - gap);
				base.fillStyle = `rgb(${(FLOOR_DARK[0] + (colour[0] - FLOOR_DARK[0]) * k) | 0},${(FLOOR_DARK[1] + (colour[1] - FLOOR_DARK[1]) * k) | 0},${(FLOOR_DARK[2] + (colour[2] - FLOOR_DARK[2]) * k) | 0})`;
				quad(base, p1, p2, p3, p4);
				if (level > 0.25) {
					const mx = (p1[0] + p3[0]) / 2;
					const my = (p1[1] + p3[1]) / 2;
					const rr = (p2[0] - p1[0]) * 0.9;
					light.globalAlpha = level * 0.32;
					light.drawImage(glow(colour), mx - rr, my - rr * 0.6, rr * 2, rr * 1.2);
				}
			}
		}
		light.globalAlpha = 1;
		ripples = ripples.filter((rp) => time - rp.t < 1.5);
	}

	function drawMirrorBall(f: PartyFrame, x: number, y: number, r: number): void {
		const { base, light, time } = f;
		const rot = time * 0.9;
		const lat = 9;
		const lon = 18;
		const sparks: Point[] = [];
		base.save();
		base.beginPath();
		base.arc(x, y, r, 0, TAU);
		base.fillStyle = "#1d1b22";
		base.fill();
		base.clip();
		for (let i = 0; i < lat; i++) {
			const a0 = -Math.PI / 2 + (i * Math.PI) / lat;
			const a1 = a0 + Math.PI / lat;
			const am = (a0 + a1) / 2;
			for (let j = 0; j < lon; j++) {
				const o0 = (j * TAU) / lon + rot;
				const o1 = o0 + TAU / lon;
				const om = (o0 + o1) / 2;
				if (Math.cos(om) <= 0) continue; // facet faces away
				const at = (la: number, lo: number): Point => [x + r * Math.sin(lo) * Math.cos(la), y + r * Math.sin(la)];
				const facing = Math.cos(om) * Math.cos(am);
				const h = hash(i, j);
				const lit = clamp(0.5 - 0.5 * Math.sin(am) - 0.35 * Math.sin(om));
				const spark = Math.sin(time * 2.6 + h * 50) > 0.9;
				const v = ((spark ? 1 : 0.16 + 0.55 * facing * lit + 0.22 * h) * 236) | 0;
				base.fillStyle = `rgb(${v},${v},${Math.min(255, v + 14)})`;
				quad(base, at(a0 + 0.03, o0 + 0.03), at(a0 + 0.03, o1 - 0.03), at(a1 - 0.03, o1 - 0.03), at(a1 - 0.03, o0 + 0.03));
				if (spark && facing > 0.3) sparks.push(at(am, om));
			}
		}
		const sheen = base.createRadialGradient(x - r * 0.35, y - r * 0.4, 0, x - r * 0.35, y - r * 0.4, r * 1.1);
		sheen.addColorStop(0, "rgba(255,255,255,0.35)");
		sheen.addColorStop(1, "rgba(255,255,255,0)");
		base.fillStyle = sheen;
		base.fillRect(x - r, y - r, r * 2, r * 2);
		base.restore();
		base.fillStyle = "#8a8170";
		base.fillRect(x - 2.5, y - r - 3, 5, 4);
		for (const [px, py] of sparks) light.drawImage(star(), px - 7, py - 7, 14, 14);
	}

	function drawBulbs(f: PartyFrame): void {
		const { base, light, time, elapsed, monograms } = f;
		const bulbsIn = ramp(elapsed, 1.1, 2.1);
		const points = bulbsIn && monograms.length ? bulbPoints() : null;
		if (!points) return;
		// Classic theatre chase: every third bulb lit, stepping 7 times a second.
		const step = Math.floor(time * 7);
		for (const box of monograms) {
			const lit: Point[] = [];
			inMonogram(base, box, () => {
				base.globalAlpha = Math.min(1, bulbsIn * 2) * 0.9;
				base.fillStyle = "#21160f";
				base.fill(monogramPath());
				base.globalAlpha = 1;
				points.forEach(([x, y], i) => {
					if (i / points.length > bulbsIn) return;
					const on = (i + step) % 3 === 0;
					base.fillStyle = on ? "#ffe6b0" : "#6b4f33";
					base.beginPath();
					base.arc(x, y, 1.25, 0, TAU);
					base.fill();
					if (on) lit.push([x, y]);
				});
			});
			inMonogram(light, box, () => {
				light.globalAlpha = 0.55;
				for (const [x, y] of lit) light.drawImage(glow(BULB_GLOW), x - 5, y - 5, 10, 10);
			});
			light.globalAlpha = 1;
		}
	}

	function draw(f: PartyFrame): void {
		const { base, light, width, height, time, elapsed } = f;
		const beats = elapsed / BEAT;
		const pulse = Math.exp(-(beats % 1) * 3.2);
		const reach = Math.hypot(width, height);
		floor = floorFor(width, height);
		light.globalCompositeOperation = "lighter";

		// Slow colour wash over the whole room.
		const washIn = ramp(elapsed, 0.2, 1.4);
		light.fillStyle = rgba(hsl(time * 22, 0.85, 0.55), 0.08 * washIn);
		light.fillRect(0, 0, width, height);

		// Moving-head spotlights hunting across the page.
		const spotsIn = ramp(elapsed, 1.9, 2.8);
		if (spotsIn) {
			[0.15, 0.5, 0.85].forEach((at, k) => {
				softCone(light, width * at, -14, Math.PI / 2 + Math.sin(time * 0.62 + k * 2.2) * 0.6, reach, 0.13, SPOT_COLOURS[k]!, 0.26 * spotsIn);
			});
		}

		drawFloor(f, floor, beats, pulse);

		// Mirror ball drops in from the top right on its chain.
		const drop = ramp(elapsed, 0.7, 1.8);
		const ballR = clamp(width * 0.062, 22, 34);
		const ballX = width - Math.max(62, width * 0.1) + Math.sin(time * 0.8) * 1.5;
		const ballY = -40 + (clamp(height * 0.09, 60, 90) + 40) * backOut(drop);
		if (drop) {
			base.strokeStyle = "rgba(205,195,175,0.75)";
			base.lineWidth = 0.8;
			line(base, ballX, 0, ballX, ballY - ballR);
			drawMirrorBall(f, ballX, ballY, ballR);
		}

		// Coloured reflections from the ball drifting across the room.
		const specksIn = ramp(elapsed, 1.6, 2.6) * 0.9;
		if (specksIn) {
			const count = Math.min(specks.length, Math.round(54 * clamp((width * height) / PHONE_AREA, 1, 2.5)));
			for (let i = 0; i < count; i++) {
				const s = specks[i]!;
				const u = (s.u + time * 0.028) % 1;
				const edge = Math.sin(Math.PI * u);
				const alpha = specksIn * edge * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
				if (alpha <= 0.01) continue;
				const w = s.r * 2 * (0.45 + 0.55 * edge);
				const h = s.r * 1.6;
				// Hue snapped to 15° steps so the glow sprite cache stays small.
				const colour = hsl(Math.round((s.hue + time * 30) / 15) * 15, 0.9, 0.7);
				light.globalAlpha = alpha;
				light.drawImage(glow(colour), u * (width + 60) - 30 - w, s.v * height - h, w * 2, h * 2);
			}
			light.globalAlpha = 1;
		}

		// Rainbow laser fan from the ball.
		const rainbowIn = ramp(elapsed, 2.4, 3.4);
		if (rainbowIn) {
			const centre = Math.PI * 0.7 + Math.sin(time * 0.5) * 0.32;
			for (let i = 0; i < 7; i++) {
				beam(light, ballX, ballY + 6, centre + 0.5 * (i / 6 - 0.5), reach * 1.1, hsl(i * 50 + time * 30, 1, 0.6), 0.5 * rainbowIn * (0.6 + 0.4 * pulse), 0.8);
			}
		}

		drawBulbs(f);
	}

	// Tap the floor to send a ripple out from that tile; taps above it ripple from the front.
	function onPointer(x: number, y: number, time: number): void {
		const fl = floor;
		if (!fl) return;
		let c = (fl.cols - 1) / 2;
		let r = 0;
		if (y > fl.top) {
			const z = fl.ky / (y - fl.horizon);
			c = ((x - fl.width / 2) * z) / fl.kx / fl.tile - fl.left / fl.tile - 0.5;
			r = (z - fl.near) / fl.depth - 0.5;
		}
		ripples.push({ c, r, t: time });
	}

	return {
		dim: { color: "#150a20", opacity: 0.66, duration: 0.8 },
		draw,
		onPointer,
	};
}
