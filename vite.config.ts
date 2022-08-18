import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'typings/auto-imports.d.ts'
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      dts: 'typings/components.d.ts',
      dirs: ['src/renderer/components', 'src/renderer/views']
    }),
    electron({
      main: {
        entry: 'src/main/index.ts',
        vite: {
          build: {
            sourcemap: false,
            outDir: 'dist/main'
          }
        }
      }
    }),
    renderer()
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
})
