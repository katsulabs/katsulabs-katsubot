import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { initAuthFromUrl } from './lib/auth'
import { initUiTheme } from './lib/ui-theme'
import './index.css'

initUiTheme()
initAuthFromUrl()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
