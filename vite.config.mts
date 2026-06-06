import { defineConfig } from "vite"

export default defineConfig({
	server: { open: true, port: 3000 },
	build: {
		outDir: "dist",
		sourcemap: true,
		chunkSizeWarningLimit: 1200, // p5js is huge, nothing we can do about it
		rollupOptions: {
			output: {
				manualChunks: (id) =>
					id.includes("node_modules/p5") ? "p5" : undefined,
			},
		},
	},
})
