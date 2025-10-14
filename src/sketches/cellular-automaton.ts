import type p5 from "p5"
import type { CellularAutomatonConfig } from "../configs/cellular-automaton-config"
import { updateSketchConfig } from "../utils/url-params"

let config: CellularAutomatonConfig = {
	rule: 30,
	width: 10,
	grid: "light",
	start: "middle",
}

let restartFunction: (() => void) | null = null

export const setCellularAutomatonConfig = (
	newConfig: CellularAutomatonConfig,
) => {
	config = {
		...newConfig,
		rule: Math.max(0, Math.min(255, newConfig.rule)),
		width: Math.max(2, Math.min(100, newConfig.width)),
	}
	restartFunction?.()
}

export const cellularAutomaton = (p: p5) => {
	const padding = p.windowWidth < 600 ? 2 : 10
	let cells: number[] = []
	let y = 0

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)
		p.background(255)

		y = padding

		const cols = Math.floor((p.width - padding * 2) / config.width)
		cells = new Array(cols).fill(0)

		// Initialize cells based on initial cells configuration
		switch (config.start) {
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
		p.translate(p.width / 2 - (cells.length * config.width) / 2, 0)

		for (let i = 0; i < cells.length; i++) {
			p.fill(255 * (1 - cells[i]))
			if (config.grid === "off") {
				p.noStroke()
			} else {
				p.strokeWeight(0.5)
				switch (config.grid) {
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
			p.rect(i * config.width, y, config.width, config.width)
		}

		cells = nextGeneration(cells)
		y += config.width

		// stop when bottom of canvas is reached
		if (y + config.width + padding >= p.height) p.noLoop()

		// reset translation and show rule number
		p.resetMatrix()
		p.textAlign(p.CENTER, p.CENTER)
		p.textSize(p.windowWidth < 600 ? 14 : 20)

		// create grid-aligned background box for text
		const ruleText = `Rule ${config.rule}`
		const textWidth = p.textWidth(ruleText)

		// calculate box dimensions as multiples of cell width
		const textPadding = p.windowWidth < 600 ? 10 : 20
		const baseBoxHeight = p.windowWidth < 600 ? 24 : 34
		const boxWidthCells = Math.ceil((textWidth + textPadding) / config.width)
		const boxHeightCells = Math.ceil(baseBoxHeight / config.width)
		const boxWidth = boxWidthCells * config.width
		const boxHeight = boxHeightCells * config.width

		// calculate the actual grid position (same logic as the cells)
		const cols = Math.floor((p.width - padding * 2) / config.width)
		const gridStartX = p.width / 2 - (cols * config.width) / 2
		const gridEndX = gridStartX + cols * config.width

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
			setCellularAutomatonConfig({
				...config,
				rule: (config.rule + 255) % 256,
			})
			restart({ updateUrl: true })
		} else if (event.code === "ArrowRight") {
			setCellularAutomatonConfig({
				...config,
				rule: (config.rule + 1) % 256,
			})
			restart({ updateUrl: true })
		} else if (event.code === "ArrowUp") {
			const nextWidth = getNextWidth(config.width)
			if (nextWidth !== config.width) {
				setCellularAutomatonConfig({
					...config,
					width: nextWidth,
				})
				restart({ updateUrl: true })
			}
		} else if (event.code === "ArrowDown") {
			const previousWidth = getPreviousWidth(config.width)
			if (previousWidth !== config.width) {
				setCellularAutomatonConfig({
					...config,
					width: previousWidth,
				})
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
		if (updateUrl) {
			updateSketchConfig("cellular-automaton", config)
		}

		p.setup() // reinitialize everything
		p.loop() // restart the draw loop
	}

	// Make restart function available globally
	restartFunction = () => restart()

	const nextGeneration = (current: number[]): number[] => {
		const next = new Array(current.length).fill(0)
		for (let i = 1; i < current.length - 1; i++)
			next[i] = applyRule(current[i - 1], current[i], current[i + 1])
		return next
	}

	const applyRule = (l: number, c: number, r: number): number => {
		const index = (l << 2) | (c << 1) | r
		return (config.rule >> index) & 1
	}
}
