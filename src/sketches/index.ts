export const sketchNames = [
	"3d-bouncing-balls",
	"dragon-curve",
	"dragon-curve-anim",
	"cellular-automaton",
	"koch-island",
	"landscape",
	"random-circles",
] as const

export type SketchName = (typeof sketchNames)[number]
