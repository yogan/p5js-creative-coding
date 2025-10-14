import { expect, test } from "@playwright/test"
import { sketchNames } from "../src/utils/url-params"

// Configuration: sketches that have config dialogs and should show the control button
const sketchConfig = {
	"3d-bouncing-balls": { hasConfig: true },
	"cellular-automaton": { hasConfig: true },
	"dragon-curve": { hasConfig: false },
	"dragon-curve-anim": { hasConfig: false },
	"koch-island": { hasConfig: false },
	landscape: { hasConfig: true },
	"random-circles": { hasConfig: true },
} as const

// Page object helper for common locators
const createPageLocators = (page: any) => ({
	canvas: page.locator("#sketch-container canvas"),
	menuButton: page.locator("#hamburger-btn"),
	controlButton: page.locator("#control-btn"),
	menuDropdown: page.locator("#menu-dropdown"),
	menuOverlay: page.locator("#menu-overlay"),
	menuItem: (sketchName: string) =>
		page.locator(`button[data-sketch="${sketchName}"]`),
	highlightedMenuItem: (sketchName: string) =>
		page.locator(`button[data-sketch="${sketchName}"].active`),
})

test("menu navigation, highlighting, and button visibility", async ({
	page,
}) => {
	// Start on home page
	await page.goto("/")

	const locators = createPageLocators(page)

	// Wait for page to load
	await expect(locators.canvas).toBeVisible()

	// Check that the hamburger menu button is always visible
	await expect(locators.menuButton).toBeVisible()

	for (const sketchName of sketchNames) {
		// Open menu
		await locators.menuButton.click()
		await expect(locators.menuDropdown).toBeVisible()

		// Click on menu entry (button with data-sketch attribute)
		const menuItem = locators.menuItem(sketchName)
		await expect(menuItem).toBeVisible()
		await menuItem.click()

		// Check that menu is hidden after click
		await expect(locators.menuDropdown).toBeHidden()

		// Check that URL has correct sketch parameter
		const url = new URL(page.url())
		expect(url.searchParams.get("sketch")).toBe(sketchName)

		// Wait for sketch to load
		await expect(locators.canvas).toBeVisible()

		// Check control button visibility based on sketch config
		await expect(locators.controlButton).toBeAttached() // Always exists in DOM
		const config = sketchConfig[sketchName as keyof typeof sketchConfig]

		if (config.hasConfig) {
			// Should be visible for sketches with config
			await expect(locators.controlButton).toBeVisible()
		} else {
			// Should be hidden for sketches without config
			await expect(locators.controlButton).toBeHidden()
		}

		// Open menu again and check highlighting
		await locators.menuButton.click()
		await expect(locators.menuDropdown).toBeVisible()

		// Check that the current sketch is highlighted
		const highlightedItem = locators.highlightedMenuItem(sketchName)
		await expect(highlightedItem).toBeVisible()

		// Close menu by clicking outside (click on menu overlay)
		await locators.menuOverlay.click()
		await expect(locators.menuDropdown).toBeHidden()
	}
})
