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

// Elementary Cellular Automaton types and functions
export type GridColor = "off" | "light" | "dark" | "black"
export type InitialCells = "middle" | "alternating" | "random"

export type CellularAutomatonConfig = {
	rule: number
	width: number
	grid: GridColor
	start: InitialCells
}

// Landscape types and functions
export type LandscapeMesh = "Triangles" | "Squares"
export type LandscapeCamera = "auto" | "manual"

export type LandscapeConfig = {
	mesh: LandscapeMesh
	heightChangeSpeed: number
	roughness: number
	camera: LandscapeCamera
}

// Scratch Randomness types and functions
export type CircleMode = "gaussian" | "random" | "mouse"
export type WalkerMode = "normal" | "gaussian" | "accept-reject" | "perlin"
export type VisualizationType = "circles" | "bars" | "walker" | "pixelNoise"

export type ScratchRandomnessConfig = {
	visualization: VisualizationType
	circleMode: CircleMode
	walkerMode: WalkerMode
}

// Unified configuration system for all sketches

const DEFAULT_CONFIGS = {
	"elementary-cellular-automaton": {
		rule: 30,
		width: 10,
		grid: "light" as GridColor,
		start: "middle" as InitialCells,
	},
	landscape: {
		mesh: "Triangles" as LandscapeMesh,
		heightChangeSpeed: 0.005,
		roughness: 0.15,
		camera: "auto" as LandscapeCamera,
	},
	"scratch-randomness": {
		visualization: "circles" as VisualizationType,
		circleMode: "gaussian" as CircleMode,
		walkerMode: "normal" as WalkerMode,
	},
} as const

export function getCellularAutomatonConfigFromURL(): CellularAutomatonConfig {
	const urlParams = new URLSearchParams(window.location.search)
	const defaults = DEFAULT_CONFIGS["elementary-cellular-automaton"]

	const rule = urlParams.get("rule")
	const ruleNumber = rule ? parseInt(rule, 10) : defaults.rule
	const validRule =
		!Number.isNaN(ruleNumber) && ruleNumber >= 0 && ruleNumber <= 255
			? ruleNumber
			: defaults.rule

	const width = urlParams.get("width")
	const widthNumber = width ? parseInt(width, 10) : defaults.width
	const validWidth =
		!Number.isNaN(widthNumber) && widthNumber >= 2 && widthNumber <= 100
			? widthNumber
			: defaults.width

	const grid = urlParams.get("grid")
	const validGridColors: GridColor[] = ["off", "light", "dark", "black"]
	const validGrid =
		grid && validGridColors.includes(grid as GridColor)
			? (grid as GridColor)
			: defaults.grid

	const start = urlParams.get("start")
	const validInitialCells: InitialCells[] = ["middle", "alternating", "random"]
	const validStart =
		start && validInitialCells.includes(start as InitialCells)
			? (start as InitialCells)
			: defaults.start

	return {
		rule: validRule,
		width: validWidth,
		grid: validGrid,
		start: validStart,
	}
}

export function getLandscapeConfigFromURL(): LandscapeConfig {
	const urlParams = new URLSearchParams(window.location.search)
	const defaults = DEFAULT_CONFIGS.landscape

	const mesh = urlParams.get("mesh")
	const meshMap: Record<string, LandscapeMesh> = {
		triangles: "Triangles",
		squares: "Squares",
	}
	const validMesh = mesh && meshMap[mesh] ? meshMap[mesh] : defaults.mesh

	const speed = urlParams.get("speed")
	const speedNumber = speed ? parseFloat(speed) : defaults.heightChangeSpeed
	const validSpeed =
		!Number.isNaN(speedNumber) && speedNumber >= 0.001 && speedNumber <= 0.01
			? speedNumber
			: defaults.heightChangeSpeed

	const roughness = urlParams.get("roughness")
	const roughnessNumber = roughness ? parseFloat(roughness) : defaults.roughness
	const validRoughness =
		!Number.isNaN(roughnessNumber) &&
		roughnessNumber >= 0.05 &&
		roughnessNumber <= 0.25
			? roughnessNumber
			: defaults.roughness

	const camera = urlParams.get("camera")
	const validCameraModes: LandscapeCamera[] = ["auto", "manual"]
	const validCamera =
		camera && validCameraModes.includes(camera as LandscapeCamera)
			? (camera as LandscapeCamera)
			: defaults.camera

	return {
		mesh: validMesh,
		heightChangeSpeed: validSpeed,
		roughness: validRoughness,
		camera: validCamera,
	}
}

export function getScratchRandomnessConfigFromURL(): ScratchRandomnessConfig {
	const urlParams = new URLSearchParams(window.location.search)
	const defaults = DEFAULT_CONFIGS["scratch-randomness"]

	const visualization = urlParams.get("visualization")
	const validVisualizations: VisualizationType[] = [
		"circles",
		"bars",
		"walker",
		"pixelNoise",
	]
	const validVisualization =
		visualization &&
		validVisualizations.includes(visualization as VisualizationType)
			? (visualization as VisualizationType)
			: defaults.visualization

	const circleMode = urlParams.get("circleMode")
	const validCircleModes: CircleMode[] = ["gaussian", "random", "mouse"]
	const validCircleMode =
		circleMode && validCircleModes.includes(circleMode as CircleMode)
			? (circleMode as CircleMode)
			: defaults.circleMode

	const walkerMode = urlParams.get("walkerMode")
	const validWalkerModes: WalkerMode[] = [
		"normal",
		"gaussian",
		"accept-reject",
		"perlin",
	]
	const validWalkerMode =
		walkerMode && validWalkerModes.includes(walkerMode as WalkerMode)
			? (walkerMode as WalkerMode)
			: defaults.walkerMode

	return {
		visualization: validVisualization,
		circleMode: validCircleMode,
		walkerMode: validWalkerMode,
	}
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

// Legacy function names for backward compatibility

export function updateLandscapeURL(
	mesh: LandscapeMesh,
	heightChangeSpeed: number,
	roughness: number,
	camera: LandscapeCamera,
) {
	updateSketchConfig("landscape", {
		mesh,
		speed: heightChangeSpeed,
		roughness,
		camera,
	})
}

export function updateCellularAutomatonURL(
	rule: number,
	width: number,
	grid: GridColor,
	start: InitialCells,
) {
	updateSketchConfig("elementary-cellular-automaton", {
		rule,
		width,
		grid,
		start,
	})
}

export function updateScratchRandomnessURL(
	visualization: VisualizationType,
	circleMode: CircleMode,
	walkerMode: WalkerMode,
) {
	updateSketchConfig("scratch-randomness", {
		visualization,
		circleMode,
		walkerMode,
	})
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
