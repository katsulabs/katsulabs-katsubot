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

// legacy-first (기본): /api/v1 → :8080 (Gateway WRTN compat), /api/v1/auth → :8081 (katsubot-api 로그인)
// katsubot-api-only: VITE_API_V1_PROXY_TARGET=http://localhost:8081
const legacyProxyTarget =
  process.env.VITE_LEGACY_PROXY_TARGET?.replace(/\/$/, '') ?? 'http://localhost:8080'
const chatApiProxyTarget =
  process.env.VITE_KATSUBOT_API_PROXY_TARGET?.replace(/\/$/, '') ?? 'http://localhost:8081'
const apiV1ProxyTarget =
  process.env.VITE_API_V1_PROXY_TARGET?.replace(/\/$/, '') ?? legacyProxyTarget

const useLegacyApiFacade = apiV1ProxyTarget !== chatApiProxyTarget

export default defineConfig({
  plugins: [react(), tailwindcss(), apiContractSpecsPlugin()],
  test: {
    environment: 'node',
  },
  server: {
    port: 5173,
    proxy: {
      ...(useLegacyApiFacade
        ? {
            // auth는 legacy에 없음 — katsubot-api LoginUseCase
            '/api/v1/auth': {
              target: chatApiProxyTarget,
              changeOrigin: true,
            },
          }
        : {}),
      '/api/v1': {
        target: useLegacyApiFacade ? apiV1ProxyTarget : chatApiProxyTarget,
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
