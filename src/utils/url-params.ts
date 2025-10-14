// Centralized URL parameter handling for all sketches

const sketchNames = [
	"3d-bouncing-balls",
	"dragon-curve",
	"dragon-curve-anim",
	"elementary-cellular-automaton",
	"koch-island",
	"landscape",
	"random-circles",
] as const

export type SketchName = (typeof sketchNames)[number]

export function getSketchFromURL(): SketchName {
	const urlParams = new URLSearchParams(window.location.search)
	const sketch = urlParams.get("sketch") as SketchName
	return sketch && sketchNames.includes(sketch) ? sketch : "koch-island"
}

type ConfigValue = string | number | boolean

export function updateSketchConfig(
	sketchName: SketchName,
	config: Record<string, ConfigValue> = {},
) {
	const url = new URL(window.location.href)

	// Clear existing params, then set sketch param
	url.search = ""
	url.searchParams.set("sketch", sketchName)

	// Set config parameters for current sketch
	for (const [key, value] of Object.entries(config)) {
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

// Generic URL parameter functions
export function getUrlParams() {
	const urlParams = new URLSearchParams(window.location.search)
	const params: Record<string, string | number> = {}

	// Convert all params to appropriate types
	for (const [key, value] of urlParams.entries()) {
		// Try to convert to number if it looks like a number
		const numValue = Number(value)
		params[key] = !Number.isNaN(numValue) ? numValue : value
	}

	return params
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
