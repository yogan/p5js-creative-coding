export type GridColor = "off" | "light" | "dark" | "black"
export type InitialCells = "middle" | "alternating" | "random"

export type CellularAutomatonConfig = {
	rule: number
	width: number
	grid: GridColor
	start: InitialCells
}

export const DEFAULT_CELLULAR_AUTOMATON_CONFIG: CellularAutomatonConfig = {
	rule: 30,
	width: 10,
	grid: "light",
	start: "middle",
}

export function getCellularAutomatonConfigFromURL(): CellularAutomatonConfig {
	const urlParams = new URLSearchParams(window.location.search)
	const defaults = DEFAULT_CELLULAR_AUTOMATON_CONFIG

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
