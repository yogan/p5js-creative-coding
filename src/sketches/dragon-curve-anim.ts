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
	let zoom = 1
	let targetZoom = zoom / Math.sqrt(2)
	let amount = 0

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)

		const a = p.createVector(0, p.height / 4)
		const b = p.createVector(0, -p.height / 4)

		endSegment = new Segment(a, b, b, true)
		segments.push(endSegment)
	}

	p.draw = () => {
		if (segments.length > 10_000) {
			p.noLoop()
			return
		}

		p.background(245, 240, 220)
		p.translate(p.width / 2, p.height / 2)

		const newZoom = p.lerp(zoom, targetZoom, amount)
		p.scale(newZoom)

		amount += 0.01

		for (const seg of segments) {
			if (!seg.completed) seg.update()
			seg.show()
		}

		if (amount >= 1) {
			for (const seg of segments) seg.completed = true

			nextGeneration()

			amount = 0
			zoom = newZoom
			targetZoom = zoom / Math.sqrt(2)
		}

		p.resetMatrix()
		p.fill(0)
		p.noStroke()
		p.textSize(16)
		p.text(`FPS: ${p.frameRate().toFixed(2)}`, 10, p.height - 30)
		p.text(`Lines: ${segments.length}`, 10, p.height - 10)
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
	}

	const nextGeneration = () => {
		const newSegments: Segment[] = []

		for (const seg of segments) {
			const origin = segments.length > 1 ? endSegment.start : endSegment.end
			newSegments.push(seg.copy(origin))
		}

		endSegment = newSegments[0]
		segments.push(...newSegments)

		rotationSpeed *= 0.5
	}

	class Segment {
		private startA: p5.Vector
		private startB: p5.Vector
		private a: p5.Vector
		private b: p5.Vector
		private origin: p5.Vector

		constructor(
			a: p5.Vector,
			b: p5.Vector,
			origin: p5.Vector,
			public completed = false,
		) {
			this.startA = a
			this.startB = b
			this.a = a.copy()
			this.b = b.copy()
			this.origin = origin.copy()
		}

		get start() {
			return this.a
		}

		get end() {
			return this.b
		}

		copy(origin: p5.Vector) {
			return new Segment(this.a.copy(), this.b.copy(), origin)
		}

		show() {
			p.stroke(0)
			p.strokeWeight(2 / zoom)
			p.line(this.a.x, this.a.y, this.b.x, this.b.y)
		}

		update() {
			const angle = -p.lerp(0, p.HALF_PI, amount)

			const va = p5.Vector.sub(this.startA, this.origin).rotate(angle)
			const vb = p5.Vector.sub(this.startB, this.origin).rotate(angle)

			this.a = p5.Vector.add(this.origin, va)
			this.b = p5.Vector.add(this.origin, vb)
		}
	}
}
