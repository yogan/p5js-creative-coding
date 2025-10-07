import type p5 from "p5"
import { KochIslandGenerator } from "../fractals/koch-island"
import type { Point } from "../turtle"

export const sketch3 = (p: p5) => {
	const maxIterations = 3 // NOTE: 4 looks cool, but uses a lot of CPU/RAM
	const animationTime = 10000 // 10 seconds for animation
	const pauseTime = 5000 // 5 seconds pause at final iteration
	const totalCycleTime = animationTime + pauseTime
	let startTime = 0

	const kochGenerator = new KochIslandGenerator()

	const lineWidthByDepth = new Map([
		[0, 6],
		[1, 4],
		[2, 2],
		[3, 1],
	])

	function getLineWidth(depth: number, isPausePhase: boolean): number {
		if (isPausePhase) return 1
		return lineWidthByDepth.get(depth) ?? 8
	}

	function drawFractalSegment(
		start: Point,
		end: Point,
		iteration: number,
		depth = 0,
		isPausePhase = false,
	) {
		const baseIteration = Math.floor(iteration)
		const transitionProgress = iteration - baseIteration

		p.strokeWeight(getLineWidth(depth, isPausePhase))

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
			const angle = Math.atan2(end.y - start.y, end.x - start.x)
			const kochPoints = kochGenerator.generatePath({ start, end, angle }, 1)

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

		// For higher iterations, use the fractal generator
		const angle = Math.atan2(end.y - start.y, end.x - start.x)
		const fractalPoints = kochGenerator.generatePath(
			{ start, end, angle },
			1, // Generate one level at a time to maintain proper depth tracking
		)

		for (let i = 0; i < fractalPoints.length - 1; i++) {
			drawFractalSegment(
				fractalPoints[i],
				fractalPoints[i + 1],
				iteration - 1,
				depth + 1,
				isPausePhase,
			)
		}
	}

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)
		p.colorMode(p.HSB, 360, 100, 100)
		p.background(220, 20, 10)
	}

	p.draw = () => {
		// Calculate smooth animation progress with pause at end
		if (startTime === 0) startTime = p.millis()
		const currentTime = p.millis() - startTime
		const cyclePosition = currentTime % totalCycleTime

		let smoothIteration: number
		let isPausePhase: boolean
		if (cyclePosition < animationTime) {
			// Normal animation phase
			const animationProgress = cyclePosition / animationTime
			smoothIteration = animationProgress * maxIterations
			isPausePhase = false
		} else {
			// Pause phase - stay at final iteration
			smoothIteration = maxIterations
			isPausePhase = true
		}

		p.background(220, 20, 10)
		p.noFill()

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
			drawFractalSegment(start, end, smoothIteration, 0, isPausePhase)
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
