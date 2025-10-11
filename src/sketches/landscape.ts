import type p5 from "p5"
import type { LandscapeSettings } from "../components/landscape-config"

let settings: LandscapeSettings = {
	mesh: "Triangles",
	heightChangeSpeed: 0.005,
	roughness: 0.15,
}

export const setLandscapeSettings = (newSettings: LandscapeSettings) => {
	settings = { ...newSettings }
}

export const landscape = (p: p5) => {
	const cols = 16
	const rows = 20
	const scl = 40
	let terrain: number[][]
	let angle = 0
	let zoff = 0

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)

		// Initialize flat terrain
		terrain = []
		for (let x = 0; x < cols; x++) {
			terrain[x] = []
			for (let y = 0; y < rows; y++) {
				terrain[x][y] = 0 // Perfectly flat surface
			}
		}
	}

	p.draw = () => {
		p.background(0)
		p.orbitControl()

		// Set up rotating camera
		const cameraX = p.cos(angle) * 600
		const cameraZ = p.sin(angle) * 600
		const cameraY = -200

		p.camera(
			cameraX,
			cameraY,
			cameraZ, // camera position
			0,
			0,
			0, // look at center
			0,
			1,
			0, // up vector
		)

		// Rotate slowly
		angle += 0.0015

		// Cyberspace styling
		p.fill(140, 200, 150, 40) // Semi-transparent white surfaces
		p.stroke(0, 255, 0, 220) // Bright green edges
		p.strokeWeight(1)

		// Translate to center the terrain and move it up
		p.translate((-cols * scl) / 2, -50, (-rows * scl) / 2)

		// Draw terrain as mesh
		for (let y = 0; y < rows - 1; y++) {
			p.beginShape(
				settings.mesh === "Squares" ? p.QUAD_STRIP : p.TRIANGLE_STRIP,
			)
			for (let x = 0; x < cols; x++) {
				p.vertex(x * scl, terrain[x][y], y * scl)
				p.vertex(x * scl, terrain[x][y + 1], (y + 1) * scl)
			}
			p.endShape()
		}

		// Change heights
		randomizeHeights()
	}

	const randomizeHeights = () => {
		let xoff = 0
		for (let y = 0; y < rows; y++) {
			let yoff = 0
			for (let x = 0; x < cols; x++) {
				terrain[x][y] = p.map(p.noise(xoff, yoff, zoff), 0, 1, -100, 300)
				yoff += settings.roughness
			}
			xoff += settings.roughness
		}
		zoff += settings.heightChangeSpeed
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
	}
}
