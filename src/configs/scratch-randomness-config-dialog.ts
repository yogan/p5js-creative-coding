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
	private walkerCountGroup!: HTMLElement
	private walkerCountSlider!: HTMLInputElement
	private walkerCountValue!: HTMLElement
	private mouseAttractionGroup!: HTMLElement
	private mouseAttractionSlider!: HTMLInputElement
	private mouseAttractionValue!: HTMLElement
	private mouseMaxSpeedGroup!: HTMLElement
	private mouseMaxSpeedSlider!: HTMLInputElement
	private mouseMaxSpeedValue!: HTMLElement

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
							<input type="radio" name="visualization" value="walker">
							<span class="radio-text">Random Walkers</span>
						</label>
						<label class="radio-label">
							<input type="radio" name="visualization" value="pixelNoise">
							<span class="radio-text">Perlin Pixel Noise <em>(slow)</em></span>
						</label>
					</div>
				</div>
				<div class="input-group" id="walker-count-group">
					<div class="input-header">
						<span class="input-label">Walker Count </span>
						<span class="input-value" id="walker-count-value">10</span>
					</div>
					<input type="range" id="walker-count-slider" min="1" max="25" value="10" class="range-slider" style="width: 100%;">
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
						<option value="perlin" data-visualization="walker">Perlin Noise</option>
						<option value="perlin-accelerated" data-visualization="walker">Perlin Noise (Accelerated)</option>
						<option value="gaussian" data-visualization="walker">Gaussian</option>
						<option value="accept-reject" data-visualization="walker">Accept-Reject</option>
						<option value="mouse" data-visualization="walker">Follow Mouse</option>
					</select>
				</div>
				<div class="input-group" id="mouse-attraction-group">
					<div class="input-header">
						<span class="input-label">Attraction </span>
						<span class="input-value" id="mouse-attraction-value">10</span>
					</div>
					<input type="range" id="mouse-attraction-slider" min="1" max="100" value="10" class="range-slider" style="width: 100%;">
				</div>
				<div class="input-group" id="mouse-max-speed-group">
					<div class="input-header">
						<span class="input-label">Max Speed </span>
						<span class="input-value" id="mouse-max-speed-value">5</span>
					</div>
					<input type="range" id="mouse-max-speed-slider" min="1" max="20" value="5" class="range-slider" style="width: 100%;">
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
		this.walkerCountGroup = this.modal.querySelector("#walker-count-group")!
		this.walkerCountSlider = this.modal.querySelector("#walker-count-slider")!
		this.walkerCountValue = this.modal.querySelector("#walker-count-value")!
		this.mouseAttractionGroup = this.modal.querySelector(
			"#mouse-attraction-group",
		)!
		this.mouseAttractionSlider = this.modal.querySelector(
			"#mouse-attraction-slider",
		)!
		this.mouseAttractionValue = this.modal.querySelector(
			"#mouse-attraction-value",
		)!
		this.mouseMaxSpeedGroup = this.modal.querySelector(
			"#mouse-max-speed-group",
		)!
		this.mouseMaxSpeedSlider = this.modal.querySelector(
			"#mouse-max-speed-slider",
		)!
		this.mouseMaxSpeedValue = this.modal.querySelector(
			"#mouse-max-speed-value",
		)!
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

		// Walker count slider
		this.walkerCountSlider.addEventListener("input", () => {
			const count = Number.parseInt(this.walkerCountSlider.value, 10)
			this.walkerCountValue.textContent = count.toString()
			this.currentConfig.walkerCount = count
			this.updateConfig()
		})

		// Mouse attraction slider
		this.mouseAttractionSlider.addEventListener("input", () => {
			const attraction = Number.parseFloat(this.mouseAttractionSlider.value)
			this.mouseAttractionValue.textContent = attraction.toString()
			this.currentConfig.mouseAttraction = attraction
			this.updateConfig()
		})

		// Mouse max speed slider
		this.mouseMaxSpeedSlider.addEventListener("input", () => {
			const maxSpeed = Number.parseFloat(this.mouseMaxSpeedSlider.value)
			this.mouseMaxSpeedValue.textContent = maxSpeed.toString()
			this.currentConfig.mouseMaxSpeed = maxSpeed
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

		// Show walker count only for walker visualization
		const showWalkerCount = this.currentConfig.visualization === "walker"
		this.walkerCountGroup.style.display = showWalkerCount ? "block" : "none"

		// Show mouse-specific controls only for walker visualization with mouse mode
		const showMouseControls =
			this.currentConfig.visualization === "walker" &&
			this.currentConfig.walkerMode === "mouse"
		this.mouseAttractionGroup.style.display = showMouseControls
			? "block"
			: "none"
		this.mouseMaxSpeedGroup.style.display = showMouseControls ? "block" : "none"

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
				this.modeSelect.value = this.currentConfig.walkerMode || "perlin"
			}
		}
	}

	private updateConfig() {
		if (this.currentConfig.visualization === "circles") {
			this.currentConfig.circleMode = this.modeSelect.value as CircleMode
		} else if (this.currentConfig.visualization === "walker") {
			this.currentConfig.walkerMode = this.modeSelect.value as WalkerMode
		}

		// Update visibility after mode changes
		this.updateModeDisplay()

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

		// Update walker count slider and display
		this.walkerCountSlider.value = this.currentConfig.walkerCount.toString()
		this.walkerCountValue.textContent =
			this.currentConfig.walkerCount.toString()

		// Update mouse sliders and display
		this.mouseAttractionSlider.value =
			this.currentConfig.mouseAttraction.toString()
		this.mouseAttractionValue.textContent =
			this.currentConfig.mouseAttraction.toString()
		this.mouseMaxSpeedSlider.value = this.currentConfig.mouseMaxSpeed.toString()
		this.mouseMaxSpeedValue.textContent =
			this.currentConfig.mouseMaxSpeed.toString()

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
			walkerCount: this.currentConfig.walkerCount,
			attraction: this.currentConfig.mouseAttraction,
			maxSpeed: this.currentConfig.mouseMaxSpeed,
		})
	}
}
