import p5 from "p5"
import {
	type BaseConfigDialog,
	BouncingBallsConfigDialog,
	CellularAutomatonConfigDialog,
	LandscapeConfigDialog,
	RandomCirclesConfigDialog,
} from "./configs"
import type { SketchId } from "./sketches"
import {
	bouncingBalls3D,
	setBouncingBallsConfig,
} from "./sketches/3d-bouncing-balls"
import {
	cellularAutomaton,
	setCellularAutomatonConfig,
} from "./sketches/cellular-automaton"
import { dragonCurve } from "./sketches/dragon-curve"
import { dragonCurveAnim } from "./sketches/dragon-curve-anim"
import { kochIsland } from "./sketches/koch-island"
import { landscape, setLandscapeConfig } from "./sketches/landscape"
import {
	randomCircles,
	setRandomCirclesConfig,
} from "./sketches/random-circles"
import { getSketchFromURL, updateSketchConfig } from "./utils/url-params"

const sketches: Record<SketchId, (p: p5) => void> = {
	"3d-bouncing-balls": bouncingBalls3D,
	"dragon-curve": dragonCurve,
	"dragon-curve-anim": dragonCurveAnim,
	"cellular-automaton": cellularAutomaton,
	"koch-island": kochIsland,
	landscape: landscape,
	"random-circles": randomCircles,
}

let currentP5Instance: p5 | null = null
let currentSketch: SketchId = "koch-island"

const sketchContainer = document.getElementById("sketch-container")
const menuButtons = document.querySelectorAll(".sketch-btn")
const hamburgerBtn = document.getElementById("hamburger-btn")
const menuOverlay = document.getElementById("menu-overlay")
const menuDropdown = document.getElementById("menu-dropdown")
const sketchMenu = document.querySelector(".sketch-menu") as HTMLElement

let bouncingBallsConfig: BouncingBallsConfigDialog | null = null
let cellularAutomatonConfig: CellularAutomatonConfigDialog | null = null
let randomCirclesConfig: RandomCirclesConfigDialog | null = null
let landscapeConfig: LandscapeConfigDialog | null = null

function loadSketch(sketchId: SketchId) {
	if (!sketchContainer) return

	currentSketch = sketchId
	const sketchFn = sketches[sketchId]

	if (currentP5Instance) currentP5Instance.remove()
	currentP5Instance = new p5(sketchFn, sketchContainer)

	menuButtons.forEach((btn) => {
		btn.classList.toggle("active", btn.getAttribute("data-sketch") === sketchId)
	})

	if (sketchId === "3d-bouncing-balls") {
		showConfigDialog(initBouncingBallsConfigDialog())
	} else if (sketchId === "cellular-automaton") {
		showConfigDialog(initCellularAutomatonConfigDialog())
	} else if (sketchId === "random-circles") {
		showConfigDialog(initRandomCirclesConfigDialog())
	} else if (sketchId === "landscape") {
		showConfigDialog(initLandscapeConfigDialog())
	} else {
		updateSketchConfig(sketchId)
		hideAllConfigDialogs()
	}
}

function initCellularAutomatonConfigDialog() {
	if (!cellularAutomatonConfig) {
		cellularAutomatonConfig = new CellularAutomatonConfigDialog(sketchMenu)
		cellularAutomatonConfig.setOnChange((config) => {
			setCellularAutomatonConfig(config)
		})
	}
	setCellularAutomatonConfig(cellularAutomatonConfig.getConfig())
	return cellularAutomatonConfig
}

function initRandomCirclesConfigDialog() {
	if (!randomCirclesConfig) {
		randomCirclesConfig = new RandomCirclesConfigDialog(sketchMenu)
		randomCirclesConfig.setOnChange((config) => {
			setRandomCirclesConfig(config)
		})
	}
	setRandomCirclesConfig(randomCirclesConfig.getConfig())
	return randomCirclesConfig
}

function initBouncingBallsConfigDialog() {
	if (!bouncingBallsConfig) {
		bouncingBallsConfig = new BouncingBallsConfigDialog(sketchMenu)
		bouncingBallsConfig.setOnChange((config) => {
			setBouncingBallsConfig(config)
		})
	}
	setBouncingBallsConfig(bouncingBallsConfig.getConfig())
	return bouncingBallsConfig
}

function initLandscapeConfigDialog() {
	if (!landscapeConfig) {
		landscapeConfig = new LandscapeConfigDialog(sketchMenu)
		landscapeConfig.setOnChange((config) => {
			setLandscapeConfig(config)
		})
	}
	setLandscapeConfig(landscapeConfig.getConfig())
	return landscapeConfig
}

function showConfigDialog<T>(dialog: BaseConfigDialog<T>) {
	hideAllConfigDialogs()
	dialog.show()
}

function hideAllConfigDialogs() {
	bouncingBallsConfig?.hide()
	cellularAutomatonConfig?.hide()
	randomCirclesConfig?.hide()
	landscapeConfig?.hide()
}

function toggleMenu() {
	if (hamburgerBtn && menuOverlay) {
		const isOpen = menuOverlay.classList.contains("open")
		hamburgerBtn.classList.toggle("open", !isOpen)
		menuOverlay.classList.toggle("open", !isOpen)
		if (!isOpen) {
			menuOverlay.style.display = "block"
		} else {
			setTimeout(() => {
				menuOverlay.style.display = "none"
			}, 200)
		}
	}
}

function closeMenu() {
	if (hamburgerBtn && menuOverlay) {
		hamburgerBtn.classList.remove("open")
		menuOverlay.classList.remove("open")
		setTimeout(() => {
			menuOverlay.style.display = "none"
		}, 200)
	}
}

hamburgerBtn?.addEventListener("click", toggleMenu)

document.addEventListener("click", (event) => {
	if (
		hamburgerBtn &&
		menuDropdown &&
		!hamburgerBtn.contains(event.target as Node) &&
		!menuDropdown.contains(event.target as Node)
	) {
		closeMenu()
	}
})

menuOverlay?.addEventListener("click", (event) => {
	if (event.target === menuOverlay) {
		closeMenu()
	}
})

menuButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const sketchId = button.getAttribute("data-sketch") as SketchId
		if (sketchId && sketchId !== currentSketch) {
			loadSketch(sketchId)
			closeMenu()
		}
	})
})

const initialSketch = getSketchFromURL()
loadSketch(initialSketch)
