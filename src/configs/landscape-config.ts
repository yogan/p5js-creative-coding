import {
	getLandscapeConfigFromURL,
	type LandscapeCamera,
	type LandscapeMesh,
	type LandscapeConfig as LandscapeSettings,
	updateLandscapeURL,
} from "../utils/url-params"
import { BaseConfig } from "./base-config"

export type { LandscapeSettings }

export class LandscapeConfig extends BaseConfig<LandscapeSettings> {
	private controlBtn: HTMLElement | null = null
	private modal: HTMLElement | null = null
	private onSettingsChange?: (settings: LandscapeSettings) => void

	private currentSettings: LandscapeSettings = getLandscapeConfigFromURL()

	constructor(private container: HTMLElement) {
		super()
		this.createElements()
		this.attachEventListeners()
		this.syncUIWithSettings()
	}

	private createElements() {
		// Create control button
		this.controlBtn = document.createElement("button")
		this.controlBtn.className = "control-btn"
		this.controlBtn.id = "landscape-control-btn"
		this.controlBtn.setAttribute("aria-label", "Open landscape controls")
		this.controlBtn.style.display = "none"
		this.controlBtn.innerHTML = `
			<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
			</svg>
		`

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
							<input type="radio" name="mesh" value="Triangles">
							<span class="radio-text">Triangles</span>
						</label>
						<label class="radio-label">
							<input type="radio" name="mesh" value="Squares">
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
				this.updateSettings()
			})
		})

		// Camera radio buttons
		const cameraRadios = this.modal?.querySelectorAll(
			'input[name="camera"]',
		) as NodeListOf<HTMLInputElement>
		cameraRadios?.forEach((radio) => {
			radio.addEventListener("change", () => {
				this.updateSettings()
			})
		})

		// Speed slider
		const speedSlider = this.modal?.querySelector(
			"#height-speed",
		) as HTMLInputElement

		speedSlider?.addEventListener("input", () => {
			this.updateSettings()
		})

		// Roughness slider
		const roughnessSlider = this.modal?.querySelector(
			"#roughness",
		) as HTMLInputElement

		roughnessSlider?.addEventListener("input", () => {
			this.updateSettings()
		})
	}

	private updateSettings() {
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
			this.currentSettings.mesh = selectedMeshRadio.value as LandscapeMesh
			this.currentSettings.camera = selectedCameraRadio.value as LandscapeCamera
			this.currentSettings.heightChangeSpeed = parseFloat(speedSlider.value)
			this.currentSettings.roughness = parseFloat(roughnessSlider.value)

			// Update URL with new settings
			updateLandscapeURL(
				this.currentSettings.mesh,
				this.currentSettings.heightChangeSpeed,
				this.currentSettings.roughness,
				this.currentSettings.camera,
			)

			this.onSettingsChange?.(this.currentSettings)
		}
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
		updateLandscapeURL(
			this.currentSettings.mesh,
			this.currentSettings.heightChangeSpeed,
			this.currentSettings.roughness,
			this.currentSettings.camera,
		)
	}

	public hide() {
		if (this.controlBtn) {
			this.controlBtn.style.display = "none"
		}
	}

	public setOnChange(callback: (settings: LandscapeSettings) => void) {
		this.onSettingsChange = callback
	}

	public getSettings(): LandscapeSettings {
		return { ...this.currentSettings }
	}

	private syncUIWithSettings() {
		// Update mesh radio buttons
		const meshRadios = this.modal?.querySelectorAll(
			'input[name="mesh"]',
		) as NodeListOf<HTMLInputElement>
		meshRadios?.forEach((radio) => {
			radio.checked = radio.value === this.currentSettings.mesh
		})

		// Update camera radio buttons
		const cameraRadios = this.modal?.querySelectorAll(
			'input[name="camera"]',
		) as NodeListOf<HTMLInputElement>
		cameraRadios?.forEach((radio) => {
			radio.checked = radio.value === this.currentSettings.camera
		})

		// Update sliders
		const speedSlider = this.modal?.querySelector(
			"#height-speed",
		) as HTMLInputElement
		if (speedSlider) {
			speedSlider.value = this.currentSettings.heightChangeSpeed.toString()
		}

		const roughnessSlider = this.modal?.querySelector(
			"#roughness",
		) as HTMLInputElement
		if (roughnessSlider) {
			roughnessSlider.value = this.currentSettings.roughness.toString()
		}
	}

	public destroy() {
		this.controlBtn?.remove()
		this.modal?.remove()
	}
}
