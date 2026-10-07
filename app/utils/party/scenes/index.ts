// The scene party mode plays. The option branches (partymode/option-a, -b, -c)
// each swap in their own scene here.
import type { PartyScene } from "~/utils/party/scene";
import { createPlainScene } from "~/utils/party/scenes/plain";

export function createPartyScene(): PartyScene {
	return createPlainScene();
}
