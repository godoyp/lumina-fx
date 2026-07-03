import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            name: "LuminaFX",
            fileName: "lumina-fx",
            formats: [
                "es",
                "umd"
            ]
        },
        rollupOptions: {
            external: [],
            output: {
                globals: {}
            }
        },
        sourcemap: true,
        emptyOutDir: true
    }
});