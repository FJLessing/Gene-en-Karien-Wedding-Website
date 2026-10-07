// The scene party mode plays: option A, Champagne Disco.
import type { PartyScene } from "~/utils/party/scene";
import { createChampagneDiscoScene } from "~/utils/party/scenes/champagne-disco";

export function createPartyScene(): PartyScene {
	return createChampagneDiscoScene();
}
