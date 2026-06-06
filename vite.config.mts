import { defineConfig } from "vite"

export default defineConfig({
	server: { open: true, port: 3000 },
	build: {
		outDir: "dist",
		sourcemap: true,
		chunkSizeWarningLimit: 1200, // p5js is huge, nothing we can do about it
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes("node_modules/p5")) return "p5"
					if (id.includes("node_modules/matter-js")) return "matter-js"
				},
			},
		},
	},
})
