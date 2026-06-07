import Matter from "matter-js"
import type p5 from "p5"

export const matterPhysics = (p: p5) => {
	let engine: Matter.Engine
	const colors = new Map<number, [number, number, number]>()

	const connectSensor = () => {
		const ws = new WebSocket("ws://localhost:8765")
		ws.onmessage = ({ data }) => {
			const { x, z } = JSON.parse(data as string) as { x: number; z: number }
			engine.gravity.x = x
			engine.gravity.y = -z
		}
		ws.onclose = () => setTimeout(connectSensor, 3000)
		ws.onerror = () => ws.close()
	}
	connectSensor()

	const addBall = (x?: number, y?: number) => {
		const r = p.random(10, 35)
		const ball = Matter.Bodies.circle(
			x ?? p.random(r, p.width - r),
			y ?? p.random(r, p.height - r),
			r,
			{
				restitution: 0.7,
				friction: 0.05,
				frictionAir: 5 / (r * r),
			},
		)
		colors.set(ball.id, [
			p.random(80, 255),
			p.random(80, 255),
			p.random(80, 255),
		])
		Matter.Composite.add(engine.world, ball)
	}

	const initialize = () => {
		colors.clear()
		engine = Matter.Engine.create()

		const t = 100
		Matter.Composite.add(engine.world, [
			Matter.Bodies.rectangle(p.width / 2, p.height + t / 2, p.width * 3, t, {
				isStatic: true,
			}),
			Matter.Bodies.rectangle(p.width / 2, -t / 2, p.width * 3, t, {
				isStatic: true,
			}),
			Matter.Bodies.rectangle(-t / 2, p.height / 2, t, p.height * 3, {
				isStatic: true,
			}),
			Matter.Bodies.rectangle(p.width + t / 2, p.height / 2, t, p.height * 3, {
				isStatic: true,
			}),
		])

		for (let i = 0; i < 40; i++) addBall()
	}

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)
		initialize()
	}

	p.draw = () => {
		p.background(20)
		Matter.Engine.update(engine, 1000 / 60)

		for (const body of Matter.Composite.allBodies(engine.world)) {
			if (body.isStatic) continue
			const { x, y } = body.position
			const r = body.circleRadius ?? 20
			const [cr, cg, cb] = colors.get(body.id) ?? [200, 200, 200]
			p.noStroke()
			p.fill(cr, cg, cb, 220)
			p.circle(x, y, r * 2)
		}
	}

	p.mousePressed = () => {
		if (p.mouseButton.center) {
			initialize()
		} else if (p.mouseButton.left) {
			addBall(p.mouseX, p.mouseY)
		}
	}

	let resizeTimer: ReturnType<typeof setTimeout>
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
		clearTimeout(resizeTimer)
		resizeTimer = setTimeout(initialize, 200)
	}
}
