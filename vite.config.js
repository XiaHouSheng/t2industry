import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 第三方依赖合并
          if (id.includes("node_modules")) {
            return "vendor";
          }
          
          // 页面合并
          if (id.includes("/src/paegs/")) {
            return "pages";
          }
          
          // 组件合并
          if (id.includes("/src/components/")) {
            return "components";
          }
          
          // 状态管理
          if (id.includes("/src/stores/")) {
            return "stores";
          }
          
          // 工具函数
          if (id.includes("/src/utils/")) {
            return "utils";
          }
          
          // 路由配置
          if (id.includes("/src/routers/")) {
            return "routers";
          }
        },
      },
    },
  },
});
