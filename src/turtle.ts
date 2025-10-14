import type p5 from "p5"

export interface TurtleInstruction {
	type: "forward" | "turn"
	value: number
}

export interface Point {
	x: number
	y: number
}

class Turtle {
	x: number
	y: number
	angle: number
	private path: Point[]

	constructor(x: number, y: number, angle = 0) {
		this.x = x
		this.y = y
		this.angle = angle
		this.path = [{ x, y }]
	}

	forward(distance: number) {
		this.x += Math.cos(this.angle) * distance
		this.y += Math.sin(this.angle) * distance
		this.path.push({ x: this.x, y: this.y })
	}

	turn(degrees: number) {
		this.angle += (degrees * Math.PI) / 180
	}

	executeInstructions(instructions: TurtleInstruction[]) {
		for (const instruction of instructions) {
			if (instruction.type === "forward") {
				this.forward(instruction.value)
			} else if (instruction.type === "turn") {
				this.turn(instruction.value)
			}
		}
	}

	getPath(): Point[] {
		return [...this.path]
	}

	reset(x: number, y: number, angle = 0) {
		this.x = x
		this.y = y
		this.angle = angle
		this.path = [{ x, y }]
	}

	drawPath(
		p: p5,
		strokeWeight = 1,
		strokeColor?: number | [number, number, number],
	) {
		p.strokeWeight(strokeWeight)
		if (strokeColor) {
			if (Array.isArray(strokeColor)) {
				p.stroke(strokeColor[0], strokeColor[1], strokeColor[2])
			} else {
				p.stroke(strokeColor)
			}
		}

		for (let i = 0; i < this.path.length - 1; i++) {
			p.line(
				this.path[i].x,
				this.path[i].y,
				this.path[i + 1].x,
				this.path[i + 1].y,
			)
		}
	}
}

export abstract class FractalGenerator {
	protected abstract generateInstructions(
		iteration: number,
	): TurtleInstruction[]

	abstract getInitialSegments(): { start: Point; end: Point; angle: number }[]

	generatePath(
		segment: { start: Point; end: Point; angle: number },
		iteration: number,
	): Point[] {
		const instructions = this.generateInstructions(iteration)
		const length = Math.sqrt(
			(segment.end.x - segment.start.x) ** 2 +
				(segment.end.y - segment.start.y) ** 2,
		)

		const turtle = new Turtle(segment.start.x, segment.start.y, segment.angle)

		const scaledInstructions = instructions.map((instruction) => ({
			...instruction,
			value:
				instruction.type === "forward"
					? instruction.value * length
					: instruction.value,
		}))

		turtle.executeInstructions(scaledInstructions)
		return turtle.getPath()
	}
}
