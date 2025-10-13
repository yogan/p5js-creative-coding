import { getNumberFromParams, getStringFromParams } from "../utils/url-params"

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

	return {
		rule: getNumberFromParams(urlParams, "rule", 0, 255, defaults.rule),
		width: getNumberFromParams(urlParams, "width", 2, 100, defaults.width),
		grid: getStringFromParams(
			urlParams,
			"grid",
			["off", "light", "dark", "black"] as const,
			defaults.grid,
		),
		start: getStringFromParams(
			urlParams,
			"start",
			["middle", "alternating", "random"] as const,
			defaults.start,
		),
	}
}
