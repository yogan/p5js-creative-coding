import type p5 from "p5"

export const bouncingBall3D = (p: p5) => {
	let boundingBox: BoundingBox
	const balls: Ball[] = []

	const createBoundingBox = (): BoundingBox => {
		const depth = Math.min(p.width, p.height) / 2
		return new BoundingBox(
			p.createVector(-p.width / 4, -p.height / 4, 0),
			p.createVector(p.width / 4, p.height / 4, depth),
		)
	}

	const createBall = (box: BoundingBox, existingBalls: Ball[] = []): Ball => {
		const size = (Math.min(p.width, p.height) / 25) * p.random(0.5, 1.5)
		const maxAttempts = 100
		let attempts = 0
		let pos: p5.Vector

		do {
			pos = p.createVector(
				p.random(box.min.x + size, box.max.x - size),
				p.random(box.min.y + size, box.max.y - size),
				p.random(box.min.z + size, box.max.z - size),
			)
			attempts++
		} while (
			attempts < maxAttempts &&
			existingBalls.some((ball) => new Ball(pos, size).collidesWith(ball))
		)

		const speedMin = size / 30
		const speedMax = size / 5
		const velocity = p.createVector(
			p.random([-1, 1]) * p.random(speedMin, speedMax),
			p.random([-1, 1]) * p.random(speedMin, speedMax),
			p.random([-1, 1]) * p.random(speedMin, speedMax),
		)

		const color = p.color(p.random(255), p.random(255), p.random(255))
		return new Ball(pos, size, velocity, color)
	}

	const setupCamera = (): void => {
		const distance = Math.max(p.width, p.height)

		// biome-ignore format: manually formatted
		p.camera(
			 distance * 0.12, // x: a bit to the left
			-distance * 0.2,  // y: slightly from above
			 distance * 0.8,  // z: move back
			0, 0, 0,          // look at center of box
			0, 1, 0           // up vector
		)
	}

	const setupLight = (): void => {
		p.ambientLight(60, 60, 60)
		p.directionalLight(80, 80, 80, -1, 0.5, -1)
		p.directionalLight(50, 50, 50, -0.8, -0.5, -0.8)
	}

	const handleBallCollisions = (): void => {
		for (let i = 0; i < balls.length; i++) {
			for (let j = i + 1; j < balls.length; j++) {
				const ball1 = balls[i]
				const ball2 = balls[j]

				if (ball1.collidesWith(ball2)) {
					ball1.resolveCollision(ball2)
				}
			}
		}
	}

	const drawObjects = (): void => {
		boundingBox.draw()

		for (const ball of balls) {
			ball.update(boundingBox)
		}

		handleBallCollisions()

		for (const ball of balls) {
			ball.draw()
		}
	}

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
		setupCamera()
		boundingBox = createBoundingBox()
		balls.push(createBall(boundingBox, balls))
		balls.push(createBall(boundingBox, balls))
		balls.push(createBall(boundingBox, balls))
	}

	p.draw = () => {
		p.background(220)
		p.orbitControl()
		setupLight()
		drawObjects()
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
		private readonly mass: number

		constructor(
			private readonly position: p5.Vector,
			private readonly radius: number,
			private readonly velocity: p5.Vector = p.createVector(0, 0, 0),
			private readonly color: p5.Color = p.color(255),
		) {
			this.mass = this.radius * this.radius * this.radius
		}

		collidesWith(other: Ball): boolean {
			const distance = p
				.createVector()
				.set(this.position)
				.sub(other.position)
				.mag()
			return distance < this.radius + other.radius
		}

		resolveCollision(other: Ball): void {
			const dx = other.position.x - this.position.x
			const dy = other.position.y - this.position.y
			const dz = other.position.z - this.position.z
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

			if (distance === 0) return

			const normalX = dx / distance
			const normalY = dy / distance
			const normalZ = dz / distance

			const overlap = this.radius + other.radius - distance
			const totalMass = this.mass + other.mass
			const thisRatio = other.mass / totalMass
			const otherRatio = this.mass / totalMass

			const separationX = overlap * normalX
			const separationY = overlap * normalY
			const separationZ = overlap * normalZ

			this.position.x -= separationX * thisRatio
			this.position.y -= separationY * thisRatio
			this.position.z -= separationZ * thisRatio
			other.position.x += separationX * otherRatio
			other.position.y += separationY * otherRatio
			other.position.z += separationZ * otherRatio

			const relativeVelocityX = other.velocity.x - this.velocity.x
			const relativeVelocityY = other.velocity.y - this.velocity.y
			const relativeVelocityZ = other.velocity.z - this.velocity.z

			const velocityAlongNormal =
				relativeVelocityX * normalX +
				relativeVelocityY * normalY +
				relativeVelocityZ * normalZ

			if (velocityAlongNormal > 0) return

			const restitution = 0.8
			const impulse =
				(-(1 + restitution) * velocityAlongNormal) /
				(1 / this.mass + 1 / other.mass)

			this.velocity.x -= (impulse / this.mass) * normalX
			this.velocity.y -= (impulse / this.mass) * normalY
			this.velocity.z -= (impulse / this.mass) * normalZ
			other.velocity.x += (impulse / other.mass) * normalX
			other.velocity.y += (impulse / other.mass) * normalY
			other.velocity.z += (impulse / other.mass) * normalZ
		}

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
