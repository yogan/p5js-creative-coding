import {
	getCurrentRule,
	getCurrentWidth,
	getGridColor,
	setGridColor,
	setRule,
	setWidth,
} from "../sketches/elementary-cellular-automaton"

export class ElementaryCellularAutomatonConfig {
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
	private onRuleChange?: () => void

	constructor(private container: HTMLElement) {
		this.createElements()
		this.attachEventListeners()
	}

	private createElements() {
		// Create control button
		this.controlBtn = document.createElement("button")
		this.controlBtn.className = "control-btn"
		this.controlBtn.id = "control-btn"
		this.controlBtn.setAttribute("aria-label", "Open controls")
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
	}

	private openModal() {
		if (
			this.modal &&
			this.ruleInput &&
			this.rulePreview &&
			this.widthInput &&
			this.widthPreview &&
			this.gridSelect
		) {
			const rule = getCurrentRule()
			const width = getCurrentWidth()
			const gridColor = getGridColor()
			this.ruleInput.value = rule.toString()
			this.rulePreview.textContent = rule.toString()
			this.widthInput.value = width.toString()
			this.widthPreview.textContent = `${width} px`
			this.gridSelect.value = gridColor
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
		if (this.ruleInput && this.widthInput && this.gridSelect) {
			const newRule = parseInt(this.ruleInput.value, 10)
			const newWidth = parseInt(this.widthInput.value, 10)
			const gridColor = this.gridSelect.value
			setRule(newRule)
			setWidth(newWidth)
			setGridColor(gridColor)
			this.onRuleChange?.()
		}
	}

	public show() {
		if (this.controlBtn) {
			this.controlBtn.style.display = "flex"
		}
	}

	public hide() {
		if (this.controlBtn) {
			this.controlBtn.style.display = "none"
		}
	}

	public setOnRuleChange(callback: () => void) {
		this.onRuleChange = callback
	}

	public destroy() {
		this.controlBtn?.remove()
		this.modal?.remove()
	}
}
