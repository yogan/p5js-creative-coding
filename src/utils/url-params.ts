// URL parameter handling for cellular automaton sketch parameters

export const CELLULAR_AUTOMATON_SKETCH =
	"elementary-cellular-automaton" as const

export type GridColor = "off" | "light" | "dark" | "black"

export type InitialCells = "middle" | "alternating" | "random"

export type SketchName =
	| "koch-island"
	| "dragon-curve"
	| "dragon-curve-anim"
	| "scratch-randomness"
	| "scratch-vectors"
	| "landscape"
	| typeof CELLULAR_AUTOMATON_SKETCH

export function getSketchFromURL(): SketchName {
	const urlParams = new URLSearchParams(window.location.search)
	const sketch = urlParams.get("sketch") as SketchName
	const validSketches: SketchName[] = [
		"koch-island",
		"dragon-curve",
		"dragon-curve-anim",
		"scratch-randomness",
		"scratch-vectors",
		"landscape",
		CELLULAR_AUTOMATON_SKETCH,
	]
	return sketch && validSketches.includes(sketch) ? sketch : "koch-island"
}

export function getRuleFromURL(): number {
	const urlParams = new URLSearchParams(window.location.search)
	const rule = urlParams.get("rule")
	if (rule) {
		const ruleNumber = parseInt(rule, 10)
		if (!Number.isNaN(ruleNumber) && ruleNumber >= 0 && ruleNumber <= 255) {
			return ruleNumber
		}
	}
	return 30
}

export function getWidthFromURL(): number {
	const urlParams = new URLSearchParams(window.location.search)
	const width = urlParams.get("width")
	if (width) {
		const widthNumber = parseInt(width, 10)
		if (!Number.isNaN(widthNumber) && widthNumber >= 2 && widthNumber <= 100) {
			return widthNumber
		}
	}
	return 10
}

export function getGridFromURL(): GridColor {
	const urlParams = new URLSearchParams(window.location.search)
	const grid = urlParams.get("grid")
	const validGridColors: GridColor[] = ["off", "light", "dark", "black"]
	return grid && validGridColors.includes(grid as GridColor)
		? (grid as GridColor)
		: "light"
}

export function getStartFromURL(): InitialCells {
	const urlParams = new URLSearchParams(window.location.search)
	const start = urlParams.get("start")
	const validInitialCells: InitialCells[] = ["middle", "alternating", "random"]
	return start && validInitialCells.includes(start as InitialCells)
		? (start as InitialCells)
		: "middle"
}

export function updateURL(
	sketchName: SketchName,
	rule?: number,
	width?: number,
	grid?: GridColor,
	start?: InitialCells,
) {
	const url = new URL(window.location.href)
	url.searchParams.set("sketch", sketchName)

	// Cellular automaton parameters
	if (rule !== undefined && sketchName === CELLULAR_AUTOMATON_SKETCH) {
		url.searchParams.set("rule", rule.toString())
	} else {
		url.searchParams.delete("rule")
	}
	if (width !== undefined && sketchName === CELLULAR_AUTOMATON_SKETCH) {
		url.searchParams.set("width", width.toString())
	} else {
		url.searchParams.delete("width")
	}
	if (grid !== undefined && sketchName === CELLULAR_AUTOMATON_SKETCH) {
		url.searchParams.set("grid", grid)
	} else {
		url.searchParams.delete("grid")
	}
	if (start !== undefined && sketchName === CELLULAR_AUTOMATON_SKETCH) {
		url.searchParams.set("start", start)
	} else {
		url.searchParams.delete("start")
	}

	// Landscape parameters - remove when not landscape sketch
	if (sketchName !== "landscape") {
		url.searchParams.delete("mesh")
		url.searchParams.delete("speed")
		url.searchParams.delete("roughness")
		url.searchParams.delete("camera")
	}

	window.history.replaceState({}, "", url)
}

// Landscape sketch parameter functions
export type LandscapeMesh = "Triangles" | "Squares"
export type LandscapeCamera = "auto" | "manual"

export function getMeshFromURL(): LandscapeMesh {
	const urlParams = new URLSearchParams(window.location.search)
	const mesh = urlParams.get("mesh")
	const meshMap: Record<string, LandscapeMesh> = {
		triangles: "Triangles",
		squares: "Squares",
	}
	return mesh && meshMap[mesh] ? meshMap[mesh] : "Triangles"
}

export function getHeightChangeSpeedFromURL(): number {
	const urlParams = new URLSearchParams(window.location.search)
	const speed = urlParams.get("speed")
	if (speed) {
		const speedNumber = parseFloat(speed)
		if (
			!Number.isNaN(speedNumber) &&
			speedNumber >= 0.001 &&
			speedNumber <= 0.01
		) {
			return speedNumber
		}
	}
	return 0.005
}

export function getRoughnessFromURL(): number {
	const urlParams = new URLSearchParams(window.location.search)
	const roughness = urlParams.get("roughness")
	if (roughness) {
		const roughnessNumber = parseFloat(roughness)
		if (
			!Number.isNaN(roughnessNumber) &&
			roughnessNumber >= 0.05 &&
			roughnessNumber <= 0.25
		) {
			return roughnessNumber
		}
	}
	return 0.15
}

export function getCameraFromURL(): LandscapeCamera {
	const urlParams = new URLSearchParams(window.location.search)
	const camera = urlParams.get("camera")
	const validCameraModes: LandscapeCamera[] = ["auto", "manual"]
	return camera && validCameraModes.includes(camera as LandscapeCamera)
		? (camera as LandscapeCamera)
		: "auto"
}

export function updateLandscapeURL(
	mesh: LandscapeMesh,
	heightChangeSpeed: number,
	roughness: number,
	camera: LandscapeCamera,
) {
	const url = new URL(window.location.href)
	url.searchParams.set("sketch", "landscape")
	url.searchParams.set("mesh", mesh.toLowerCase())
	url.searchParams.set("speed", heightChangeSpeed.toString())
	url.searchParams.set("roughness", roughness.toString())
	url.searchParams.set("camera", camera)
	window.history.replaceState({}, "", url)
}

// Helper function to update just the cellular automaton parameters
export function updateCellularAutomatonURL(
	rule: number,
	width: number,
	grid: GridColor,
	start: InitialCells,
) {
	updateURL(CELLULAR_AUTOMATON_SKETCH, rule, width, grid, start)
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
