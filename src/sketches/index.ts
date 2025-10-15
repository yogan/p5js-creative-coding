export const sketches = {
	"3d-bouncing-balls": { name: "3D Bouncing Balls", hasConfig: true },
	"dragon-curve": { name: "Dragon Curve", hasConfig: false },
	"dragon-curve-anim": { name: "Dragon Curve (animated)", hasConfig: false },
	"cellular-automaton": {
		name: "Elementary Cellular Automaton",
		hasConfig: true,
	},
	"koch-island": { name: "Koch Island", hasConfig: false },
	landscape: { name: "Landscape", hasConfig: true },
	"random-circles": { name: "Random Circles", hasConfig: true },
} as const

export type SketchId = keyof typeof sketches

export const DEFAULT_SKETCH: SketchId = "koch-island"

export const allSketches = () =>
	Object.entries(sketches).map(([id, sketch]) => ({
		id: id as SketchId,
		...sketch,
	}))
