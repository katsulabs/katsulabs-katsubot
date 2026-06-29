import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contractDir = path.resolve(__dirname, '../../packages/api-contract')

const API_SPECS = [
  'openapi.yaml',
  'wrtn-upstream-openapi.yaml',
  'ai-gateway-wrtn-replacement-openapi.yaml',
] as const

function apiContractSpecsPlugin(): Plugin {
  const outSpecsDir = path.resolve(__dirname, 'public/api-docs/specs')

  const copySpecs = () => {
    fs.mkdirSync(outSpecsDir, { recursive: true })
    for (const name of API_SPECS) {
      fs.copyFileSync(path.join(contractDir, name), path.join(outSpecsDir, name))
    }
  }

  return {
    name: 'api-contract-specs',
    buildStart: copySpecs,
    configureServer(server) {
      copySpecs()
      server.middlewares.use('/api-docs/specs', (req, res, next) => {
        const name = path.basename(req.url ?? '')
        if (!API_SPECS.includes(name as (typeof API_SPECS)[number])) {
          next()
          return
        }
        const file = path.join(contractDir, name)
        if (!fs.existsSync(file)) {
          next()
          return
        }
        res.setHeader('Content-Type', 'application/yaml; charset=utf-8')
        fs.createReadStream(file).pipe(res)
      })
    },
  }
}

// 로컬 legacy BFF(:8080)가 /api/v1 제공. chat-api만 쓸 때 VITE_CHAT_API_PROXY_TARGET=http://localhost:8081
const chatApiProxyTarget =
  process.env.VITE_CHAT_API_PROXY_TARGET?.replace(/\/$/, '') ?? 'http://localhost:8080'
const legacyProxyTarget =
  process.env.VITE_LEGACY_PROXY_TARGET?.replace(/\/$/, '') ?? 'http://localhost:8080'

export default defineConfig({
  plugins: [react(), tailwindcss(), apiContractSpecsPlugin()],
  test: {
    environment: 'node',
  },
  server: {
    port: 5173,
    proxy: {
      // Phase 1+ 로컬: chat-api(:8081). 레거시 BFF(:8080)는 WRTN upstream 의존.
      '/api/v1': {
        target: chatApiProxyTarget,
        changeOrigin: true,
      },
      '/xs': {
        target: legacyProxyTarget,
        changeOrigin: true,
      },
      '/webapps': {
        target: legacyProxyTarget,
        changeOrigin: true,
      },
    },
  },
})
