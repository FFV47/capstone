import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/static/",
  server: {
    origin: "http://localhost:5173",
    // https: {
    //   cert: fs.readFileSync("localhost.pem"),
    //   key: fs.readFileSync("localhost-key.pem"),
    // },
  },
  build: {
    assetsDir: "",
    target: "esnext",
    outDir: "../static/solution",
    emptyOutDir: true,
    // generate manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: {
        "bootstrap": "src/bootstrap.ts",
        "default": "src/main.tsx",
      },
    },
  },
});
