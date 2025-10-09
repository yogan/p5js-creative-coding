import p5 from "p5"
import { ElementaryCellularAutomatonConfig } from "./components/elementary-cellular-automaton-config"
import { dragonCurve } from "./sketches/dragon-curve"
import { dragonCurveAnim } from "./sketches/dragon-curve-anim"
import {
	elementaryCellularAutomaton,
	getCurrentRule,
	getCurrentWidth,
	getGridColor,
	setGridColor,
	setRule,
	setWidth,
} from "./sketches/elementary-cellular-automaton"
import { kochIsland } from "./sketches/koch-island"
import { orbitalCrescents } from "./sketches/orbital-crescents"
import { particleWave } from "./sketches/particle-wave"
import {
	CELLULAR_AUTOMATON_SKETCH,
	getGridFromURL,
	getRuleFromURL,
	getSketchFromURL,
	getWidthFromURL,
	type SketchName,
	updateURL,
} from "./utils/url-params"

const sketches: Record<SketchName, (p: p5) => void> = {
	"orbital-crescents": orbitalCrescents,
	"particle-wave": particleWave,
	"koch-island": kochIsland,
	"dragon-curve": dragonCurve,
	"dragon-curve-anim": dragonCurveAnim,
	[CELLULAR_AUTOMATON_SKETCH]: elementaryCellularAutomaton,
}

let currentP5Instance: p5 | null = null
let currentSketch = "orbital-crescents"

const sketchContainer = document.getElementById("sketch-container")
const menuButtons = document.querySelectorAll(".sketch-btn")
const hamburgerBtn = document.getElementById("hamburger-btn")
const menuOverlay = document.getElementById("menu-overlay")
const menuDropdown = document.getElementById("menu-dropdown")
const sketchMenu = document.querySelector(".sketch-menu") as HTMLElement

let sketchConfig: ElementaryCellularAutomatonConfig | null = null

function loadSketch(
	sketchName: SketchName,
	rule?: number,
	width?: number,
	grid?: string,
) {
	if (currentP5Instance) {
		currentP5Instance.remove()
	}

	if (sketchContainer) {
		const sketchFn = sketches[sketchName]
		currentP5Instance = new p5(sketchFn, sketchContainer)

		currentSketch = sketchName
		updateURL(sketchName, rule, width, grid)

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
			setRule(currentRule)
			setWidth(currentWidth)
			setGridColor(currentGrid)
			if (!sketchConfig) {
				sketchConfig = new ElementaryCellularAutomatonConfig(sketchMenu)
				sketchConfig.setOnRuleChange(() => {
					loadSketch(
						currentSketch as SketchName,
						getCurrentRule(),
						getCurrentWidth(),
						getGridColor(),
					)
				})
			}
			sketchConfig.show()
		} else {
			if (sketchConfig) {
				sketchConfig.hide()
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
	)
} else {
	loadSketch(initialSketch)
}
