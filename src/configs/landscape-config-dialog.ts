import { updateSketchConfig } from "../utils/url-params"
import { BaseConfigDialog } from "./base-config-dialog"

import {
	getLandscapeConfigFromURL,
	type LandscapeCamera,
	type LandscapeConfig,
	type LandscapeMesh,
} from "./landscape-config"

export class LandscapeConfigDialog extends BaseConfigDialog<LandscapeConfig> {
	private meshRadios!: NodeListOf<HTMLInputElement>
	private cameraRadios!: NodeListOf<HTMLInputElement>
	private speedSlider!: HTMLInputElement
	private roughnessSlider!: HTMLInputElement

	private onConfigChange?: (config: LandscapeConfig) => void
	private currentConfig: LandscapeConfig = getLandscapeConfigFromURL()

	constructor(container: HTMLElement) {
		super(container)
		this.initialize()
	}

	protected getModalContent(): string {
		return `
			<div class="modal-content">
				<h3>Configure Landscape</h3>
				<div class="input-group">
					<div class="input-header">
						<span class="input-label">Mesh Type</span>
					</div>
					<div class="radio-group horizontal">
						<label class="radio-label">
							<input type="radio" name="mesh" value="triangles">
							<span class="radio-text">Triangles</span>
						</label>
						<label class="radio-label">
							<input type="radio" name="mesh" value="squares">
							<span class="radio-text">Squares</span>
						</label>
					</div>
				</div>
				<div class="input-group">
					<div class="input-header">
						<span class="input-label">Height Change Speed</span>
					</div>
					<div class="slider-container">
						<span class="slider-label">slow</span>
						<input type="range" id="height-speed" min="0.001" max="0.010" step="0.001" class="range-slider">
						<span class="slider-label">fast</span>
					</div>
				</div>
				<div class="input-group">
					<div class="input-header">
						<span class="input-label">Roughness</span>
					</div>
					<div class="slider-container">
						<span class="slider-label">smooth</span>
						<input type="range" id="roughness" min="0.05" max="0.25" step="0.01" class="range-slider">
						<span class="slider-label">rough</span>
					</div>
				</div>
				<div class="input-group">
					<div class="input-header">
						<span class="input-label">Camera</span>
					</div>
					<div class="radio-group horizontal">
						<label class="radio-label">
							<input type="radio" name="camera" value="auto">
							<span class="radio-text">Auto Rotate</span>
						</label>
						<label class="radio-label">
							<input type="radio" name="camera" value="manual">
							<span class="radio-text">Manual</span>
						</label>
					</div>
				</div>
			</div>
		`
	}

	protected queryElements() {
		this.meshRadios = this.modal.querySelectorAll('input[name="mesh"]')
		this.cameraRadios = this.modal.querySelectorAll('input[name="camera"]')
		// biome-ignore-start lint/style/noNonNullAssertion: see getModalContent()
		this.speedSlider = this.modal.querySelector("#height-speed")!
		this.roughnessSlider = this.modal.querySelector("#roughness")!
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

		// Mesh radio buttons
		this.meshRadios.forEach((radio) => {
			radio.addEventListener("change", () => {
				this.updateConfig()
			})
		})

		// Camera radio buttons
		this.cameraRadios.forEach((radio) => {
			radio.addEventListener("change", () => {
				this.updateConfig()
			})
		})

		// Speed slider
		this.speedSlider.addEventListener("input", () => {
			this.updateConfig()
		})

		// Roughness slider
		this.roughnessSlider.addEventListener("input", () => {
			this.updateConfig()
		})
	}

	private updateConfig() {
		const selectedMeshRadio = this.modal.querySelector(
			'input[name="mesh"]:checked',
		) as HTMLInputElement
		const selectedCameraRadio = this.modal.querySelector(
			'input[name="camera"]:checked',
		) as HTMLInputElement

		this.currentConfig.mesh = selectedMeshRadio.value as LandscapeMesh
		this.currentConfig.camera = selectedCameraRadio.value as LandscapeCamera
		this.currentConfig.heightChangeSpeed = parseFloat(this.speedSlider.value)
		this.currentConfig.roughness = parseFloat(this.roughnessSlider.value)
		this.updateURL()
		this.onConfigChange?.(this.currentConfig)
	}

	protected openModal() {
		// Update current config from URL
		this.currentConfig = getLandscapeConfigFromURL()

		// Update mesh radio buttons
		this.meshRadios.forEach((radio) => {
			radio.checked = radio.value === this.currentConfig.mesh
		})

		// Update camera radio buttons
		this.cameraRadios.forEach((radio) => {
			radio.checked = radio.value === this.currentConfig.camera
		})

		// Update sliders
		this.speedSlider.value = this.currentConfig.heightChangeSpeed.toString()
		this.roughnessSlider.value = this.currentConfig.roughness.toString()

		this.modal.style.display = "flex"
	}

	public setOnChange(callback: (config: LandscapeConfig) => void) {
		this.onConfigChange = callback
	}

	public getConfig(): LandscapeConfig {
		return { ...this.currentConfig }
	}

	protected updateURL() {
		updateSketchConfig("landscape", this.currentConfig)
	}
}
