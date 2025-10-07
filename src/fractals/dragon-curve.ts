import { FractalGenerator, type Point, type TurtleInstruction } from "../turtle"

export class DragonCurveGenerator extends FractalGenerator {
	private generateDragonSequence(iteration: number): string {
		if (iteration === 0) {
			return "F"
		}

		const prev = this.generateDragonSequence(iteration - 1)
		const reversed = prev.split("").reverse().join("")
		const flipped = reversed
			.replace(/L/g, "X")
			.replace(/R/g, "L")
			.replace(/X/g, "R")

		return `${prev}R${flipped}`
	}

	protected generateInstructions(iteration: number): TurtleInstruction[] {
		const sequence = this.generateDragonSequence(iteration)
		const instructions: TurtleInstruction[] = []

		for (const char of sequence) {
			if (char === "F") {
				instructions.push({ type: "forward", value: 1 })
			} else if (char === "R") {
				instructions.push({ type: "turn", value: 90 })
			} else if (char === "L") {
				instructions.push({ type: "turn", value: -90 })
			}
		}

		return instructions
	}

	getInitialSegments(): { start: Point; end: Point; angle: number }[] {
		return [{ start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, angle: 0 }]
	}
}
