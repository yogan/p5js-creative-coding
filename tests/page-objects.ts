import type { Page } from "@playwright/test"
import type { SketchId } from "../src/sketches"

export const createPageLocators = (page: Page) => ({
	canvas: page.locator("#sketch-container canvas"),
	menuButton: page.locator("#hamburger-btn"),
	controlButton: page.locator("#control-btn"),
	menuDropdown: page.locator("#menu-dropdown"),
	menuOverlay: page.locator("#menu-overlay"),
	modalOverlay: page.locator(".modal-overlay"),
	menuItem: (id: SketchId) => page.locator(`button[data-sketch="${id}"]`),
	highlightedMenuItem: (id: SketchId) =>
		page.locator(`button[data-sketch="${id}"].active`),
})
