import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"

export default defineConfig({
  plugins: [
    vueDevTools(),
    vue(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0", // 新增此行，允许外部访问
    port: 3000,
    proxy: {
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // 移除所有 console
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 从 node_modules 中引入的模块，按模块名称拆分
          if (id.includes("node_modules")) {
            const packagePath = id.split("node_modules/")[1].split("/")
            const first = packagePath[0]
            let name = first === ".pnpm" ? packagePath[1] : first
            if (name.startsWith("@")) {
              name = name.substring(1)
            }
            name = name.replace(".", "_")
            let chunkName = name.split("@")[0]
            if (["vue", "vue+devtools-api", "vue+devtools-kit", "vue+devtools-shared"].includes(chunkName)) {
              chunkName = "vue+runtime-core"
            }
            return `vendor-${chunkName}`
          }
        },

        entryFileNames: "js/[name]-[hash].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: (chunkInfo) => {
          const name = chunkInfo.names[0]
          if (name.endsWith(".css")) {
            return "css/[name]-[hash][extname]"
          }
          if (name.endsWith(".js")) {
            return "js/[name]-[hash][extname]"
          }
          const imgExts = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico"]
          if (imgExts.some((ext) => name.endsWith(ext))) {
            return "img/[name]-[hash][extname]"
          }
          return "assets/[name]-[hash][extname]"
        },
      },
    },
  },
})
