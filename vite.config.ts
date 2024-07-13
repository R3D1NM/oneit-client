import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel:{
        presets:['jotai/babel/preset']
      }
    }),
    mkcert({certFileName: path.resolve(__dirname,"./cert/localhost.pem"), keyFileName: path.resolve(__dirname,"./cert/localhost-key.pem")}),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  // esbuild:{
  //   drop: ['console']
  // },
  server: {
    port: 3000,
  }
})