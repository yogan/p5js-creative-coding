const GRID_COLORS = ["off", "light", "dark", "black"] as const
const INITIAL_CELLS = ["middle", "alternating", "random"] as const

export type GridColor = (typeof GRID_COLORS)[number]
export type InitialCells = (typeof INITIAL_CELLS)[number]

export type CellularAutomatonConfig = {
	rule: number
	width: number
	grid: GridColor
	start: InitialCells
}
