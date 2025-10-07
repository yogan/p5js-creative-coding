import { FractalGenerator, type Point, type TurtleInstruction } from "../turtle"

export class KochIslandGenerator extends FractalGenerator {
	protected generateInstructions(iteration: number): TurtleInstruction[] {
		if (iteration === 0) {
			return [{ type: "forward", value: 1 }]
		}

		const previousInstructions = this.generateInstructions(iteration - 1)
		const newInstructions: TurtleInstruction[] = []

		for (const instruction of previousInstructions) {
			if (instruction.type === "forward") {
				// Replace each forward with the Koch Island pattern
				// Tracing original getKochPoints movements:
				// 1. unitX/Y (forward)
				// 2. leftX/Y (turn left, forward)
				// 3. unitX/Y (turn right, forward)
				// 4. rightX/Y (turn right, forward)
				// 5. rightX/Y (continue right, forward)
				// 6. unitX/Y (turn left, forward)
				// 7. leftX/Y (turn left, forward)
				// 8. unitX/Y (turn right, forward)
				newInstructions.push(
					{ type: "forward", value: instruction.value / 4 },
					{ type: "turn", value: 90 },
					{ type: "forward", value: instruction.value / 4 },
					{ type: "turn", value: -90 },
					{ type: "forward", value: instruction.value / 4 },
					{ type: "turn", value: -90 },
					{ type: "forward", value: instruction.value / 4 },
					{ type: "forward", value: instruction.value / 4 },
					{ type: "turn", value: 90 },
					{ type: "forward", value: instruction.value / 4 },
					{ type: "turn", value: 90 },
					{ type: "forward", value: instruction.value / 4 },
					{ type: "turn", value: -90 },
					{ type: "forward", value: instruction.value / 4 },
				)
			} else {
				newInstructions.push(instruction)
			}
		}

		return newInstructions
	}

	getInitialSegments(): { start: Point; end: Point; angle: number }[] {
		// Return the four sides of a square
		const size = 1 // Will be scaled later
		return [
			{ start: { x: 0, y: 0 }, end: { x: size, y: 0 }, angle: 0 },
			{
				start: { x: size, y: 0 },
				end: { x: size, y: size },
				angle: Math.PI / 2,
			},
			{ start: { x: size, y: size }, end: { x: 0, y: size }, angle: Math.PI },
			{
				start: { x: 0, y: size },
				end: { x: 0, y: 0 },
				angle: (3 * Math.PI) / 2,
			},
		]
	}
}
