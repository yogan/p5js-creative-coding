import p5 from "p5"
import {
	type CircleMode,
	getRandomCirclesConfigFromURL,
	type RandomCirclesConfig,
} from "../configs/random-circles-config"

let currentConfig: RandomCirclesConfig = getRandomCirclesConfigFromURL()

export const setRandomCirclesConfig = (config: RandomCirclesConfig) => {
	currentConfig = { ...config }
	restartRandomCircles()
}

let restartFn: (() => void) | null = null

const setRandomCirclesInitialize = (initFn: () => void) => {
	restartFn = initFn
}

export const restartRandomCircles = () => {
	restartFn?.()
}

export const randomCircles = (p: p5) => {
	let walkers: Walker[]

	const initialize = () => {
		p.background(240)
		walkers = []
		for (let i = 0; i < currentConfig.count; i++) {
			walkers.push(
				new Walker(p.random(p.width), p.random(p.height), currentConfig),
			)
		}
	}

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)

		initialize()
		setRandomCirclesInitialize(initialize)
	}

	p.draw = () => {
		switch (currentConfig.type) {
			case "static":
				drawCircles(currentConfig.placement)
				break

			case "moving":
				drawWalker()
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

	const drawWalker = () => {
		p.background(240, 5) // slight trail effect
		for (const walker of walkers) {
			walker.step()
			walker.move()
			walker.show()
		}
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
		private config: RandomCirclesConfig

		constructor(x: number, y: number, config: RandomCirclesConfig) {
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
			switch (this.config.behavior) {
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
							this.config.attraction / 10,
						),
					)

					this.velocity.add(this.acceleration)
					this.velocity.limit(this.config.speed)
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

			if (this.config.behavior === "mouse") {
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
