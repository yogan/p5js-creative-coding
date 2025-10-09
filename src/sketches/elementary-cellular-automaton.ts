import type p5 from "p5"

let currentRule = 30

export const setRule = (rule: number) => {
	currentRule = Math.max(0, Math.min(255, rule))
}

export const getCurrentRule = () => currentRule

export const elementaryCellularAutomaton = (p: p5) => {
	const width = 20
	const padding = 10
	let cells: number[] = []
	let y = 0

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)
		p.background(255)

		y = padding

		const cols = Math.floor((p.width - padding * 2) / width)
		cells = new Array(cols).fill(0)
		cells[Math.floor(cols / 2)] = 1 // set the middle cell to 1
	}

	p.draw = () => {
		// center horizontally
		p.translate(p.width / 2 - (cells.length * width) / 2, 0)

		for (let i = 0; i < cells.length; i++) {
			p.fill(255 * (1 - cells[i]))
			p.rect(i * width, y, width, width)
		}

		cells = nextGeneration(cells)
		y += width

		// stop when bottom of canvas is reached
		if (y + width + padding >= p.height) p.noLoop()

		// reset translation and show rule number
		p.resetMatrix()
		p.textAlign(p.CENTER, p.CENTER)
		p.textSize(20)

		// create grid-aligned background box for text
		const ruleText = `Rule ${getCurrentRule()}`
		const textWidth = p.textWidth(ruleText)

		// calculate box dimensions as multiples of cell width
		const boxWidthCells = Math.ceil((textWidth + 20) / width)
		const boxHeightCells = Math.ceil(34 / width) // text height + padding
		const boxWidth = boxWidthCells * width
		const boxHeight = boxHeightCells * width

		// calculate the actual grid position (same logic as the cells)
		const cols = Math.floor((p.width - padding * 2) / width)
		const gridStartX = p.width / 2 - (cols * width) / 2
		const gridEndX = gridStartX + cols * width

		// position box to align with rightmost cells
		const boxX = gridEndX - boxWidth
		const boxY = padding

		p.fill(255, 200) // semi-transparent white background
		p.rect(boxX, boxY, boxWidth, boxHeight)

		// center text in the box
		p.fill(0)
		p.text(ruleText, boxX + boxWidth / 2, boxY + boxHeight / 2)
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
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
