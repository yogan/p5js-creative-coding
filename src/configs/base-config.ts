export abstract class BaseConfig<TSettings = void> {
	abstract show(): void
	abstract hide(): void
	abstract destroy(): void

	// Unified change callback method
	abstract setOnChange(
		callback: TSettings extends void
			? () => void
			: (settings: TSettings) => void,
	): void

	// Optional getSettings method for configs with settings
	getSettings?(): TSettings
}
