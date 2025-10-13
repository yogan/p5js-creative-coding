import { getNumberFromParams, getStringFromParams } from "../utils/url-params"

export const GRID_COLORS = ["off", "light", "dark", "black"] as const
export const INITIAL_CELLS = ["middle", "alternating", "random"] as const

export type GridColor = (typeof GRID_COLORS)[number]
export type InitialCells = (typeof INITIAL_CELLS)[number]

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

	return {
		rule: getNumberFromParams(urlParams, "rule", 0, 255, defaults.rule),
		width: getNumberFromParams(urlParams, "width", 2, 100, defaults.width),
		grid: getStringFromParams(urlParams, "grid", GRID_COLORS, defaults.grid),
		start: getStringFromParams(
			urlParams,
			"start",
			INITIAL_CELLS,
			defaults.start,
		),
	}
}
