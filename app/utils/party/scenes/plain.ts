// Placeholder scene for the shared base: dims the page and draws nothing else.
// Each option branch replaces it in scenes/index.ts with its own scene.
import type { PartyScene } from "~/utils/party/scene";

export function createPlainScene(): PartyScene {
	return {
		dim: { color: "#120c08", opacity: 0.6, duration: 0.8 },
		draw: () => {},
	};
}
