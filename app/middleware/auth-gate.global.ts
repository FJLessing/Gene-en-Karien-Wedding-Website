import { AccessState } from "#shared/types/types";

// Global access gate (Story 1). Runs on every navigation, server and client.
// If the shared invite URL param is present, unlock immediately. Otherwise the
// state stays Locked and the envelope/password layout is shown.
//
// Access is persisted in a cookie so the invite param doesn't need to be
// carried through every navigation. The cookie is also set by useAccess().unlock()
// so password-based unlocks survive hard navigations.
//
// Note: this does NOT redirect — the envelope is rendered inline. Pages read
// `useAccess().isUnlocked` to decide between the envelope and the content.
export default defineNuxtRouteMiddleware((to) => {
	const config = useRuntimeConfig();
	const paramName = config.public.accessParam;
	const access = useState<AccessState>("access-state", () => AccessState.Locked);

	// Already unlocked (e.g. from a previous client-side navigation) — nothing to do.
	if (access.value === AccessState.Unlocked) return;

	const hasInviteParam = paramName in to.query && !!to.query[paramName];
	const accessCookie = useCookie("access-granted", { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", path: "/" });

	if (hasInviteParam || accessCookie.value === "1") {
		access.value = AccessState.Unlocked;
		if (hasInviteParam) {
			accessCookie.value = "1";
		}
	}
});
