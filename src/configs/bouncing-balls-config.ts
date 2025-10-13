import { getUrlParams } from "../utils/url-params"

export interface BouncingBallsConfig {
	ballCount: number
}

const DEFAULT_CONFIG: BouncingBallsConfig = {
	ballCount: 8,
}

export function getBouncingBallsConfigFromURL(): BouncingBallsConfig {
	const params = getUrlParams()
	return {
		ballCount: Math.max(
			2,
			Math.min(15, Number(params.ballCount) || DEFAULT_CONFIG.ballCount),
		),
	}
}
