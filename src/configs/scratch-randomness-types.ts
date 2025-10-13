export type CircleMode = "gaussian" | "random" | "mouse"
export type WalkerMode = "normal" | "gaussian" | "accept-reject" | "perlin"
export type VisualizationType = "circles" | "bars" | "walker" | "pixelNoise"

export type ScratchRandomnessConfig = {
	visualization: VisualizationType
	circleMode: CircleMode
	walkerMode: WalkerMode
}

export const DEFAULT_SCRATCH_RANDOMNESS_CONFIG: ScratchRandomnessConfig = {
	visualization: "circles",
	circleMode: "gaussian",
	walkerMode: "normal",
}

export function getScratchRandomnessConfigFromURL(): ScratchRandomnessConfig {
	const urlParams = new URLSearchParams(window.location.search)
	const defaults = DEFAULT_SCRATCH_RANDOMNESS_CONFIG

	const visualization = urlParams.get("visualization")
	const validVisualizations: VisualizationType[] = [
		"circles",
		"bars",
		"walker",
		"pixelNoise",
	]
	const validVisualization =
		visualization &&
		validVisualizations.includes(visualization as VisualizationType)
			? (visualization as VisualizationType)
			: defaults.visualization

	const circleMode = urlParams.get("circleMode")
	const validCircleModes: CircleMode[] = ["gaussian", "random", "mouse"]
	const validCircleMode =
		circleMode && validCircleModes.includes(circleMode as CircleMode)
			? (circleMode as CircleMode)
			: defaults.circleMode

	const walkerMode = urlParams.get("walkerMode")
	const validWalkerModes: WalkerMode[] = [
		"normal",
		"gaussian",
		"accept-reject",
		"perlin",
	]
	const validWalkerMode =
		walkerMode && validWalkerModes.includes(walkerMode as WalkerMode)
			? (walkerMode as WalkerMode)
			: defaults.walkerMode

	return {
		visualization: validVisualization,
		circleMode: validCircleMode,
		walkerMode: validWalkerMode,
	}
}
