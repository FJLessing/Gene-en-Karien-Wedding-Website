// Contract between PartyOverlay.vue and a party mode scene. These types use DOM
// canvas APIs, so they live here (client code) rather than in shared/types, which
// the server also compiles.

// Where a visible GK monogram sits on screen. Multiply monogram path units by
// `scale` and offset by x/y to get viewport CSS pixels.
export interface MonogramBox {
	x: number;
	y: number;
	scale: number;
}

export interface PartyFrame {
	// Solid shapes (floor tiles, mirror ball, redrawn monogram). Normal blending.
	base: CanvasRenderingContext2D;
	// Light (beams, glows, specks). Screen-blended over the page, so draw additively.
	light: CanvasRenderingContext2D;
	// Viewport size in CSS pixels. Both contexts are pre-scaled for devicePixelRatio.
	width: number;
	height: number;
	// Seconds on a continuous clock, for looping motion.
	time: number;
	// Seconds since party mode started, for the intro sequence.
	elapsed: number;
	monograms: MonogramBox[];
	// True when the visitor prefers reduced motion: the overlay draws one still
	// frame, and scenes must skip anything that flashes.
	reducedMotion: boolean;
}

export interface PartyScene {
	// The dark layer over the page. `duration` is the fade-in in seconds.
	dim: { color: string; opacity: number; duration: number };
	draw(frame: PartyFrame): void;
	// Optional reaction to taps anywhere on the page (viewport CSS pixels).
	onPointer?(x: number, y: number, time: number): void;
}
