import { restartRandomCircles } from "../sketches/random-circles"
import { updateSketchConfig } from "../utils/url-params"
import { BaseConfigDialog } from "./base-config-dialog"

import {
	type CircleMode,
	getRandomCirclesConfigFromURL,
	type RandomCirclesConfig,
	type VisualizationType,
	type WalkerMode,
} from "./random-circles-config"

export class RandomCirclesConfigDialog extends BaseConfigDialog<RandomCirclesConfig> {
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

	private onConfigChange?: (config: RandomCirclesConfig) => void
	private currentConfig: RandomCirclesConfig = getRandomCirclesConfigFromURL()

	constructor(container: HTMLElement) {
		super(container)
		this.initialize()
	}

	protected getModalContent(): string {
		return `
			<div class="modal-content">
				<h3>Configure Random Circles</h3>
				<div class="input-group">
					<div class="input-header">
						<span class="input-label">Circle Type</span>
					</div>
					<div class="radio-group horizontal">
						<label class="radio-label">
							<input type="radio" name="visualization" value="static">
							<span class="radio-text">Static</span>
						</label>

						<label class="radio-label">
							<input type="radio" name="visualization" value="moving">
							<span class="radio-text">Moving</span>
						</label>

					</div>
				</div>
				<div class="input-group" id="mode-group">
					<div class="input-header">
						<span class="input-label" id="mode-label">Mode</span>
					</div>
					<select id="mode-select" class="grid-select">
						<!-- Static circle options -->
						<option value="gaussian" data-visualization="static">Gaussian</option>
						<option value="random" data-visualization="static">Random</option>
						<option value="mouse" data-visualization="static">Follow Mouse</option>
						<!-- Moving circle options -->
						<option value="perlin" data-visualization="moving">Perlin Noise</option>
						<option value="perlin-accelerated" data-visualization="moving">Perlin Noise (Accelerated)</option>
						<option value="gaussian" data-visualization="moving">Gaussian</option>
						<option value="accept-reject" data-visualization="moving">Accept-Reject</option>
						<option value="mouse" data-visualization="moving">Follow Mouse</option>
					</select>
				</div>
				<div class="input-group" id="mouse-attraction-group">
					<div class="input-header">
						<span class="input-label">Attraction </span>
						<span class="input-value" id="mouse-attraction-value">10%</span>
					</div>
					<input type="range" id="mouse-attraction-slider" min="1" max="100" value="10" class="range-slider" style="width: 100%;">
				</div>
				<div class="input-group" id="mouse-max-speed-group">
					<div class="input-header">
						<span class="input-label">Speed </span>
						<span class="input-value" id="mouse-max-speed-value">5</span>
					</div>
					<input type="range" id="mouse-max-speed-slider" min="1" max="20" value="5" class="range-slider" style="width: 100%;">
				</div>
				<div class="input-group" id="walker-count-group">
					<div class="input-header">
						<span class="input-label">Number of Circles </span>
						<span class="input-value" id="walker-count-value">10</span>
					</div>
					<input type="range" id="walker-count-slider" min="1" max="25" value="10" class="range-slider" style="width: 100%;">
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
			this.mouseAttractionValue.textContent = `${attraction}%`
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
			restartRandomCircles()
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
			this.currentConfig.visualization === "static" ||
			this.currentConfig.visualization === "moving"

		this.modeGroup.style.display = hasMode ? "block" : "none"

		// Show walker count only for moving visualization
		const showWalkerCount = this.currentConfig.visualization === "moving"
		this.walkerCountGroup.style.display = showWalkerCount ? "block" : "none"

		// Show mouse-specific controls only for moving visualization with mouse mode
		const showMouseControls =
			this.currentConfig.visualization === "moving" &&
			this.currentConfig.walkerMode === "mouse"
		this.mouseAttractionGroup.style.display = showMouseControls
			? "block"
			: "none"
		this.mouseMaxSpeedGroup.style.display = showMouseControls ? "block" : "none"

		if (hasMode) {
			if (this.currentConfig.visualization === "static") {
				this.modeLabel.textContent = "Placement"
			} else if (this.currentConfig.visualization === "moving") {
				this.modeLabel.textContent = "Behavior"
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
			if (this.currentConfig.visualization === "static") {
				this.modeSelect.value = this.currentConfig.circleMode || "random"
			} else if (this.currentConfig.visualization === "moving") {
				this.modeSelect.value = this.currentConfig.walkerMode || "perlin"
			}
		}
	}

	private updateConfig() {
		if (this.currentConfig.visualization === "static") {
			this.currentConfig.circleMode = this.modeSelect.value as CircleMode
		} else if (this.currentConfig.visualization === "moving") {
			this.currentConfig.walkerMode = this.modeSelect.value as WalkerMode
		}

		// Update visibility after mode changes
		this.updateModeDisplay()

		this.updateURL()
		this.onConfigChange?.(this.currentConfig)
	}

	protected openModal() {
		// Update current config from URL
		this.currentConfig = getRandomCirclesConfigFromURL()

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
		this.mouseAttractionValue.textContent = `${this.currentConfig.mouseAttraction}%`
		this.mouseMaxSpeedSlider.value = this.currentConfig.mouseMaxSpeed.toString()
		this.mouseMaxSpeedValue.textContent =
			this.currentConfig.mouseMaxSpeed.toString()

		// Update mode display
		this.updateModeDisplay()

		this.modal.style.display = "flex"
	}

	public setOnChange(callback: (config: RandomCirclesConfig) => void) {
		this.onConfigChange = callback
	}

	public getConfig(): RandomCirclesConfig {
		return { ...this.currentConfig }
	}

	protected updateURL() {
		updateSketchConfig("random-circles", {
			visualization: this.currentConfig.visualization,
			circleMode: this.currentConfig.circleMode,
			walkerMode: this.currentConfig.walkerMode,
			walkerCount: this.currentConfig.walkerCount,
			attraction: this.currentConfig.mouseAttraction,
			maxSpeed: this.currentConfig.mouseMaxSpeed,
		})
	}
}
