// Option B, Laser Show: lights out. After a beat of darkness each visible GK
// monogram buzzes on as a pink neon sign, then green, magenta and cyan laser fans
// sweep up from the bottom of the screen through drifting haze at 124 BPM. A short
// strobe burst (one flash per beat, about two a second) hits every 32 beats.
import {
	TAU,
	beam,
	clamp,
	flash,
	glow,
	inMonogram,
	monogramCentre,
	monogramPath,
	ramp,
	rgba,
	seededRandom,
	type Point,
	type Rgb,
} from "~/utils/party/canvas";
import type { PartyFrame, PartyScene } from "~/utils/party/scene";

const BEAT = 60 / 124; // seconds per beat
const LASERS_AT = 1.8; // seconds into the intro when the lasers fire
const BEAMS_PER_FAN = 7;

const LASER_COLOURS: Rgb[] = [
	[57, 255, 122],
	[255, 43, 214],
	[34, 230, 255],
];
const HAZE: Rgb = [130, 135, 175];
const NEON: Rgb = [255, 50, 190];
const NEON_TUBE: Rgb = [255, 70, 205];
const NEON_CORE: Rgb = [255, 222, 246];

// When the neon sign is lit during the intro: a few flickers, then on for good.
const NEON_ON: [number, number][] = [
	[0.55, 0.62],
	[0.7, 0.76],
	[0.9, 0.98],
	[1.08, 1.5],
	[1.58, Infinity],
];

export function createLaserShowScene(): PartyScene {
	const random = seededRandom(11);
	const haze = Array.from({ length: 6 }, () => ({
		r: 200 + random() * 140,
		phase: random() * TAU,
		sx: 0.05 + random() * 0.06,
		sy: 0.04 + random() * 0.05,
		alpha: 0.07 + random() * 0.06,
	}));

	function drawNeon(f: PartyFrame): void {
		const { light, elapsed, time, monograms } = f;
		if (!NEON_ON.some(([from, to]) => elapsed >= from && elapsed < to)) return;
		// Once fully on, the tube hums with a faint flicker.
		const level = elapsed > 1.58 ? 0.9 + 0.1 * Math.sin(time * 90) * Math.sin(time * 7) : 1;
		for (const box of monograms) {
			const [cx, cy] = monogramCentre(box);
			light.globalAlpha = 0.28 * level;
			light.drawImage(glow(NEON), cx - 120 * box.scale, cy - 80 * box.scale, 240 * box.scale, 160 * box.scale);
			light.globalAlpha = 1;
			inMonogram(light, box, () => {
				light.lineJoin = "round";
				light.strokeStyle = rgba(NEON, 0.18 * level);
				light.lineWidth = 7;
				light.stroke(monogramPath());
				light.strokeStyle = rgba(NEON_TUBE, 0.45 * level);
				light.lineWidth = 3;
				light.stroke(monogramPath());
				light.strokeStyle = rgba(NEON_CORE, level);
				light.lineWidth = 0.9;
				light.stroke(monogramPath());
			});
		}
	}

	function draw(f: PartyFrame): void {
		const { light, width, height, time, elapsed, monograms, reducedMotion } = f;
		const reach = Math.hypot(width, height) * 1.2;
		light.globalCompositeOperation = "lighter";

		const hazeIn = ramp(elapsed, 0.4, 2.6);
		const hazeScale = Math.sqrt(clamp(width / 390, 1, 4));
		for (const h of haze) {
			const x = width * (0.5 + 0.5 * Math.sin(time * h.sx + h.phase));
			const y = height * (0.5 + 0.42 * Math.cos(time * h.sy + h.phase * 1.3));
			const r = h.r * hazeScale;
			light.globalAlpha = hazeIn * h.alpha;
			light.drawImage(glow(HAZE), x - r, y - r, r * 2, r * 2);
		}
		light.globalAlpha = 1;

		drawNeon(f);

		const beats = (elapsed - LASERS_AT) / BEAT;
		if (beats < 0) return;
		const phase = beats % 1;
		const pulse = Math.exp(-phase * 3);
		const bar = Math.floor(beats / 4);
		const pattern = Math.floor(beats / 8) % 3;
		const lasersIn = ramp(elapsed, LASERS_AT, LASERS_AT + 0.3);
		// The "converge" pattern aims every fan at the monogram.
		const [tx, ty]: Point = monograms[0] ? monogramCentre(monograms[0]) : [width / 2, height * 0.25];
		const emitters = [width * 0.1, width * 0.5, width * 0.9];

		emitters.forEach((ex, k) => {
			const ey = height + 6;
			let centre: number;
			let spread: number;
			let colour: Rgb;
			if (pattern === 0) {
				// Sweep: all fans swing together, one colour per bar.
				centre = -Math.PI / 2 + Math.sin(time * 1.25 + k * 1.1) * 0.5;
				spread = 0.75;
				colour = LASER_COLOURS[bar % 3]!;
			} else if (pattern === 1) {
				// Cross: outer fans lean inward, each its own colour.
				centre = -Math.PI / 2 + (1 - k) * 0.55 + Math.sin(time * 2) * 0.22;
				spread = 0.34;
				colour = LASER_COLOURS[k]!;
			} else {
				// Converge on the monogram, breathing in and out.
				centre = Math.atan2(ty - ey, tx - ex);
				spread = 0.06 + 0.08 * (1 + Math.sin(time * 2.4));
				colour = LASER_COLOURS[(bar + k) % 3]!;
			}
			for (let i = 0; i < BEAMS_PER_FAN; i++) {
				const angle = centre + spread * (i / (BEAMS_PER_FAN - 1) - 0.5);
				beam(light, ex, ey, angle, reach, colour, 0.62 * lasersIn * (0.5 + 0.5 * pulse), 1);
			}
		});

		if (reducedMotion) return;
		// One soft flash as the lasers fire.
		if (beats < 1.2) flash(light, width, height, 0.3 * (1 - beats / 1.2));
		// Strobe: one flash per beat for 4 beats in every 32 (~2 flashes a second, under the 3/s limit).
		if ((beats + 20) % 32 >= 28) flash(light, width, height, 0.24 * Math.exp(-phase * 12));
	}

	return {
		dim: { color: "#040309", opacity: 0.9, duration: 0.15 },
		draw,
	};
}
