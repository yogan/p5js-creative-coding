import { restartScratchRandomness } from "../sketches/scratch-randomness"
import { updateSketchConfig } from "../utils/url-params"
import { BaseConfigDialog } from "./base-config-dialog"

import {
	type CircleMode,
	getScratchRandomnessConfigFromURL,
	type ScratchRandomnessConfig,
	type VisualizationType,
	type WalkerMode,
} from "./scratch-randomness-config"

export class ScratchRandomnessConfigDialog extends BaseConfigDialog<ScratchRandomnessConfig> {
	private radioButtons!: NodeListOf<HTMLInputElement>
	private modeSelect!: HTMLSelectElement
	private resetBtn!: HTMLButtonElement
	private modeGroup!: HTMLElement
	private modeLabel!: HTMLElement

	private onConfigChange?: (config: ScratchRandomnessConfig) => void
	private currentConfig: ScratchRandomnessConfig =
		getScratchRandomnessConfigFromURL()

	constructor(container: HTMLElement) {
		super(container)
		this.initialize()
	}

	protected getModalContent(): string {
		return `
			<div class="modal-content">
				<h3>Configure Randomness Sketch</h3>
				<div class="input-group">
					<div class="input-header">
						<span class="input-label">Visualization Type</span>
					</div>
					<div class="radio-group">
						<label class="radio-label">
							<input type="radio" name="visualization" value="circles">
							<span class="radio-text">Circles</span>
						</label>
						<label class="radio-label">
							<input type="radio" name="visualization" value="bars">
							<span class="radio-text">Random Distribution Bars</span>
						</label>
						<label class="radio-label">
							<input type="radio" name="visualization" value="walker">
							<span class="radio-text">Random Walker</span>
						</label>
						<label class="radio-label">
							<input type="radio" name="visualization" value="pixelNoise">
							<span class="radio-text">Perlin Pixel Noise <em>(slow)</em></span>
						</label>
					</div>
				</div>
				<div class="input-group" id="mode-group">
					<div class="input-header">
						<span class="input-label" id="mode-label">Mode</span>
					</div>
					<select id="mode-select" class="grid-select">
						<!-- Circle mode options -->
						<option value="gaussian" data-visualization="circles">Gaussian</option>
						<option value="random" data-visualization="circles">Random</option>
						<option value="mouse" data-visualization="circles">Follow Mouse</option>
						<!-- Walker mode options -->
						<option value="normal" data-visualization="walker">Normal</option>
						<option value="gaussian" data-visualization="walker">Gaussian</option>
						<option value="accept-reject" data-visualization="walker">Accept-Reject</option>
						<option value="perlin" data-visualization="walker">Perlin Noise</option>
					</select>
				</div>
				<div class="button-group">
					<button id="reset-btn" class="reset-btn">Reset</button>
				</div>
			</div>
		`
	}

	protected queryElements() {
		this.radioButtons = this.modal.querySelectorAll(
			'input[name="visualization"]',
		)
		// biome-ignore-start lint/style/noNonNullAssertion: see getModalContent()
		this.modeSelect = this.modal.querySelector("#mode-select")!
		this.resetBtn = this.modal.querySelector("#reset-btn")!
		this.modeGroup = this.modal.querySelector("#mode-group")!
		this.modeLabel = this.modal.querySelector("#mode-label")!
		// biome-ignore-end lint/style/noNonNullAssertion: see getModalContent()
	}

	protected attachEventListeners() {
		this.controlBtn.addEventListener("click", (event) => {
			event.stopPropagation()
			event.preventDefault()
			this.openModal()
		})

		this.modal.addEventListener("click", (event) => {
			if (event.target === this.modal) {
				this.closeModal()
			}
		})

		// Add event listeners for radio buttons
		this.radioButtons.forEach((radio) => {
			radio.addEventListener("change", () => {
				this.updateVisualizationAndMode()
			})
		})

		// Mode select
		this.modeSelect.addEventListener("change", () => {
			this.updateConfig()
		})

		// Reset button
		this.resetBtn.addEventListener("click", () => {
			restartScratchRandomness()
		})
	}

	private updateVisualizationAndMode() {
		const selectedRadio = this.modal.querySelector(
			'input[name="visualization"]:checked',
		) as HTMLInputElement
		const newVisualization = selectedRadio.value as VisualizationType

		this.currentConfig.visualization = newVisualization
		this.updateModeDisplay()
		this.updateConfig()
	}

	private updateModeDisplay() {
		const hasMode =
			this.currentConfig.visualization === "circles" ||
			this.currentConfig.visualization === "walker"

		this.modeGroup.style.display = hasMode ? "block" : "none"

		if (hasMode) {
			if (this.currentConfig.visualization === "circles") {
				this.modeLabel.textContent = "Circle Mode"
			} else if (this.currentConfig.visualization === "walker") {
				this.modeLabel.textContent = "Walker Mode"
			}

			// Show/hide options based on visualization type
			const options = this.modeSelect.querySelectorAll(
				"option",
			) as NodeListOf<HTMLOptionElement>
			options.forEach((option) => {
				const visualizationType = option.getAttribute("data-visualization")
				option.style.display =
					visualizationType === this.currentConfig.visualization
						? "block"
						: "none"
			})

			// Set selected value
			if (this.currentConfig.visualization === "circles") {
				this.modeSelect.value = this.currentConfig.circleMode || "random"
			} else if (this.currentConfig.visualization === "walker") {
				this.modeSelect.value = this.currentConfig.walkerMode || "normal"
			}
		}
	}

	private updateConfig() {
		if (this.currentConfig.visualization === "circles") {
			this.currentConfig.circleMode = this.modeSelect.value as CircleMode
		} else if (this.currentConfig.visualization === "walker") {
			this.currentConfig.walkerMode = this.modeSelect.value as WalkerMode
		}

		this.updateURL()
		this.onConfigChange?.(this.currentConfig)
	}

	protected openModal() {
		// Update current config from URL
		this.currentConfig = getScratchRandomnessConfigFromURL()

		// Update visualization radio buttons
		this.radioButtons.forEach((radio) => {
			radio.checked = radio.value === this.currentConfig.visualization
		})

		// Update mode display
		this.updateModeDisplay()

		this.modal.style.display = "flex"
	}

	public setOnChange(callback: (config: ScratchRandomnessConfig) => void) {
		this.onConfigChange = callback
	}

	public getConfig(): ScratchRandomnessConfig {
		return { ...this.currentConfig }
	}

	protected updateURL() {
		updateSketchConfig("scratch-randomness", {
			visualization: this.currentConfig.visualization,
			circleMode: this.currentConfig.circleMode,
			walkerMode: this.currentConfig.walkerMode,
		})
	}
}
