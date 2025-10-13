export abstract class BaseConfigDialog<TConfig = void> {
	abstract show(): void
	abstract hide(): void
	abstract destroy(): void

	abstract setOnChange(
		callback: TConfig extends void ? () => void : (config: TConfig) => void,
	): void

	getConfig?(): TConfig
}
