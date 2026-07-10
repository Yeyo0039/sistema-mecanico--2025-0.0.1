import { fileURLToPath } from 'node:url'
import viteConfig from './vite.config'

export default {
  ...viteConfig,
  test: {
    environment: 'jsdom',
    exclude: ['e2e/**'],
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
}
