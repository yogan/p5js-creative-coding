import type { KnipConfig } from "knip"

const config: KnipConfig = {
	ignoreDependencies: [
		// Types should actually be included in p5 package, but they are not compatible
		// with the Vite ESM build. The `@types/p5` is outdated, but works well enough.
		"@types/p5",
	],
}

export default config
