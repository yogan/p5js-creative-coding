import {
	getCurrentRule,
	setRule,
} from "../sketches/elementary-cellular-automaton"

export class ElementaryCellularAutomatonConfig {
	private controlBtn: HTMLElement | null = null
	private modal: HTMLElement | null = null
	private ruleInput: HTMLInputElement | null = null
	private rulePreview: HTMLElement | null = null
	private cancelBtn: HTMLElement | null = null
	private applyBtn: HTMLElement | null = null
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
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="3"/>
				<path d="M12 6.5V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2.5M6.5 12H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2.5M12 17.5V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2.5M17.5 12H20a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-2.5"/>
			</svg>
		`

		// Create modal
		this.modal = document.createElement("div")
		this.modal.className = "modal-overlay"
		this.modal.id = "rule-modal"
		this.modal.style.display = "none"
		this.modal.innerHTML = `
			<div class="modal-content">
				<h3>Configure Rule</h3>
				<p>Set the cellular automaton rule (0-255):</p>
				<div class="input-group">
					<input type="range" id="rule-input" min="0" max="255" value="30" class="rule-slider">
					<span class="rule-preview" id="rule-preview">Rule 30</span>
				</div>
				<div class="modal-buttons">
					<button class="modal-btn cancel-btn" id="cancel-rule">Cancel</button>
					<button class="modal-btn apply-btn" id="apply-rule">Apply</button>
				</div>
			</div>
		`

		// Add elements to container and document
		this.container.appendChild(this.controlBtn)
		document.body.appendChild(this.modal)

		// Get references to modal elements
		this.ruleInput = this.modal.querySelector("#rule-input") as HTMLInputElement
		this.rulePreview = this.modal.querySelector("#rule-preview")
		this.cancelBtn = this.modal.querySelector("#cancel-rule")
		this.applyBtn = this.modal.querySelector("#apply-rule")
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

		this.cancelBtn?.addEventListener("click", () => {
			this.closeModal()
		})

		this.applyBtn?.addEventListener("click", () => {
			this.applyRule()
		})

		this.ruleInput?.addEventListener("input", () => {
			this.updateRulePreview()
		})

		this.ruleInput?.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				this.applyRule()
			} else if (event.key === "Escape") {
				this.closeModal()
			}
		})
	}

	private openModal() {
		if (this.modal && this.ruleInput && this.rulePreview) {
			const rule = getCurrentRule()
			this.ruleInput.value = rule.toString()
			this.rulePreview.textContent = `Rule ${rule}`
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
			this.rulePreview.textContent = `Rule ${clampedValue}`
		}
	}

	private applyRule() {
		if (this.ruleInput) {
			const newRule = parseInt(this.ruleInput.value, 10)
			setRule(newRule)
			this.closeModal()
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
