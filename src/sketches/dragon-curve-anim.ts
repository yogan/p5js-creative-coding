import p5 from "p5"

/**
 * Dragon Curve Animation
 *
 * Based on the tutorial by Daniel Shiffman
 * https://thecodingtrain.com/challenges/185-dragon-curve
 */
export const dragonCurveAnim = (p: p5) => {
	const segments: Segment[] = []
	let endSegment: Segment
	let rotationSpeed = 0.1

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)

		const length = Math.min(p.width, p.height) / 40
		const a = p.createVector(p.width / 2, p.height / 2 + length / 2)
		const b = p.createVector(p.width / 2, p.height / 2 - length / 2)

		endSegment = new Segment(a, b, b, true)
		segments.push(endSegment)
	}

	p.mousePressed = () => {
		if (segments.some((seg) => !seg.complete)) return

		const newSegments: Segment[] = []

		for (const seg of segments) {
			const origin = segments.length > 1 ? endSegment.start : endSegment.end
			newSegments.push(seg.copy(origin))
		}

		endSegment = newSegments[0]
		segments.push(...newSegments)

		rotationSpeed *= 0.9
	}

	p.draw = () => {
		p.background(245, 240, 220)

		for (const seg of segments) {
			if (!seg.complete) seg.update()
			seg.show()
		}
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
	}

	class Segment {
		private startA: p5.Vector
		private startB: p5.Vector
		private a: p5.Vector
		private b: p5.Vector
		private origin: p5.Vector
		private angle = 0

		constructor(
			a: p5.Vector,
			b: p5.Vector,
			origin: p5.Vector,
			private completed = false,
		) {
			this.startA = a.copy()
			this.startB = b.copy()
			this.a = a.copy()
			this.b = b.copy()
			this.origin = origin.copy()
		}

		get start() {
			return this.a.copy()
		}

		get end() {
			return this.b.copy()
		}

		get complete() {
			return this.completed
		}

		copy(origin: p5.Vector) {
			return new Segment(this.a.copy(), this.b.copy(), origin)
		}

		show() {
			p.stroke(0)
			p.strokeWeight(2)
			p.line(this.a.x, this.a.y, this.b.x, this.b.y)
		}

		update() {
			this.angle += rotationSpeed
			if (this.angle >= p.HALF_PI) {
				this.angle = p.HALF_PI
				this.completed = true
			}

			const va = p5.Vector.sub(this.startA, this.origin).rotate(-this.angle)
			const vb = p5.Vector.sub(this.startB, this.origin).rotate(-this.angle)

			this.a = p5.Vector.add(this.origin, va)
			this.b = p5.Vector.add(this.origin, vb)
		}
	}
}
