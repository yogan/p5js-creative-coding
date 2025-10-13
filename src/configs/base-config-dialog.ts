export abstract class BaseConfigDialog<TConfig> {
	protected controlBtn!: HTMLElement
	protected modal!: HTMLElement

	// Abstract methods that subclasses must implement
	protected abstract openModal(): void
	protected abstract updateURL(): void
	abstract setOnChange(
		callback: TConfig extends void ? () => void : (config: TConfig) => void,
	): void
	abstract getConfig(): TConfig

	// Concrete implementations shared by all subclasses
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
