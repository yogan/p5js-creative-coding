import { getNumberFromParams, getStringFromParams } from "../utils/url-params"

const CIRCLE_MODES = ["gaussian", "random", "mouse"] as const
const WALKER_MODES = [
	"perlin",
	"perlin-accelerated",
	"gaussian",
	"accept-reject",
	"mouse",
] as const
const VISUALIZATION_TYPES = ["static", "moving"] as const

export type CircleMode = (typeof CIRCLE_MODES)[number]
export type WalkerMode = (typeof WALKER_MODES)[number]
export type VisualizationType = (typeof VISUALIZATION_TYPES)[number]

export type RandomCirclesConfig = {
	type: VisualizationType
	placement: CircleMode
	behavior: WalkerMode
	count: number
	attraction: number
	speed: number
}

export const DEFAULT_RANDOM_CIRCLES_CONFIG: RandomCirclesConfig = {
	type: "static",
	placement: "gaussian",
	behavior: "perlin",
	count: 10,
	attraction: 10,
	speed: 5,
}

export function getRandomCirclesConfigFromURL(): RandomCirclesConfig {
	const urlParams = new URLSearchParams(window.location.search)
	const defaults = DEFAULT_RANDOM_CIRCLES_CONFIG

	return {
		type: getStringFromParams(
			urlParams,
			"type",
			VISUALIZATION_TYPES,
			defaults.type,
		),
		placement: getStringFromParams(
			urlParams,
			"placement",
			CIRCLE_MODES,
			defaults.placement,
		),
		behavior: getStringFromParams(
			urlParams,
			"behavior",
			WALKER_MODES,
			defaults.behavior,
		),
		count: getNumberFromParams(urlParams, "count", 1, 25, defaults.count),
		attraction: getNumberFromParams(
			urlParams,
			"attraction",
			1,
			100,
			defaults.attraction,
		),
		speed: getNumberFromParams(urlParams, "speed", 1, 20, defaults.speed),
	}
}
