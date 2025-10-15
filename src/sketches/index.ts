export const sketches = [
	{ id: "3d-bouncing-balls", name: "3D Bouncing Balls", hasConfig: true },
	{ id: "dragon-curve", name: "Dragon Curve", hasConfig: false },
	{
		id: "dragon-curve-anim",
		name: "Dragon Curve (animated)",
		hasConfig: false,
	},
	{
		id: "cellular-automaton",
		name: "Elementary Cellular Automaton",
		hasConfig: true,
	},
	{ id: "koch-island", name: "Koch Island", hasConfig: false },
	{ id: "landscape", name: "Landscape", hasConfig: true },
	{ id: "random-circles", name: "Random Circles", hasConfig: true },
] as const

export type SketchId = (typeof sketches)[number]["id"]
