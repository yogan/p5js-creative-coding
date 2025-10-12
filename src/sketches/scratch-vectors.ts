import type p5 from "p5"

export const scratchVectors = (p: p5) => {
	const CIRCLE_SIZE = 50
	let circle: p5.Vector
	let velocity: p5.Vector

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)

		circle = p.createVector(p.random(p.width), p.random(p.height))
		velocity = p.createVector(p.random(-5, 5), p.random(-5, 5))
	}

	p.draw = () => {
		p.background(220)

		p.fill(175)
		p.stroke(0)

		p.circle(circle.x, circle.y, CIRCLE_SIZE)

		circle.add(velocity)

		if (circle.x < CIRCLE_SIZE / 2 || circle.x > p.width - CIRCLE_SIZE / 2)
			velocity.x *= -1
		if (circle.y < CIRCLE_SIZE / 2 || circle.y > p.height - CIRCLE_SIZE / 2)
			velocity.y *= -1
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
	}
}
