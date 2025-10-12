import type p5 from "p5"

export const scratchVectors = (p: p5) => {
	let circle: p5.Vector

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)

		circle = p.createVector(p.random(p.width), p.random(p.height))
	}

	p.draw = () => {
		p.background(220)

		p.fill(175)
		p.stroke(0)
		p.circle(circle.x, circle.y, 50)
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
	}
}
