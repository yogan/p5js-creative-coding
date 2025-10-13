export abstract class BaseConfig<TConfig = void> {
	abstract show(): void
	abstract hide(): void
	abstract destroy(): void

	// Unified change callback method
	abstract setOnChange(
		callback: TConfig extends void ? () => void : (config: TConfig) => void,
	): void

	// Optional getConfig method for configs with config
	getConfig?(): TConfig
}
