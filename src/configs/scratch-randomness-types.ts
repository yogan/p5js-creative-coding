import { getStringFromParams } from "../utils/url-params"

export type CircleMode = "gaussian" | "random" | "mouse"
export type WalkerMode = "normal" | "gaussian" | "accept-reject" | "perlin"
export type VisualizationType = "circles" | "bars" | "walker" | "pixelNoise"

export type ScratchRandomnessConfig = {
	visualization: VisualizationType
	circleMode: CircleMode
	walkerMode: WalkerMode
}

export const DEFAULT_SCRATCH_RANDOMNESS_CONFIG: ScratchRandomnessConfig = {
	visualization: "circles",
	circleMode: "gaussian",
	walkerMode: "normal",
}

export function getScratchRandomnessConfigFromURL(): ScratchRandomnessConfig {
	const urlParams = new URLSearchParams(window.location.search)
	const defaults = DEFAULT_SCRATCH_RANDOMNESS_CONFIG

	return {
		visualization: getStringFromParams(
			urlParams,
			"visualization",
			["circles", "bars", "walker", "pixelNoise"] as const,
			defaults.visualization,
		),
		circleMode: getStringFromParams(
			urlParams,
			"circleMode",
			["gaussian", "random", "mouse"] as const,
			defaults.circleMode,
		),
		walkerMode: getStringFromParams(
			urlParams,
			"walkerMode",
			["normal", "gaussian", "accept-reject", "perlin"] as const,
			defaults.walkerMode,
		),
	}
}
