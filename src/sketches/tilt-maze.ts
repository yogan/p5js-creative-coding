import Matter from "matter-js"
import type p5 from "p5"

export const tiltMaze = (p: p5) => {
	let engine: Matter.Engine
	let ball: Matter.Body

	const connectSensor = () => {
		const ws = new WebSocket("ws://localhost:8765")
		ws.onmessage = ({ data }) => {
			const { x, y, z, lid } = JSON.parse(data as string) as {
				x: number
				y: number
				z: number
				lid: number
			}
			const lidRad = (lid * Math.PI) / 180
			const scale = 3
			engine.gravity.x = x * scale
			engine.gravity.y = (y * Math.cos(lidRad) - z * Math.sin(lidRad)) * scale
		}
		ws.onclose = () => setTimeout(connectSensor, 3000)
		ws.onerror = () => ws.close()
	}

	const initialize = () => {
		engine = Matter.Engine.create()
		engine.gravity.x = 0
		engine.gravity.y = 0

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

		ball = Matter.Bodies.circle(p.width / 2, p.height / 2, 35, {
			restitution: 0.2,
			friction: 0.05,
			frictionAir: 0.008,
			density: 0.005,
		})
		Matter.Composite.add(engine.world, ball)
	}

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight)
		initialize()
		connectSensor()
	}

	p.draw = () => {
		p.background(20)
		Matter.Engine.update(engine, 1000 / 60)

		const { x, y } = ball.position
		const r = 35
		const ctx = p.drawingContext as CanvasRenderingContext2D

		const grad = ctx.createRadialGradient(
			x - r * 0.35,
			y - r * 0.35,
			r * 0.05,
			x,
			y,
			r,
		)
		grad.addColorStop(0, "rgba(255,255,255,0.95)")
		grad.addColorStop(0.25, "rgba(210,210,220,0.95)")
		grad.addColorStop(0.65, "rgba(130,130,145,0.97)")
		grad.addColorStop(1, "rgba(55,55,65,1)")

		ctx.beginPath()
		ctx.arc(x, y, r, 0, Math.PI * 2)
		ctx.fillStyle = grad
		ctx.fill()
	}

	let resizeTimer: ReturnType<typeof setTimeout>
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
		clearTimeout(resizeTimer)
		resizeTimer = setTimeout(initialize, 200)
	}
}
