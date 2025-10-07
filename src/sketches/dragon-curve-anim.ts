import p5 from "p5"

/**
 * Dragon Curve Animation
 *
 * Based on the tutorial by Daniel Shiffman
 * https://thecodingtrain.com/challenges/185-dragon-curve
 */
export const dragonCurveAnim = (p: p5) => {
	const segments: Segment[] = []
	let endPoint: p5.Vector

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)

		const a = p.createVector(400, 400)
		const b = p.createVector(400, 200)
		endPoint = b
		segments.push(new Segment(a, b))
	}

	p.mousePressed = () => {
		const newSegments: Segment[] = []

		for (const seg of segments) {
			const newSeg = seg.rotate(endPoint)
			newSegments.push(newSeg)
		}

		endPoint = newSegments[0].start
		segments.push(...newSegments)
	}

	p.draw = () => {
		p.background(245, 240, 220)

		for (const seg of segments) {
			seg.show()
		}
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
	}

	class Segment {
		constructor(
			private a: p5.Vector,
			private b: p5.Vector,
		) {}

		get start() {
			return this.a.copy()
		}

		get end() {
			return this.b.copy()
		}

		show() {
			p.stroke(0)
			p.strokeWeight(2)
			p.line(this.a.x, this.a.y, this.b.x, this.b.y)
		}

		rotate(origin: p5.Vector): Segment {
			const va = p5.Vector.sub(this.a, origin).rotate(-p.HALF_PI)
			const vb = p5.Vector.sub(this.b, origin).rotate(-p.HALF_PI)

			return new Segment(p5.Vector.add(origin, va), p5.Vector.add(origin, vb))
		}
	}
}
