import type { Page } from "@playwright/test"

export const createPageLocators = (page: Page) => ({
	canvas: page.locator("#sketch-container canvas"),
	menuButton: page.locator("#hamburger-btn"),
	controlButton: page.locator("#control-btn"),
	menuDropdown: page.locator("#menu-dropdown"),
	menuOverlay: page.locator("#menu-overlay"),
	modalOverlay: page.locator(".modal-overlay"),
	menuItem: (sketchName: string) =>
		page.locator(`button[data-sketch="${sketchName}"]`),
	highlightedMenuItem: (sketchName: string) =>
		page.locator(`button[data-sketch="${sketchName}"].active`),
})
