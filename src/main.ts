import p5 from "p5"
import type { BaseConfigDialog } from "./configs/base-config-dialog"
import { ElementaryCellularAutomatonConfigDialog } from "./configs/elementary-cellular-automaton-config-dialog"
import { LandscapeConfigDialog } from "./configs/landscape-config-dialog"
import { ScratchRandomnessConfigDialog } from "./configs/scratch-randomness-config-dialog"
import { bouncingBalls3D } from "./sketches/3d-bouncing-balls"
import { dragonCurve } from "./sketches/dragon-curve"
import { dragonCurveAnim } from "./sketches/dragon-curve-anim"
import {
	elementaryCellularAutomaton,
	getElementaryCellularAutomatonConfig,
	setElementaryCellularAutomatonConfig,
} from "./sketches/elementary-cellular-automaton"
import { kochIsland } from "./sketches/koch-island"
import { landscape, setLandscapeConfig } from "./sketches/landscape"
import {
	scratchRandomness,
	setScratchRandomnessConfig,
} from "./sketches/scratch-randomness"
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
	"scratch-randomness": scratchRandomness,
}

let currentP5Instance: p5 | null = null
let currentSketch = "koch-island"

const sketchContainer = document.getElementById("sketch-container")
const menuButtons = document.querySelectorAll(".sketch-btn")
const hamburgerBtn = document.getElementById("hamburger-btn")
const menuOverlay = document.getElementById("menu-overlay")
const menuDropdown = document.getElementById("menu-dropdown")
const sketchMenu = document.querySelector(".sketch-menu") as HTMLElement

let cellularAutomaton: ElementaryCellularAutomatonConfigDialog | null = null
let scratchConfig: ScratchRandomnessConfigDialog | null = null
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

	if (sketchName === "elementary-cellular-automaton") {
		showConfigDialog(initElementaryCellularAutomatonConfigDialog())
	} else if (sketchName === "scratch-randomness") {
		showConfigDialog(initScratchRandomnessConfigDialog())
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
	setElementaryCellularAutomatonConfig(getElementaryCellularAutomatonConfig())
	return cellularAutomaton
}

function initScratchRandomnessConfigDialog() {
	if (!scratchConfig) {
		scratchConfig = new ScratchRandomnessConfigDialog(sketchMenu)
		scratchConfig.setOnChange((config) => {
			setScratchRandomnessConfig(config)
		})
	}
	setScratchRandomnessConfig(scratchConfig.getConfig())
	return scratchConfig
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

function showConfigDialog(dialog: BaseConfigDialog) {
	hideAllConfigDialogs()
	dialog.show()
}

function hideAllConfigDialogs() {
	cellularAutomaton?.hide()
	scratchConfig?.hide()
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
