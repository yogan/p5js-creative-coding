import { getNumberFromParams, getStringFromParams } from "../utils/url-params"

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

	return {
		mesh: getStringFromParams(
			urlParams,
			"mesh",
			["triangles", "squares"] as const,
			defaults.mesh,
		),
		heightChangeSpeed: getNumberFromParams(
			urlParams,
			"speed",
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
			["auto", "manual"] as const,
			defaults.camera,
		),
	}
}
