import p5 from "p5"
import { ElementaryCellularAutomatonConfig } from "./components/elementary-cellular-automaton-config"
import { LandscapeConfig } from "./components/landscape-config"
import { ScratchRandomnessConfig } from "./components/scratch-randomness-config"
import { dragonCurve } from "./sketches/dragon-curve"
import { dragonCurveAnim } from "./sketches/dragon-curve-anim"
import {
	elementaryCellularAutomaton,
	getCurrentRule,
	getCurrentWidth,
	getGridColor,
	getInitialCells,
	setGridColor,
	setInitialCells,
	setRule,
	setWidth,
} from "./sketches/elementary-cellular-automaton"
import { kochIsland } from "./sketches/koch-island"
import { landscape, setLandscapeSettings } from "./sketches/landscape"
import {
	scratchRandomness,
	setScratchRandomnessSettings,
} from "./sketches/scratch-randomness"

import {
	CELLULAR_AUTOMATON_SKETCH,
	type GridColor,
	getGridFromURL,
	getRuleFromURL,
	getSketchFromURL,
	getStartFromURL,
	getWidthFromURL,
	type InitialCells,
	type SketchName,
	updateURL,
} from "./utils/url-params"

const sketches: Record<SketchName, (p: p5) => void> = {
	"koch-island": kochIsland,
	"dragon-curve": dragonCurve,
	"dragon-curve-anim": dragonCurveAnim,
	[CELLULAR_AUTOMATON_SKETCH]: elementaryCellularAutomaton,
	"scratch-randomness": scratchRandomness,
	landscape: landscape,
}

let currentP5Instance: p5 | null = null
let currentSketch = "koch-island"

const sketchContainer = document.getElementById("sketch-container")
const menuButtons = document.querySelectorAll(".sketch-btn")
const hamburgerBtn = document.getElementById("hamburger-btn")
const menuOverlay = document.getElementById("menu-overlay")
const menuDropdown = document.getElementById("menu-dropdown")
const sketchMenu = document.querySelector(".sketch-menu") as HTMLElement

let sketchConfig: ElementaryCellularAutomatonConfig | null = null
let scratchConfig: ScratchRandomnessConfig | null = null
let landscapeConfig: LandscapeConfig | null = null

function loadSketch(
	sketchName: SketchName,
	rule?: number,
	width?: number,
	grid?: GridColor,
	start?: InitialCells,
) {
	if (currentP5Instance) {
		currentP5Instance.remove()
	}

	if (sketchContainer) {
		const sketchFn = sketches[sketchName]
		currentP5Instance = new p5(sketchFn, sketchContainer)

		currentSketch = sketchName
		updateURL(sketchName, rule, width, grid, start)

		menuButtons.forEach((btn) => {
			btn.classList.toggle(
				"active",
				btn.getAttribute("data-sketch") === sketchName,
			)
		})

		if (sketchName === CELLULAR_AUTOMATON_SKETCH) {
			const currentRule = rule ?? getRuleFromURL()
			const currentWidth = width ?? getWidthFromURL()
			const currentGrid = grid ?? getGridFromURL()
			const currentStart = start ?? getStartFromURL()
			setRule(currentRule)
			setWidth(currentWidth)
			setGridColor(currentGrid)
			setInitialCells(currentStart)
			if (!sketchConfig) {
				sketchConfig = new ElementaryCellularAutomatonConfig(sketchMenu)
				sketchConfig.setOnRuleChange(() => {
					loadSketch(
						currentSketch as SketchName,
						getCurrentRule(),
						getCurrentWidth(),
						getGridColor(),
						getInitialCells(),
					)
				})
			}
			sketchConfig.show()
			if (scratchConfig) {
				scratchConfig.hide()
			}
		} else if (sketchName === "scratch-randomness") {
			if (!scratchConfig) {
				scratchConfig = new ScratchRandomnessConfig(sketchMenu)
				scratchConfig.setOnSettingsChange((settings) => {
					setScratchRandomnessSettings(settings)
				})
			}
			scratchConfig.show()
			if (sketchConfig) {
				sketchConfig.hide()
			}
			if (landscapeConfig) {
				landscapeConfig.hide()
			}
		} else if (sketchName === "landscape") {
			if (!landscapeConfig) {
				landscapeConfig = new LandscapeConfig(sketchMenu)
				landscapeConfig.setOnSettingsChange((settings) => {
					setLandscapeSettings(settings)
				})
			}
			// Set initial settings from URL
			setLandscapeSettings(landscapeConfig.getSettings())
			landscapeConfig.show()
			if (sketchConfig) {
				sketchConfig.hide()
			}
			if (scratchConfig) {
				scratchConfig.hide()
			}
		} else {
			if (sketchConfig) {
				sketchConfig.hide()
			}
			if (scratchConfig) {
				scratchConfig.hide()
			}
			if (landscapeConfig) {
				landscapeConfig.hide()
			}
		}
	}
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
			if (sketchName === CELLULAR_AUTOMATON_SKETCH) {
				loadSketch(
					sketchName,
					getCurrentRule(),
					getCurrentWidth(),
					getGridColor(),
					getInitialCells(),
				)
			} else {
				loadSketch(sketchName)
			}
			closeMenu()
		}
	})
})

const initialSketch = getSketchFromURL()
if (initialSketch === CELLULAR_AUTOMATON_SKETCH) {
	loadSketch(
		initialSketch,
		getRuleFromURL(),
		getWidthFromURL(),
		getGridFromURL(),
		getStartFromURL(),
	)
} else {
	loadSketch(initialSketch)
}
