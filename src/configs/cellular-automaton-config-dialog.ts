import { sketches } from "../sketches"
import { updateSketchConfig } from "../utils/url-params"
import { BaseConfigDialog } from "./base-config-dialog"
import type {
	CellularAutomatonConfig,
	GridColor,
	InitialCells,
} from "./cellular-automaton-config"
import { getCellularAutomatonConfigFromURL } from "./cellular-automaton-config"

export class CellularAutomatonConfigDialog extends BaseConfigDialog<CellularAutomatonConfig> {
	private ruleInput!: HTMLInputElement
	private rulePreview!: HTMLElement
	private widthInput!: HTMLInputElement
	private widthPreview!: HTMLElement
	private rulePlusBtn!: HTMLElement
	private ruleMinusBtn!: HTMLElement
	private widthPlusBtn!: HTMLElement
	private widthMinusBtn!: HTMLElement
	private gridSelect!: HTMLSelectElement
	private startSelect!: HTMLSelectElement

	private onRuleChange?: (config: CellularAutomatonConfig) => void
	private currentConfig: CellularAutomatonConfig =
		getCellularAutomatonConfigFromURL()

	constructor(container: HTMLElement) {
		super(container)
		this.initialize()
	}

	protected getModalContent(): string {
		return `
			<div class="modal-content">
				<h3>Configure ${sketches["cellular-automaton"].name}</h3>
				<div class="input-group">
					<div class="input-header">
						<span class="input-label">Rule</span>
						<span class="input-value" id="rule-preview">30</span>
					</div>
					<div class="rule-controls">
						<button type="button" class="rule-btn" id="rule-minus">−</button>
						<input type="range" id="rule-input" min="0" max="255" value="30" class="rule-slider">
						<button type="button" class="rule-btn" id="rule-plus">+</button>
					</div>
				</div>
				<div class="input-group">
					<div class="input-header">
						<span class="input-label">Initial Cells</span>
					</div>
					<select id="start-select" class="grid-select">
						<option value="middle" selected="selected">Middle Cell Only</option>
						<option value="alternating">Alternating Pattern</option>
						<option value="random">Random</option>
					</select>
				</div>
				<div class="input-group">
					<div class="input-header">
						<span class="input-label">Cell Width</span>
						<span class="input-value" id="width-preview">10 px</span>
					</div>
					<div class="rule-controls">
						<button type="button" class="rule-btn" id="width-minus">−</button>
						<input type="range" id="width-input" min="2" max="100" value="10" class="rule-slider">
						<button type="button" class="rule-btn" id="width-plus">+</button>
					</div>
				</div>
				<div class="input-group">
					<div class="input-header">
						<span class="input-label">Grid</span>
					</div>
					<select id="grid-select" class="grid-select">
						<option value="off">Off</option>
						<option value="light" selected="selected">Light Gray</option>
						<option value="dark" selected="selected">Dark Gray</option>
						<option value="black">Black</option>
					</select>
				</div>
			</div>
		`
	}

	protected queryElements() {
		// biome-ignore-start lint/style/noNonNullAssertion: see getModalContent()
		this.ruleInput = this.modal.querySelector("#rule-input")!
		this.rulePreview = this.modal.querySelector("#rule-preview")!
		this.widthInput = this.modal.querySelector("#width-input")!
		this.widthPreview = this.modal.querySelector("#width-preview")!
		this.rulePlusBtn = this.modal.querySelector("#rule-plus")!
		this.ruleMinusBtn = this.modal.querySelector("#rule-minus")!
		this.widthPlusBtn = this.modal.querySelector("#width-plus")!
		this.widthMinusBtn = this.modal.querySelector("#width-minus")!
		this.gridSelect = this.modal.querySelector("#grid-select")!
		this.startSelect = this.modal.querySelector("#start-select")!
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

		this.ruleInput.addEventListener("input", () => {
			this.updateRulePreview()
			this.applyChanges()
		})

		this.ruleInput.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				this.closeModal()
			}
		})

		this.rulePlusBtn.addEventListener("click", () => {
			this.incrementRule()
			this.applyChanges()
		})

		this.ruleMinusBtn.addEventListener("click", () => {
			this.decrementRule()
			this.applyChanges()
		})

		this.widthInput.addEventListener("input", () => {
			this.updateWidthPreview()
			this.applyChanges()
		})

		this.widthPlusBtn.addEventListener("click", () => {
			this.incrementWidth()
			this.applyChanges()
		})

		this.widthMinusBtn.addEventListener("click", () => {
			this.decrementWidth()
			this.applyChanges()
		})

		this.gridSelect.addEventListener("change", () => {
			this.applyChanges()
		})

		this.startSelect.addEventListener("change", () => {
			this.applyChanges()
		})
	}

	protected openModal() {
		// Update current config from URL
		this.currentConfig = getCellularAutomatonConfigFromURL()

		this.ruleInput.value = this.currentConfig.rule.toString()
		this.rulePreview.textContent = this.currentConfig.rule.toString()
		this.widthInput.value = this.currentConfig.width.toString()
		this.widthPreview.textContent = `${this.currentConfig.width} px`
		this.gridSelect.value = this.currentConfig.grid
		this.startSelect.value = this.currentConfig.start
		this.modal.style.display = "flex"
	}

	private updateRulePreview() {
		const value = parseInt(this.ruleInput.value, 10)
		const clampedValue = Math.max(0, Math.min(255, value))
		this.rulePreview.textContent = clampedValue.toString()
	}

	private incrementRule() {
		const currentValue = parseInt(this.ruleInput.value, 10)
		const newValue = Math.min(255, currentValue + 1)
		this.ruleInput.value = newValue.toString()
		this.updateRulePreview()
	}

	private decrementRule() {
		const currentValue = parseInt(this.ruleInput.value, 10)
		const newValue = Math.max(0, currentValue - 1)
		this.ruleInput.value = newValue.toString()
		this.updateRulePreview()
	}

	private updateWidthPreview() {
		const value = parseInt(this.widthInput.value, 10)
		const clampedValue = Math.max(2, Math.min(100, value))
		this.widthPreview.textContent = `${clampedValue} px`
	}

	private incrementWidth() {
		const currentValue = parseInt(this.widthInput.value, 10)
		const newValue = Math.min(100, currentValue + 1)
		this.widthInput.value = newValue.toString()
		this.updateWidthPreview()
	}

	private decrementWidth() {
		const currentValue = parseInt(this.widthInput.value, 10)
		const newValue = Math.max(2, currentValue - 1)
		this.widthInput.value = newValue.toString()
		this.updateWidthPreview()
	}

	private applyChanges() {
		this.currentConfig.rule = parseInt(this.ruleInput.value, 10)
		this.currentConfig.width = parseInt(this.widthInput.value, 10)
		this.currentConfig.grid = this.gridSelect.value as GridColor
		this.currentConfig.start = this.startSelect.value as InitialCells
		this.updateURL()
		this.onRuleChange?.(this.currentConfig)
	}

	public setOnChange(callback: (config: CellularAutomatonConfig) => void) {
		this.onRuleChange = callback
	}

	public getConfig(): CellularAutomatonConfig {
		return { ...this.currentConfig }
	}

	protected updateURL() {
		updateSketchConfig("cellular-automaton", this.currentConfig)
	}
}
