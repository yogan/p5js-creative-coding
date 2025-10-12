import type p5 from "p5"
import {
	type CircleMode,
	getScratchRandomnessConfigFromURL,
	type ScratchRandomnessConfig,
	type WalkerMode,
} from "../utils/url-params"

let currentSettings: ScratchRandomnessConfig =
	getScratchRandomnessConfigFromURL()

export const setScratchRandomnessSettings = (
	settings: ScratchRandomnessConfig,
) => {
	currentSettings = { ...settings }
	if (initializeFunction) {
		initializeFunction()
	}
}

export const getScratchRandomnessSettings = (): ScratchRandomnessConfig => {
	return { ...currentSettings }
}

let initializeFunction: (() => void) | null = null

export const setScratchRandomnessInitialize = (initFn: () => void) => {
	initializeFunction = initFn
}

export const resetScratchRandomness = () => {
	if (initializeFunction) {
		initializeFunction()
	}
}

export const scratchRandomness = (p: p5) => {
	const totalCounts = 20
	let randomCounts = Array.from({ length: totalCounts }, () => 0)
	let w: number
	let walker: Walker
	let zOff = 0.0

	const initialize = () => {
		p.background(240)
		walker = new Walker(p.width / 2, p.height / 2)
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
		switch (currentSettings.visualization) {
			case "circles":
				drawCircles(currentSettings.circleMode)
				break
			case "bars":
				bars()
				break
			case "walker":
				drawWalker(currentSettings.walkerMode)
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

	const drawWalker = (mode: WalkerMode) => {
		switch (mode) {
			case "normal":
				walker.step()
				break
			case "gaussian":
				walker.gaussianStep()
				break
			case "accept-reject":
				walker.accpetRejectStep()
				break
			case "perlin":
				walker.perlinStep()
				break
		}
		walker.show()
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
		private tx = 0
		private ty = 100_000

		constructor(
			private x: number,
			private y: number,
		) {}

		show() {
			p.stroke(0)
			p.point(this.x, this.y)
		}

		step() {
			if (p.random() < 0.5) {
				// move to mouse
				this.x += p.mouseX < this.x ? -1 : 1
				this.y += p.mouseY < this.y ? -1 : 1
				return
			}

			this.x += p.random([-1, -1, 0, 1, 1])
			this.y += p.random([-1, 0, 1])
			this.x = p.constrain(this.x, 0, p.width - 1)
			this.y = p.constrain(this.y, 0, p.height - 1)
		}

		gaussianStep() {
			this.x += p.randomGaussian(0, 16)
			this.y += p.randomGaussian(0, 9)
			this.x = p.constrain(this.x, 0, p.width - 1)
			this.y = p.constrain(this.y, 0, p.height - 1)
		}

		accpetRejectStep() {
			let r1: number, r2: number, prop: number
			do {
				r1 = p.random(100)
				r2 = p.random(100)
				prop = r1 * r1
			} while (r2 < prop)

			const stepX = p.random(-r1, r1)
			const stepY = p.random(-r1, r1)
			this.x += stepX
			this.y += stepY
		}

		perlinStep() {
			const stepX = p.map(p.noise(this.tx), 0, 1, -2, 2)
			const stepY = p.map(p.noise(this.ty), 0, 1, -2, 2)

			this.x += stepX
			this.y += stepY

			this.tx += 0.02
			this.ty += 0.01
		}
	}
}
