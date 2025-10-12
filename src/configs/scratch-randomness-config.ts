import { resetScratchRandomness } from "../sketches/scratch-randomness"
import {
	type CircleMode,
	getScratchRandomnessConfigFromURL,
	type ScratchRandomnessConfig as ScratchRandomnessSettings,
	updateScratchRandomnessURL,
	type VisualizationType,
	type WalkerMode,
} from "../utils/url-params"
import { BaseConfig } from "./base-config"
import { createConfigButton } from "./config-button"

export class ScratchRandomnessConfigComponent extends BaseConfig<ScratchRandomnessSettings> {
	private controlBtn: HTMLElement | null = null
	private modal: HTMLElement | null = null
	private onSettingsChange?: (settings: ScratchRandomnessSettings) => void

	private currentSettings: ScratchRandomnessSettings =
		getScratchRandomnessConfigFromURL()

	constructor(private container: HTMLElement) {
		super()
		this.createElements()
		this.attachEventListeners()
	}

	private getModeOptions(): string {
		if (this.currentSettings.visualization === "circles") {
			return `
				<option value="gaussian" ${this.currentSettings.circleMode === "gaussian" ? "selected" : ""}>Gaussian</option>
				<option value="random" ${this.currentSettings.circleMode === "random" ? "selected" : ""}>Random</option>
				<option value="mouse" ${this.currentSettings.circleMode === "mouse" ? "selected" : ""}>Follow Mouse</option>
			`
		}
		if (this.currentSettings.visualization === "walker") {
			return `
				<option value="normal" ${this.currentSettings.walkerMode === "normal" ? "selected" : ""}>Normal</option>
				<option value="gaussian" ${this.currentSettings.walkerMode === "gaussian" ? "selected" : ""}>Gaussian</option>
				<option value="accept-reject" ${this.currentSettings.walkerMode === "accept-reject" ? "selected" : ""}>Accept-Reject</option>
				<option value="perlin" ${this.currentSettings.walkerMode === "perlin" ? "selected" : ""}>Perlin Noise</option>
			`
		}
		return ""
	}

	private createElements() {
		// Create control button using shared utility
		this.controlBtn = createConfigButton()

		// Create modal
		this.modal = document.createElement("div")
		this.modal.className = "modal-overlay"
		this.modal.id = "scratch-modal"
		this.modal.style.display = "none"
		this.modal.innerHTML = `
			<div class="modal-content">
				<h3>Configure Randomness Sketch</h3>
				<div class="input-group">
					<div class="input-header">
						<span class="input-label">Visualization Type</span>
					</div>
					<div class="radio-group">
						<label class="radio-label">
							<input type="radio" name="visualization" value="circles" ${this.currentSettings.visualization === "circles" ? "checked" : ""}>
							<span class="radio-text">Circles</span>
						</label>
						<label class="radio-label">
							<input type="radio" name="visualization" value="bars" ${this.currentSettings.visualization === "bars" ? "checked" : ""}>
							<span class="radio-text">Random Distribution Bars</span>
						</label>
						<label class="radio-label">
							<input type="radio" name="visualization" value="walker" ${this.currentSettings.visualization === "walker" ? "checked" : ""}>
							<span class="radio-text">Random Walker</span>
						</label>
						<label class="radio-label">
							<input type="radio" name="visualization" value="pixelNoise" ${this.currentSettings.visualization === "pixelNoise" ? "checked" : ""}>
							<span class="radio-text">Perlin Pixel Noise <em>(slow)</em></span>
						</label>
					</div>
				</div>
				<div class="input-group" id="mode-group" style="display: ${this.currentSettings.visualization === "circles" || this.currentSettings.visualization === "walker" ? "block" : "none"};">
					<div class="input-header">
						<span class="input-label" id="mode-label">${this.currentSettings.visualization === "circles" ? "Circle Mode" : "Walker Mode"}</span>
					</div>
					<select id="mode-select" class="grid-select">
						${this.getModeOptions()}
					</select>
				</div>
				<div class="button-group">
					<button id="reset-btn" class="reset-btn">Reset</button>
				</div>
			</div>
		`

		// Add elements to container and document
		this.container.appendChild(this.controlBtn)
		document.body.appendChild(this.modal)
	}

	private attachEventListeners() {
		this.controlBtn?.addEventListener("click", (event) => {
			event.stopPropagation()
			event.preventDefault()
			this.openModal()
		})

		this.modal?.addEventListener("click", (event) => {
			if (event.target === this.modal) {
				this.closeModal()
			}
		})

		// Add event listeners for radio buttons
		const radioButtons = this.modal?.querySelectorAll(
			'input[name="visualization"]',
		) as NodeListOf<HTMLInputElement>
		radioButtons?.forEach((radio) => {
			radio.addEventListener("change", () => {
				this.updateVisualizationAndMode()
			})
		})

		// Mode select
		const modeSelect = this.modal?.querySelector(
			"#mode-select",
		) as HTMLSelectElement
		modeSelect?.addEventListener("change", () => {
			this.updateSettings()
		})

		// Reset button
		const resetBtn = this.modal?.querySelector(
			"#reset-btn",
		) as HTMLButtonElement
		resetBtn?.addEventListener("click", () => {
			resetScratchRandomness()
		})
	}

	private updateVisualizationAndMode() {
		const selectedRadio = this.modal?.querySelector(
			'input[name="visualization"]:checked',
		) as HTMLInputElement
		const newVisualization = selectedRadio?.value as VisualizationType

		if (newVisualization) {
			this.currentSettings.visualization = newVisualization
			this.updateModeDisplay()
		}

		this.updateSettings()
	}

	private updateModeDisplay() {
		const modeGroup = this.modal?.querySelector("#mode-group") as HTMLElement
		const modeLabel = this.modal?.querySelector("#mode-label") as HTMLElement
		const modeSelect = this.modal?.querySelector(
			"#mode-select",
		) as HTMLSelectElement

		const hasMode =
			this.currentSettings.visualization === "circles" ||
			this.currentSettings.visualization === "walker"

		if (modeGroup && modeLabel && modeSelect) {
			modeGroup.style.display = hasMode ? "block" : "none"

			if (hasMode) {
				if (this.currentSettings.visualization === "circles") {
					modeLabel.textContent = "Circle Mode"
				} else if (this.currentSettings.visualization === "walker") {
					modeLabel.textContent = "Walker Mode"
				}
				modeSelect.innerHTML = this.getModeOptions()
			}
		}
	}

	private updateSettings() {
		const modeSelect = this.modal?.querySelector(
			"#mode-select",
		) as HTMLSelectElement

		if (this.currentSettings.visualization === "circles") {
			this.currentSettings.circleMode =
				(modeSelect?.value as CircleMode) ?? "random"
		} else if (this.currentSettings.visualization === "walker") {
			this.currentSettings.walkerMode =
				(modeSelect?.value as WalkerMode) ?? "normal"
		}

		// Update URL with new settings
		updateScratchRandomnessURL(
			this.currentSettings.visualization,
			this.currentSettings.circleMode,
			this.currentSettings.walkerMode,
		)

		this.onSettingsChange?.(this.currentSettings)
	}

	private openModal() {
		if (this.modal) {
			this.modal.style.display = "flex"
		}
	}

	private closeModal() {
		if (this.modal) {
			this.modal.style.display = "none"
		}
	}

	public show() {
		if (this.controlBtn) {
			this.controlBtn.style.display = "flex"
		}
		updateScratchRandomnessURL(
			this.currentSettings.visualization,
			this.currentSettings.circleMode,
			this.currentSettings.walkerMode,
		)
	}

	public hide() {
		if (this.controlBtn) {
			this.controlBtn.style.display = "none"
		}
	}

	public setOnChange(callback: (settings: ScratchRandomnessSettings) => void) {
		this.onSettingsChange = callback
	}

	public getSettings(): ScratchRandomnessSettings {
		return { ...this.currentSettings }
	}

	public destroy() {
		this.controlBtn?.remove()
		this.modal?.remove()
	}
}
