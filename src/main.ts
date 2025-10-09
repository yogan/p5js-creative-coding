import p5 from "p5"
import { ElementaryCellularAutomatonConfig } from "./components/elementary-cellular-automaton-config"
import { dragonCurve } from "./sketches/dragon-curve"
import { dragonCurveAnim } from "./sketches/dragon-curve-anim"
import { elementaryCellularAutomaton } from "./sketches/elementary-cellular-automaton"
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
const menuDropdown = document.getElementById("menu-dropdown")
const sketchMenu = document.querySelector(".sketch-menu") as HTMLElement

let sketchConfig: ElementaryCellularAutomatonConfig | null = null

function getSketchFromURL(): keyof typeof sketches {
	const urlParams = new URLSearchParams(window.location.search)
	const sketch = urlParams.get("sketch") as keyof typeof sketches
	return sketch && sketch in sketches ? sketch : "orbital-crescents"
}

function updateURL(sketchName: keyof typeof sketches) {
	const url = new URL(window.location.href)
	url.searchParams.set("sketch", sketchName)
	window.history.replaceState({}, "", url)
}

function loadSketch(sketchName: keyof typeof sketches) {
	if (currentP5Instance) {
		currentP5Instance.remove()
	}

	if (sketchContainer) {
		const sketchFn = sketches[sketchName]
		currentP5Instance = new p5(sketchFn, sketchContainer)

		currentSketch = sketchName
		updateURL(sketchName)

		menuButtons.forEach((btn) => {
			btn.classList.toggle(
				"active",
				btn.getAttribute("data-sketch") === sketchName,
			)
		})

		if (sketchName === "elementary-cellular-automaton") {
			if (!sketchConfig) {
				sketchConfig = new ElementaryCellularAutomatonConfig(sketchMenu)
				sketchConfig.setOnRuleChange(() => {
					loadSketch(currentSketch as keyof typeof sketches)
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
	if (hamburgerBtn && menuDropdown) {
		const isOpen = menuDropdown.classList.contains("open")
		hamburgerBtn.classList.toggle("open", !isOpen)
		menuDropdown.classList.toggle("open", !isOpen)
	}
}

function closeMenu() {
	if (hamburgerBtn && menuDropdown) {
		hamburgerBtn.classList.remove("open")
		menuDropdown.classList.remove("open")
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

menuButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const sketchName = button.getAttribute(
			"data-sketch",
		) as keyof typeof sketches
		if (sketchName && sketchName !== currentSketch) {
			loadSketch(sketchName)
			closeMenu()
		}
	})
})

loadSketch(getSketchFromURL())
