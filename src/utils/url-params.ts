// Centralized URL parameter handling for all sketches

export type SketchName =
	| "3d-bouncing-balls"
	| "dragon-curve"
	| "dragon-curve-anim"
	| "elementary-cellular-automaton"
	| "koch-island"
	| "landscape"
	| "scratch-randomness"

export function getSketchFromURL(): SketchName {
	const urlParams = new URLSearchParams(window.location.search)
	const sketch = urlParams.get("sketch") as SketchName
	const validSketches: SketchName[] = [
		"3d-bouncing-balls",
		"dragon-curve",
		"dragon-curve-anim",
		"elementary-cellular-automaton",
		"koch-island",
		"landscape",
		"scratch-randomness",
	]
	return sketch && validSketches.includes(sketch) ? sketch : "koch-island"
}

type ConfigValue = string | number | boolean

export function updateSketchConfig(
	sketchName: SketchName,
	config?: Record<string, ConfigValue>,
) {
	const url = new URL(window.location.href)
	url.searchParams.set("sketch", sketchName)

	// Only clear parameters when explicitly providing config
	if (config !== undefined) {
		// Clear all potential config parameters first
		const allConfigKeys = [
			"rule",
			"width",
			"grid",
			"start",
			"mesh",
			"speed",
			"roughness",
			"camera",
			"visualization",
			"circleMode",
			"walkerMode",
		]
		for (const key of allConfigKeys) {
			url.searchParams.delete(key)
		}

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

export function setUrlParam(key: string, value: string | number) {
	const url = new URL(window.location.href)
	url.searchParams.set(key, value.toString())
	window.history.replaceState({}, "", url)
}
