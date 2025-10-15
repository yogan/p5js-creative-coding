import { expect, test } from "@playwright/test"
import { sketchNames } from "../src/sketches"
import { createPageLocators } from "./page-objects"

const sketches = {
	"3d-bouncing-balls": { hasConfig: true },
	"cellular-automaton": { hasConfig: true },
	"dragon-curve": { hasConfig: false },
	"dragon-curve-anim": { hasConfig: false },
	"koch-island": { hasConfig: false },
	landscape: { hasConfig: true },
	"random-circles": { hasConfig: true },
} as const

const sketchesWithConfigs = Object.entries(sketches)
	.filter(([, config]) => config.hasConfig)
	.map(([sketchName]) => sketchName)

test("Menu navigation and button visibility", async ({ page }) => {
	const loc = createPageLocators(page)

	// Wait for page to load
	await page.goto("/")
	await expect(loc.canvas).toBeVisible()

	// Check that the hamburger menu button is always visible
	await expect(loc.menuButton).toBeVisible()

	for (const sketchName of sketchNames) {
		// Open menu
		await loc.menuButton.click()
		await expect(loc.menuDropdown).toBeVisible()

		// Click on menu entry (button with data-sketch attribute)
		const menuItem = loc.menuItem(sketchName)
		await expect(menuItem).toBeVisible()
		await menuItem.click()

		// Check that menu is hidden after click
		await expect(loc.menuDropdown).toBeHidden()

		// Check that URL has correct sketch parameter
		expect(new URL(page.url()).searchParams.get("sketch")).toBe(sketchName)

		// Wait for sketch to load
		await expect(loc.canvas).toBeVisible()

		// Check control button visibility based on sketch config
		if (sketches[sketchName].hasConfig) {
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
		const highlightedItem = loc.highlightedMenuItem(sketchName)
		await expect(highlightedItem).toBeVisible()

		// Close menu by clicking outside (click on menu overlay)
		await loc.menuOverlay.click()
		await expect(loc.menuDropdown).toBeHidden()
	}
})

sketchesWithConfigs.forEach((sketchName) => {
	test(`Config dialog for ${sketchName}`, async ({ page }) => {
		const loc = createPageLocators(page)

		// Navigate directly to the sketch
		await page.goto(`/?sketch=${sketchName}`)

		// Wait for sketch to load and config button to be visible
		await expect(loc.canvas).toBeVisible()
		await expect(loc.controlButton).toBeVisible()

		// Click the config button to open dialog
		await loc.controlButton.click()

		// Check that the modal overlay is visible
		await expect(loc.modalOverlay).toBeVisible()

		// Close the dialog by clicking on the overlay (outside the modal content)
		await loc.modalOverlay.click()

		// Check that dialog is no longer visible
		await expect(loc.modalOverlay).toBeHidden()
	})
})
