import { expect, test } from "@playwright/test"
import { sketchNames } from "../src/utils/url-params"

// Sketches that have config dialogs and should show the control button
const sketchesWithConfig = new Set([
	"3d-bouncing-balls",
	"cellular-automaton",
	"random-circles",
	"landscape",
])

for (const sketchName of sketchNames) {
	test(`sketch ${sketchName} - button visibility`, async ({ page }) => {
		// Navigate to the page with the sketch parameter
		await page.goto(`/?sketch=${sketchName}`)

		// Wait for the page to load and sketch to initialize
		await page.waitForSelector("#sketch-container canvas", { timeout: 10000 })

		// Check that the hamburger menu button exists and is visible
		const menuButton = page.locator("#hamburger-btn")
		await expect(menuButton).toBeVisible()

		// Check the control button based on whether this sketch has config
		const controlButton = page.locator("#control-btn")
		await expect(controlButton).toBeAttached() // Always exists in DOM

		if (sketchesWithConfig.has(sketchName)) {
			// Should be visible for sketches with config
			await expect(controlButton).toBeVisible()
		} else {
			// Should be hidden for sketches without config
			await expect(controlButton).toBeHidden()
		}
	})
}
