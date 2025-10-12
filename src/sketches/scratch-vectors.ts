import type p5 from "p5"

export const scratchVectors = (p: p5) => {
	let min: p5.Vector
	let max: p5.Vector
	let ball: p5.Vector
	let size: number // radius of the ball
	let velocity: p5.Vector

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)

		// Lower and upper bounds define a box in which the circle can move
		const depth = Math.min(p.width, p.height) / 2
		min = p.createVector(-p.width / 4, -p.height / 4, 0)
		max = p.createVector(p.width / 4, p.height / 4, depth)

		// Place circle at random position within the box
		size = Math.min(p.width, p.height) / 25
		ball = p.createVector(
			p.random(min.x + size, max.x - size),
			p.random(min.y + size, max.y - size),
			p.random(min.z + size, max.z - size),
		)

		// Random initial velocity, relative to ball size
		const speedMin = size / 20
		const speedMax = size / 10
		velocity = p.createVector(
			p.random([-1, 1]) * p.random(speedMin, speedMax),
			p.random([-1, 1]) * p.random(speedMin, speedMax),
			p.random([-1, 1]) * p.random(speedMin, speedMax),
		)

		// Initial camera position
		const distance = Math.max(p.width, p.height)
		// biome-ignore format: manually formatted
		p.camera(
			distance * 0.12,  // x: a bit to the left
			-distance * 0.2,  // y: slightly from above
			distance * 0.8,   // z: move back
			0, 0, 0,          // look at center of box
			0, 1, 0           // up vector
		)
	}

	p.draw = () => {
		p.background(220)
		p.orbitControl()

		// Draw bounding box
		p.push()
		p.noFill()
		p.translate((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2)
		p.box(max.x - min.x, max.y - min.y, max.z - min.z)
		p.pop()

		// Move ball
		ball.add(velocity)

		// Bounce off walls
		if (ball.x <= min.x + size || ball.x >= max.x - size) {
			velocity.x *= -1
			ball.x = p.constrain(ball.x, min.x + size, max.x - size)
		}
		if (ball.y <= min.y + size || ball.y >= max.y - size) {
			velocity.y *= -1
			ball.y = p.constrain(ball.y, min.y + size, max.y - size)
		}
		if (ball.z <= min.z + size || ball.z >= max.z - size) {
			velocity.z *= -1
			ball.z = p.constrain(ball.z, min.z + size, max.z - size)
		}

		// Draw ball
		p.push()
		p.translate(ball.x, ball.y, ball.z)
		p.sphere(size)
		p.pop()
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
	}
}
