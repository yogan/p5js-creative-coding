import p5 from "p5"
import {
	type CircleMode,
	getScratchRandomnessConfigFromURL,
	type ScratchRandomnessConfig,
} from "../configs/scratch-randomness-config"

let currentConfig: ScratchRandomnessConfig = getScratchRandomnessConfigFromURL()

export const setScratchRandomnessConfig = (config: ScratchRandomnessConfig) => {
	currentConfig = { ...config }
	restartScratchRandomness()
}

let restartFn: (() => void) | null = null

const setScratchRandomnessInitialize = (initFn: () => void) => {
	restartFn = initFn
}

export const restartScratchRandomness = () => {
	restartFn?.()
}

export const scratchRandomness = (p: p5) => {
	const totalCounts = 20
	let randomCounts = Array.from({ length: totalCounts }, () => 0)
	let w: number
	let walkers: Walker[]
	let zOff = 0.0

	const initialize = () => {
		p.background(240)
		walkers = []
		for (let i = 0; i < currentConfig.walkerCount; i++) {
			walkers.push(
				new Walker(p.random(p.width), p.random(p.height), currentConfig),
			)
		}
		randomCounts = Array.from({ length: totalCounts }, () => 0)
		zOff = 0.0
	}

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)
		w = p.width / totalCounts
		initialize()
		setScratchRandomnessInitialize(initialize)
	}

	p.draw = () => {
		switch (currentConfig.visualization) {
			case "circles":
				drawCircles(currentConfig.circleMode)
				break
			case "bars":
				bars()
				break
			case "walker":
				drawWalker()
				break
			case "pixelNoise":
				pixelNoise()
				break
		}
	}

	const drawCircles = (mode: CircleMode) => {
		switch (mode) {
			case "gaussian": {
				const x = p.randomGaussian(p.width / 2, p.width / 8)
				const y = p.randomGaussian(p.height / 2, p.height / 8)
				const colorR = p.randomGaussian(127, 50)
				const colorG = p.randomGaussian(127, 50)
				const colorB = p.randomGaussian(127, 50)
				p.fill(
					p.constrain(colorR, 0, 255),
					p.constrain(colorG, 0, 255),
					p.constrain(colorB, 0, 255),
					100,
				)
				p.stroke(0, 100)
				p.circle(x, y, p.random(10, 50))
				break
			}
			case "random":
				// Circles with random colors and positions
				p.fill(p.random(50, 255), p.random(50, 255), p.random(50, 255), 100)
				p.stroke(0, 0, 0, 100)
				p.circle(p.random(p.width), p.random(p.height), p.random(10, 50))
				break
			case "mouse": {
				const mouseX = p.randomGaussian(p.mouseX, p.width / 32)
				const mouseY = p.randomGaussian(p.mouseY, p.height / 32)
				p.stroke(0, 10)
				p.fill(0, 10)
				p.circle(mouseX, mouseY, p.random(10, 50))
				break
			}
		}
	}

	const bars = () => {
		let r1: number, r2: number, prop: number
		do {
			r1 = p.random(totalCounts)
			r2 = p.random(totalCounts)
			prop = r1
		} while (r2 < prop)

		const index = Math.floor(r1)
		randomCounts[index]++

		p.stroke(0)
		p.fill(127)

		for (let x = 0; x < totalCounts; x++) {
			p.rect(x * w, p.height - randomCounts[x], w - 1, randomCounts[x])
		}
	}

	const drawWalker = () => {
		p.background(240, 5) // slight trail effect
		for (const walker of walkers) {
			walker.step()
			walker.move()
			walker.show()
		}
	}

	const pixelNoise = () => {
		p.loadPixels()
		const d = p.pixelDensity()

		p.noiseDetail(5, 0.5)

		let xOff = 0.0
		for (let x = 0; x < p.width * d; x++) {
			let yOff = 0.0
			for (let y = 0; y < p.height * d; y++) {
				const index = (x + y * p.width * d) * 4
				const bright = p.noise(xOff, yOff, zOff) * 255
				p.pixels[index + 0] = bright
				p.pixels[index + 1] = bright
				p.pixels[index + 2] = bright
				p.pixels[index + 3] = 255 // alpha
				yOff += 0.01
			}
			xOff += 0.01
		}

		p.updatePixels()

		zOff += 0.05
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
		p.background(240)
	}

	class Walker {
		private static walkerId = 0

		private position: p5.Vector
		private velocity: p5.Vector
		private acceleration: p5.Vector
		private timeOffset: p5.Vector
		private config: ScratchRandomnessConfig

		constructor(x: number, y: number, config: ScratchRandomnessConfig) {
			this.position = p.createVector(x, y)
			this.velocity = p.createVector(0, 0)
			this.acceleration = p.createVector(0, 0)
			this.config = config

			// Without a walker-specific offset, all walkers that use perlin
			// noise would move the same way.
			const perlinOffset = 100_000
			this.timeOffset = p.createVector(
				Walker.walkerId * perlinOffset,
				(Walker.walkerId + 1) * perlinOffset,
			)
			Walker.walkerId++
		}

		step() {
			switch (this.config.walkerMode) {
				case "mouse": {
					const direction = p5.Vector.sub(
						p.createVector(p.mouseX, p.mouseY),
						this.position,
					)

					this.acceleration = direction.setMag(
						p.map(
							direction.mag(),
							0,
							Math.min(p.width, p.height),
							0,
							this.config.mouseAttraction / 10,
						),
					)

					this.velocity.add(this.acceleration)
					this.velocity.limit(this.config.mouseMaxSpeed)
					break
				}

				case "gaussian":
					this.velocity = p.createVector(
						p.randomGaussian(0, 16),
						p.randomGaussian(0, 9),
					)
					break

				case "accept-reject": {
					let r1: number, r2: number, prop: number
					do {
						r1 = p.random(100)
						r2 = p.random(100)
						prop = r1 * r1
					} while (r2 < prop)
					this.velocity = p.createVector(p.random(-r1, r1), p.random(-r1, r1))
					break
				}

				case "perlin":
					this.velocity = p.createVector(
						p.map(p.noise(this.timeOffset.x), 0, 1, -2, 2),
						p.map(p.noise(this.timeOffset.y), 0, 1, -2, 2),
					)
					this.timeOffset.add(p.createVector(0.01, 0.02))
					break

				case "perlin-accelerated":
					this.acceleration = p.createVector(
						p.map(p.noise(this.timeOffset.x), 0, 1, -1, 1),
						p.map(p.noise(this.timeOffset.y), 0, 1, -1, 1),
					)
					this.velocity.add(this.acceleration)
					this.velocity.limit(3)
					this.timeOffset.add(p.createVector(0.05, 0.05))
					break
			}
		}

		move() {
			this.position.add(this.velocity)

			if (this.config.walkerMode === "mouse") {
				// Keep within bounds
				this.position.x = p.constrain(this.position.x, 0, p.width - 1)
				this.position.y = p.constrain(this.position.y, 0, p.height - 1)
				return
			}

			// Wrap around horizontally
			if (this.position.x >= p.width) {
				this.position.x = 0
			} else if (this.position.x < 0) {
				this.position.x = p.width - 1
			}

			// Wrap around vertically
			if (this.position.y >= p.height) {
				this.position.y = 0
			} else if (this.position.y < 0) {
				this.position.y = p.height - 1
			}
		}

		show() {
			p.stroke(0, 200)
			p.fill(200, 100)
			p.circle(this.position.x, this.position.y, 50)
		}
	}
}
