import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'

// PWA service worker (auto handled by vite-plugin-pwa)
import { registerSW } from 'virtual:pwa-register'
import { AuthProvider } from './providers/auth_provider.tsx'

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <App />
    </AuthProvider>
)
