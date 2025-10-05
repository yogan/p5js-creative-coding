import { defineConfig } from "vite"

export default defineConfig({
	base: process.env.NODE_ENV === "production" ? "/p5js-creative-coding/" : "/",
	server: {
		open: true,
		port: 3000,
	},
	build: {
		outDir: "dist",
		sourcemap: true,
		chunkSizeWarningLimit: 1100, // p5js is huge, nothing we can do about it
		rollupOptions: { output: { manualChunks: { p5: ["p5"] } } },
	},
})
