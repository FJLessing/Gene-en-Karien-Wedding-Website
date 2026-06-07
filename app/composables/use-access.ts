import { ApiService } from "~/services/api-service";
import { AccessState } from "#shared/types/types";

// Shared access-gate state (Story 1). Backed by useState so the value set in the
// global middleware (server side, from the URL param) carries through to the
// client without a flash of the locked state.
export function useAccess() {
	const state = useState<AccessState>("access-state", () => AccessState.Locked);

	const isUnlocked = computed(() => state.value === AccessState.Unlocked);

	function unlock(): void {
		state.value = AccessState.Unlocked;
	}

	function lock(): void {
		state.value = AccessState.Locked;
	}

	// Password path: verify against the server-held env password.
	async function verifyPassword(password: string): Promise<boolean> {
		const result = await ApiService._request<{ valid: boolean }>("/api/auth", "POST", undefined, { password });
		if (result.success && result.data?.valid) {
			unlock();
			return true;
		}
		return false;
	}

	return { state, isUnlocked, unlock, lock, verifyPassword };
}
