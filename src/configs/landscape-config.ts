import { getNumberFromParams, getStringFromParams } from "../utils/url-params"

const LANDSCAPE_MESH = ["triangles", "squares"] as const
const LANDSCAPE_CAMERA = ["auto", "manual"] as const

export type LandscapeMesh = (typeof LANDSCAPE_MESH)[number]
export type LandscapeCamera = (typeof LANDSCAPE_CAMERA)[number]

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

	return {
		mesh: getStringFromParams(urlParams, "mesh", LANDSCAPE_MESH, defaults.mesh),
		heightChangeSpeed: getNumberFromParams(
			urlParams,
			"heightChangeSpeed",
			0.001,
			0.01,
			defaults.heightChangeSpeed,
		),
		roughness: getNumberFromParams(
			urlParams,
			"roughness",
			0.05,
			0.25,
			defaults.roughness,
		),
		camera: getStringFromParams(
			urlParams,
			"camera",
			LANDSCAPE_CAMERA,
			defaults.camera,
		),
	}
}
