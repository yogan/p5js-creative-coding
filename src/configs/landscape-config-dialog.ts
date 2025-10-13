import { updateSketchConfig } from "../utils/url-params"
import { BaseConfigDialog } from "./base-config-dialog"
import { createConfigButton } from "./config-button"
import {
	getLandscapeConfigFromURL,
	type LandscapeCamera,
	type LandscapeConfig,
	type LandscapeMesh,
} from "./landscape-config"

export class LandscapeConfigDialog extends BaseConfigDialog<LandscapeConfig> {
	private controlBtn: HTMLElement | null = null
	private modal: HTMLElement | null = null
	private onConfigChange?: (config: LandscapeConfig) => void

	private currentConfig: LandscapeConfig = getLandscapeConfigFromURL()

	constructor(private container: HTMLElement) {
		super()
		this.createElements()
		this.attachEventListeners()
	}

	private createElements() {
		// Create control button
		this.controlBtn = createConfigButton()

		// Create modal
		this.modal = document.createElement("div")
		this.modal.className = "modal-overlay"
		this.modal.id = "landscape-modal"
		this.modal.style.display = "none"
		this.modal.innerHTML = `
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

		// Mesh radio buttons
		const meshRadios = this.modal?.querySelectorAll(
			'input[name="mesh"]',
		) as NodeListOf<HTMLInputElement>
		meshRadios?.forEach((radio) => {
			radio.addEventListener("change", () => {
				this.updateConfig()
			})
		})

		// Camera radio buttons
		const cameraRadios = this.modal?.querySelectorAll(
			'input[name="camera"]',
		) as NodeListOf<HTMLInputElement>
		cameraRadios?.forEach((radio) => {
			radio.addEventListener("change", () => {
				this.updateConfig()
			})
		})

		// Speed slider
		const speedSlider = this.modal?.querySelector(
			"#height-speed",
		) as HTMLInputElement

		speedSlider?.addEventListener("input", () => {
			this.updateConfig()
		})

		// Roughness slider
		const roughnessSlider = this.modal?.querySelector(
			"#roughness",
		) as HTMLInputElement

		roughnessSlider?.addEventListener("input", () => {
			this.updateConfig()
		})
	}

	private updateConfig() {
		const selectedMeshRadio = this.modal?.querySelector(
			'input[name="mesh"]:checked',
		) as HTMLInputElement
		const selectedCameraRadio = this.modal?.querySelector(
			'input[name="camera"]:checked',
		) as HTMLInputElement
		const speedSlider = this.modal?.querySelector(
			"#height-speed",
		) as HTMLInputElement
		const roughnessSlider = this.modal?.querySelector(
			"#roughness",
		) as HTMLInputElement

		if (
			selectedMeshRadio &&
			selectedCameraRadio &&
			speedSlider &&
			roughnessSlider
		) {
			this.currentConfig.mesh = selectedMeshRadio.value as LandscapeMesh
			this.currentConfig.camera = selectedCameraRadio.value as LandscapeCamera
			this.currentConfig.heightChangeSpeed = parseFloat(speedSlider.value)
			this.currentConfig.roughness = parseFloat(roughnessSlider.value)
			this.updateURL()
			this.onConfigChange?.(this.currentConfig)
		}
	}

	private openModal() {
		if (this.modal) {
			// Update current config from URL
			this.currentConfig = getLandscapeConfigFromURL()

			// Update mesh radio buttons
			const meshRadios = this.modal.querySelectorAll(
				'input[name="mesh"]',
			) as NodeListOf<HTMLInputElement>
			meshRadios.forEach((radio) => {
				radio.checked = radio.value === this.currentConfig.mesh
			})

			// Update camera radio buttons
			const cameraRadios = this.modal.querySelectorAll(
				'input[name="camera"]',
			) as NodeListOf<HTMLInputElement>
			cameraRadios.forEach((radio) => {
				radio.checked = radio.value === this.currentConfig.camera
			})

			// Update sliders
			const speedSlider = this.modal.querySelector(
				"#height-speed",
			) as HTMLInputElement
			if (speedSlider) {
				speedSlider.value = this.currentConfig.heightChangeSpeed.toString()
			}

			const roughnessSlider = this.modal.querySelector(
				"#roughness",
			) as HTMLInputElement
			if (roughnessSlider) {
				roughnessSlider.value = this.currentConfig.roughness.toString()
			}

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

	public setOnChange(callback: (config: LandscapeConfig) => void) {
		this.onConfigChange = callback
	}

	public getConfig(): LandscapeConfig {
		return { ...this.currentConfig }
	}

	public destroy() {
		this.controlBtn?.remove()
		this.modal?.remove()
	}

	private updateURL() {
		updateSketchConfig("landscape", {
			mesh: this.currentConfig.mesh,
			speed: this.currentConfig.heightChangeSpeed,
			roughness: this.currentConfig.roughness,
			camera: this.currentConfig.camera,
		})
	}
}
