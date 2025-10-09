import type p5 from "p5"

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
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
		p.setup() // reinitialize everything
		p.loop() // restart the draw loop
	}

	const nextGeneration = (current: number[]): number[] => {
		const next = new Array(current.length).fill(0)
		for (let i = 1; i < current.length - 1; i++)
			next[i] = applyRule(30, current[i - 1], current[i], current[i + 1])
		return next
	}

	const applyRule = (rule: number, l: number, c: number, r: number): number => {
		const index = (l << 2) | (c << 1) | r
		return (rule >> index) & 1
	}
}
