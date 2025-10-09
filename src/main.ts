import p5 from "p5"
import { ElementaryCellularAutomatonConfig } from "./components/elementary-cellular-automaton-config"
import { dragonCurve } from "./sketches/dragon-curve"
import { dragonCurveAnim } from "./sketches/dragon-curve-anim"
import {
	elementaryCellularAutomaton,
	getCurrentRule,
	getCurrentWidth,
	setRule,
	setWidth,
} from "./sketches/elementary-cellular-automaton"
import { kochIsland } from "./sketches/koch-island"
import { orbitalCrescents } from "./sketches/orbital-crescents"
import { particleWave } from "./sketches/particle-wave"

const sketches = {
	"orbital-crescents": orbitalCrescents,
	"particle-wave": particleWave,
	"koch-island": kochIsland,
	"dragon-curve": dragonCurve,
	"dragon-curve-anim": dragonCurveAnim,
	"elementary-cellular-automaton": elementaryCellularAutomaton,
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

function getSketchFromURL(): keyof typeof sketches {
	const urlParams = new URLSearchParams(window.location.search)
	const sketch = urlParams.get("sketch") as keyof typeof sketches
	return sketch && sketch in sketches ? sketch : "orbital-crescents"
}

function getRuleFromURL(): number {
	const urlParams = new URLSearchParams(window.location.search)
	const rule = urlParams.get("rule")
	if (rule) {
		const ruleNumber = parseInt(rule, 10)
		if (!Number.isNaN(ruleNumber) && ruleNumber >= 0 && ruleNumber <= 255) {
			return ruleNumber
		}
	}
	return 30
}

function getWidthFromURL(): number {
	const urlParams = new URLSearchParams(window.location.search)
	const width = urlParams.get("width")
	if (width) {
		const widthNumber = parseInt(width, 10)
		if (!Number.isNaN(widthNumber) && widthNumber >= 5 && widthNumber <= 50) {
			return widthNumber
		}
	}
	return 10
}

function updateURL(
	sketchName: keyof typeof sketches,
	rule?: number,
	width?: number,
) {
	const url = new URL(window.location.href)
	url.searchParams.set("sketch", sketchName)
	if (rule !== undefined && sketchName === "elementary-cellular-automaton") {
		url.searchParams.set("rule", rule.toString())
	} else {
		url.searchParams.delete("rule")
	}
	if (width !== undefined && sketchName === "elementary-cellular-automaton") {
		url.searchParams.set("width", width.toString())
	} else {
		url.searchParams.delete("width")
	}
	window.history.replaceState({}, "", url)
}

function loadSketch(
	sketchName: keyof typeof sketches,
	rule?: number,
	width?: number,
) {
	if (currentP5Instance) {
		currentP5Instance.remove()
	}

	if (sketchContainer) {
		const sketchFn = sketches[sketchName]
		currentP5Instance = new p5(sketchFn, sketchContainer)

		currentSketch = sketchName
		updateURL(sketchName, rule, width)

		menuButtons.forEach((btn) => {
			btn.classList.toggle(
				"active",
				btn.getAttribute("data-sketch") === sketchName,
			)
		})

		if (sketchName === "elementary-cellular-automaton") {
			const currentRule = rule ?? getRuleFromURL()
			const currentWidth = width ?? getWidthFromURL()
			setRule(currentRule)
			setWidth(currentWidth)
			if (!sketchConfig) {
				sketchConfig = new ElementaryCellularAutomatonConfig(sketchMenu)
				sketchConfig.setOnRuleChange(() => {
					loadSketch(
						currentSketch as keyof typeof sketches,
						getCurrentRule(),
						getCurrentWidth(),
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
		const sketchName = button.getAttribute(
			"data-sketch",
		) as keyof typeof sketches
		if (sketchName && sketchName !== currentSketch) {
			if (sketchName === "elementary-cellular-automaton") {
				loadSketch(sketchName, getCurrentRule(), getCurrentWidth())
			} else {
				loadSketch(sketchName)
			}
			closeMenu()
		}
	})
})

const initialSketch = getSketchFromURL()
if (initialSketch === "elementary-cellular-automaton") {
	loadSketch(initialSketch, getRuleFromURL(), getWidthFromURL())
} else {
	loadSketch(initialSketch)
}
