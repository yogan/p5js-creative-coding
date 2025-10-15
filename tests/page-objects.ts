import type { Page } from "@playwright/test"
import type { SketchId } from "../src/sketches"

export const createPageLocators = (page: Page) => ({
	canvas: page.locator("#sketch-container canvas"),
	menuButton: page.locator("#hamburger-btn"),
	controlButton: page.locator("#control-btn"),
	menuDropdown: page.locator("#menu-dropdown"),
	menuOverlay: page.locator("#menu-overlay"),
	modalOverlay: page.locator(".modal-overlay"),
	modalHeading: page.locator(".modal-overlay .modal-content h3"),
	menuItem: (id: SketchId) => page.locator(`button[data-sketch="${id}"]`),
	highlightedMenuItem: (id: SketchId) =>
		page.locator(`button[data-sketch="${id}"].active`),

	// 3D Bouncing Balls controls
	ballCountSlider: page.locator("#ball-count-slider"),

	// Cellular Automaton controls
	ruleSlider: page.locator("#rule-input"),
	rulePlusBtn: page.locator("#rule-plus"),
	ruleMinusBtn: page.locator("#rule-minus"),
	widthSlider: page.locator("#width-input"),
	widthPlusBtn: page.locator("#width-plus"),
	widthMinusBtn: page.locator("#width-minus"),
	gridSelect: page.locator("#grid-select"),
	startSelect: page.locator("#start-select"),

	// Landscape controls
	meshRadio: (value: string) =>
		page.locator(`input[name="mesh"][value="${value}"]`),
	cameraRadio: (value: string) =>
		page.locator(`input[name="camera"][value="${value}"]`),
	heightSpeedSlider: page.locator("#height-speed"),
	roughnessSlider: page.locator("#roughness"),

	// Random Circles controls
	visualizationRadio: (value: string) =>
		page.locator(`input[name="visualization"][value="${value}"]`),
	modeSelect: page.locator("#mode-select"),
	walkerCountSlider: page.locator("#walker-count-slider"),
	mouseAttractionSlider: page.locator("#mouse-attraction-slider"),
	mouseMaxSpeedSlider: page.locator("#mouse-max-speed-slider"),
	resetBtn: page.locator("#reset-btn"),
})
