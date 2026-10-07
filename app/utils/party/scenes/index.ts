// The scene party mode plays: option B, Laser Show.
import type { PartyScene } from "~/utils/party/scene";
import { createLaserShowScene } from "~/utils/party/scenes/laser-show";

export function createPartyScene(): PartyScene {
	return createLaserShowScene();
}
