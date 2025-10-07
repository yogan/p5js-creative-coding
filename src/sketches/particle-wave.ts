import type p5 from "p5"

export const particleWave = (p: p5) => {
	let time = 0
	let particles: Particle[] = []

	class Particle {
		x: number
		y: number
		baseY: number
		size: number
		speed: number
		hue: number

		constructor(x: number, y: number) {
			this.x = x
			this.y = y
			this.baseY = y
			this.size = p.random(8, 16)
			this.speed = p.random(0.01, 0.05)
			this.hue = p.random(180, 300)
		}

		update() {
			const waveOffset = p.sin(this.x * 0.01 + time) * 100
			const turbulence = p.noise(this.x * 0.005, time * 0.5) * 80 - 40
			this.y = this.baseY + waveOffset + turbulence

			const baseHue = 180 + p.sin(time * 0.3) * 60
			this.hue = (baseHue + this.x * 0.2) % 360
		}

		draw() {
			p.push()
			p.translate(this.x, this.y)

			const pulseIntensity = p.sin(time * 0.5) * 0.3 + 0.7
			const alpha =
				p.map(p.sin(this.x * 0.02 + time * 2), -1, 1, 0.2, 0.6) * pulseIntensity
			p.fill(this.hue, 80, 90, alpha)
			p.noStroke()

			const currentSize = this.size + p.sin(this.x * 0.01 + time * 3) * 2
			p.ellipse(0, 0, currentSize, currentSize)

			const glowSize = currentSize * 1.5
			p.fill(this.hue, 60, 70, alpha * 0.2)
			p.ellipse(0, 0, glowSize, glowSize)

			p.pop()
		}
	}

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)
		p.colorMode(p.HSB, 360, 100, 100)

		for (let x = 0; x < p.width + 20; x += 15) {
			particles.push(new Particle(x, p.height / 2))
		}
	}

	p.draw = () => {
		p.fill(5, 50, 8, 0.05)
		p.noStroke()
		p.rect(0, 0, p.width, p.height)

		particles.forEach((particle) => {
			particle.update()
			particle.draw()
		})

		time += 0.02
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
		particles = []
		for (let x = 0; x < p.width + 20; x += 15) {
			particles.push(new Particle(x, p.height / 2))
		}
	}
}
