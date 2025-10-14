import p5 from "p5"
import type { BaseConfigDialog } from "./configs/base-config-dialog"
import { BouncingBallsConfigDialog } from "./configs/bouncing-balls-config-dialog"
import { ElementaryCellularAutomatonConfigDialog } from "./configs/elementary-cellular-automaton-config-dialog"
import { LandscapeConfigDialog } from "./configs/landscape-config-dialog"
import { RandomCirclesConfigDialog } from "./configs/random-circles-config-dialog"
import {
	bouncingBalls3D,
	setBouncingBallsConfig,
} from "./sketches/3d-bouncing-balls"
import { dragonCurve } from "./sketches/dragon-curve"
import { dragonCurveAnim } from "./sketches/dragon-curve-anim"
import {
	elementaryCellularAutomaton,
	setElementaryCellularAutomatonConfig,
} from "./sketches/elementary-cellular-automaton"
import { kochIsland } from "./sketches/koch-island"
import { landscape, setLandscapeConfig } from "./sketches/landscape"
import {
	randomCircles,
	setRandomCirclesConfig,
} from "./sketches/random-circles"
import {
	getSketchFromURL,
	type SketchName,
	updateSketchConfig,
} from "./utils/url-params"

const sketches: Record<SketchName, (p: p5) => void> = {
	"3d-bouncing-balls": bouncingBalls3D,
	"dragon-curve": dragonCurve,
	"dragon-curve-anim": dragonCurveAnim,
	"elementary-cellular-automaton": elementaryCellularAutomaton,
	"koch-island": kochIsland,
	landscape: landscape,
	"random-circles": randomCircles,
}

let currentP5Instance: p5 | null = null
let currentSketch: SketchName = "koch-island"

const sketchContainer = document.getElementById("sketch-container")
const menuButtons = document.querySelectorAll(".sketch-btn")
const hamburgerBtn = document.getElementById("hamburger-btn")
const menuOverlay = document.getElementById("menu-overlay")
const menuDropdown = document.getElementById("menu-dropdown")
const sketchMenu = document.querySelector(".sketch-menu") as HTMLElement

let bouncingBallsConfig: BouncingBallsConfigDialog | null = null
let cellularAutomaton: ElementaryCellularAutomatonConfigDialog | null = null
let randomCirclesConfig: RandomCirclesConfigDialog | null = null
let landscapeConfig: LandscapeConfigDialog | null = null

function loadSketch(sketchName: SketchName) {
	if (!sketchContainer) return

	currentSketch = sketchName
	const sketchFn = sketches[sketchName]

	if (currentP5Instance) currentP5Instance.remove()
	currentP5Instance = new p5(sketchFn, sketchContainer)

	menuButtons.forEach((btn) => {
		btn.classList.toggle(
			"active",
			btn.getAttribute("data-sketch") === sketchName,
		)
	})

	if (sketchName === "3d-bouncing-balls") {
		showConfigDialog(initBouncingBallsConfigDialog())
	} else if (sketchName === "elementary-cellular-automaton") {
		showConfigDialog(initElementaryCellularAutomatonConfigDialog())
	} else if (sketchName === "random-circles") {
		showConfigDialog(initRandomCirclesConfigDialog())
	} else if (sketchName === "landscape") {
		showConfigDialog(initLandscapeConfigDialog())
	} else {
		updateSketchConfig(sketchName)
		hideAllConfigDialogs()
	}
}

function initElementaryCellularAutomatonConfigDialog() {
	if (!cellularAutomaton) {
		cellularAutomaton = new ElementaryCellularAutomatonConfigDialog(sketchMenu)
		cellularAutomaton.setOnChange((config) => {
			setElementaryCellularAutomatonConfig(config)
		})
	}
	setElementaryCellularAutomatonConfig(cellularAutomaton.getConfig())
	return cellularAutomaton
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
	cellularAutomaton?.hide()
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
		const sketchName = button.getAttribute("data-sketch") as SketchName
		if (sketchName && sketchName !== currentSketch) {
			loadSketch(sketchName)
			closeMenu()
		}
	})
})

const initialSketch = getSketchFromURL()
loadSketch(initialSketch)
