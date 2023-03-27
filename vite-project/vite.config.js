/* eslint-disable no-undef */
import { resolve } from "path";
import { defineConfig } from "vite";
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        details: resolve(__dirname, "details.html"),
        contact: resolve(__dirname, "contact.html"),
        exchange: resolve(__dirname, "exchange.html"),
        login: resolve(__dirname, "login.html"),
        mint: resolve(__dirname, "mint.html"),
      },
    },
  },
});