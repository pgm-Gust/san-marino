import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@design": path.resolve("./src/app/components/design"),
      "@functional": path.resolve("./src/app/components/functional"),
      "@core": path.resolve("./src/core"),
      "@pages": path.resolve("./src/app/pages"),
      "@style": path.resolve("./src/app/style"),
    },
  },
});
