import { defineConfig } from "vite";

export default defineConfig({
    root: "src/",
    build: { outDir: "../dist/", emptyOutDir: true },
    base: "/fm-product-list-with-card/",
});
