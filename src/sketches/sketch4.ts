import type p5 from "p5"
import { DragonCurveGenerator } from "../fractals/dragon-curve"

export const sketch4 = (p: p5) => {
	const maxIterations = 15
	const pauseTime = 10000 // 10 seconds pause at final iteration
	let dragonGenerator: DragonCurveGenerator
	let currentIteration = 0
	let hueOffset = 0
	let lastIterationTime = 0

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)
		p.colorMode(p.HSB, 360, 100, 100)

		dragonGenerator = new DragonCurveGenerator()
	}

	p.draw = () => {
		p.background(240, 30, 5)

		// Get initial segment and generate path
		const segments = dragonGenerator.getInitialSegments()
		const iteration = Math.floor(currentIteration)

		// Generate path to calculate bounds
		const path = dragonGenerator.generatePath(segments[0], iteration)

		// Calculate bounding box
		let minX = Number.POSITIVE_INFINITY
		let maxX = Number.NEGATIVE_INFINITY
		let minY = Number.POSITIVE_INFINITY
		let maxY = Number.NEGATIVE_INFINITY

		for (const point of path) {
			minX = Math.min(minX, point.x)
			maxX = Math.max(maxX, point.x)
			minY = Math.min(minY, point.y)
			maxY = Math.max(maxY, point.y)
		}

		// Calculate scale to fit in viewport with padding
		const width = maxX - minX
		const height = maxY - minY
		const padding = 0.9
		const scaleX = (p.width * padding) / width
		const scaleY = (p.height * padding) / height
		const scale = Math.min(scaleX, scaleY)

		// Center the curve
		const centerX = (minX + maxX) / 2
		const centerY = (minY + maxY) / 2

		p.push()
		p.translate(p.width / 2 - centerX * scale, p.height / 2 - centerY * scale)
		p.scale(scale)

		p.strokeWeight(2 / scale)
		p.noFill()

		// Draw the dragon curve path
		for (let i = 0; i < path.length - 1; i++) {
			const progress = i / (path.length - 1)
			const hue = (hueOffset + progress * 180) % 360
			p.stroke(hue, 80, 90)

			p.line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y)
		}
		p.pop()

		// Animate iteration and color
		if (Math.floor(currentIteration) < maxIterations) {
			currentIteration += 0.015
		} else {
			// Pause at final iteration
			if (lastIterationTime === 0) {
				lastIterationTime = p.millis()
			}

			if (p.millis() - lastIterationTime > pauseTime) {
				currentIteration = 0
				lastIterationTime = 0
			}
		}

		hueOffset += 0.8

		// Display current iteration (after resetting transformations)
		p.noStroke()
		p.fill(255, 192)
		p.textFont("monospace", 24)
		p.textAlign(p.LEFT, p.BOTTOM)
		p.text(`Iteration: ${Math.floor(currentIteration)}`, 20, p.height - 20)
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
	}
}
