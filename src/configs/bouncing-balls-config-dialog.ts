import { updateSketchConfig } from "../utils/url-params"
import { BaseConfigDialog } from "./base-config-dialog"
import {
	type BouncingBallsConfig,
	getBouncingBallsConfigFromURL,
} from "./bouncing-balls-config"

export class BouncingBallsConfigDialog extends BaseConfigDialog<BouncingBallsConfig> {
	private ballCountSlider!: HTMLInputElement
	private ballCountValue!: HTMLElement

	private onConfigChange?: (config: BouncingBallsConfig) => void
	private currentConfig: BouncingBallsConfig = getBouncingBallsConfigFromURL()

	constructor(container: HTMLElement) {
		super(container)
		this.initialize()
	}

	protected getModalContent(): string {
		return `
			<div class="modal-content">
				<h3>Configure 3D Bouncing Balls</h3>
				<div class="input-group">
					<div class="input-header">
						<span class="input-label">Number of Balls</span>
						<span id="ball-count-value" class="input-value">${this.currentConfig.ballCount}</span>
					</div>
					<div class="slider-container">
						<span class="slider-label">2</span>
						<input type="range" id="ball-count-slider" min="2" max="10" step="1" value="${this.currentConfig.ballCount}" class="range-slider">
						<span class="slider-label">10</span>
					</div>
				</div>
			</div>
		`
	}

	protected queryElements() {
		// biome-ignore-start lint/style/noNonNullAssertion: see getModalContent()
		this.ballCountSlider = this.modal.querySelector("#ball-count-slider")!
		this.ballCountValue = this.modal.querySelector("#ball-count-value")!
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
		this.ballCountSlider.addEventListener("input", () => {
			this.updateConfig()
		})
	}

	private updateConfig() {
		this.currentConfig.ballCount = parseInt(this.ballCountSlider.value, 10)
		this.ballCountValue.textContent = this.currentConfig.ballCount.toString()
		this.updateURL()
		this.onConfigChange?.(this.currentConfig)
	}

	protected openModal() {
		// Update current config from URL
		this.currentConfig = getBouncingBallsConfigFromURL()

		// Update slider and display
		this.ballCountSlider.value = this.currentConfig.ballCount.toString()
		this.ballCountValue.textContent = this.currentConfig.ballCount.toString()

		this.modal.style.display = "flex"
	}

	public setOnChange(callback: (config: BouncingBallsConfig) => void) {
		this.onConfigChange = callback
	}

	public getConfig(): BouncingBallsConfig {
		return { ...this.currentConfig }
	}

	protected updateURL() {
		updateSketchConfig("3d-bouncing-balls", {
			ballCount: this.currentConfig.ballCount,
		})
	}
}
