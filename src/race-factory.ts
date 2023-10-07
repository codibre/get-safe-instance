/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { delay } from './delay';

export function raceFactory<T>(
	timeout: number,
	callback: (...args: any[]) => Promise<any>,
): (...args: any[]) => Promise<T | undefined> {
	return async (...args) => {
		let finished = false;
		let timedOut = false;
		try {
			return await Promise.race([
				callback(...args).catch(async (err) => {
					if (!timedOut) {
						throw err;
					}
				}),
				delay(timeout).then(() => {
					if (!finished) {
						timedOut = true;
						return Promise.reject(new Error('Redis seems to be unavailable'));
					}
				}),
			]);
		} finally {
			finished = true;
		}
	};
}
