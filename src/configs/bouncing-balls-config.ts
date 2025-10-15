import { getNumberFromParams } from "../utils/url-params"

export interface BouncingBallsConfig {
	count: number
}

export const DEFAULT_BOUNCING_BALLS_CONFIG: BouncingBallsConfig = {
	count: 8,
}

export function getBouncingBallsConfigFromURL(): BouncingBallsConfig {
	return {
		count: getNumberFromParams(
			new URLSearchParams(window.location.search),
			"count",
			2,
			15,
			DEFAULT_BOUNCING_BALLS_CONFIG.count,
		),
	}
}
