import { getElementaryCellularAutomatonConfig } from "../sketches/elementary-cellular-automaton"
import { updateSketchConfig } from "../utils/url-params"
import { BaseConfigDialog } from "./base-config-dialog"
import type {
	CellularAutomatonConfig,
	GridColor,
	InitialCells,
} from "./cellular-automaton-config"
import { createConfigButton } from "./config-button"

export class ElementaryCellularAutomatonConfigDialog extends BaseConfigDialog<CellularAutomatonConfig> {
	private controlBtn!: HTMLElement
	private modal!: HTMLElement
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

	constructor(private container: HTMLElement) {
		super()
		this.createElements()
		this.queryElements()
		this.attachEventListeners()
	}

	private createElements() {
		this.controlBtn = createConfigButton()

		this.modal = document.createElement("div")
		this.modal.className = "modal-overlay"
		this.modal.id = "rule-modal"
		this.modal.style.display = "none"
		this.modal.innerHTML = `
			<div class="modal-content">
				<h3>Configure Cellular Automaton</h3>
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
						<option value="dark">Dark Gray</option>
						<option value="black">Black</option>
					</select>
				</div>
			</div>
		`

		// Add elements to container and document
		this.container.appendChild(this.controlBtn)
		document.body.appendChild(this.modal)
	}

	private queryElements() {
		// biome-ignore-start lint/style/noNonNullAssertion: see createElements()
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
		// biome-ignore-end lint/style/noNonNullAssertion: see createElements()
	}

	private attachEventListeners() {
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

	private openModal() {
		const config = getElementaryCellularAutomatonConfig()
		this.ruleInput.value = config.rule.toString()
		this.rulePreview.textContent = config.rule.toString()
		this.widthInput.value = config.width.toString()
		this.widthPreview.textContent = `${config.width} px`
		this.gridSelect.value = config.grid
		this.startSelect.value = config.start
		this.modal.style.display = "flex"
	}

	private closeModal() {
		this.modal.style.display = "none"
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
		const rule = parseInt(this.ruleInput.value, 10)
		const width = parseInt(this.widthInput.value, 10)
		const grid = this.gridSelect.value as GridColor
		const start = this.startSelect.value as InitialCells
		this.updateURL()
		this.onRuleChange?.({ rule, width, grid, start })
	}

	public show() {
		this.controlBtn.style.display = "flex"
		this.updateURL()
	}

	public hide() {
		this.controlBtn.style.display = "none"
	}

	public setOnChange(callback: (config: CellularAutomatonConfig) => void) {
		this.onRuleChange = callback
	}

	public getConfig(): CellularAutomatonConfig {
		return getElementaryCellularAutomatonConfig()
	}

	public destroy() {
		this.controlBtn.remove()
		this.modal.remove()
	}

	private updateURL() {
		updateSketchConfig(
			"elementary-cellular-automaton",
			getElementaryCellularAutomatonConfig(),
		)
	}
}
