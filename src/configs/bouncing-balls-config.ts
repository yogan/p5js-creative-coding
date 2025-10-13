import { getUrlParams } from "../utils/url-params"

export interface BouncingBallsConfig {
	ballCount: number
}

const DEFAULT_CONFIG: BouncingBallsConfig = {
	ballCount: 3,
}

export function getBouncingBallsConfigFromURL(): BouncingBallsConfig {
	const params = getUrlParams()
	return {
		ballCount: Math.max(
			2,
			Math.min(10, Number(params.ballCount) || DEFAULT_CONFIG.ballCount),
		),
	}
}
