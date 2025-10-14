import type { BouncingBallsConfig } from "../configs/bouncing-balls-config"
import type { CellularAutomatonConfig } from "../configs/cellular-automaton-config"
import type { LandscapeConfig } from "../configs/landscape-config"
import type { RandomCirclesConfig } from "../configs/random-circles-config"

const sketchNames = [
	"3d-bouncing-balls",
	"dragon-curve",
	"dragon-curve-anim",
	"cellular-automaton",
	"koch-island",
	"landscape",
	"random-circles",
] as const

export type SketchName = (typeof sketchNames)[number]

type SketchConfig =
	| BouncingBallsConfig
	| CellularAutomatonConfig
	| LandscapeConfig
	| RandomCirclesConfig

export function getSketchFromURL(): SketchName {
	const urlParams = new URLSearchParams(window.location.search)
	const sketch = urlParams.get("sketch") as SketchName
	return sketch && sketchNames.includes(sketch) ? sketch : "koch-island"
}

export function updateSketchConfig(
	sketchName: SketchName,
	config?: SketchConfig,
) {
	const url = new URL(window.location.href)

	// Clear existing params, then set sketch param
	url.search = ""
	url.searchParams.set("sketch", sketchName)

	// Set config parameters for current sketch
	for (const [key, value] of Object.entries(config ?? {})) {
		if (value !== undefined) {
			if (key === "mesh" && typeof value === "string") {
				url.searchParams.set(key, value.toLowerCase())
			} else {
				url.searchParams.set(key, value.toString())
			}
		}
	}

	window.history.replaceState({}, "", url)
}

export function getStringFromParams<T extends string>(
	urlParams: URLSearchParams,
	key: string,
	validValues: readonly T[],
	fallback: T,
): T {
	const value = urlParams.get(key)
	return value && validValues.includes(value as T) ? (value as T) : fallback
}

export function getNumberFromParams(
	urlParams: URLSearchParams,
	key: string,
	min: number,
	max: number,
	fallback: number,
): number {
	const value = urlParams.get(key)
	if (!value) return fallback

	const numberValue = parseFloat(value)
	return !Number.isNaN(numberValue) && numberValue >= min && numberValue <= max
		? numberValue
		: fallback
}
