import { getNumberFromParams, getStringFromParams } from "../utils/url-params"

export const CIRCLE_MODES = ["gaussian", "random", "mouse"] as const
export const WALKER_MODES = [
	"perlin",
	"perlin-accelerated",
	"gaussian",
	"accept-reject",
	"mouse",
] as const
export const VISUALIZATION_TYPES = [
	"circles",
	"bars",
	"walker",
	"pixelNoise",
] as const

export type CircleMode = (typeof CIRCLE_MODES)[number]
export type WalkerMode = (typeof WALKER_MODES)[number]
export type VisualizationType = (typeof VISUALIZATION_TYPES)[number]

export type ScratchRandomnessConfig = {
	visualization: VisualizationType
	circleMode: CircleMode
	walkerMode: WalkerMode
	walkerCount: number
	mouseAttraction: number
	mouseMaxSpeed: number
}

export const DEFAULT_SCRATCH_RANDOMNESS_CONFIG: ScratchRandomnessConfig = {
	visualization: "circles",
	circleMode: "gaussian",
	walkerMode: "perlin",
	walkerCount: 10,
	mouseAttraction: 0.1,
	mouseMaxSpeed: 5,
}

export function getScratchRandomnessConfigFromURL(): ScratchRandomnessConfig {
	const urlParams = new URLSearchParams(window.location.search)
	const defaults = DEFAULT_SCRATCH_RANDOMNESS_CONFIG

	return {
		visualization: getStringFromParams(
			urlParams,
			"visualization",
			VISUALIZATION_TYPES,
			defaults.visualization,
		),
		circleMode: getStringFromParams(
			urlParams,
			"circleMode",
			CIRCLE_MODES,
			defaults.circleMode,
		),
		walkerMode: getStringFromParams(
			urlParams,
			"walkerMode",
			WALKER_MODES,
			defaults.walkerMode,
		),
		walkerCount: getNumberFromParams(
			urlParams,
			"walkerCount",
			1,
			25,
			defaults.walkerCount,
		),
		mouseAttraction: getNumberFromParams(
			urlParams,
			"attraction",
			0.01,
			1.0,
			defaults.mouseAttraction,
		),
		mouseMaxSpeed: getNumberFromParams(
			urlParams,
			"maxSpeed",
			1,
			20,
			defaults.mouseMaxSpeed,
		),
	}
}
