// Standard result envelope returned by every ApiService call (fj-vue convention).
// Always check `success` before reading `data`.
export class Result<T = unknown> {
	constructor(
		public success: boolean,
		public msg: string = "",
		public data: T | null = null,
		public statusCode: number = 0,
	) {}

	static ok<T>(data: T, msg: string = "", statusCode: number = 200): Result<T> {
		return new Result<T>(true, msg, data, statusCode);
	}

	static fail<T = unknown>(msg: string, statusCode: number = 0, data: T | null = null): Result<T> {
		return new Result<T>(false, msg, data, statusCode);
	}
}
