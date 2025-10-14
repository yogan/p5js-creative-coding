import {
	getConfigButton,
	hideConfigButton,
	setConfigButtonHandler,
	showConfigButton,
} from "./config-button"

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
		this.controlBtn = getConfigButton()

		this.modal = document.createElement("div")
		this.modal.className = "modal-overlay"
		this.modal.style.display = "none"
		this.modal.innerHTML = this.getModalContent()

		document.body.appendChild(this.modal)
	}

	protected closeModal(): void {
		this.modal.style.display = "none"
	}

	public show(): void {
		showConfigButton()
		setConfigButtonHandler(() => this.openModal())
		this.updateURL()
	}

	public hide(): void {
		hideConfigButton()
	}

	public destroy(): void {
		hideConfigButton()
		this.modal.remove()
	}
}
