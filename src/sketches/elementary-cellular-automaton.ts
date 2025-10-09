import type p5 from "p5"
import {
	type GridColor,
	type InitialCells,
	updateCellularAutomatonURL,
} from "../utils/url-params"

let currentRule = 30
let currentWidth = 10
let gridColor: GridColor = "light"
let initialCells: InitialCells = "middle"

export const setRule = (rule: number) => {
	currentRule = Math.max(0, Math.min(255, rule))
}

export const getCurrentRule = () => currentRule

export const setWidth = (width: number) => {
	currentWidth = Math.max(2, Math.min(100, width))
}

export const getCurrentWidth = () => currentWidth

export const setGridColor = (color: GridColor) => {
	gridColor = color
}

export const getGridColor = (): GridColor => gridColor

export const setInitialCells = (config: InitialCells) => {
	initialCells = config
}

export const getInitialCells = (): InitialCells => initialCells

export const elementaryCellularAutomaton = (p: p5) => {
	const padding = p.windowWidth < 600 ? 2 : 10
	let cells: number[] = []
	let y = 0

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)
		p.background(255)

		y = padding

		const cols = Math.floor((p.width - padding * 2) / getCurrentWidth())
		cells = new Array(cols).fill(0)

		// Initialize cells based on initial cells configuration
		switch (getInitialCells()) {
			case "middle":
				cells[Math.floor(cols / 2)] = 1
				break
			case "alternating":
				for (let i = 0; i < cols; i += 2) {
					cells[i] = 1
				}
				break
			case "random":
				for (let i = 0; i < cols; i++) {
					cells[i] = p.random() < 0.5 ? 1 : 0
				}
				break
		}
	}

	p.draw = () => {
		// center horizontally
		p.translate(p.width / 2 - (cells.length * getCurrentWidth()) / 2, 0)

		for (let i = 0; i < cells.length; i++) {
			p.fill(255 * (1 - cells[i]))
			if (gridColor === "off") {
				p.noStroke()
			} else {
				p.strokeWeight(0.5)
				switch (gridColor) {
					case "black":
						p.stroke(0)
						break
					case "dark":
						p.stroke(100)
						break
					case "light":
						p.stroke(200)
						break
				}
			}
			p.rect(i * getCurrentWidth(), y, getCurrentWidth(), getCurrentWidth())
		}

		cells = nextGeneration(cells)
		y += getCurrentWidth()

		// stop when bottom of canvas is reached
		if (y + getCurrentWidth() + padding >= p.height) p.noLoop()

		// reset translation and show rule number
		p.resetMatrix()
		p.textAlign(p.CENTER, p.CENTER)
		p.textSize(p.windowWidth < 600 ? 14 : 20)

		// create grid-aligned background box for text
		const ruleText = `Rule ${getCurrentRule()}`
		const textWidth = p.textWidth(ruleText)

		// calculate box dimensions as multiples of cell width
		const textPadding = p.windowWidth < 600 ? 10 : 20
		const baseBoxHeight = p.windowWidth < 600 ? 24 : 34
		const boxWidthCells = Math.ceil(
			(textWidth + textPadding) / getCurrentWidth(),
		)
		const boxHeightCells = Math.ceil(baseBoxHeight / getCurrentWidth())
		const boxWidth = boxWidthCells * getCurrentWidth()
		const boxHeight = boxHeightCells * getCurrentWidth()

		// calculate the actual grid position (same logic as the cells)
		const cols = Math.floor((p.width - padding * 2) / getCurrentWidth())
		const gridStartX = p.width / 2 - (cols * getCurrentWidth()) / 2
		const gridEndX = gridStartX + cols * getCurrentWidth()

		// position box to align with rightmost cells
		const boxX = gridEndX - boxWidth
		const boxY = padding

		p.fill(255, 200) // semi-transparent white background
		p.rect(boxX, boxY, boxWidth, boxHeight)

		// center text in the box
		p.fill(0)
		p.noStroke()
		p.text(ruleText, boxX + boxWidth / 2, boxY + boxHeight / 2)
	}

	p.keyPressed = (event: KeyboardEvent) => {
		if (event.code === "ArrowLeft") {
			setRule((getCurrentRule() + 255) % 256)
			restart({ updateUrl: true })
		} else if (event.code === "ArrowRight") {
			setRule((getCurrentRule() + 1) % 256)
			restart({ updateUrl: true })
		} else if (event.code === "ArrowUp") {
			const nextWidth = getNextWidth(getCurrentWidth())
			if (nextWidth !== getCurrentWidth()) {
				setWidth(nextWidth)
				restart({ updateUrl: true })
			}
		} else if (event.code === "ArrowDown") {
			const previousWidth = getPreviousWidth(getCurrentWidth())
			if (previousWidth !== getCurrentWidth()) {
				setWidth(previousWidth)
				restart({ updateUrl: true })
			}
		} else if (event.code === "Space") {
			restart()
		}
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
		restart()
	}

	const getNextWidth = (currentWidth: number): number => {
		if (currentWidth < 10) {
			return Math.min(10, currentWidth + 1)
		} else if (currentWidth < 20) {
			return Math.min(20, currentWidth + 2)
		} else if (currentWidth < 50) {
			return Math.min(50, currentWidth + 5)
		} else if (currentWidth < 100) {
			return Math.min(100, currentWidth + 10)
		}
		return 100
	}

	const getPreviousWidth = (currentWidth: number): number => {
		if (currentWidth <= 10) {
			return Math.max(2, currentWidth - 1)
		} else if (currentWidth <= 20) {
			return Math.max(10, currentWidth - 2)
		} else if (currentWidth <= 50) {
			return Math.max(20, currentWidth - 5)
		} else if (currentWidth <= 100) {
			return Math.max(50, currentWidth - 10)
		}
		return 50
	}

	const restart = ({ updateUrl = false } = {}) => {
		if (updateUrl)
			updateCellularAutomatonURL(
				getCurrentRule(),
				getCurrentWidth(),
				getGridColor(),
				getInitialCells(),
			)

		p.setup() // reinitialize everything
		p.loop() // restart the draw loop
	}

	const nextGeneration = (current: number[]): number[] => {
		const next = new Array(current.length).fill(0)
		for (let i = 1; i < current.length - 1; i++)
			next[i] = applyRule(current[i - 1], current[i], current[i + 1])
		return next
	}

	const applyRule = (l: number, c: number, r: number): number => {
		const index = (l << 2) | (c << 1) | r
		return (getCurrentRule() >> index) & 1
	}
}
