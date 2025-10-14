export function getConfigButton(): HTMLButtonElement {
	const button = document.getElementById("control-btn") as HTMLButtonElement
	if (!button) {
		throw new Error("Control button not found in DOM")
	}
	return button
}

export function showConfigButton(): void {
	const button = getConfigButton()
	button.style.display = "flex"
}

export function hideConfigButton(): void {
	const button = getConfigButton()
	button.style.display = "none"
}

export function setConfigButtonHandler(handler: () => void): void {
	const button = getConfigButton()

	// Remove any existing click handlers by cloning the button
	const newButton = button.cloneNode(true) as HTMLButtonElement
	button.parentNode?.replaceChild(newButton, button)

	// Add the new handler
	newButton.addEventListener("click", handler)
}
