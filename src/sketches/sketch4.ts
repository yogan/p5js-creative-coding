import type p5 from "p5"
import { DragonCurveGenerator } from "../fractals/dragon-curve"
import type { Point } from "../turtle"

export const sketch4 = (p: p5) => {
	const maxIterations = 20
	const iterationDisplayTime = 2000 // 2 seconds per iteration
	const pauseTime = 5000 // 5 seconds pause at final iteration
	let dragonGenerator: DragonCurveGenerator
	let currentIteration = 0
	let lastIterationChangeTime = 0
	let cachedPath: Point[] | null = null
	let cachedIteration = -1
	let cachedBounds: {
		minX: number
		maxX: number
		minY: number
		maxY: number
	} | null = null

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)
		p.colorMode(p.HSB, 360, 100, 100)

		dragonGenerator = new DragonCurveGenerator()
		lastIterationChangeTime = p.millis()
	}

	p.draw = () => {
		p.background(240, 30, 5)

		// Check if we need to advance to next iteration
		const currentTime = p.millis()
		const timeSinceLastChange = currentTime - lastIterationChangeTime

		if (currentIteration < maxIterations) {
			if (timeSinceLastChange >= iterationDisplayTime) {
				currentIteration++
				lastIterationChangeTime = currentTime
				cachedIteration = -1 // Force recalculation
			}
		} else {
			// Pause at final iteration
			if (timeSinceLastChange >= pauseTime) {
				currentIteration = 0
				lastIterationChangeTime = currentTime
				cachedIteration = -1 // Force recalculation
			}
		}

		// Generate path only if iteration changed
		if (cachedIteration !== currentIteration) {
			const segments = dragonGenerator.getInitialSegments()
			cachedPath = dragonGenerator.generatePath(segments[0], currentIteration)

			// Calculate bounding box
			let minX = Number.POSITIVE_INFINITY
			let maxX = Number.NEGATIVE_INFINITY
			let minY = Number.POSITIVE_INFINITY
			let maxY = Number.NEGATIVE_INFINITY

			for (const point of cachedPath) {
				minX = Math.min(minX, point.x)
				maxX = Math.max(maxX, point.x)
				minY = Math.min(minY, point.y)
				maxY = Math.max(maxY, point.y)
			}

			cachedBounds = { minX, maxX, minY, maxY }
			cachedIteration = currentIteration
		}

		if (!cachedPath || !cachedBounds) return

		// Calculate scale to fit in viewport with padding
		const width = cachedBounds.maxX - cachedBounds.minX
		const height = cachedBounds.maxY - cachedBounds.minY
		const padding = 0.9
		const scaleX = (p.width * padding) / width
		const scaleY = (p.height * padding) / height
		const scale = Math.min(scaleX, scaleY)

		// Center the curve
		const centerX = (cachedBounds.minX + cachedBounds.maxX) / 2
		const centerY = (cachedBounds.minY + cachedBounds.maxY) / 2

		p.push()
		p.translate(p.width / 2 - centerX * scale, p.height / 2 - centerY * scale)
		p.scale(scale)

		p.strokeWeight(2 / scale)
		p.noFill()

		// Draw the dragon curve path with static rainbow colors
		for (let i = 0; i < cachedPath.length - 1; i++) {
			const progress = i / (cachedPath.length - 1)
			const hue = (progress * 180) % 360
			p.stroke(hue, 80, 90)

			p.line(
				cachedPath[i].x,
				cachedPath[i].y,
				cachedPath[i + 1].x,
				cachedPath[i + 1].y,
			)
		}
		p.pop()

		// Display current iteration
		p.noStroke()
		p.fill(255, 192)
		p.textFont("monospace", 24)
		p.textAlign(p.LEFT, p.BOTTOM)
		p.text(`Iteration: ${currentIteration}`, 20, p.height - 20)
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
	}
}
