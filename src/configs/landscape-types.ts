export type LandscapeMesh = "triangles" | "squares"
export type LandscapeCamera = "auto" | "manual"

export type LandscapeConfig = {
	mesh: LandscapeMesh
	heightChangeSpeed: number
	roughness: number
	camera: LandscapeCamera
}

export const DEFAULT_LANDSCAPE_CONFIG: LandscapeConfig = {
	mesh: "triangles",
	heightChangeSpeed: 0.005,
	roughness: 0.15,
	camera: "auto",
}

export function getLandscapeConfigFromURL(): LandscapeConfig {
	const urlParams = new URLSearchParams(window.location.search)
	const defaults = DEFAULT_LANDSCAPE_CONFIG

	const mesh = urlParams.get("mesh")
	const meshMap: Record<string, LandscapeMesh> = {
		triangles: "triangles",
		squares: "squares",
	}
	const validMesh = mesh && meshMap[mesh] ? meshMap[mesh] : defaults.mesh

	const speed = urlParams.get("speed")
	const speedNumber = speed ? parseFloat(speed) : defaults.heightChangeSpeed
	const validSpeed =
		!Number.isNaN(speedNumber) && speedNumber >= 0.001 && speedNumber <= 0.01
			? speedNumber
			: defaults.heightChangeSpeed

	const roughness = urlParams.get("roughness")
	const roughnessNumber = roughness ? parseFloat(roughness) : defaults.roughness
	const validRoughness =
		!Number.isNaN(roughnessNumber) &&
		roughnessNumber >= 0.05 &&
		roughnessNumber <= 0.25
			? roughnessNumber
			: defaults.roughness

	const camera = urlParams.get("camera")
	const validCameraModes: LandscapeCamera[] = ["auto", "manual"]
	const validCamera =
		camera && validCameraModes.includes(camera as LandscapeCamera)
			? (camera as LandscapeCamera)
			: defaults.camera

	return {
		mesh: validMesh,
		heightChangeSpeed: validSpeed,
		roughness: validRoughness,
		camera: validCamera,
	}
}
