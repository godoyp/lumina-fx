import { defineConfig } from "vite";

export default defineConfig({
    base: "/lumina-fx/",

    build: {
        outDir: "site-dist",
        emptyOutDir: true
    }
});