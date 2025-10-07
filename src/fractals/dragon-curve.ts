import { FractalGenerator, type Point, type TurtleInstruction } from "../turtle"

export class DragonCurveGenerator extends FractalGenerator {
	protected generateInstructions(iteration: number): TurtleInstruction[] {
		if (iteration === 0) {
			return [{ type: "forward", value: 1 }]
		}

		const previousInstructions = this.generateInstructions(iteration - 1)
		const newInstructions: TurtleInstruction[] = []

		// Dragon curve: X -> X+YF+, Y -> -FX-Y
		// Simplified for forward-only instructions: F -> F+F++F-F
		for (const instruction of previousInstructions) {
			if (instruction.type === "forward") {
				newInstructions.push(
					{ type: "forward", value: instruction.value / Math.sqrt(2) },
					{ type: "turn", value: 45 },
					{ type: "forward", value: instruction.value / Math.sqrt(2) },
					{ type: "turn", value: 90 },
					{ type: "forward", value: instruction.value / Math.sqrt(2) },
					{ type: "turn", value: -135 },
					{ type: "forward", value: instruction.value / Math.sqrt(2) },
				)
			} else {
				newInstructions.push(instruction)
			}
		}

		return newInstructions
	}

	getInitialSegments(): { start: Point; end: Point; angle: number }[] {
		// Single line segment for the dragon curve
		return [{ start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, angle: 0 }]
	}
}
