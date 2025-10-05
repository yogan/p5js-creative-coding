import type p5 from "p5"

export const sketch3 = (p: p5) => {
	const maxIterations = 4
	const totalCycleTime = 10000 // 10 seconds for full cycle
	let startTime = 0

	function getKochPoints(
		start: { x: number; y: number },
		end: { x: number; y: number },
	) {
		const dx = end.x - start.x
		const dy = end.y - start.y
		const totalLength = Math.sqrt(dx * dx + dy * dy)
		const segmentLength = totalLength / 4

		const unitX = dx / totalLength
		const unitY = dy / totalLength
		const leftX = -unitY
		const leftY = unitX
		const rightX = unitY
		const rightY = -unitX

		let currentX = start.x
		let currentY = start.y
		const points = [{ x: currentX, y: currentY }]

		// Build Koch pattern points
		currentX += unitX * segmentLength
		currentY += unitY * segmentLength
		points.push({ x: currentX, y: currentY })

		currentX += leftX * segmentLength
		currentY += leftY * segmentLength
		points.push({ x: currentX, y: currentY })

		currentX += unitX * segmentLength
		currentY += unitY * segmentLength
		points.push({ x: currentX, y: currentY })

		currentX += rightX * segmentLength
		currentY += rightY * segmentLength
		points.push({ x: currentX, y: currentY })

		currentX += rightX * segmentLength
		currentY += rightY * segmentLength
		points.push({ x: currentX, y: currentY })

		currentX += unitX * segmentLength
		currentY += unitY * segmentLength
		points.push({ x: currentX, y: currentY })

		currentX += leftX * segmentLength
		currentY += leftY * segmentLength
		points.push({ x: currentX, y: currentY })

		currentX += unitX * segmentLength
		currentY += unitY * segmentLength
		points.push({ x: currentX, y: currentY })

		return points
	}

	function drawKochLine(
		start: { x: number; y: number },
		end: { x: number; y: number },
		iteration: number,
		depth = 0,
	) {
		const baseIteration = Math.floor(iteration)
		const transitionProgress = iteration - baseIteration

		if (baseIteration === 0) {
			if (transitionProgress === 0) {
				// Pure straight line with rainbow color
				const midX = (start.x + end.x) / 2
				const midY = (start.y + end.y) / 2
				const hue =
					((midX / p.width + midY / p.height + p.millis() * 0.0001) * 360) % 360
				p.stroke(hue, 80, 90)
				p.line(start.x, start.y, end.x, end.y)
				return
			}

			// Transitioning from straight line to Koch pattern
			const straightPoints = [start, end]
			const kochPoints = getKochPoints(start, end)

			// Interpolate between straight line and Koch pattern
			const interpolatedPoints = []
			for (let i = 0; i < kochPoints.length; i++) {
				const straightIndex = Math.min(i, straightPoints.length - 1)
				const straightPoint = straightPoints[straightIndex]
				const kochPoint = kochPoints[i]

				interpolatedPoints.push({
					x: p.lerp(straightPoint.x, kochPoint.x, transitionProgress),
					y: p.lerp(straightPoint.y, kochPoint.y, transitionProgress),
				})
			}

			// Draw interpolated segments with rainbow colors
			for (let i = 0; i < interpolatedPoints.length - 1; i++) {
				const midX = (interpolatedPoints[i].x + interpolatedPoints[i + 1].x) / 2
				const midY = (interpolatedPoints[i].y + interpolatedPoints[i + 1].y) / 2
				const hue =
					((midX / p.width +
						midY / p.height +
						depth * 30 +
						p.millis() * 0.0001) *
						360) %
					360
				p.stroke(hue, 80, 90)
				p.line(
					interpolatedPoints[i].x,
					interpolatedPoints[i].y,
					interpolatedPoints[i + 1].x,
					interpolatedPoints[i + 1].y,
				)
			}
			return
		}

		// For higher iterations, use the Koch points and recurse
		const kochPoints = getKochPoints(start, end)
		for (let i = 0; i < kochPoints.length - 1; i++) {
			drawKochLine(kochPoints[i], kochPoints[i + 1], iteration - 1, depth + 1)
		}
	}

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)
		p.colorMode(p.HSB, 360, 100, 100)
		p.background(220, 20, 10)
	}

	p.draw = () => {
		// Calculate smooth animation progress
		if (startTime === 0) startTime = p.millis()
		const currentTime = p.millis() - startTime
		const cycleProgress = (currentTime % totalCycleTime) / totalCycleTime
		const smoothIteration = cycleProgress * maxIterations

		p.background(220, 20, 10)

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
			drawKochLine(start, end, smoothIteration)
		}

		// Display current iteration
		p.noStroke()
		p.fill(255, 192)
		p.textFont("monospace", 24)
		p.textAlign(p.LEFT, p.BOTTOM)
		p.text(`Iteration: ${smoothIteration.toFixed(2)}`, 20, p.height - 20)
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
	}
}
