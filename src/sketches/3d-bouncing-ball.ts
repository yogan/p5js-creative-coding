import type p5 from "p5"

export const bouncingBall3D = (p: p5) => {
	let boundingBox: BoundingBox
	let ball: Ball

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)

		const depth = Math.min(p.width, p.height) / 2
		boundingBox = new BoundingBox(
			p.createVector(-p.width / 4, -p.height / 4, 0),
			p.createVector(p.width / 4, p.height / 4, depth),
		)

		const size = Math.min(p.width, p.height) / 25
		const pos = p.createVector(
			p.random(boundingBox.min.x + size, boundingBox.max.x - size),
			p.random(boundingBox.min.y + size, boundingBox.max.y - size),
			p.random(boundingBox.min.z + size, boundingBox.max.z - size),
		)

		const speedMin = size / 20
		const speedMax = size / 10
		const velocity = p.createVector(
			p.random([-1, 1]) * p.random(speedMin, speedMax),
			p.random([-1, 1]) * p.random(speedMin, speedMax),
			p.random([-1, 1]) * p.random(speedMin, speedMax),
		)

		const color = p.color(p.random(255), p.random(255), p.random(255))
		ball = new Ball(pos, velocity, size, color)

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

		p.ambientLight(60, 60, 60)
		p.directionalLight(80, 80, 80, -1, 0.5, -1)
		p.directionalLight(50, 50, 50, -0.8, -0.5, -0.8)

		boundingBox.draw()

		ball.update(boundingBox)
		ball.draw()
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
	}

	class BoundingBox {
		constructor(
			public readonly min: p5.Vector,
			public readonly max: p5.Vector,
		) {}

		draw() {
			p.push()
			p.noFill()
			p.translate(
				(this.min.x + this.max.x) / 2,
				(this.min.y + this.max.y) / 2,
				(this.min.z + this.max.z) / 2,
			)
			p.box(
				this.max.x - this.min.x,
				this.max.y - this.min.y,
				this.max.z - this.min.z,
			)
			p.pop()
		}
	}

	class Ball {
		constructor(
			private position: p5.Vector,
			private velocity: p5.Vector,
			private radius: number,
			private color: p5.Color,
		) {}

		update(box: BoundingBox) {
			this.position.add(this.velocity)

			// Invert velocity if we hit a wall
			if (
				this.position.x - this.radius < box.min.x ||
				this.position.x + this.radius > box.max.x
			) {
				this.velocity.x *= -1
				this.position.x = p.constrain(
					this.position.x,
					box.min.x + this.radius,
					box.max.x - this.radius,
				)
			}
			if (
				this.position.y - this.radius < box.min.y ||
				this.position.y + this.radius > box.max.y
			) {
				this.velocity.y *= -1
				this.position.y = p.constrain(
					this.position.y,
					box.min.y + this.radius,
					box.max.y - this.radius,
				)
			}
			if (
				this.position.z - this.radius < box.min.z ||
				this.position.z + this.radius > box.max.z
			) {
				this.velocity.z *= -1
				this.position.z = p.constrain(
					this.position.z,
					box.min.z + this.radius,
					box.max.z - this.radius,
				)
			}
		}

		draw() {
			p.push()
			p.translate(this.position.x, this.position.y, this.position.z)
			p.noStroke()
			p.fill(this.color)
			p.specularMaterial(this.color)
			p.sphere(this.radius)
			p.pop()
		}
	}
}
