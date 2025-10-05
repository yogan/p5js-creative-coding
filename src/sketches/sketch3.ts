import type p5 from "p5"

export const sketch3 = (p: p5) => {
	let currentIteration = 0
	let lastIterationTime = 0
	const iterationDelay = 2000 // 2 seconds between iterations
	const maxIterations = 4

	function drawKochLine(
		start: { x: number; y: number },
		end: { x: number; y: number },
		iteration: number,
	) {
		if (iteration === 0) {
			// Base case: draw straight line
			p.line(start.x, start.y, end.x, end.y)
			return
		}

		// Calculate the direction and length of the original line
		const dx = end.x - start.x
		const dy = end.y - start.y
		const totalLength = Math.sqrt(dx * dx + dy * dy)
		const segmentLength = totalLength / 4

		// Unit vector in the direction of the line
		const unitX = dx / totalLength
		const unitY = dy / totalLength

		// Perpendicular vectors for 90 degree turns
		const leftX = -unitY // 90 degrees left
		const leftY = unitX
		const rightX = unitY // 90 degrees right
		const rightY = -unitX

		// Calculate the 8 points for Koch island pattern
		let currentX = start.x
		let currentY = start.y
		const points = [{ x: currentX, y: currentY }]

		// Move 1 segment forward
		currentX += unitX * segmentLength
		currentY += unitY * segmentLength
		points.push({ x: currentX, y: currentY })

		// Turn 90 deg left, move 1 seg forward
		currentX += leftX * segmentLength
		currentY += leftY * segmentLength
		points.push({ x: currentX, y: currentY })

		// Turn 90 deg right, move 1 seg forward
		currentX += unitX * segmentLength
		currentY += unitY * segmentLength
		points.push({ x: currentX, y: currentY })

		// Turn right, move 1 seg forward
		currentX += rightX * segmentLength
		currentY += rightY * segmentLength
		points.push({ x: currentX, y: currentY })

		// Move 1 more seg forward (continuing in same direction)
		currentX += rightX * segmentLength
		currentY += rightY * segmentLength
		points.push({ x: currentX, y: currentY })

		// Turn left, move 1 seg forward
		currentX += unitX * segmentLength
		currentY += unitY * segmentLength
		points.push({ x: currentX, y: currentY })

		// Turn left, move 1 seg forward
		currentX += leftX * segmentLength
		currentY += leftY * segmentLength
		points.push({ x: currentX, y: currentY })

		// Turn right, move 1 seg forward (should reach end point)
		currentX += unitX * segmentLength
		currentY += unitY * segmentLength
		points.push({ x: currentX, y: currentY })

		// Draw the 8 line segments
		for (let i = 0; i < points.length - 1; i++) {
			drawKochLine(points[i], points[i + 1], iteration - 1)
		}
	}

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)
		p.background(20)
	}

	p.draw = () => {
		// Handle animation timing
		const currentTime = p.millis()
		if (currentTime - lastIterationTime > iterationDelay) {
			currentIteration = (currentIteration + 1) % (maxIterations + 1)
			lastIterationTime = currentTime
		}

		p.background(20)

		p.stroke(255)
		p.noFill()
		p.strokeWeight(2)

		const size = p.min(p.width, p.height) * 0.5
		const centerX = p.width / 2
		const centerY = p.height / 2

		// Define starting points of the square
		const corners = [
			{ x: centerX - size / 2, y: centerY - size / 2 }, // top-left
			{ x: centerX + size / 2, y: centerY - size / 2 }, // top-right
			{ x: centerX + size / 2, y: centerY + size / 2 }, // bottom-right
			{ x: centerX - size / 2, y: centerY + size / 2 }, // bottom-left
		]

		// For each side of the square, apply Koch transformation
		for (let i = 0; i < 4; i++) {
			const start = corners[i]
			const end = corners[(i + 1) % 4]
			drawKochLine(start, end, currentIteration)
		}

		// Display current iteration
		p.fill(255)
		p.textAlign(p.LEFT, p.BOTTOM)
		p.textFont("Courier New", 24)
		p.text(`Iteration: ${currentIteration}`, 20, p.height - 20)
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
	}
}
