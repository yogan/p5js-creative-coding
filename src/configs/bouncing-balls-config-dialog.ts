import { sketches } from "../sketches"
import {
	disableOrbitalControls,
	enableOrbitalControls,
} from "../sketches/3d-bouncing-balls"
import { updateSketchConfig } from "../utils/url-params"
import { BaseConfigDialog } from "./base-config-dialog"
import {
	type BouncingBallsConfig,
	getBouncingBallsConfigFromURL,
} from "./bouncing-balls-config"

export class BouncingBallsConfigDialog extends BaseConfigDialog<BouncingBallsConfig> {
	private countSlider!: HTMLInputElement
	private countValue!: HTMLElement

	private onConfigChange?: (config: BouncingBallsConfig) => void
	private currentConfig: BouncingBallsConfig = getBouncingBallsConfigFromURL()

	constructor(container: HTMLElement) {
		super(container)
		this.initialize()
	}

	protected getModalContent(): string {
		return `
			<div class="modal-content">
				<h3>Configure ${sketches["3d-bouncing-balls"].name}</h3>
				<div class="input-group">
					<div class="input-header">
						<span class="input-label">Number of Balls</span>
						<span id="ball-count-value" class="input-value">${this.currentConfig.count}</span>
					</div>
					<div class="slider-container">
						<span class="slider-label">2</span>
						<input type="range" id="ball-count-slider" min="2" max="15" step="1" value="${this.currentConfig.count}" class="range-slider">
						<span class="slider-label">15</span>
					</div>
				</div>
			</div>
		`
	}

	protected queryElements() {
		// biome-ignore-start lint/style/noNonNullAssertion: see getModalContent()
		this.countSlider = this.modal.querySelector("#ball-count-slider")!
		this.countValue = this.modal.querySelector("#ball-count-value")!
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

		// Ball count slider
		this.countSlider.addEventListener("input", () => {
			this.updateConfig()
		})
	}

	private updateConfig() {
		this.currentConfig.count = parseInt(this.countSlider.value, 10)
		this.countValue.textContent = this.currentConfig.count.toString()
		this.updateURL()
		this.onConfigChange?.(this.currentConfig)
	}

	protected openModal() {
		// Update current config from URL
		this.currentConfig = getBouncingBallsConfigFromURL()

		// Update slider and display
		this.countSlider.value = this.currentConfig.count.toString()
		this.countValue.textContent = this.currentConfig.count.toString()

		// Disable orbital controls to prevent camera movement while using slider
		disableOrbitalControls()

		this.modal.style.display = "flex"
	}

	protected closeModal() {
		super.closeModal()
		enableOrbitalControls()
	}

	public setOnChange(callback: (config: BouncingBallsConfig) => void) {
		this.onConfigChange = callback
	}

	public getConfig(): BouncingBallsConfig {
		return { ...this.currentConfig }
	}

	protected updateURL() {
		updateSketchConfig("3d-bouncing-balls", this.currentConfig)
	}
}
