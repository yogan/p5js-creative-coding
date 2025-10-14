import { getNumberFromParams } from "../utils/url-params"

export interface BouncingBallsConfig {
	count: number
}

const DEFAULT_CONFIG: BouncingBallsConfig = {
	count: 8,
}

export function getBouncingBallsConfigFromURL(): BouncingBallsConfig {
	return {
		count: getNumberFromParams(
			new URLSearchParams(window.location.search),
			"count",
			2,
			15,
			DEFAULT_CONFIG.count,
		),
	}
}
