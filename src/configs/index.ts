export type { BaseConfigDialog } from "./base-config-dialog"
export { BouncingBallsConfigDialog } from "./bouncing-balls-config-dialog"
export { CellularAutomatonConfigDialog } from "./cellular-automaton-config-dialog"
export { LandscapeConfigDialog } from "./landscape-config-dialog"
export { RandomCirclesConfigDialog } from "./random-circles-config-dialog"

import type { BouncingBallsConfig } from "./bouncing-balls-config"
import type { CellularAutomatonConfig } from "./cellular-automaton-config"
import type { LandscapeConfig } from "./landscape-config"
import type { RandomCirclesConfig } from "./random-circles-config"

export type SketchConfig =
	| BouncingBallsConfig
	| CellularAutomatonConfig
	| LandscapeConfig
	| RandomCirclesConfig
