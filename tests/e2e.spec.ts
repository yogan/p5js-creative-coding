import type { Page } from "@playwright/test"
import { expect, test } from "@playwright/test"
import { DEFAULT_BOUNCING_BALLS_CONFIG } from "../src/configs/bouncing-balls-config"
import { DEFAULT_CELLULAR_AUTOMATON_CONFIG } from "../src/configs/cellular-automaton-config"
import { DEFAULT_LANDSCAPE_CONFIG } from "../src/configs/landscape-config"
import { DEFAULT_RANDOM_CIRCLES_CONFIG } from "../src/configs/random-circles-config"
import { allSketches, DEFAULT_SKETCH } from "../src/sketches"
import { createPageLocators } from "./page-objects"

const getQueryParam = (page: Page, param: string): string | null =>
	new URL(page.url()).searchParams.get(param)

test("Menu navigation and button visibility", async ({ page }) => {
	const loc = createPageLocators(page)

	// Wait for page to load
	await page.goto("/")
	await expect(loc.canvas).toBeVisible()

	// Check that the hamburger menu button is always visible
	await expect(loc.menuButton).toBeVisible()

	// Check that initially the default sketch is highlighted
	await loc.menuButton.click()
	await expect(loc.menuDropdown).toBeVisible()
	await expect(loc.highlightedMenuItem(DEFAULT_SKETCH)).toBeVisible()
	await loc.menuOverlay.click()
	await expect(loc.menuDropdown).toBeHidden()

	for (const sketch of allSketches()) {
		const sketchId = sketch.id

		// Open menu
		await loc.menuButton.click()
		await expect(loc.menuDropdown).toBeVisible()

		// Click on menu entry (button with data-sketch attribute)
		const menuItem = loc.menuItem(sketchId)
		await expect(menuItem).toBeVisible()
		await menuItem.click()

		// Check that menu is hidden after click
		await expect(loc.menuDropdown).toBeHidden()

		// Check that URL has correct sketch parameter
		expect(getQueryParam(page, "sketch")).toBe(sketchId)

		// Wait for sketch to load
		await expect(loc.canvas).toBeVisible()

		// Check control button visibility based on sketch config
		if (sketch.hasConfig) {
			// Should be visible for sketches with config
			await expect(loc.controlButton).toBeVisible()
		} else {
			// Should be hidden for sketches without config
			await expect(loc.controlButton).toBeHidden()
		}

		// Open menu again and check highlighting
		await loc.menuButton.click()
		await expect(loc.menuDropdown).toBeVisible()

		// Check that the current sketch is highlighted
		const highlightedItem = loc.highlightedMenuItem(sketchId)
		await expect(highlightedItem).toBeVisible()

		// Close menu by clicking outside (click on menu overlay)
		await loc.menuOverlay.click()
		await expect(loc.menuDropdown).toBeHidden()
	}
})

test("3D Bouncing Balls config controls", async ({ page }) => {
	const loc = createPageLocators(page)

	// Navigate to sketch
	await page.goto("/?sketch=3d-bouncing-balls")
	await expect(loc.canvas).toBeVisible()
	await expect(loc.controlButton).toBeVisible()

	// Open config dialog
	await loc.controlButton.click()
	await expect(loc.modalOverlay).toBeVisible()
	await expect(loc.modalHeading).toHaveText("Configure 3D Bouncing Balls")

	// Test initial values match defaults
	await expect(loc.ballCountSlider).toHaveValue(
		DEFAULT_BOUNCING_BALLS_CONFIG.count.toString(),
	)

	// Test ball count slider - move to value 10
	await loc.ballCountSlider.fill("10")
	expect(getQueryParam(page, "count")).toBe("10")

	// Close and reopen to verify persistence
	await loc.modalOverlay.click()
	await expect(loc.modalOverlay).toBeHidden()
	await loc.controlButton.click()
	await expect(loc.ballCountSlider).toHaveValue("10")

	await loc.modalOverlay.click()
})

test("Cellular Automaton config controls", async ({ page }) => {
	const loc = createPageLocators(page)

	// Navigate to sketch
	await page.goto("/?sketch=cellular-automaton")
	await expect(loc.canvas).toBeVisible()
	await expect(loc.controlButton).toBeVisible()

	// Open config dialog
	await loc.controlButton.click()
	await expect(loc.modalOverlay).toBeVisible()
	await expect(loc.modalHeading).toHaveText(
		"Configure Elementary Cellular Automaton",
	)

	// Test initial values match defaults
	await expect(loc.ruleSlider).toHaveValue(
		DEFAULT_CELLULAR_AUTOMATON_CONFIG.rule.toString(),
	)
	await expect(loc.widthSlider).toHaveValue(
		DEFAULT_CELLULAR_AUTOMATON_CONFIG.width.toString(),
	)
	await expect(loc.gridSelect).toHaveValue(
		DEFAULT_CELLULAR_AUTOMATON_CONFIG.grid,
	)
	await expect(loc.startSelect).toHaveValue(
		DEFAULT_CELLULAR_AUTOMATON_CONFIG.start,
	)

	// Test rule slider - move to value 90
	await loc.ruleSlider.fill("90")
	expect(getQueryParam(page, "rule")).toBe("90")

	// Test rule plus button
	await loc.rulePlusBtn.click()
	expect(getQueryParam(page, "rule")).toBe("91")

	// Test rule minus button
	await loc.ruleMinusBtn.click()
	expect(getQueryParam(page, "rule")).toBe("90")

	// Test width slider - move to value 5
	await loc.widthSlider.fill("5")
	expect(getQueryParam(page, "width")).toBe("5")

	// Test width plus/minus buttons
	await loc.widthPlusBtn.click()
	expect(getQueryParam(page, "width")).toBe("6")
	await loc.widthMinusBtn.click()
	expect(getQueryParam(page, "width")).toBe("5")

	// Test grid select dropdown
	await loc.gridSelect.selectOption("dark")
	expect(getQueryParam(page, "grid")).toBe("dark")

	// Test start select dropdown
	await loc.startSelect.selectOption("random")
	expect(getQueryParam(page, "start")).toBe("random")

	// Close and reopen to verify persistence
	await loc.modalOverlay.click()
	await expect(loc.modalOverlay).toBeHidden()
	await loc.controlButton.click()
	await expect(loc.ruleSlider).toHaveValue("90")
	await expect(loc.widthSlider).toHaveValue("5")
	await expect(loc.gridSelect).toHaveValue("dark")
	await expect(loc.startSelect).toHaveValue("random")

	await loc.modalOverlay.click()
})

test("Landscape config controls", async ({ page }) => {
	const loc = createPageLocators(page)

	// Navigate to sketch
	await page.goto("/?sketch=landscape")
	await expect(loc.canvas).toBeVisible()
	await expect(loc.controlButton).toBeVisible()

	// Open config dialog
	await loc.controlButton.click()
	await expect(loc.modalOverlay).toBeVisible()
	await expect(loc.modalHeading).toHaveText("Configure Landscape")

	// Test initial values match defaults
	await expect(loc.meshRadio(DEFAULT_LANDSCAPE_CONFIG.mesh)).toBeChecked()
	await expect(loc.cameraRadio(DEFAULT_LANDSCAPE_CONFIG.camera)).toBeChecked()
	await expect(loc.heightSpeedSlider).toHaveValue(
		DEFAULT_LANDSCAPE_CONFIG.heightChangeSpeed.toString(),
	)
	await expect(loc.roughnessSlider).toHaveValue(
		DEFAULT_LANDSCAPE_CONFIG.roughness.toString(),
	)

	// Test mesh radio buttons
	await loc.meshRadio("squares").click()
	expect(getQueryParam(page, "mesh")).toBe("squares")

	// Test camera radio buttons
	await loc.cameraRadio("manual").click()
	expect(getQueryParam(page, "camera")).toBe("manual")

	// Test height speed slider - move to value 0.007
	await loc.heightSpeedSlider.fill("0.007")
	expect(getQueryParam(page, "heightChangeSpeed")).toBe("0.007")

	// Test roughness slider - move to value 0.2
	await loc.roughnessSlider.fill("0.2")
	expect(getQueryParam(page, "roughness")).toBe("0.2")

	// Close and reopen to verify persistence
	await loc.modalOverlay.click()
	await expect(loc.modalOverlay).toBeHidden()
	await loc.controlButton.click()
	await expect(loc.meshRadio("squares")).toBeChecked()
	await expect(loc.cameraRadio("manual")).toBeChecked()
	await expect(loc.heightSpeedSlider).toHaveValue("0.007")
	await expect(loc.roughnessSlider).toHaveValue("0.2")

	await loc.modalOverlay.click()
})

test("Random Circles config controls", async ({ page }) => {
	const loc = createPageLocators(page)

	// Navigate to sketch
	await page.goto("/?sketch=random-circles")
	await expect(loc.canvas).toBeVisible()
	await expect(loc.controlButton).toBeVisible()

	// Open config dialog
	await loc.controlButton.click()
	await expect(loc.modalOverlay).toBeVisible()
	await expect(loc.modalHeading).toHaveText("Configure Random Circles")

	// Test initial values match defaults
	await expect(
		loc.visualizationRadio(DEFAULT_RANDOM_CIRCLES_CONFIG.type),
	).toBeChecked()
	await expect(loc.modeSelect).toHaveValue(
		DEFAULT_RANDOM_CIRCLES_CONFIG.placement,
	)
	await expect(loc.walkerCountSlider).toHaveValue(
		DEFAULT_RANDOM_CIRCLES_CONFIG.count.toString(),
	)

	// Test visualization type radio - switch to moving
	await loc.visualizationRadio("moving").click()
	expect(getQueryParam(page, "type")).toBe("moving")

	// Test mode select (behavior for moving)
	await loc.modeSelect.selectOption("gaussian")
	expect(getQueryParam(page, "behavior")).toBe("gaussian")

	// Test walker count slider - move to value 15
	await loc.walkerCountSlider.fill("15")
	expect(getQueryParam(page, "count")).toBe("15")

	// Switch to mouse mode to test mouse-specific controls
	await loc.modeSelect.selectOption("mouse")
	expect(getQueryParam(page, "behavior")).toBe("mouse")

	// Test mouse attraction slider - move to value 25
	await loc.mouseAttractionSlider.fill("25")
	expect(getQueryParam(page, "attraction")).toBe("25")

	// Test mouse max speed slider - move to value 8
	await loc.mouseMaxSpeedSlider.fill("8")
	expect(getQueryParam(page, "speed")).toBe("8")

	// Test switching back to static
	await loc.visualizationRadio("static").click()
	expect(getQueryParam(page, "type")).toBe("static")

	// Test placement mode for static
	await loc.modeSelect.selectOption("gaussian")
	expect(getQueryParam(page, "placement")).toBe("gaussian")

	// Close and reopen to verify persistence
	await loc.modalOverlay.click()
	await expect(loc.modalOverlay).toBeHidden()
	await loc.controlButton.click()
	await expect(loc.visualizationRadio("static")).toBeChecked()
	await expect(loc.modeSelect).toHaveValue("gaussian")

	await loc.modalOverlay.click()
})
