// URL parameter handling for cellular automaton sketch parameters

export const CELLULAR_AUTOMATON_SKETCH =
	"elementary-cellular-automaton" as const

export type GridColor = "off" | "light" | "dark" | "black"

export type InitialCells = "middle" | "alternating" | "random"

export type SketchName =
	| "orbital-crescents"
	| "particle-wave"
	| "koch-island"
	| "dragon-curve"
	| "dragon-curve-anim"
	| typeof CELLULAR_AUTOMATON_SKETCH

export function getSketchFromURL(): SketchName {
	const urlParams = new URLSearchParams(window.location.search)
	const sketch = urlParams.get("sketch") as SketchName
	const validSketches: SketchName[] = [
		"orbital-crescents",
		"particle-wave",
		"koch-island",
		"dragon-curve",
		"dragon-curve-anim",
		CELLULAR_AUTOMATON_SKETCH,
	]
	return sketch && validSketches.includes(sketch) ? sketch : "orbital-crescents"
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
