import {
	getCurrentRule,
	getCurrentWidth,
	getGridColor,
	getInitialCells,
	setGridColor,
	setInitialCells,
	setRule,
	setWidth,
} from "../sketches/elementary-cellular-automaton"
import { updateSketchConfig } from "../utils/url-params"
import { BaseConfig } from "./base-config"
import type { GridColor, InitialCells } from "./cellular-automaton-config"
import { createConfigButton } from "./config-button"

export class ElementaryCellularAutomatonConfigDialog extends BaseConfig<void> {
	private controlBtn: HTMLElement | null = null
	private modal: HTMLElement | null = null
	private ruleInput: HTMLInputElement | null = null
	private rulePreview: HTMLElement | null = null
	private widthInput: HTMLInputElement | null = null
	private widthPreview: HTMLElement | null = null

	private rulePlusBtn: HTMLElement | null = null
	private ruleMinusBtn: HTMLElement | null = null
	private widthPlusBtn: HTMLElement | null = null
	private widthMinusBtn: HTMLElement | null = null
	private gridSelect: HTMLSelectElement | null = null
	private startSelect: HTMLSelectElement | null = null
	private onRuleChange?: () => void

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

		// Get references to modal elements
		this.ruleInput = this.modal.querySelector("#rule-input") as HTMLInputElement
		this.rulePreview = this.modal.querySelector("#rule-preview")
		this.widthInput = this.modal.querySelector(
			"#width-input",
		) as HTMLInputElement
		this.widthPreview = this.modal.querySelector("#width-preview")

		this.rulePlusBtn = this.modal.querySelector("#rule-plus")
		this.ruleMinusBtn = this.modal.querySelector("#rule-minus")
		this.widthPlusBtn = this.modal.querySelector("#width-plus")
		this.widthMinusBtn = this.modal.querySelector("#width-minus")
		this.gridSelect = this.modal.querySelector(
			"#grid-select",
		) as HTMLSelectElement
		this.startSelect = this.modal.querySelector(
			"#start-select",
		) as HTMLSelectElement
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

		this.ruleInput?.addEventListener("input", () => {
			this.updateRulePreview()
			this.applyChanges()
		})

		this.ruleInput?.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				this.closeModal()
			}
		})

		this.rulePlusBtn?.addEventListener("click", () => {
			this.incrementRule()
			this.applyChanges()
		})

		this.ruleMinusBtn?.addEventListener("click", () => {
			this.decrementRule()
			this.applyChanges()
		})

		this.widthInput?.addEventListener("input", () => {
			this.updateWidthPreview()
			this.applyChanges()
		})

		this.widthPlusBtn?.addEventListener("click", () => {
			this.incrementWidth()
			this.applyChanges()
		})

		this.widthMinusBtn?.addEventListener("click", () => {
			this.decrementWidth()
			this.applyChanges()
		})

		this.gridSelect?.addEventListener("change", () => {
			this.applyChanges()
		})

		this.startSelect?.addEventListener("change", () => {
			this.applyChanges()
		})
	}

	private openModal() {
		if (
			this.modal &&
			this.ruleInput &&
			this.rulePreview &&
			this.widthInput &&
			this.widthPreview &&
			this.gridSelect &&
			this.startSelect
		) {
			const rule = getCurrentRule()
			const width = getCurrentWidth()
			const gridColor = getGridColor()
			const initialCells = getInitialCells()
			this.ruleInput.value = rule.toString()
			this.rulePreview.textContent = rule.toString()
			this.widthInput.value = width.toString()
			this.widthPreview.textContent = `${width} px`
			this.gridSelect.value = gridColor
			this.startSelect.value = initialCells
			this.modal.style.display = "flex"
			this.ruleInput.focus()
		}
	}

	private closeModal() {
		if (this.modal) {
			this.modal.style.display = "none"
		}
	}

	private updateRulePreview() {
		if (this.ruleInput && this.rulePreview) {
			const value = parseInt(this.ruleInput.value, 10)
			const clampedValue = Math.max(0, Math.min(255, value))
			this.rulePreview.textContent = clampedValue.toString()
		}
	}

	private incrementRule() {
		if (this.ruleInput) {
			const currentValue = parseInt(this.ruleInput.value, 10)
			const newValue = Math.min(255, currentValue + 1)
			this.ruleInput.value = newValue.toString()
			this.updateRulePreview()
		}
	}

	private decrementRule() {
		if (this.ruleInput) {
			const currentValue = parseInt(this.ruleInput.value, 10)
			const newValue = Math.max(0, currentValue - 1)
			this.ruleInput.value = newValue.toString()
			this.updateRulePreview()
		}
	}

	private updateWidthPreview() {
		if (this.widthInput && this.widthPreview) {
			const value = parseInt(this.widthInput.value, 10)
			const clampedValue = Math.max(2, Math.min(100, value))
			this.widthPreview.textContent = `${clampedValue} px`
		}
	}

	private incrementWidth() {
		if (this.widthInput) {
			const currentValue = parseInt(this.widthInput.value, 10)
			const newValue = Math.min(100, currentValue + 1)
			this.widthInput.value = newValue.toString()
			this.updateWidthPreview()
		}
	}

	private decrementWidth() {
		if (this.widthInput) {
			const currentValue = parseInt(this.widthInput.value, 10)
			const newValue = Math.max(2, currentValue - 1)
			this.widthInput.value = newValue.toString()
			this.updateWidthPreview()
		}
	}

	private applyChanges() {
		if (
			this.ruleInput &&
			this.widthInput &&
			this.gridSelect &&
			this.startSelect
		) {
			const rule = parseInt(this.ruleInput.value, 10)
			const width = parseInt(this.widthInput.value, 10)
			const grid = this.gridSelect.value as GridColor
			const start = this.startSelect.value as InitialCells
			setRule(rule)
			setWidth(width)
			setGridColor(grid)
			setInitialCells(start)
			this.updateURL()
			this.onRuleChange?.()
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

	public setOnChange(callback: () => void) {
		this.onRuleChange = callback
	}

	public destroy() {
		this.controlBtn?.remove()
		this.modal?.remove()
	}

	private updateURL() {
		updateSketchConfig("elementary-cellular-automaton", {
			rule: getCurrentRule(),
			width: getCurrentWidth(),
			grid: getGridColor(),
			start: getInitialCells(),
		})
	}
}
