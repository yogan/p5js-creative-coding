import { createConfigButton } from "./config-button"

export abstract class BaseConfigDialog<TConfig> {
	protected controlBtn!: HTMLElement
	protected modal!: HTMLElement
	protected container: HTMLElement

	constructor(container: HTMLElement) {
		this.container = container
	}

	protected initialize(): void {
		this.createElements()
		this.queryElements()
		this.attachEventListeners()
	}

	// Abstract methods that subclasses must implement
	protected abstract getModalContent(): string
	protected abstract queryElements(): void
	protected abstract attachEventListeners(): void
	protected abstract openModal(): void
	protected abstract updateURL(): void
	abstract setOnChange(
		callback: TConfig extends void ? () => void : (config: TConfig) => void,
	): void
	abstract getConfig(): TConfig

	// Concrete implementations shared by all subclasses
	protected createElements(): void {
		this.controlBtn = createConfigButton()

		this.modal = document.createElement("div")
		this.modal.className = "modal-overlay"
		this.modal.style.display = "none"
		this.modal.innerHTML = this.getModalContent()

		this.container.appendChild(this.controlBtn)
		document.body.appendChild(this.modal)
	}

	protected closeModal(): void {
		this.modal.style.display = "none"
	}

	public show(): void {
		this.controlBtn.style.display = "flex"
		this.updateURL()
	}

	public hide(): void {
		this.controlBtn.style.display = "none"
	}

	public destroy(): void {
		this.controlBtn.remove()
		this.modal.remove()
	}
}
