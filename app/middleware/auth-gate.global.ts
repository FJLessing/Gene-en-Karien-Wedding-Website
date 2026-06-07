import { AccessState } from "#shared/types/types";

// Global access gate (Story 1). Runs on every navigation, server and client.
// If the shared invite URL param is present, unlock immediately. Otherwise the
// state stays Locked and the envelope/password layout is shown.
//
// Note: this does NOT redirect — the envelope is rendered inline. Pages read
// `useAccess().isUnlocked` to decide between the envelope and the content.
export default defineNuxtRouteMiddleware((to) => {
	const config = useRuntimeConfig();
	const paramName = config.public.accessParam;
	const access = useState<AccessState>("access-state", () => AccessState.Locked);

	const hasInviteParam = paramName in to.query && !!to.query[paramName];
	if (hasInviteParam) {
		access.value = AccessState.Unlocked;
	}
});
