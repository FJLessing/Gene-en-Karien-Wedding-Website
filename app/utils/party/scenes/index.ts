// The scene party mode plays: option C, Dance Floor.
import type { PartyScene } from "~/utils/party/scene";
import { createDanceFloorScene } from "~/utils/party/scenes/dance-floor";

export function createPartyScene(): PartyScene {
	return createDanceFloorScene();
}
