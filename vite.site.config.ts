import { defineConfig } from "vite";

export default defineConfig({
    base: "/lumina-fx/",

    build: {
        outDir: "site-dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: "index.html",
                transitionDemo: "transition-demo.html"
            }
        }
    }
});