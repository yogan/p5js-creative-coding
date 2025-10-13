import { resetScratchRandomness } from "../sketches/scratch-randomness"
import { updateSketchConfig } from "../utils/url-params"
import { BaseConfig } from "./base-config"
import { createConfigButton } from "./config-button"
import {
	type CircleMode,
	getScratchRandomnessConfigFromURL,
	type ScratchRandomnessConfig,
	type VisualizationType,
	type WalkerMode,
} from "./scratch-randomness-config"

export class ScratchRandomnessConfigDialog extends BaseConfig<ScratchRandomnessConfig> {
	private controlBtn: HTMLElement | null = null
	private modal: HTMLElement | null = null
	private onConfigChange?: (config: ScratchRandomnessConfig) => void

	private currentConfig: ScratchRandomnessConfig =
		getScratchRandomnessConfigFromURL()

	constructor(private container: HTMLElement) {
		super()
		this.createElements()
		this.attachEventListeners()
	}

	private getModeOptions(): string {
		if (this.currentConfig.visualization === "circles") {
			return `
				<option value="gaussian" ${this.currentConfig.circleMode === "gaussian" ? "selected" : ""}>Gaussian</option>
				<option value="random" ${this.currentConfig.circleMode === "random" ? "selected" : ""}>Random</option>
				<option value="mouse" ${this.currentConfig.circleMode === "mouse" ? "selected" : ""}>Follow Mouse</option>
			`
		}
		if (this.currentConfig.visualization === "walker") {
			return `
				<option value="normal" ${this.currentConfig.walkerMode === "normal" ? "selected" : ""}>Normal</option>
				<option value="gaussian" ${this.currentConfig.walkerMode === "gaussian" ? "selected" : ""}>Gaussian</option>
				<option value="accept-reject" ${this.currentConfig.walkerMode === "accept-reject" ? "selected" : ""}>Accept-Reject</option>
				<option value="perlin" ${this.currentConfig.walkerMode === "perlin" ? "selected" : ""}>Perlin Noise</option>
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
							<input type="radio" name="visualization" value="circles" ${this.currentConfig.visualization === "circles" ? "checked" : ""}>
							<span class="radio-text">Circles</span>
						</label>
						<label class="radio-label">
							<input type="radio" name="visualization" value="bars" ${this.currentConfig.visualization === "bars" ? "checked" : ""}>
							<span class="radio-text">Random Distribution Bars</span>
						</label>
						<label class="radio-label">
							<input type="radio" name="visualization" value="walker" ${this.currentConfig.visualization === "walker" ? "checked" : ""}>
							<span class="radio-text">Random Walker</span>
						</label>
						<label class="radio-label">
							<input type="radio" name="visualization" value="pixelNoise" ${this.currentConfig.visualization === "pixelNoise" ? "checked" : ""}>
							<span class="radio-text">Perlin Pixel Noise <em>(slow)</em></span>
						</label>
					</div>
				</div>
				<div class="input-group" id="mode-group" style="display: ${this.currentConfig.visualization === "circles" || this.currentConfig.visualization === "walker" ? "block" : "none"};">
					<div class="input-header">
						<span class="input-label" id="mode-label">${this.currentConfig.visualization === "circles" ? "Circle Mode" : "Walker Mode"}</span>
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
			this.updateConfig()
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
			this.currentConfig.visualization = newVisualization
			this.updateModeDisplay()
		}

		this.updateConfig()
	}

	private updateModeDisplay() {
		const modeGroup = this.modal?.querySelector("#mode-group") as HTMLElement
		const modeLabel = this.modal?.querySelector("#mode-label") as HTMLElement
		const modeSelect = this.modal?.querySelector(
			"#mode-select",
		) as HTMLSelectElement

		const hasMode =
			this.currentConfig.visualization === "circles" ||
			this.currentConfig.visualization === "walker"

		if (modeGroup && modeLabel && modeSelect) {
			modeGroup.style.display = hasMode ? "block" : "none"

			if (hasMode) {
				if (this.currentConfig.visualization === "circles") {
					modeLabel.textContent = "Circle Mode"
				} else if (this.currentConfig.visualization === "walker") {
					modeLabel.textContent = "Walker Mode"
				}
				modeSelect.innerHTML = this.getModeOptions()
			}
		}
	}

	private updateConfig() {
		const modeSelect = this.modal?.querySelector(
			"#mode-select",
		) as HTMLSelectElement

		if (this.currentConfig.visualization === "circles") {
			this.currentConfig.circleMode =
				(modeSelect?.value as CircleMode) ?? "random"
		} else if (this.currentConfig.visualization === "walker") {
			this.currentConfig.walkerMode =
				(modeSelect?.value as WalkerMode) ?? "normal"
		}

		this.updateURL()

		this.onConfigChange?.(this.currentConfig)
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
		this.updateURL()
	}

	public hide() {
		if (this.controlBtn) {
			this.controlBtn.style.display = "none"
		}
	}

	public setOnChange(callback: (config: ScratchRandomnessConfig) => void) {
		this.onConfigChange = callback
	}

	public getConfig(): ScratchRandomnessConfig {
		return { ...this.currentConfig }
	}

	public destroy() {
		this.controlBtn?.remove()
		this.modal?.remove()
	}

	private updateURL() {
		updateSketchConfig("scratch-randomness", {
			visualization: this.currentConfig.visualization,
			circleMode: this.currentConfig.circleMode,
			walkerMode: this.currentConfig.walkerMode,
		})
	}
}
