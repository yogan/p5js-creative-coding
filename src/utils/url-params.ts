import type { SketchConfig } from "../configs"
import { type SketchId, sketches } from "../sketches"

export function getSketchFromURL(): SketchId {
	const urlParams = new URLSearchParams(window.location.search)
	const sketchId = urlParams.get("sketch") as SketchId
	const ids = sketches.map((sketch) => sketch.id)
	return sketchId && ids.includes(sketchId) ? sketchId : "koch-island"
}

export function updateSketchConfig(sketchId: SketchId, config?: SketchConfig) {
	const url = new URL(window.location.href)

	// Clear existing params, then set sketch param
	url.search = ""
	url.searchParams.set("sketch", sketchId)

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
