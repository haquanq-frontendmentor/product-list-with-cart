import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
    root: "src/",
    build: { outDir: "../dist/", emptyOutDir: true },
    base: "/product-list-with-cart/",
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: "assets/images",
                    dest: "../dist/assets/",
                },
            ],
        }),
    ],
});
